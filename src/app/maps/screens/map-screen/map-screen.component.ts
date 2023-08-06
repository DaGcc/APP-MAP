import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../service/places.service';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.scss']
})
export class MapScreenComponent implements OnInit {


  public userLocation : [number, number] | undefined


  constructor(private placeService : PlacesService) { 
  }

  get isUserLocationReady(){
    return this.placeService.isUserLocationReady;
  }

  ngOnInit(): void {
  }








}
