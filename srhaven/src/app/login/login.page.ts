import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;  // New property to toggle password visibility

  constructor() {}

  // Login function
  onLogin() {
    console.log('Login clicked');
  }
}
