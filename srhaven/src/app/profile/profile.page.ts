import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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
    password: '',
  };

  email: string = '';
  loading: boolean = true;
  passwordType: string = 'password';

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
    if (!this.email) {
      console.error('No email found in localStorage.');
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.http.get(`http://localhost:5000/api/users/${this.email}`).subscribe({
      next: (response: any) => {
        this.user = { ...response, password: '' };
        this.loading = false;
      },
      error: (error) => {
        console.error(this.translate.instant('PROFILE.LOAD_ERROR'), error);
        this.loading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }

  onUpdate() {
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      this.showToast(this.translate.instant('PROFILE.ALL_FIELDS_REQUIRED'));
      return;
    }

    const updatePayload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.user.password || undefined,
    };

    this.http.put(`http://localhost:5000/api/users/${this.email}`, updatePayload).subscribe({
      next: () => this.showToast(this.translate.instant('PROFILE.UPDATE_SUCCESS')),
      error: () => this.showToast(this.translate.instant('PROFILE.UPDATE_ERROR')),
    });
  }

  onDeleteAccount() {
    this.showToast(this.translate.instant('PROFILE.CONFIRM_DELETE'), true).then((toast) => {
      toast.onDidDismiss().then(() => this.deleteAccount());
    });
  }

  deleteAccount() {
    this.http.delete(`http://localhost:5000/api/users/${this.email}`).subscribe({
      next: () => {
        this.showToast(this.translate.instant('PROFILE.DELETE_SUCCESS'));
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
      },
      error: () => this.showToast(this.translate.instant('PROFILE.DELETE_ERROR')),
    });
  }

  async showToast(message: string, showConfirmButton: boolean = false) {
    const toast = await this.toastController.create({
      message: message,
      duration: showConfirmButton ? 0 : 4000,
      position: 'bottom',
      buttons: showConfirmButton
        ? [{ text: this.translate.instant('PROFILE.CANCEL'), role: 'cancel' }]
        : [],
    });
    toast.present();
    return toast;
  }
}
