import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FiltroModel} from '../model/filtro.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  constructor(private http: HttpClient) {}

  route = environment.apiUrlPublic + 'filtro';

  getFiltro() {
    return this.http.get(this.route);
  }

  postFiltro(filtro: FiltroModel) {
    return this.http.post(this.route, filtro);
  }

  getIntervalos(bairroId) {
    return this.http.get(this.route + `/${bairroId}/intervalos`);
  }

  getDiasDisponiveis(bairroId) {
    return this.http.get(this.route + `/${bairroId}/dias`);
  }
}
