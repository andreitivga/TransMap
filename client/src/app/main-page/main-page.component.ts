import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../services/backend-api.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public currentUserName!: string | null;
  public currentUserId!: string | null;
  public curentUserType!: string | null;
  public truck_id: string = "";
  public trucks: any = {};
  public status: string = "";
  public leaving_date!: NgbDateStruct | null;
  public arriving_date!: NgbDateStruct | null;
  public max_leaving_date!: NgbDateStruct | null;
  public max_arriving_date!: NgbDateStruct | null;
  public leaving_place: string = "";
  public arriving_place: string = "";
  public price_km_empty: string = "";
  public price_km_full: string = "";
  public notes: string = "";
  public truck_model: string = "";
  public truck_volume: string = "";
  public truck_weight: string = "";
  public goods_type: string = "";
  public goods_weight: string = "";
  public goods_volume: string = "";
  public budget: string = "";
  public user_requests: any = [];
  public availableList: any = [];
  public selected_available: string = "";
  public list_rcmd: any = [];
  public goods_type_list = ['furniture', 'animals', 'food', 'medical equipment', 'cars'];
  public city_selector = ['Bucuresti',
    'Constanta',
    'Brasov',
    'Cluj',
    'Iasi',
    'Focsani',
    'Timisoara'];

  public showTrackMap: boolean = false;

  constructor(public auth: BackendApiService, private parserFormatter: NgbDateParserFormatter) { }

  ngOnInit(): void {
    this.currentUserName = localStorage.getItem('user_fname');
    this.curentUserType = localStorage.getItem('user_type');
    this.currentUserId = localStorage.getItem('user_id');

  }

  getTrucks() {
    this.auth.getTruckfromUser(this.currentUserId).subscribe((res) => { this.trucks = res });
  }

  manageModal() {
    if (this.isClient()) this.auth.getRequestsfromUser(this.currentUserId).subscribe((res) => { this.user_requests = res; console.log(this.user_requests); });
    else { this.auth.getOffersfromUser(this.currentUserId).subscribe((res) => { this.user_requests = res; console.log(this.user_requests); }); }
  }

  getAvailableRcmd() {
    this.auth.getAvailableForRecommandation(this.curentUserType, this.currentUserId).subscribe((res) => {
      this.availableList = res;
    })
  }

  getRecommendations() {
    if (this.selected_available != "") {
      if (this.curentUserType == 'carrier') this.auth.getRecommendationCarrier(this.selected_available, this.curentUserType).subscribe((res) => this.list_rcmd = res);
      else {
        this.auth.getRecommendationClient(this.selected_available, this.curentUserType).subscribe((res) => this.list_rcmd = res);
      }
    }
  }

  clearFileds() {
    this.truck_model = "";
    this.truck_volume = "";
    this.truck_weight = "";
  }

  preparePostModal() {
    this.truck_id = "";
    this.status = "";
    this.arriving_place = "";
    this.leaving_place = "";
    this.price_km_empty = "";
    this.price_km_full = "";
    this.notes = "";
    this.goods_type = "";
    this.goods_weight = "";
    this.goods_volume = "";
    this.budget = "";
    this.getTrucks();
  }

  isCarrier() {
    if (this.curentUserType == 'carrier') return true;
    else return false;
  }
  isClient() {
    if (this.curentUserType == 'client') return true;
    else return false;
  }

  refresh() {
    window.location.reload();
  }

  addPostModal() {
    let leav_date = this.parserFormatter.format(this.leaving_date);
    let arr_date = this.parserFormatter.format(this.arriving_date);
    if (this.isCarrier()) {
      this.auth.addOffer(this.currentUserId, this.truck_id, leav_date, this.leaving_place, arr_date, this.arriving_place, this.price_km_empty, this.price_km_full, this.notes).subscribe((res) => { });
      this.refresh();
    }
    else {
      let max_leav_date = this.parserFormatter.format(this.max_leaving_date);
      let max_arr_date = this.parserFormatter.format(this.max_arriving_date);
      this.auth.addRequest(this.currentUserId, leav_date, max_leav_date, this.leaving_place, arr_date, max_arr_date, this.arriving_place, this.goods_type, this.goods_weight, this.goods_volume, this.budget, this.notes).subscribe((res) => { });
      this.refresh();
    }
  }

  addTruckModal() {
    this.auth.addTruck(this.truck_model, this.truck_volume, this.truck_weight, this.currentUserId).subscribe((res) => { });
    this.refresh();
  }

  allowAddOffer() {
    if (this.truck_id == "" || this.leaving_date == null || this.leaving_place == "" || this.arriving_date == null || this.arriving_place == "" || this.price_km_empty == "" || this.price_km_full == "" || this.notes == "") return true;
    return false;
  }
  allowAddRequest() {
    if (this.goods_type == "" || this.goods_volume == "" || this.goods_weight == "" || this.leaving_date == null || this.leaving_place == "" || this.arriving_date == null || this.arriving_place == "" || this.budget == "" || this.notes == "") return true;
    return false;
  }

  allowAddTruck() {
    if (this.truck_model == "" || this.truck_volume == "" || this.truck_weight == "") return true;
    return false;
  }

  notEmptyJson(obj: any) {
    return Object.keys(obj).length;
  }

  clickHome() {
    window.location.reload();
    this.showTrackMap = false;
    console.log("home: ", this.showTrackMap);
  }

  clickTrackTransport() {
    this.showTrackMap = true;
    console.log("track: ", this.showTrackMap);
  }

  acceptAvailableFunction(id: any) {
    console.log(id);
    if (this.curentUserType == 'carrier') {
      this.auth.acceptRequestPopup(this.currentUserId, id, 'carrier').subscribe((res) => this.refresh())
    }
    else {
      this.auth.acceptOfferPopup(this.currentUserId, id, 'client').subscribe((res) => this.refresh())
    }
  }
}
