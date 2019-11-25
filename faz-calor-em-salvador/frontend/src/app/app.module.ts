import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MapaComponent} from './mapa/mapa.component';
import {EstatisticasComponent} from './estatisticas/estatisticas.component';
import {SobreComponent} from './sobre/sobre.component';
import {FormsModule} from '@angular/forms';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {DatePipe} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {MapaService} from './mapa/mapa.service';

@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
    EstatisticasComponent,
    SobreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    AngularMyDatePickerModule,
    HttpClientModule
  ],
  providers: [DatePipe, MapaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
