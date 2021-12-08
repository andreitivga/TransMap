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

  register(email: string, password: string, first_name: string, last_name: string, user_type: string) {
    return this.http.post<any>(backendPath + 'register', { email: email, password: password, first_name: first_name, last_name: last_name, user_type: user_type });
  }

  logout() {
    this.http.post<any>(backendPath + 'logout', {}).subscribe(() => { });
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_fname');
    localStorage.removeItem('user_type');
    this.router.navigateByUrl('login');
  }
  addOffer(carrier_id: string | null, truck_id: string, leaving_date: string, leaving_place: string, arriving_date: string, arriving_place: string, price_km_empty: string, price_km_full: string, notes:string) {
    return this.http.post<any>(backendPath + 'offer', { carrier_id: carrier_id, truck_id: truck_id, status: "Available", leaving_date: leaving_date, leaving_place: leaving_place, arriving_date: arriving_date, arriving_place: arriving_place, price_km_empty: price_km_empty, price_km_full: price_km_full, notes:notes})
  }


}
