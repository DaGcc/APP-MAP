import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from './../api/directionsApiClient';
import { DirectionsResponse, Route } from './../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private map : Map | undefined;
  private markers : Marker[] = []


  get isMapReady(){
    return !!this.map;
  }


  constructor( private directionsAPi :  DirectionsApiClient) { }


  setMap( map : Map){
    this.map = map;
  }


  flyTO( coords : LngLatLike){

    if( !this.isMapReady ) throw new Error('Error al inicializa mapa ')

    this.map?.flyTo({
      zoom: 14,
      center: coords
    })
  }

  createMarkersFromPlaces( places : Feature[],  userLocation : [number , number] | undefined ){
    if( !this.map ) throw Error('Mapa no inicializaado')
    
    this.markers.forEach( marker => marker.remove() )
    const newMarkers  = []

    for( const place of places ){
      const [lng,lat] = place.center
      const popup = new Popup()
      .setHTML(`
        <h6>${place.text}</h6>
        <span>${place.place_name}</span>
      `)

      const newMarker = new Marker()
      .setLngLat([lng,lat])
      .setPopup( popup )
      .addTo(this.map);

      newMarkers.push( newMarker)

    }

    this.markers = newMarkers;

    if( places.length == 0) return;

    //limites del mapa
    const bounds = new LngLatBounds();

    bounds.extend( userLocation! )
    newMarkers.forEach( marker => {

      bounds.extend(marker.getLngLat())
    } )
    this.map.fitBounds(bounds,{
      padding: 200
    } )

  }


  getRouteBetweenPoints( start : [number, number], end : [number, number]){
    this.directionsAPi.get<DirectionsResponse>(`/${ start.join(',')};${ end.join(',')}`)
    .subscribe( {
      next : data  => this.drawPolyLine(data.routes[0])
    })
  }

  private drawPolyLine( route : Route){
    if(!this.map) throw Error('Mapa no inicializada')
    console.log( { kms: route.distance/1000, duration : route.duration/60})
    
    const coords = route.geometry.coordinates

    const bounds = new LngLatBounds();
    coords.forEach( ([lng, lat]) => {
      bounds.extend([lng, lat]) 
    })

    this.map?.fitBounds( bounds, {
        padding: 200
      }
    )

    //polyLine
    const sourceData : AnySourceData = {
      type : 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    }

    //primero borramos la polyline 
    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString')
      this.map.removeSource('RouteString');
    }


    
    this.map.addSource('RouteString', sourceData)

    //liena
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        "line-cap": 'round',
        "line-join": 'round'
      },
      paint: {
        "line-color": 'black',
        "line-width": 3
      }
    })

  }




}
