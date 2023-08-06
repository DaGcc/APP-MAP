import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlacesService } from '../../service/places.service';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService } from '../../service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit, AfterViewInit {

  @ViewChild('mapDiv') mapDivElement!: ElementRef

  constructor(private placeService: PlacesService, private mapService : MapService) { }

  ngOnInit(): void {
    console.log(this.placeService.userLocation)
  }

  ngAfterViewInit(): void {
    if (!this.placeService.userLocation) throw new Error('no hay this.placeService.userLocation')


    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placeService.userLocation, // starting position [lng, lat]
      zoom: 13, // starting zoom
    });


    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `)
    new Marker({color: 'red'})
      .setLngLat( this.placeService.userLocation ) //posicion en la que estara ubicado en el mundo
      .setPopup( popup )
      .addTo( map )


    this.mapService.setMap( map );
  }


}
