import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-memories',
  templateUrl: './memories.page.html',
  styleUrls: ['./memories.page.scss'],
})
export class MemoriesPage {
  constructor(private router: Router, private actionSheetController: ActionSheetController) {}

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
            console.log('Select from gallery clicked');
            // Here we can add logic to open the gallery (integration goes here)
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
}
