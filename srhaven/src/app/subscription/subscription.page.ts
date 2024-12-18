import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  userIBAN: string = '';
  description: string = '';
  subscriptionAmount: number = 49; 
  srHavenIBAN: string = 'GB12 ABCD 102030 12345678'; 
  userEmail: string = ''; 

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch logged-in user's email from localStorage
    this.userEmail = localStorage.getItem('email') || '';

    if (!this.userEmail) {
      console.error('No user email found in localStorage. Redirecting to login.');
      this.router.navigate(['/login']); // Redirect to login if no email is found
    }
  }

  async paySubscription() {
    // Validate IBAN field
    if (!this.userIBAN) {
      const errorToast = await this.toastController.create({
        message: 'Please enter your IBAN to proceed!',
        duration: 2000,
        color: 'danger',
      });
      errorToast.present();
      return;
    }

    // Send POST request to the backend API
    this.http.post('http://localhost:5000/api/subscription', {
      email: this.userEmail, 
      userIBAN: this.userIBAN, 
      description: this.description || '',
    }).subscribe({
      next: async (response: any) => {
        // Display success toast
        const successToast = await this.toastController.create({
          message: response.message || 'Payment successful! Subscription activated.',
          duration: 2000,
          color: 'success',
        });
        successToast.present();
      },
      error: async (error) => {
        // Handle error response and display error toast
        const errorToast = await this.toastController.create({
          message: error.error.message || 'Failed to process payment!',
          duration: 2000,
          color: 'danger',
        });
        errorToast.present();
      }
    });
  }
}
