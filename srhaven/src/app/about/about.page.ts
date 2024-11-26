import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {
  
  constructor(private router: Router) {}

  // Method to redirect to the Dashboard page
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
