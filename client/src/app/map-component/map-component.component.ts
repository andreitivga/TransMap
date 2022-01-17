import { Component, OnInit } from '@angular/core';
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from '@arcgis/core/geometry/Point'
import { cityMapping } from '../app.component';
import { BackendApiService } from '../services/backend-api.service';
import GeometryService from '@arcgis/core/tasks/GeometryService';
import DistanceParameters from "@arcgis/core/rest/support/DistanceParameters";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";



@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})

export class MapComponentComponent implements OnInit {
  public currentUserId!: string | null;
  private data: any = [];
  private curentUserType!: string | null;
  private map = new ArcGISMap({ basemap: "streets-vector" });
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

  constructor(private backServ: BackendApiService) {
  }

  ngOnInit(): void {
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
    this.fetchAvailableRequests(this.curentUserType);
    this.map.add(this.graphicsLayer);
    this.view.when(() => {
      console.log("Map is loaded");
    });
    this.view.popup.on("trigger-action", (event) => {
      if (event.action.id === "accept-request") {
        this.acceptAvailableFunction(this.view.popup.title.split('#')[1]);
      }
    });
  }

  fetchAvailableRequests(user_type: string | null) {
    this.backServ.getAvailableRequests(user_type).subscribe((res) => {
      this.availableRequests = res;
      this.availableRequests.forEach((element: any) => {
        if (user_type == 'carrier') var city = element[3];
        else var city = element[5];
        switch (city) {
          case 'Bucuresti': {
            const point = new Point({
              longitude: cityMapping.Bucuresti[0] + Math.random() / 50,
              latitude: cityMapping.Bucuresti[1] + Math.random() / 50
            });
            this.availablePoints.push([point, element]);
            break;
          }
          case 'Constanta': {
            const point = new Point({
              longitude: cityMapping.Constanta[0] + Math.random() / 50,
              latitude: cityMapping.Constanta[1] + Math.random() / 50
            });
            this.availablePoints.push([point, element]);
            break;
          }
          case 'Brasov': {
            const point = new Point({
              longitude: cityMapping.Brasov[0] + Math.random() / 50,
              latitude: cityMapping.Brasov[1] + Math.random() / 50
            });
            this.availablePoints.push([point, element]);
            break;
          }
          case 'Cluj': {
            const point = new Point({
              longitude: cityMapping.Cluj[0] + Math.random() / 50,
              latitude: cityMapping.Cluj[1] + Math.random() / 50
            });
            this.availablePoints.push([point, element]);
            break;
          }
          case 'Iasi': {
            const point = new Point({
              longitude: cityMapping.Iasi[0] + Math.random() / 50,
              latitude: cityMapping.Iasi[1] + Math.random() / 50
            });
            this.availablePoints.push([point, element]);
            break;
          }
          case 'Focsani': {
            const point = new Point({
              longitude: cityMapping.Focsani[0] + Math.random() / 50,
              latitude: cityMapping.Focsani[1] + Math.random() / 50
            });
            this.availablePoints.push([point, element]);
            break;
          }
          case 'Timisoara': {
            const point = new Point({
              longitude: cityMapping.Timisoara[0] + Math.random() / 50,
              latitude: cityMapping.Timisoara[1] + Math.random() / 50
            });
            this.availablePoints.push([point, element]);
            break;
          }
        }
      });
      this.availablePoints.forEach((element: any) => {
        const attributesRequest = {
          Name: "Request #" + element[1][0],
          city1: element[1][3],
          city2: element[1][6],
          date1: element[1][4],
          date3: element[1][7],
          date2: element[1][5],
          date4: element[1][8],
          goods: element[1][9],
          weight: element[1][10],
          volume: element[1][11],
          price: element[1][12],
          cn: element[1][13],
        };

        const attributesOffer = {
          Name: "Offer #" + element[1][0],
          city1: element[1][5],
          city2: element[1][7],
          date1: element[1][4],
          date2: element[1][6],
          price_empty: element[1][8],
          price_full: element[1][9],
          cn: element[1][10],
        };
        if (user_type == 'carrier') var pointGraphic = new Graphic({
          geometry: element[0],
          symbol: this.userIcon,
          attributes: attributesRequest,
          popupTemplate: this.popupTemplateRequests

        });
        else var pointGraphic = new Graphic({
          geometry: element[0],
          symbol: this.truckIcon,
          attributes: attributesOffer,
          popupTemplate: this.popupTemplateOffers

        });
        this.graphicsLayer.add(pointGraphic);
      });
    });
  }

  getCityCoordonates(city: string) {
    switch (city) {
      case 'Bucuresti': {
        return {
          longitude: cityMapping.Bucuresti[0],
          latitude: cityMapping.Bucuresti[1],
          spatialReference:({
            wkid: 5523
          })
        };
        break;
      }
      case 'Constanta': {
        return {
          longitude: cityMapping.Constanta[0],
          latitude: cityMapping.Constanta[1],
          spatialReference:({
            wkid: 5523
          })
        };
        break;
      }
      case 'Brasov': {
        return {
          longitude: cityMapping.Brasov[0],
          latitude: cityMapping.Brasov[1],
          spatialReference:({
            wkid: 4326
          })
        };
        break;
      }
      case 'Cluj': {
        return {
          longitude: cityMapping.Cluj[0],
          latitude: cityMapping.Cluj[1],
          spatialReference:({
            wkid: 4326
          })
        };
        break;
      }
      case 'Iasi': {
        return {
          longitude: cityMapping.Iasi[0],
          latitude: cityMapping.Iasi[1],
          spatialReference:({
            wkid: 4326
          })
        };
        break;
      }
      case 'Focsani': {
        return {
          longitude: cityMapping.Focsani[0],
          latitude: cityMapping.Focsani[1],
          spatialReference:({
            wkid: 4326
          })
        };
        break;
      }
      case 'Timisoara': {
        return {
          longitude: cityMapping.Timisoara[0],
          latitude: cityMapping.Timisoara[1],
          spatialReference:({
            wkid: 4326
          })
        };
        break;
      }
      default:{
        return {
          longitude: cityMapping.Timisoara[0],
          latitude: cityMapping.Timisoara[1],
          spatialReference:({
            wkid: 4326
          })
        };
      }
    }
  }

  calculateDistance(city1: string, city2: string) {
    let geometryService = new GeometryService();

    let pt1 = new Point(this.getCityCoordonates(city1));
    let pt2 = new Point(this.getCityCoordonates(city2));
    let geometry = geometryEngine.distance(pt1,pt2, 'meters');
    return geometry;
  
  }

  acceptAvailableFunction(id: any) {
    console.log(id);
    if (this.curentUserType == 'carrier') {
      this.backServ.getRequestById(id).subscribe((res) => {
        this.data = res;
        let city1 = this.data[3];
        let city2 = this.data[6];
        let date1 = this.data[4];
        let date3 = this.data[7];
        let price = this.data[12];
        let status = 'confirmed';
        console.log(this.calculateDistance(city1,city2));
       // this.backServ.addOffer(this.currentUserId, '', date1, city1, date3, city2,)
      })
    }
  }

}