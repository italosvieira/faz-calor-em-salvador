import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Filtro} from '../model/filtro';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  constructor(private http: HttpClient) {}

  getFiltro() {
    return this.http.get(environment.apiUrlPublic + 'filtro');
  }

  postFiltro(filtro: Filtro) {
    return this.http.post(environment.apiUrlPublic + 'filtro', filtro);
  }
}
