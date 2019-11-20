import {Map, tileLayer} from 'leaflet';
import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements AfterViewInit {
  constructor() {}

  private mapa;

  ngAfterViewInit(): void {
    this.mapa = new Map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.mapa);
  }
}
