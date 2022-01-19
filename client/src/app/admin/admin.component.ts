import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public currentUserName!: string | null;
  public currentUserId!: string | null;
  public curentUserType!: string | null;
  public addGoodTypeButton: boolean=false;
  public manageContractsButton: boolean=false;
  public home: boolean=true;

  constructor(public auth: BackendApiService) { }

  ngOnInit(): void {
    this.currentUserName = localStorage.getItem('user_fname');
    this.curentUserType = localStorage.getItem('user_type');
    this.currentUserId = localStorage.getItem('user_id');
  }

  goodsOpen()
  {
    this.home=false;
    this.addGoodTypeButton=true;
    this.manageContractsButton=false;
  }
  contractOpen(){
    this.home=false;
    this.addGoodTypeButton=false;
    this.manageContractsButton=true;
  }
  homeOpen(){
    this.home=true;
    this.addGoodTypeButton=false;
    this.manageContractsButton=false;
  }

}
