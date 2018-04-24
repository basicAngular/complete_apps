import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }
  signin(data): Observable<any> {
    return this.http.post('http://localhost:3000/user', data);
  }
}
