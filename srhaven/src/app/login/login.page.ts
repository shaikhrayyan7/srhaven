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
    const loginData = {
      email: this.email,
      password: this.password
    };

    // Send a POST request to your backend API
    this.http.post('http://localhost:5000/api/login', loginData).subscribe(
      (response: any) => {
        // Handle successful login
        if (response.message === 'Login successful') {
          // Redirect to the dashboard page after successful login
          this.router.navigate(['/dashboard']); 
        }
      },
      (error) => {
        // Handle errors (e.g., incorrect password or user not found)
        this.errorMessage = error.error.message || 'Login failed. Please try again.';
      }
    );
  }
}
