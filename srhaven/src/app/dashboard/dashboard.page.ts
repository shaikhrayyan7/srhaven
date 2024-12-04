import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  constructor(private router: Router) {}

  ionViewWillEnter() {
    // Simply show a welcome message without needing user data
  }

  // Function to handle Create a Memory button click
  onCreateMemory() {
    console.log('Create a Memory button clicked');
    // Logic to open the camera for the user (to be implemented later)
  }

  // Function to handle menu item clicks
  onMenuItemClick(route: string) {
    console.log(`Navigating to ${route}`);
    this.router.navigate([route]);
  }

  // Placeholder for openCamera method
  openCamera() {
    console.log('Camera button clicked');
    // Logic to open the camera to take a picture will go here
  }
}
