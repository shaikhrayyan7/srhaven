import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular'; // Import ToastController

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
    password: '', // Password is now part of the profile for updating
  };

  email: string = ''; // Holds the logged-in user's email
  loading: boolean = true; // Used to display a loading spinner
  passwordType: string = 'password'; // Password visibility control

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController // Inject ToastController
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') || ''; // Retrieve email from localStorage

    if (!this.email) {
      console.error('No email found in localStorage.');
      this.router.navigate(['/login']); // Redirect to login if no email
      return;
    }

    // Fetch the user's profile using the stored email
    this.loadUserProfile();
  }

  // Load user profile from the backend
  loadUserProfile() {
    this.http.get(`http://localhost:5000/api/users/${this.email}`).subscribe({
      next: (response: any) => {
        this.user = { ...response, password: '' }; // Clear the password field when loading
        console.log('User profile loaded:', this.user);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.loading = false;
      },
    });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  // Update user profile
  onUpdate() {
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      this.showToast('All fields are required.');
      return;
    }

    const updatePayload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email, // Email might be immutable
      password: this.user.password || undefined, // Send only if password is provided
    };

    this.http.put(`http://localhost:5000/api/users/${this.email}`, updatePayload).subscribe({
      next: (response: any) => {
        console.log('Profile updated successfully:', response);
        this.showToast('Profile updated successfully!'); // Show toast on success
        // Update the email in localStorage if it was changed
        if (this.user.email !== this.email) {
          localStorage.setItem('email', this.user.email);
          this.email = this.user.email;
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.showToast('Failed to update profile. Please try again.'); // Show error toast
      },
    });
  }

  // Delete user account
  onDeleteAccount() {
    // Show a toast to confirm deletion
    this.showToast('Are you sure you want to delete your account?', true).then((toast) => {
      toast.onDidDismiss().then(() => {
        this.deleteAccount();
      });
    });
  }

  // Delete the account after confirmation
  deleteAccount() {
    this.http.delete(`http://localhost:5000/api/users/${this.email}`).subscribe({
      next: () => {
        console.log('Account deleted successfully');
        this.showToast('Account deleted successfully!'); // Show success toast
        localStorage.removeItem('email'); // Clear the stored email
        this.router.navigate(['/login']); // Redirect to login page after account deletion
      },
      error: (error) => {
        console.error('Error deleting account:', error);
        this.showToast('Failed to delete account. Please try again.'); // Show error toast
      },
    });
  }

  // Show toast message
  async showToast(message: string, showConfirmButton: boolean = false) {
    const toast = await this.toastController.create({
      message: message,
      duration: showConfirmButton ? 0 : 4000, // Show for 4 seconds if no confirmation button
      position: 'bottom',
      buttons: showConfirmButton
        ? [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Deletion cancelled');
              },
            },
            {
              text: 'Confirm',
              handler: () => {
                console.log('User confirmed deletion');
              },
            },
          ]
        : [],
    });
    toast.present();
    return toast;
  }
}
