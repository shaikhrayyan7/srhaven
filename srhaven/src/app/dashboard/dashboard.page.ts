import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  capturedImage: string = '';
  isWebCameraOpen: boolean = false; // Track if the webcam is open

  constructor(private router: Router, private platform: Platform) {}

  ionViewWillEnter() {
    console.log('Welcome to the Dashboard!');
  }

  // Open the camera to take a picture
  async openCamera() {
    if (this.platform.is('hybrid')) {
      // If running on a mobile device, use Capacitor Camera
      try {
        console.log('Opening camera...');
        const photo = await Camera.getPhoto({
          quality: 100,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          width: 800,
        });

        this.capturedImage = photo.webPath || '';
        console.log('Captured Image:', this.capturedImage);

        // Navigate to the create-memory page with the captured image URL
        this.router.navigate(['/create-memory'], {
          queryParams: { imageUrl: this.capturedImage, date: new Date().toLocaleString() },
        });
      } catch (error) {
        console.error('Error capturing photo:', error);
      }
    } else {
      // If running in a browser, use Web API
      this.openWebCamera();
    }
  }

  // Open the webcam using the browser's camera API
  openWebCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.isWebCameraOpen = true; // Show the webcam preview section

      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          const videoElement = document.querySelector('video') as HTMLVideoElement;
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
        });
    } else {
      alert('Webcam not supported');
    }
  }

  // Capture the image from the webcam
  captureImageFromWebCamera() {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const capturedImage = canvas.toDataURL('image/png');
      console.log('Captured Image:', capturedImage);

      // Navigate to the create-memory page with the captured image
      this.router.navigate(['/create-memory'], {
        queryParams: { imageUrl: capturedImage, date: new Date().toLocaleString() },
      });

      // Stop the video stream after capturing the image
      this.closeCamera();
    }
  }

  // Close the webcam without capturing an image
  closeCamera() {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      const stream = videoElement.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null; // Clear the video stream
    }
    this.isWebCameraOpen = false; // Hide the webcam preview
  }

  // Handle menu item clicks
  onMenuItemClick(route: string) {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }
}
