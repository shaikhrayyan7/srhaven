import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  // Variable to hold user's name
  userName: string = 'John Doe'; // Replace with dynamic user data

  constructor(private router: Router) {}

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
