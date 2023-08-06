import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  isLoadingPlaces : boolean = false

  private debounceTimer? : NodeJS.Timeout // significa que puede ser un objeto Timeout de Node.js o 

  constructor(private placesService : PlacesService) { }

  ngOnInit(): void {
  }



  //se llama cada vez que apretamos una tecla
  onQueryChange(query : string | undefined){


    //EJECUCION A 
    //se cancela la ejecucion "A" anterior si es que se vuelve a llamar a onQuerhange, luego se crea otro setTimeout
    if(this.debounceTimer) clearTimeout(this.debounceTimer);


    //EJECUCION B
    //se inicia una ejecucion dentro de 1000s o puede ser eliminada e iniciada nuevamente por clearTimeOut
    this.debounceTimer = setTimeout(() => {
      console.log("mandar "+query)
      this.placesService.getPlacesByQuery(query);
    }, 500);

  }

}

/*
DATO: 
El "debounce" es un patrón de diseño o técnica utilizada en programación para controlar la frecuencia con la que se ejecuta una función 
o acción en respuesta a eventos, especialmente eventos que pueden ocurrir repetidamente en un corto período de tiempo.

El objetivo del "debounce" es retrasar la ejecución de la función hasta que se haya esperado un período específico desde el último evento. 
De esta manera, si se generan múltiples eventos en rápida sucesión, solo se ejecutará la función una vez, después de que haya pasado el período de espera
*/
