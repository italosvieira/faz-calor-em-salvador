import * as L from 'leaflet';
import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  constructor() {}

  private mapa;

  ngOnInit(): void {
    // this.mapa = L.map('map').setView([46.879966, -121.726909], 7);
    //
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(this.mapa);
  }
}
