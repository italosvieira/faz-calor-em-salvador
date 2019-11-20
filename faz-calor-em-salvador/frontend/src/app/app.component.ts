import {Component} from '@angular/core';
import {faChartPie, faInfoCircle, faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor( private router: Router ) {}

  abaSelecionada = 1;
  faMapMarkedAlt = faMapMarkedAlt;
  faChartPie = faChartPie;
  faInfoCircle = faInfoCircle;

  selecionarAba(aba: number): void {
    if (aba) {
      if (aba === 1) {
        this.abaSelecionada = 1;
        this.router.navigate(['mapa']);
        return;
      } else if (aba === 2) {
        this.abaSelecionada = 2;
        this.router.navigate(['estatisticas']);
        return;
      } else if (aba === 3) {
        this.abaSelecionada = 3;
        this.router.navigate(['sobre']);
        return;
      }
    }

    this.abaSelecionada = 1;
    this.router.navigate(['mapa']);
  }
}
