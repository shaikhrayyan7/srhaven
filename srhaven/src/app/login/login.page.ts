import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = ''; // To store error message if any

  constructor(private http: HttpClient, private router: Router) {}

  // Method triggered when the login form is submitted
  onLogin() {
    const loginData = { email: this.email, password: this.password };
  
    this.http.post('http://localhost:5000/api/login', loginData).subscribe({
      next: (response: any) => {
        if (response.message === 'Login successful') {
          localStorage.setItem('email', this.email); // Save email to localStorage
          this.router.navigate(['/dashboard']); // Navigate to the dashboard
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.error || 'Login failed. Please try again.';
      }
    });
  }
}
