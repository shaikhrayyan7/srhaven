import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';

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
    private apiService: ApiService,
    private translate: TranslateService
  ) {
    // Set the app's language based on the saved preference
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

  // Validate the email format
  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('SIGNUP.ERROR_HEADER'),
        message: this.translate.instant('SIGNUP.INVALID_EMAIL'),
        buttons: ['OK'],
      });
      await alert.present();
      return false;
    }
    return true;
  }

  // Validate the password format
  async validatePassword(password: string): Promise<boolean> {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('SIGNUP.ERROR_HEADER'),
        message: this.translate.instant('SIGNUP.INVALID_PASSWORD'),
        buttons: ['OK'],
      });
      await alert.present();
      return false;
    }
    return true;
  }

  // Handle the signup process
  async onSignup() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('SIGNUP.ERROR_HEADER'),
        message: this.translate.instant('SIGNUP.ALL_FIELDS_REQUIRED'),
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Validate the email format
    const isEmailValid = await this.validateEmail(this.email);
    if (!isEmailValid) return;

    // Validate the password format
    const isPasswordValid = await this.validatePassword(this.password);
    if (!isPasswordValid) return;

    // Prepare the user data for signup
    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };


    // Call the API to create a new user
    this.apiService.signupUser(newUser.firstName, newUser.lastName, newUser.email, newUser.password).subscribe(
      async () => {
        // On successful signup, show a success message and navigate to the login page
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('SIGNUP.SUCCESS_HEADER'),
          message: this.translate.instant('SIGNUP.SUCCESS_MESSAGE'),
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/login']);
      },
      async (error) => {
        // On error, show an error message
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('SIGNUP.ERROR_HEADER'),
          message: error?.error?.message || this.translate.instant('SIGNUP.ERROR_MESSAGE'),
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}
