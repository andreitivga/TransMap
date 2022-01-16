import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
}

export const backendPath = 'http://127.0.0.1:5000/';

//long,lat
export const cityMapping = {
                            'Bucuresti' : [26.10389, 44.43278],
                            'Constanta': [28.6383, 44.1733],
                            'Brasov': [25.3441, 45.71],
                            'Cluj': [23.6172, 46.7784],
                            'Iasi': [27.57, 47.17],
                            'Focsani': [27.1833, 45.7],
                            'Timisoara': [21.2272, 45.749]
                           }

