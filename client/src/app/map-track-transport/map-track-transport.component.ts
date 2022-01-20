import { Component, OnInit } from '@angular/core';
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from '@arcgis/core/geometry/Point';
import * as route from '@arcgis/core/rest/route';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import esriConfig from "@arcgis/core/config";
import { cityMapping } from '../app.component';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-map-track-transport',
  templateUrl: './map-track-transport.component.html',
  styleUrls: ['./map-track-transport.component.css']
})
export class MapTrackTransportComponent implements OnInit {

  public currentUserId!: string | null;
  private data: any = [];
  private curentUserType!: string | null;
  private map = new ArcGISMap({ basemap: "arcgis-navigation" });
  private view = new MapView({
    map: this.map,
    container: "viewDiv",
    center: [-118.244, 34.052],
    zoom: 12
  });

  private graphicsLayer = new GraphicsLayer();
  private availablePoints: any = [];
  private availableRequests: any = [];
  private acceptAvailable: any = {
    title: "Accept this Request",
    id: "accept-request",
    image: "../../assets/acceptRequest.png"
    ,
  };
  private userIcon = {
    type: "text",
    color: "#7A003C",
    text: "\ue675", // esri-icon-map-user
    font: {
      size: 20,
      family: "CalciteWebCoreIcons"
    }
  };
  private truckIcon = {
    type: "text",
    color: "#7A003C",
    text: "\ue660", // esri-icon-map-shoppingbag
    font: {
      size: 20,
      family: "CalciteWebCoreIcons"
    }
  };
  private popupTemplateRequests = {
    title: "{Name}",
    content: "Leaves from {city1} to {city2} from {date1} to {date3}. Accepts delay from {date2} to {date4}. \
    Goods: {goods}. Weight:{weight}, Volume: {volume}. Budget: {price}  RON. Client notes: {cn}",
    actions: [this.acceptAvailable]
  };
  private popupTemplateOffers = {
    title: "{Name}",
    content: "Leaves from {city1} to {city2} from {date1} to {date2}. Price/km empty: {price_empty} RON. \
    Price/km full: {price_full} RON. Carrier notes: {cn}",
    actions: [this.acceptAvailable]
  };

  private routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";


  constructor(private backServ: BackendApiService) {
  }

  ngOnInit(): void {
    console.log("TRACK MAP");
    esriConfig.apiKey = "AAPKae40b934261e4ec6b79d2622e2b5b049kIV7ihnilaRJHxO1UFOXu9yBHyeMyAm4TK0cKUmxkDfMndCJfMKANS7yOUChaPUF";
    this.currentUserId = localStorage.getItem('user_id');
    this.curentUserType = localStorage.getItem('user_type');
    this.map = new ArcGISMap({
      basemap: "streets-vector"
    });

    this.view = new MapView({
      map: this.map,
      container: "viewDiv",
      center: [25, 46],
      zoom: 6
    });

    const point1 = new Point({
      longitude: cityMapping.Bucuresti[0] + Math.random() / 50,
      latitude: cityMapping.Bucuresti[1] + Math.random() / 50
    });

    const point2 = new Point({
      longitude: cityMapping.Constanta[0] + Math.random() / 50,
      latitude: cityMapping.Constanta[1] + Math.random() / 50
    });

    this.addGraphic(point1);
    this.addGraphic(point2);

    this.getRoute();
  }

  addGraphic(point : Point) {
    const graphic = new Graphic({
      geometry: point,
      symbol: this.truckIcon
    });

    this.view.graphics.add(graphic);
  }

  async getRoute() {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: this.view.graphics.toArray()
      }),
      returnRoutes: true,
      returnDirections: true
    });

    route.solve(this.routeUrl, routeParams).then((res:any) => {
      console.log(res.routeResults[0].route);
      console.log(res.routeResults[0].directions);
      this.view.graphics.add(res.routeResults[0].route);
      }).catch((error) => {
        console.log(error);
    })
  }

}
