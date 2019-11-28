import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapaComponent } from './mapa/mapa.component';
import { EstatisticasComponent } from './estatisticas/estatisticas.component';
import { SobreComponent } from './sobre/sobre.component';

const routes: Routes = [
  { path: '', component: MapaComponent },
  /*{ path: 'estatisticas', component: EstatisticasComponent, pathMatch: 'full' },
  { path: 'sobre', component: SobreComponent, pathMatch: 'full' },*/
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
