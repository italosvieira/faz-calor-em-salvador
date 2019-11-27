import {circle, control, divIcon, geoJSON, Map, marker, tileLayer} from 'leaflet';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {IAngularMyDpOptions} from 'angular-mydatepicker';
import {FiltroModel} from '../model/filtro.model';
import {DatePipe} from '@angular/common';
import {MapaService} from './mapa.service';
import {FiltroCamposModel} from '../model/filtro-campos.model';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  providers: [DatePipe]
})
export class MapaComponent implements OnInit, AfterViewInit {
  constructor(private readonly breakpointObserver: BreakpointObserver, private readonly datePipe: DatePipe,
              private readonly service: MapaService) {}

  // FiltroModel
  filtro: FiltroModel;
  filtroCampos: FiltroCamposModel;

  dataOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    dayLabels: {su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sáb'},
    monthLabels: {1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho',
                  7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'}
  };

  // TODO desabilitar datas que não tem no banco
  /*disableSince*/
  /*disableUntil*/

  // Camadas do mapa
  /*['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']*/
  mapa: Map;
  mapaBairro;
  mapaCirculo;
  mapaPontos = [];

  ngOnInit(): void {
    this.filtro = new FiltroModel();
    this.filtroCampos = new FiltroCamposModel();

    this.service.getFiltro().subscribe((filtroCampos: FiltroCamposModel) => {
      this.filtroCampos = filtroCampos;
      this.inicializarFiltro();
    }, error => {{
      console.log(error);
    }});
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

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

    const iconeEstacaoRadioMarinha = divIcon({
      html: `<i class="fas fa-broadcast-tower fa-2x"></i>`,
      className: 'mapa-icone mapa-icone-estacao-radio-marinha-cor'
    });

    const iconeEstacaoAutomatica = divIcon({
      html: `<i class="fas fa-broadcast-tower fa-2x"></i>`,
      className: 'mapa-icone'
    });

    const iconeEstacaoConvencional = divIcon({
      html: `<i class="fas fa-broadcast-tower fa-2x"></i>`,
      className: 'mapa-icone mapa-icone-estacao-convencional-cor'
    });

    marker([-12.808222, -38.495944], {icon:  iconeEstacaoRadioMarinha}).addTo(this.mapa)
      .bindPopup('Estação Automática Rádio Marinha', { closeButton: false });
    marker([-13.005515, -38.505760], {icon:  iconeEstacaoAutomatica}).addTo(this.mapa)
      .bindPopup('Estação Automática Ondina', { closeButton: false });
    marker([-13.005768, -38.505825], {icon:  iconeEstacaoConvencional}).addTo(this.mapa)
      .bindPopup('Estação Convencional Ondina', { closeButton: false });
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

    if (this.mapaCirculo) {
      this.mapa.removeLayer(this.mapaCirculo);
      this.mapaCirculo = null;
    }
  }

  private adicionarLayerBairroNoMapa(data: any): void {
    this.mapaBairro = geoJSON(data.bairro);
    this.mapaBairro.addTo(this.mapa)
      .bindTooltip(data.bairro.properties.nome, { permanent: true, direction: 'center', className: 'mapa-tooltip is-size-3' })
      .openTooltip();
    this.mapa.fitBounds(this.mapaBairro.getBounds());
  }

  private adicionarLayerPontosNoMapa(data: any): void {
    const iconeTemperatura = divIcon({
      html: `<i class="fas fa-temperature-high fa-3x"></i>`,
      className: 'mapa-icone-marker'
    });

    for (const ponto of data.pontos) {
      const layer = geoJSON(ponto, {
        pointToLayer(feature, latlng) {
          const layerMarker = marker(latlng, {icon:  iconeTemperatura})
            .bindPopup(
              `
            <div class="box">
            <div class="has-text-centered is-size-5 has-text-weight-semibold">Manhã</div><br>
              <div class="is-size-7">
                  Temperatura: ${ponto.properties.temperaturadia ? ponto.properties.temperaturadia + '°C' : '--'}<br>
                  Hora: ${ponto.properties.horadia ? ponto.properties.horadia + 'h' : '--'}
                </div>
            </div>
            <div class="box">
            <div class="has-text-centered is-size-5 has-text-weight-semibold">Noite</div><br>
                <div class="is-size-7">
                  Temperatura: ${ponto.properties.temperaturanoite ? ponto.properties.temperaturanoite + '°C' : '--'}<br>
                  Hora: ${ponto.properties.horanoite ? ponto.properties.horanoite + 'h' : ''}
                </div>
            </div>
          `, { closeButton: false });
          return layerMarker;
        }
      });

      layer.addTo(this.mapa).on('click', () => {
        const circleLayer = circle([ponto.geometry.coordinates[1], ponto.geometry.coordinates[0]], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 1000
        });

        if (!this.mapaCirculo) {
          circleLayer.addTo(this.mapa);
          this.mapaCirculo = circleLayer;
        }
      });

      this.mapaPontos.push(layer);
    }
  }

  filtrar(): void {
    this.scrollToView('map');

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

  onChangeVisualizacao(): void {
    this.filtro.intervalo = this.filtroCampos.intervalos ? this.filtroCampos.intervalos[0] : null;

    const date = new Date();

    this.filtro.data = {
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
    };
  }

  private inicializarFiltro(): void {
    this.filtro = new FiltroModel();
    this.filtro.bairro = this.filtroCampos.bairros ? this.filtroCampos.bairros[0] : null;
    this.filtro.visualizacao = this.filtroCampos.visualizacoes ? this.filtroCampos.visualizacoes[0] : null;
    this.onChangeVisualizacao();
  }

  limpar(): void {
    this.inicializarFiltro();
    this.limparLayersMapa();
    this.scrollToView('filtro');
  }

  private scrollToView(id: string): void {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView();
    }
  }
}
