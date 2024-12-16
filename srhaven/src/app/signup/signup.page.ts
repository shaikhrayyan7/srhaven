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
    // Apply the stored language at page load
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

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

    const newUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.apiService.signupUser(newUser.firstName, newUser.lastName, newUser.email, newUser.password).subscribe(
      async () => {
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('SIGNUP.SUCCESS_HEADER'),
          message: this.translate.instant('SIGNUP.SUCCESS_MESSAGE'),
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/login']);
      },
      async (error) => {
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
