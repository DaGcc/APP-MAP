import { Component, OnInit } from '@angular/core';
import { MapService, PlacesService } from '../../service';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.scss']
})
export class BtnMyLocationComponent implements OnInit {

  constructor(private placeService : PlacesService, private mapService : MapService) { }

  ngOnInit(): void {
 
  }


  goToMyLocation(){
    if( !this.placeService.isUserLocationReady ) throw new Error("No hay ubicacion de usuario")
    if( !this.mapService.isMapReady ) throw new Error("No hay mapa disponible")

    this.mapService.flyTO(this.placeService.userLocation! )

  }

}
