import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { backendPath } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    return this.http.post<any>(backendPath + 'login', { email: email, password: password });
  }
  register(email: string, password: string, first_name: string, last_name: string , user_type:string) {
    return this.http.post<any>(backendPath + 'register', { email: email, password: password, first_name: first_name, last_name: last_name, user_type: user_type });
  }
  logout() {
    this.http.post<any>(backendPath + 'logout', {}).subscribe(() => {});
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_fname');
    localStorage.removeItem('user_type');
    this.router.navigateByUrl('login');
  }

}
