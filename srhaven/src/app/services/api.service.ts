import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api'; // URL of your backend server

  constructor(private http: HttpClient) {}

  /**
   * Function to create a new user
   * @param firstName - The first name of the user
   * @param lastName - The last name of the user
   * @param email - The email of the user
   * @param password - The password of the user
   * @returns Observable of the server response
   */

  loginUser(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        throw error; // Rethrow the error for handling in the component
      })
    );
  }
  
  signupUser(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const user = { firstName, lastName, email, password };
    return this.http.post(`${this.apiUrl}/signup`, user).pipe(
      catchError((error) => {
        console.error('Error during user signup:', error);
        throw error; // Rethrow the error for further handling if needed
      })
    );
  }

  /* Function to get all users @returns Observable of the users list */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      catchError((error) => {
        console.error('Error retrieving users:', error);
        throw error; // Rethrow the error for further handling if needed
      })
    );
  }
}
