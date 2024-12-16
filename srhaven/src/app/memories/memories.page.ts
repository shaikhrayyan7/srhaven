import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Import Camera
import { HttpClient } from '@angular/common/http'; // Import HttpClient for sending data to server

@Component({
  selector: 'app-memories',
  templateUrl: './memories.page.html',
  styleUrls: ['./memories.page.scss'],
})
export class MemoriesPage {
  memoryImages: string[] = []; // Array to hold images displayed in the UI
  userEmail: string = ''; // Store the logged-in user's email

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private http: HttpClient // Inject HttpClient
  ) {
    // Retrieve the logged-in user's email (this could be from local storage or a user service)
    this.userEmail = localStorage.getItem('userEmail') || ''; // Adjust based on your actual logic
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
        source: CameraSource.Photos, // Use Photos source to select from gallery
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
      const formData = new FormData();
  
      // Fetch the image file from the URI and convert it into a Blob
      const imageFile = await fetch(photo.webPath);
      const imageBlob = await imageFile.blob();
  
      // Append the image file, user email, and other metadata to FormData
      formData.append('image', imageBlob, 'image.jpg');
      formData.append('email', this.userEmail); // Send logged-in user's email
      formData.append('place', 'Unknown Place'); // Optional metadata
      formData.append('gpsCoordinates', 'Unknown Coordinates'); // Optional metadata
  
      // Send the form data to the backend to store the image
      const response = await this.http.post('http://localhost:5000/api/upload', formData).toPromise();
  
      console.log('Image uploaded successfully:', response);
  
      // Optionally, fetch the updated memories after upload to display them
      this.loadMemories();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }  

  // Function to load saved images from the backend (get all memories)
  async loadMemories() {
    try {
      // Send a GET request to the backend to fetch images for the logged-in user
      const memories = await this.http.get<any>(`http://localhost:5000/api/memories/${this.userEmail}`).toPromise();

      // Update memoryImages array with the image URLs fetched from the backend
      this.memoryImages = memories.map((memory: any) => memory.image); // Assuming image URLs are returned
    } catch (error) {
      console.error('Error fetching memories:', error);
    }
  }

  // Fetch memories when the page loads
  ngOnInit() {
    this.loadMemories();
  }
}
