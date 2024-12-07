import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // For navigation

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
  };

  email: string = ''; // To store the logged-in user's email
  errorMessage: string = ''; // To handle errors if needed

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const state = history.state;
    this.email = state?.email || ''; // Extract email from state

    if (!this.email) {
      console.error('No email provided. Unable to fetch user profile.');
      return; // Just log and stop execution if email is not present
    }

    // Fetch the user's profile using the email
    this.loadUserProfile(this.email);
  }

  loadUserProfile(email: string) {
    this.http.get(`http://localhost:5000/api/users/${email}`).subscribe({
      next: (response: any) => {
        this.user = response; // Assign the user data from the response
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.errorMessage =
          error.error.message || 'Failed to load user profile. Please try again later.';
      },
      complete: () => {
        console.log('Profile fetch completed');
      }
    });
  }

  // Method to navigate to the dashboard (no redirect to login)
  goToDashboard() {
    this.router.navigate(['/dashboard']); // Navigating to the dashboard
  }

  onUpdate() {
    const updatePayload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      newEmail: this.user.email, // Pass as newEmail
      password: this.user.password,
    };
  
    this.http.put(`http://localhost:5000/api/users/${this.email}`, updatePayload).subscribe(
      (response: any) => {
        console.log('Profile updated successfully:', response);
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage =
          error.error.message || 'Failed to update profile. Please try again.';
      }
    );
  }  
  
  onDeleteAccount() {
    this.http.delete(`http://localhost:5000/api/users/${this.email}`).subscribe({
      next: (response: any) => {
        console.log('Account deleted successfully:', response);
        // No redirect, the account deletion is handled and will remain in place
      },
      error: (error) => {
        console.error('Error deleting account:', error);
        this.errorMessage =
          error.error.message || 'Failed to delete account. Please try again.';
      },
      complete: () => {
        console.log('Account deletion completed');
      }
    });
  }
}
