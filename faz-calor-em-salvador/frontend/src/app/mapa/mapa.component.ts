import {Map, marker, tileLayer, geoJSON, circleMarker, control, circle} from 'leaflet';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {faBroadcastTower, faCalendarAlt, faDrawPolygon, faEraser, faEye, faFilter} from '@fortawesome/free-solid-svg-icons';
import {faCircle} from '@fortawesome/free-regular-svg-icons';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {Filtro} from '../model/filtro';
import {DatePipe} from '@angular/common';
import {MapaService} from './mapa.service';
import {FiltroDTO} from '../model/filtroDTO';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  providers: [DatePipe]
})
export class MapaComponent implements OnInit, AfterViewInit {
  constructor(private readonly breakpointObserver: BreakpointObserver, private readonly datePipe: DatePipe,
              private readonly service: MapaService) {}

  /*['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']*/
  mapa: Map;
  filtro: Filtro;
  faDrawPolygon = faDrawPolygon;
  faFilter = faFilter;
  faEraser = faEraser;
  faCalendarAlt = faCalendarAlt;
  faEye = faEye;
  faCircle = faCircle;
  faBroadcastTower = faBroadcastTower;
  visualizacoes;
  bairros;

  dataOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    dayLabels: {su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sáb'},
    monthLabels: {1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho',
                  7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'}
  };

  // Lon Lat
  estacaoAutomaticaRadioMarinha = '-38.495944, -12.808222';

  // Long lat
  estacaoAutomaticaOndina = '-38.505760, -13.005515';

  // Lon Lat
  estacaoConvencionalOndina = '-38.505825, -13.005768';

  teste;

  // TODO desabilitar datas que não tem no banco
  /*disableSince*/
  /*disableUntil*/

  // Camadas do mapa
  mapaBairro;
  mapaPontos = [];

  ngOnInit(): void {
    this.filtro = new Filtro(null, null, null);

    this.service.getFiltro().subscribe((data: FiltroDTO) => {
      this.visualizacoes =  data.visualizacoes;
      this.bairros = data.bairros;
      this.limpar();
    });
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  /*private validarTamanhoDaTela(): void {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        console.log('XSmall');
        // max-width = 599.99px
      }
      if (result.breakpoints[Breakpoints.Small]) {
        console.log('Small');
        // min-width = 600px and max-width = 959.99px
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        console.log('Medium');
        // 960px and max-width = 1279.99px
      }
      if (result.breakpoints[Breakpoints.Large]) {
        console.log('Large');
        // 1280px and max-width = 1919.99px
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        console.log('XLarge');
        this.mapaHeight = '84%';
        // 1920px
      }
    });
  }*/

  private inicializarMapa(): void {
    this.mapa = new Map('map', {
      center: [-12.8382471753411741, -38.38245391845703],
      zoom: 13,
    });

    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    control.scale().addTo(this.mapa);
    tiles.addTo(this.mapa);


    /*const fontAwesomeIcon = divIcon({
      html: `<fa-icon [icon]="faCircle"></fa-icon>`,
      iconSize: [20, 20],
      className: 'myDivIcon'
    });

    const teste = DomUtil.create('i');

    marker([-12.808222, -38.495944], {icon:  fontAwesomeIcon})
    .addTo(this.mapa).bindPopup('A pretty CSS3 popup.<br> Easily customizable.');*/

    marker([-12.808222, -38.495944]).addTo(this.mapa).bindPopup('Estação Automática Rádio Marinha.');
    marker([-13.005515, -38.505760]).addTo(this.mapa).bindPopup('Estação Automática Ondina');
    marker([-13.005768, -38.505825]).addTo(this.mapa).bindPopup('Estação Convencional Ondina');
  }

  private limparLayersMapa(): void {
    if (this.mapaBairro) {
      this.mapa.removeLayer(this.mapaBairro);
      this.mapaBairro = null;
    }

    if (this.mapaPontos) {
      this.mapaPontos.forEach(p => this.mapa.removeLayer(p));
      this.mapaPontos = [];
    }
  }

  private adicionarLayerBairroNoMapa(data: any): void {
    this.mapaBairro = geoJSON(data.bairro);
    this.mapaBairro.addTo(this.mapa);
  }

  private adicionarLayerPontosNoMapa(data: any): void {
    const geojsonMarkerOptions = {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 1000
    };

    data.pontos.forEach(ponto => {
      const layer = geoJSON(ponto, {
        pointToLayer(feature, latlng) {
          const circle2 = circle(latlng, geojsonMarkerOptions);
          /*circle.bindPopup(`
          Temperatura dia: ${ponto.properties.temperaturadia}°C<br>
          Hora dia: ${ponto.properties.horadia} da manhã<br>
          Temperatura Noite: ${ponto.properties.temperaturanoite}°C<br>
          Hora dia: ${ponto.properties.horanoite} da noite<br>
          `);*/
          return circle2;
        }
      });

      layer.addTo(this.mapa);
      this.mapaPontos.push(layer);
    });
  }

  filtrar(): void {
    console.log(this.filtro);
    this.service.postFiltro(this.filtro).subscribe((data: any) => {
      this.limparLayersMapa();
      this.adicionarLayerBairroNoMapa(data);
      this.adicionarLayerPontosNoMapa(data);
    }, error => {
      console.log(error);
    });
    /*const legend = new Control({position: 'bottomright'});
    legend.onAdd = function(map) {

      // tslint:disable-next-line:one-variable-per-declaration
      const div = DomUtil.create('div', 'info-batata legend-batata'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background: red'  + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(this.mapa);*/
  }

  /*metodoAdd(): HTMLElement {
    // tslint:disable-next-line:one-variable-per-declaration
    const div = DomUtil.create('div', 'info-batata legend-batata'),
      grades = [0, 10, 20, 50, 100, 200, 500, 1000],
      labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + this.getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  }*/

  /*getColor(i) {
    return 'black';
  }*/

  limpar(): void {
    this.limparLayersMapa();

    const date = new Date();
    const visualizacao = this.visualizacoes ? this.visualizacoes[0] : null;
    const bairro = this.bairros ? this.bairros[0] : null;

    this.filtro = new Filtro(visualizacao, bairro, {
      isRange: false,
      singleDate: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        },
        jsDate: date,
        formatted: this.datePipe.transform(date, 'dd/MM/yyyy'),
        epoc:  date.getTime()
      },
      dateRange: null
    });
  }
}
