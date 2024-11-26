import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  // Example user data for now, this can be fetched from an API
  user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: '********', // Normally you wouldn't store passwords like this
  };

  constructor(private router: Router) {}

  // Redirect to Dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Update Profile Logic (e.g., send updated data to an API)
  onUpdate() {
    console.log('Updating profile with:', this.user);
    // Handle form submission here (make API call to update the profile)
  }

  // Delete Account Logic
  onDeleteAccount() {
    console.log('Deleting account for:', this.user.email);
    // Implement logic for deleting the user account
  }
}
