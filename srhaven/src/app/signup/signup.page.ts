import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service'; // Import the ApiService

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private apiService: ApiService // Inject the ApiService
  ) {}

  async onSignup() {
    // Check if all fields are filled
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'All fields are required.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Create the user object
    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    // Call the API to save the user
    this.apiService.signupUser(newUser.firstName, newUser.lastName, newUser.email, newUser.password).subscribe(
      async (response) => {
        console.log('User created successfully:', response);

        // Show success alert
        const alert = await this.alertCtrl.create({
          header: 'Success',
          message: 'Your account has been created successfully!',
          buttons: ['OK'],
        });
        await alert.present();

        // Redirect to the login page
        this.router.navigate(['/login']);
      },
      async (error) => {
        console.error('Error creating user:', error);

        // Show error alert
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message:
            error?.error?.message || 'There was an error creating your account.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}
