import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemoryService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getMemories(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/memories/${email}`);
  }
}
