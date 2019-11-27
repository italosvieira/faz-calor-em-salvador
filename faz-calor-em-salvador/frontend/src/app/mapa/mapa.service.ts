import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FiltroModel} from '../model/filtro.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  constructor(private http: HttpClient) {}

  getFiltro() {
    return this.http.get(environment.apiUrlPublic + 'filtro');
  }

  postFiltro(filtro: FiltroModel) {
    return this.http.post(environment.apiUrlPublic + 'filtro', filtro);
  }
}
