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
  userEmail: string = ''; // Store the logged-in user's email

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Retrieve the logged-in user's email (from localStorage)
    this.userEmail = localStorage.getItem('email') || ''; // Retrieve from localStorage
    console.log('Retrieved userEmail from localStorage:', this.userEmail); // Debugging log

    // If no email is found, redirect to the login page
    if (!this.userEmail) {
      console.error('No email found in localStorage.');
      this.router.navigate(['/login']); // Redirect to login if no email
      return;
    }

    // Load memories from the backend
    this.loadMemories();
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
      // Ensure the email is available
      if (!this.userEmail) {
        console.error('Error: userEmail is missing or empty');
        return; // Stop if email is missing
      }

      const formData = new FormData();

      // Fetch the image file from the URI and convert it into a Blob
      const imageFile = await fetch(photo.webPath);
      const imageBlob = await imageFile.blob();

      // Log email and metadata for debugging
      console.log('Uploading image with email:', this.userEmail);

      // Append the image and metadata to FormData
      formData.append('image', imageBlob, 'image.jpg');
      formData.append('email', this.userEmail); // Send the user's email
      formData.append('place', 'Uploaded from device gallery'); // Default value for place
      formData.append('gpsCoordinates', 'Not available'); // Default value for GPS coordinates
      formData.append('date', new Date().toISOString()); // Send the current date as the date of upload

      // Debugging: Log FormData content
      formData.forEach((value, key) => {
        console.log(`FormData: ${key} = ${value}`);
      });

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
      // Send a GET request to the backend to fetch images for the logged-in user
      const response = await this.http
        .get<any>(`http://localhost:5000/api/memories/${this.userEmail}`)
        .toPromise();

      // Process the response and update memoryImages array
      if (response && response.memories) {
        this.memoryImages = response.memories.map(
          (memory: any) => memory.image // Extract base64 image string
        );
      } else {
        console.warn('No memories found for the user.');
        this.memoryImages = [];
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  }
}
