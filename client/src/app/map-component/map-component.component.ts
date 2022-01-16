import { Component, OnInit } from '@angular/core';
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from '@arcgis/core/geometry/Point'
import Popup from "@arcgis/core/widgets/Popup";
import { cityMapping } from '../app.component';
import { BackendApiService } from '../services/backend-api.service';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css']
})

export class MapComponentComponent implements OnInit {

  public map = new ArcGISMap({ basemap: "streets-vector" });
  public view = new MapView({
    map: this.map,
    container: "viewDiv",
    center: [-118.244, 34.052],
    zoom: 12
  });
  public graphicsLayer = new GraphicsLayer();
  public availablePoints: any = [];
  public availableRequests: any = [];

  constructor(private backServ: BackendApiService) {
  }

  ngOnInit(): void {
    this.map = new ArcGISMap({
      basemap: "streets-vector"
    });

    this.view = new MapView({
      map: this.map,
      container: "viewDiv",
      center: [25, 46],
      zoom: 6
    });

    this.fetchAvailableRequests();

    this.map.add(this.graphicsLayer);

    this.view.when(() => {
      console.log("Map is loaded");
    });
  }

  fetchAvailableRequests() {

    this.backServ.getAvailableRequests().subscribe((res) => {
      this.availableRequests = res;
      console.log(this.availableRequests);
      this.availableRequests.forEach((element: any) => {
        let city = element[3];
        
        switch (city) {
          case 'Bucuresti': {
            const point = new Point({
              longitude: cityMapping.Bucuresti[0] + Math.random() / 50,
              latitude: cityMapping.Bucuresti[1] + Math.random() / 50
            });
            this.availablePoints.push(point);
            break;
          }

          case 'Constanta': {
            const point = new Point({
              longitude: cityMapping.Constanta[0] + Math.random() / 50,
              latitude: cityMapping.Constanta[1] + Math.random() / 50
            });
            this.availablePoints.push(point);
            break;
          }

          case 'Brasov': {
            const point = new Point({
              longitude: cityMapping.Brasov[0] + Math.random() / 50,
              latitude: cityMapping.Brasov[1] + Math.random() / 50
            });
            this.availablePoints.push(point);
            break;
          }

          case 'Cluj': {
            const point = new Point({
              longitude: cityMapping.Cluj[0] + Math.random() / 50,
              latitude: cityMapping.Cluj[1] + Math.random() / 50
            });
            this.availablePoints.push(point);
            break;
          }

          case 'Iasi': {
            const point = new Point({
              longitude: cityMapping.Iasi[0] + Math.random() / 50,
              latitude: cityMapping.Iasi[1] + Math.random() / 50
            });
            this.availablePoints.push(point);
            break;
          }

          case 'Focsani': {
            const point = new Point({
              longitude: cityMapping.Focsani[0] + Math.random() / 50,
              latitude: cityMapping.Focsani[1] + Math.random() / 50
            });
            this.availablePoints.push(point);
            break;
          }

          case 'Timisoara': {
            const point = new Point({
              longitude: cityMapping.Timisoara[0] + Math.random() / 50,
              latitude: cityMapping.Timisoara[1] + Math.random() / 50
            });
            this.availablePoints.push(point);
            break;
          }
        }
      });

  
      this.availablePoints.forEach((element: any) => {
        const textSymbol = {
          type: "text", // autocasts as new TextSymbol()
          color: "#7A003C",
          text: "\ue675", // esri-icon-map-pin
          font: {
            // autocasts as new Font()
            size: 20,
            family: "CalciteWebCoreIcons"
          }
        };

        const pointGraphic = new Graphic({
          geometry: element,
          symbol: textSymbol
        });
        this.graphicsLayer.add(pointGraphic);
      });
    });

  }
}