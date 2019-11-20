import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapaComponent} from './mapa/mapa.component';
import {EstatisticasComponent} from './estatisticas/estatisticas.component';
import {SobreComponent} from './sobre/sobre.component';

const routes: Routes = [
  { path: '', redirectTo: '/mapa', pathMatch: 'full' },
  { path: 'mapa', component: MapaComponent },
  { path: 'estatisticas', component: EstatisticasComponent },
  { path: 'sobre', component: SobreComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
