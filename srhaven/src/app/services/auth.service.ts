import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Mock login method
  login(email: string, password: string): Observable<any> {
    const loginUrl = 'https://your-api.com/login'; // Replace with your actual API endpoint

    return this.http.post(loginUrl, { email, password }).pipe(
      catchError((error) => {
        console.error('Login error', error);
        return throwError(error);
      })
    );
  }
}
