import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private alertCtrl: AlertController) {}

  async onSignup() {
    // Simulate account creation logic
    console.log('Account Created:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    });

    // Show a popup that the account has been created
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Your account has been created successfully!',
      buttons: ['OK'],
    });

    await alert.present();

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
