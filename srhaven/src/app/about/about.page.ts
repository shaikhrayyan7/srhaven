import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {
  constructor(private router: Router, private translate: TranslateService) {
    // Set the saved language when the page initializes
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

  // Method to redirect to the Dashboard page
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
