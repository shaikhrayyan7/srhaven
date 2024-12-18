import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-memories',
  templateUrl: './memories.page.html',
  styleUrls: ['./memories.page.scss'],
})
export class MemoriesPage implements OnInit {
  memoryImages: string[] = [];
  imageCount: number = 0;
  userEmail: string = '';
  subscriptionStatus: string = 'Unsubscribed';
  maxImagesAllowed: number = 50; // Set the maximum images allowed for unsubscribed users

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email') || '';

    if (!this.userEmail) {
      console.error('No email found in localStorage.');
      this.router.navigate(['/login']);
      return;
    }

    this.loadMemories();
    this.loadSubscriptionStatus();
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  async uploadPicture() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose an Image',
      buttons: [
        {
          text: 'Select from Gallery',
          handler: () => {
            this.selectImageFromGallery();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async selectImageFromGallery() {
    try {
      const photo = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        width: 800,
      });

      await this.uploadImage(photo);
    } catch (error) {
      console.error('Error selecting image from gallery:', error);
    }
  }

  async uploadImage(photo: any) {
    try {
      if (!this.userEmail) {
        console.error('Error: userEmail is missing or empty');
        return;
      }

      const formData = new FormData();
      const imageFile = await fetch(photo.webPath);
      const imageBlob = await imageFile.blob();

      formData.append('image', imageBlob, 'image.jpg');
      formData.append('email', this.userEmail);
      formData.append('place', 'Uploaded from device gallery');
      formData.append('gpsCoordinates', 'Not available');
      formData.append('date', new Date().toISOString());

      const response = await this.http
        .post('http://localhost:5000/api/upload', formData)
        .toPromise();

      console.log('Image uploaded successfully:', response);

      this.loadMemories();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  async loadMemories() {
    try {
      const response = await this.http
        .get<any>(`http://localhost:5000/api/memories/${this.userEmail}`)
        .toPromise();

      if (response && response.memories) {
        this.memoryImages = response.memories.map(
          (memory: any) => memory.image
        );
        this.imageCount = this.memoryImages.length;
        this.checkImageLimit();
      } else {
        this.memoryImages = [];
        this.imageCount = 0;
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  }

  async loadSubscriptionStatus() {
    try {
      const response = await this.http
        .get<any>(`http://localhost:5000/api/users/${this.userEmail}`)
        .toPromise();

      if (response && response.subscription) {
        this.subscriptionStatus = response.subscription;

        if (this.subscriptionStatus === 'Subscribed') {
          this.maxImagesAllowed = Infinity; // No limit for subscribed users
        }
      } else {
        this.subscriptionStatus = 'Unsubscribed';
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  }

  checkImageLimit() {
    if (this.subscriptionStatus === 'Unsubscribed' && this.imageCount >= 40) {
      this.showSubscriptionReminder();
    }
  }

  async showSubscriptionReminder() {
    const alert = await this.alertController.create({
      header: 'Storage Limit Approaching',
      message:
        'You are nearing your storage limit of 50 images. Upgrade to unlimited space by subscribing!',
      buttons: ['OK'],
    });
    await alert.present();
  }
}