import { Component, OnInit } from '@angular/core';
import { MapService, PlacesService } from '../../service';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  public selectedId : string = ''

  preLoading : boolean = false;

  constructor(private placesService : PlacesService, private mapService : MapService) { }

  ngOnInit(): void {

  }


  get isLoadingPlaces() : boolean{
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[]{
    return this.placesService.places;
  }


  flyTo( place : Feature ){
    this.selectedId = place.id
    const [lng, lat] = place.center;
    this.mapService.flyTO([lng, lat]);
  }

  getDireccions( place : Feature){

    if(!this.placesService.userLocation) throw Error('No hay userLocation')

    this.placesService.deletePlaces();

    const start = this.placesService.userLocation;
    const end = place.center as [number, number]
    this.mapService.getRouteBetweenPoints(start, end)

  }

}
