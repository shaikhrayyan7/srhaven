import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage {
  userIBAN: string = ''; // User input IBAN
  description: string = ''; // User input description
  subscriptionAmount: number = 49; // Fixed subscription amount
  srHavenIBAN: string = 'GB12 ABCD 102030 12345678'; // Fixed SRHaven IBAN

  constructor(private toastController: ToastController) {}

  // Function to show success toast after payment
  async paySubscription() {
    if (this.userIBAN && this.description) {
      const toast = await this.toastController.create({
        message: 'Paid successfully!',
        duration: 2000,
        color: 'success',
      });
      toast.present();
    } else {
      const errorToast = await this.toastController.create({
        message: 'Please fill in all required fields!',
        duration: 2000,
        color: 'danger',
      });
      errorToast.present();
    }
  }
}
