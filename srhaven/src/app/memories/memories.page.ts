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

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Retrieve the logged-in user's email (from localStorage)
    this.userEmail = localStorage.getItem('email') || ''; // Retrieve from localStorage

    // If no email is found, redirect to the login page
    if (!this.userEmail) {
      console.error('No email found in localStorage.');
      this.router.navigate(['/login']); // Redirect to login if no email
      return;
    }

    // Load memories and check subscription status
    this.loadMemories();
    this.loadSubscriptionStatus();
  }

  // Function to navigate back to the Dashboard
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Function to open action sheet for image upload (only Gallery option)
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

  // Function to select an image from the gallery
  async selectImageFromGallery() {
    try {
      const photo = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        width: 800,
      });

      // Upload the selected image to the server
      await this.uploadImage(photo);
    } catch (error) {
      console.error('Error selecting image from gallery:', error);
    }
  }

  // Function to upload image to the backend
  async uploadImage(photo: any) {
    try {
      if (!this.userEmail) {
        console.error('Error: userEmail is missing or empty');
        return;
      }

      const formData = new FormData();
      const imageFile = await fetch(photo.webPath);
      const imageBlob = await imageFile.blob();

      // Append the image and metadata to FormData
      formData.append('image', imageBlob, 'image.jpg');
      formData.append('email', this.userEmail);
      formData.append('place', 'Uploaded from device gallery');
      formData.append('gpsCoordinates', 'Not available');
      formData.append('date', new Date().toISOString());

      // Send the form data to the backend
      const response = await this.http
        .post('http://localhost:5000/api/upload', formData)
        .toPromise();

      console.log('Image uploaded successfully:', response);

      // Fetch the updated memories after upload to display them
      this.loadMemories();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  // Function to load saved images from the backend (get all memories for the logged-in user)
  async loadMemories() {
    try {
      const response = await this.http
        .get<any>(`http://localhost:5000/api/memories/${this.userEmail}`)
        .toPromise();

      if (response && response.memories) {
        this.memoryImages = response.memories.map(
          (memory: any) => memory.image // Extract base64 image string
        );
        this.imageCount = this.memoryImages.length; // Update the image count
      } else {
        this.memoryImages = [];
        this.imageCount = 0;
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  }

  // Load subscription status (if any)
  // Function to load subscription status (if any)
async loadSubscriptionStatus() {
  try {
    const response = await this.http
      .get<any>(`http://localhost:5000/api/users/${this.userEmail}`)
      .toPromise();

    console.log('Subscription response:', response);  // Debugging log

    if (response && response.subscription) {
      this.subscriptionStatus = response.subscription; // Update subscription status
      console.log('Subscription status loaded:', this.subscriptionStatus); // Debugging log
    } else {
      console.warn('No subscription status found.');
      this.subscriptionStatus = 'Unsubscribed'; // Default if no subscription status
    }
  } catch (error) {
    console.error('Error fetching subscription status:', error);
  }
}
}
