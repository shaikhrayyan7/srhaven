import { Component } from '@angular/core';
import { ApiService } from './services/api.service'; // New service

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private apiService: ApiService) {
    this.initializeApp();
  }

  async initializeApp() {
    // Call the server if necessary (e.g., to test if it's up)
    try {
      const response = await this.apiService.getUsers(); // Example API call to get all users
      console.log(response);
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
}
