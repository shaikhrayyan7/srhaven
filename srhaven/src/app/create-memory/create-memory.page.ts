import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-memory',
  templateUrl: './create-memory.page.html',
  styleUrls: ['./create-memory.page.scss'],
})
export class CreateMemoryPage {
  capturedImage: string = '';
  place: string = '';
  date: string = '';
  gpsCoordinates: string = '';
  loading: boolean = true;
  userEmail: string | null = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.userEmail = localStorage.getItem('email');
    console.log('User Email:', this.userEmail);

    if (!this.userEmail) {
      console.error('User email not found.');
      return;
    }

    this.activatedRoute.queryParams.subscribe(async (params) => {
      if (params['imageUrl']) {
        const originalImage = params['imageUrl'];
        console.log('Original Image Size:', this.getImageSize(originalImage));
        this.capturedImage = await this.compressImage(originalImage); // Compress immediately
        console.log('Compressed Image Size:', this.getImageSize(this.capturedImage));
        this.date = params['date'];
      }

      try {
        const coordinates = await Geolocation.getCurrentPosition();
        this.gpsCoordinates = `Latitude: ${coordinates.coords.latitude}, Longitude: ${coordinates.coords.longitude}`;
        this.place = await this.getPlaceFromCoordinates(
          coordinates.coords.latitude,
          coordinates.coords.longitude
        );
      } catch (error) {
        console.error('Error fetching GPS or Place:', error);
        this.gpsCoordinates = 'Error fetching GPS';
        this.place = 'Error fetching Place';
      } finally {
        this.loading = false;
      }
    });
  }

  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        quality: 90,
      });

      if (image.dataUrl) {
        console.log('Captured Image Size:', this.getImageSize(image.dataUrl));
        this.capturedImage = await this.compressImage(image.dataUrl);
        console.log('Compressed Captured Image Size:', this.getImageSize(this.capturedImage));
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      await this.showToast('Failed to capture image. Please try again.');
    }
  }

  async saveMemory() {
    if (!this.userEmail) {
      console.error('User email is not available. Cannot save memory.');
      await this.showToast('User email is missing. Please log in again.');
      return;
    }

    const memoryData = {
      image: this.capturedImage,
      place: this.place || 'Unknown Place',
      date: this.date || new Date().toISOString(),
      gpsCoordinates: this.gpsCoordinates || 'Unknown Coordinates',
      userEmail: this.userEmail,
    };

    console.log('Memory Data to be sent:', memoryData); // Debug the payload

    try {
      const response = await this.http.post('http://localhost:5000/api/upload', memoryData, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }).toPromise();
      console.log('Memory saved successfully:', response);
      await this.showToast('Memory saved successfully!');
      this.router.navigate(['/memories']);
    } catch (error: any) {
      console.error('Error saving memory:', error);
      if (error.status === 400) {
        console.error('Server rejected the request. Check the payload structure.');
      }
      await this.showToast('Failed to save memory. Please try again.');
    }
  }

  async getPlaceFromCoordinates(latitude: number, longitude: number): Promise<string> {
    try {
      const apiKey = 'ba5753827b0049f1b98f85397a334605';
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.results.length > 0) {
        return data.results[0].formatted || 'Unknown Location';
      } else {
        return 'Unknown Location';
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return 'Error Fetching Location';
    }
  }

  async compressImage(imageBase64: string): Promise<string> {
    const img = new Image();
    img.src = imageBase64;

    return new Promise<string>((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;

        if (width > height && width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        } else if (height > width && height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to 70% quality
      };
    });
  }

  getImageSize(base64String: string): string {
    const size = (base64String.length * 3) / 4 - (base64String.indexOf('=') > 0 ? base64String.split('=').length - 1 : 0);
    return `${(size / 1024).toFixed(2)} KB`;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}
