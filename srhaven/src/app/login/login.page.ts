import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = ''; // To store error message if any

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {
    // Retrieve and set the stored language
    const savedLanguage = localStorage.getItem('appLanguage') || 'en';
    this.translate.use(savedLanguage);
  }

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
  }
  
  // Method triggered when the login form is submitted
  onLogin() {
    const loginData = { email: this.email, password: this.password };

    this.http.post('http://localhost:5000/api/login', loginData).subscribe({
      next: (response: any) => {
        if (response.message === 'Login successful') {
          // Save email to localStorage for future use
          localStorage.setItem('email', this.email);

          // Navigate to the dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        // Display error message in the selected language
        this.errorMessage = error?.error?.error || this.translate.instant('LOGIN.ERROR_MESSAGE');
      },
    });
  }
}
