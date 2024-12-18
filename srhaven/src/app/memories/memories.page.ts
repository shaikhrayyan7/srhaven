import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-memories',
  templateUrl: './memories.page.html',
  styleUrls: ['./memories.page.scss'],
})
export class MemoriesPage implements OnInit {
  memoryImages: string[] = []; // Array to hold images displayed in the UI
  imageCount: number = 0; // Image count variable
  userEmail: string = ''; // Store the logged-in user's email
  subscriptionStatus: string = 'Unsubscribed'; // Track subscription status
  maxImagesAllowed: number = 50; // Default maximum for unsubscribed users

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Retrieve the logged-in user's email (from localStorage)
    this.userEmail = localStorage.getItem('email') || '';

    // If no email is found, redirect to the login page
    if (!this.userEmail) {
      console.error('No email found in localStorage.');
      this.router.navigate(['/login']);
      return;
    }

    // Load memories and check subscription status
    this.loadMemories();
    this.loadSubscriptionStatus();
  }

  async uploadPicture() {
    if (this.subscriptionStatus === 'Unsubscribed' && this.imageCount >= this.maxImagesAllowed) {
      alert('You have reached the maximum limit of 50 images. Please subscribe for unlimited storage.');
      return;
    }

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
  
      console.log('Full API response:', response); // Log full response
  
      if (response && response.subscription) {
        this.subscriptionStatus = response.subscription;
        console.log('Subscription status loaded:', this.subscriptionStatus);
      } else {
        console.warn('No subscription status found in response.');
        this.subscriptionStatus = 'Unsubscribed'; // Default
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  }  
}
