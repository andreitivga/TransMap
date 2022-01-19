import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any = "";
  public email_reg: any = "";
  public role: any = "";
  public first_name: any = "";
  public last_name: any = "";
  public password: any = "";
  public password_reg: any = "";
  public emptyCredentials: boolean = false;
  public emptyCredentials_reg: boolean = false;
  public wrongCredentials: boolean = false;
  public invalidCredentials: boolean = false;

  constructor(public auth: BackendApiService, private router: Router) { }

  ngOnInit(): void {
  }

  register(email_reg: string, password_reg: string, first_name: string, last_name: string, role: string) {
    console.log('!!!!!', this.role)
    if (this.email_reg == '' || this.password_reg == '' || this.last_name == '' || this.first_name == '' || this.role == '') {
      this.emptyCredentials_reg = true;
      return;
    }
    else {
      this.emptyCredentials_reg = false;
    }
    this.auth.register(email_reg, password_reg, first_name, last_name, role).subscribe(res => {
      this.router.navigateByUrl('home');
      localStorage.setItem('user_id', res['user']['id']);
      localStorage.setItem('user_fname', res['user']['first_name']);
      localStorage.setItem('user_type', res['user']['user_type']);
    }, error => this.invalidCredentials = true);
  }

  login(email: string, password: string) {
    if (this.email == '' || this.password == '') {
      this.emptyCredentials = true;
      return;
    }
    else {
      this.emptyCredentials = false;
    }
    this.auth.login(email, password).subscribe(res => {

      localStorage.setItem('user_id', res['user']['id']);
      localStorage.setItem('user_fname', res['user']['first_name']);
      localStorage.setItem('user_type', res['user']['user_type']);
      if (res['user']['user_type'] == 'admin') this.router.navigateByUrl('admin');
      else this.router.navigateByUrl('home');
    }, error => this.wrongCredentials = true);
  }

}