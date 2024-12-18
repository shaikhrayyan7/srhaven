import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private translate: TranslateService, private router: Router) {

    // Retrieve the saved language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.setDefaultLang(savedLanguage);
    this.translate.use(savedLanguage);
  }

  // Method to switch the app's language
  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('appLanguage', lang);
  }

  // Method to navigate to the login page
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  // Method to navigate to the signup page
  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
