import {Circle, circle, Control, control, divIcon, DomUtil, geoJSON, Map, marker, tileLayer} from 'leaflet';
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {IAngularMyDpOptions, IMyDate} from 'angular-mydatepicker';
import {FiltroModel} from '../model/filtro.model';
import {DatePipe} from '@angular/common';
import {MapaService} from './mapa.service';
import {FiltroCamposModel} from '../model/filtro-campos.model';
import {IntervaloModel} from '../model/intervalo.model';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  providers: [DatePipe]
})
export class MapaComponent implements OnInit, AfterViewInit {
  constructor(private readonly breakpointObserver: BreakpointObserver, private readonly datePipe: DatePipe,
              private readonly service: MapaService) {}

  filtro: FiltroModel;
  filtroCampos: FiltroCamposModel;
  isLoadingPage: boolean;
  isDisabledFiltros: boolean;

  isLoadingData: boolean;
  isLoadingBairro: boolean;
  isLoadingIntervalo: boolean;
  isLoadingVisualizacao: boolean;


  isLoadingButtons: boolean;
  isDisabledButtons: boolean;

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
  mapa: Map;
  mapaBairro;
  mapaCirculo: Circle;
  mapaPontos = [];
  cabecalhoTemperaturaCidade;
  cabecalhoPaletaDeTemperatura;

  ngOnInit(): void {
    this.isLoadingPage = true;
    this.isLoadingButtons = true;
    this.isDisabledButtons = true;
    this.isDisabledFiltros = true;
    this.filtro = new FiltroModel();
    this.filtroCampos = new FiltroCamposModel();

    this.service.getFiltro().subscribe((filtroCampos: FiltroCamposModel) => {
      this.filtroCampos = filtroCampos;
      this.inicializarFiltro();
      this.isLoadingPage = false;
      this.isLoadingButtons = false;
      this.isDisabledButtons = false;
      this.isDisabledFiltros = false;
    }, () => {{
      this.isLoadingPage = false;
      this.isLoadingButtons = false;
    }});
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  private inicializarMapa(): void {
    this.mapa = new Map('map', {
      center: [-12.8382471753411741, -38.38245391845703],
      zoom: 13,
      attributionControl: false,
      zoomControl: false
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
      .bindPopup(`Estação automática de coleta de dados metereológicos rádio marinha.
                          Estes são dados brutos e sem consistência, mas disponíveis de forma imediata.`);
    marker([-13.005515, -38.505760], {icon:  iconeEstacaoAutomatica}).addTo(this.mapa)
      .bindPopup(`Estação automática de coleta de dados metereológicos Ondina.
                          Estes são dados brutos e sem consistência, mas disponíveis de forma imediata.`);
    marker([-13.005768, -38.505825], {icon:  iconeEstacaoConvencional}).addTo(this.mapa)
      .bindPopup(`Estação convencional de coleta de dados metereológicos Ondina.`);
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

    if (this.cabecalhoTemperaturaCidade) {
      this.mapa.removeControl(this.cabecalhoTemperaturaCidade);
      this.cabecalhoTemperaturaCidade = null;
    }

    if (this.cabecalhoPaletaDeTemperatura) {
      this.mapa.removeControl(this.cabecalhoPaletaDeTemperatura);
      this.cabecalhoPaletaDeTemperatura = null;
    }
  }

  private adicionarLayerBairroNoMapa(data: any): void {
    this.mapaBairro = geoJSON(data.bairro);
    this.mapaBairro.addTo(this.mapa)
      .bindTooltip(data.bairro.properties.nome, { permanent: true, direction: 'center', className: 'mapa-tooltip is-size-3' })
      .openTooltip();
    this.mapa.flyToBounds(this.mapaBairro.getBounds());
  }

  private adicionarLayerPontosNoMapa(data: any): void {
    for (const ponto of data.pontos) {
      const iconeTemperatura = divIcon({
        html: `
        <span class="icon">
            <div>
              <span style="color: black; font-weight: bold; font-size: 16px;">${ponto.properties.temperaturadia ? ponto.properties.temperaturadia + '°C' : '--'}</span><i class="fas fa-sun fa-2x" style="display: inline; color: #f9d71c;"></i>
              <span style="color: black; font-weight: bold; font-size: 16px;">${ponto.properties.temperaturanoite ? ponto.properties.temperaturanoite + '°C' : '--'}</span><i class="fas fa-moon fa-2x" style="display: inline; color: #adc6ff;"></i>
            </div>
          <i class="fas fa-temperature-high fa-4x" style="color: red;"></i>
        </span>
      `,
        className: 'mapa-icone-marker'
      });

      const layer = geoJSON(ponto, {
        pointToLayer(feature, latlng) {
          return marker(latlng, {icon:  iconeTemperatura});
        }
      });

      layer.on('click', () => {
        const circleLayer = circle([ponto.geometry.coordinates[1], ponto.geometry.coordinates[0]], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: 1000
        });

        if (this.mapaCirculo) {
          this.mapa.removeLayer(this.mapaCirculo);

          if (this.mapaCirculo.getLatLng().lat === circleLayer.getLatLng().lat &&
              this.mapaCirculo.getLatLng().lng === circleLayer.getLatLng().lng) {
            this.mapaCirculo = null;
          } else {
            this.mapaCirculo = circleLayer;
            this.mapaCirculo.addTo(this.mapa);
          }
        } else {
          this.mapaCirculo = circleLayer;
          this.mapaCirculo.addTo(this.mapa);
        }
      });

      layer.addTo(this.mapa);
      this.mapaPontos.push(layer);
    }
  }

  onClickIconeEstacao(estacao: number) {
    if (this.isLoadingPage) {
      return;
    }

    if (estacao === 1) {
      this.mapa.flyTo({ lat: -12.808222, lng: -38.495944}, 16);
    } else if (estacao === 2) {
      this.mapa.flyTo({ lat: -13.005515, lng: -38.505760}, 16);
    } else if (estacao === 3) {
      this.mapa.flyTo({ lat: -13.005768, lng: -38.505825}, 16);
    } else if (estacao === 4) {
      if (this.mapaBairro) {
        this.mapa.flyToBounds(this.mapaBairro.getBounds());
      }
    }
  }

  filtrar(): void {
    this.isLoadingButtons = true;
    this.scrollToView('map');

    this.service.postFiltro(this.filtro).subscribe((data: any) => {
      this.limparLayersMapa();
      this.adicionarLayerCabecalhoTopo(data);
      this.adicionarLayerBairroNoMapa(data);
      this.adicionarLayerPontosNoMapa(data);
      this.isLoadingButtons = false;
    }, () => {
      this.isLoadingButtons = false;
    });
  }

  obterTemperaturaTruncada(temperatura) {
    return temperatura && !isNaN(temperatura) ? parseFloat(temperatura).toFixed(2) : '--';
  }

  adicionarLayerCabecalhoTopo(data: any): void {
    this.cabecalhoTemperaturaCidade = new Control({position: 'topright'});
    this.cabecalhoTemperaturaCidade.onAdd = () =>  {
      const div = DomUtil.create('div', '');

      const estacaoAutomaticaTempInst = this.obterTemperaturaTruncada(data.estacaoAutomatica.mediaTemperaturaManha.temperaturainst);
      const estacaoAutomaticaTempMax = this.obterTemperaturaTruncada(data.estacaoAutomatica.mediaTemperaturaManha.temperaturamax);
      const estacaoAutomaticaTempMin = this.obterTemperaturaTruncada(data.estacaoAutomatica.mediaTemperaturaManha.temperaturamin);

      const estacaoAutomaticaRadioMarinhaTempInst = this.obterTemperaturaTruncada(data.estacaoAutomaticaRadioMarinha.mediaTemperaturaManha.temperaturainst);
      const estacaoAutomaticaRadioMarinhaTempMax = this.obterTemperaturaTruncada(data.estacaoAutomaticaRadioMarinha.mediaTemperaturaManha.temperaturamax);
      const estacaoAutomaticaRadioMarinhaTempMin = this.obterTemperaturaTruncada(data.estacaoAutomaticaRadioMarinha.mediaTemperaturaManha.temperaturamin);

      const estacaoConvencionalTempInst = this.obterTemperaturaTruncada(data.estacaoConvencional.mediaTemperaturaManha.temperaturamin);
      const estacaoConvencionalTempMax = this.obterTemperaturaTruncada(data.estacaoConvencional.mediaTemperaturaManha.temperaturamax);
      const estacaoConvencionalTempMin = this.obterTemperaturaTruncada(data.estacaoConvencional.mediaTemperaturaManha.temperaturamin);

      div.innerHTML = `
        <div class="box">
          <div>
            <p class="has-text-centered" style="border-bottom: 1px solid; font-size: 16px; font-weight: bold;">Temperatura do dia (°C)</p>
          </div>

          <div style="display: flex">
          <div style="border-right: 1px solid; padding-right: 2px;">
          <p><i class="fas fa-broadcast-tower fa-xs mapa-icone-estacao-radio-marinha-cor" style="margin-right: 2px;"></i>Inst: ${estacaoAutomaticaTempInst}</p>
          <p><i class="fas fa-broadcast-tower fa-xs mapa-icone-estacao-radio-marinha-cor" style="margin-right: 2px;"></i>Máx: ${estacaoAutomaticaTempMax}</p>
          <p><i class="fas fa-broadcast-tower fa-xs mapa-icone-estacao-radio-marinha-cor" style="margin-right: 2px;"></i>Mín: ${estacaoAutomaticaTempMin}</p>
          </div>

          <div style="border-right: 1px solid; padding-right: 2px; padding-left: 2px;">
            <p><i class="fas fa-broadcast-tower fa-xs" style="margin-right: 2px;"></i>Inst: ${estacaoAutomaticaRadioMarinhaTempInst}</p>
            <p><i class="fas fa-broadcast-tower fa-xs" style="margin-right: 2px;"></i>Máx: ${estacaoAutomaticaRadioMarinhaTempMax}</p>
            <p><i class="fas fa-broadcast-tower fa-xs" style="margin-right: 2px;"></i>Mín: ${estacaoAutomaticaRadioMarinhaTempMin}</p>
          </div>

          <div style="padding-left: 2px;">
            <p><i class="fas fa-broadcast-tower fa-xs mapa-icone-estacao-convencional-cor" style="margin-right: 2px;"></i>Inst: ${estacaoConvencionalTempInst}</p>
            <p><i class="fas fa-broadcast-tower fa-xs mapa-icone-estacao-convencional-cor" style="margin-right: 2px;"></i>Máx: ${estacaoConvencionalTempMax}</p>
            <p><i class="fas fa-broadcast-tower fa-xs mapa-icone-estacao-convencional-cor" style="margin-right: 2px;"></i>Mín: ${estacaoConvencionalTempMin}</p>
          </div>
          </div>
        </div>
      `;

      return div;
    };

    this.cabecalhoTemperaturaCidade.addTo(this.mapa);
  }

  private montarDateModel(myDate: IMyDate) {
    const date = myDate ? new Date(myDate.year + '-' + myDate.month + '-' + myDate.day) : new Date();

    return {
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

  onChangeVisualizacao(): void {
    this.isDisabledButtons = true;
    this.isLoadingIntervalo = true;
    this.filtroCampos.dias = null;
    this.filtroCampos.intervalos = null;

    if (this.filtro.visualizacao && this.filtro.visualizacao === 'Dia a dia') {
      this.service.getDiasDisponiveis(this.filtro.bairro.id).subscribe((dias: Array<IMyDate>) => {
        this.filtroCampos.dias = dias;
        this.filtro.data = this.montarDateModel(dias[0]);
        this.isDisabledButtons = false;
        this.isLoadingIntervalo = false;
      }, () => {
        this.isDisabledButtons = false;
      });
    } else {
      this.service.getIntervalos(this.filtro.bairro.id).subscribe((intervalos: Array<IntervaloModel>) => {
        this.filtroCampos.intervalos = intervalos;
        this.filtro.intervalo = intervalos ? intervalos[0] : null;
        this.isDisabledButtons = false;
        this.isLoadingIntervalo = false;
      }, () => {
        this.isDisabledButtons = false;
      });
    }
  }

  private inicializarFiltro(): void {
    this.filtro = new FiltroModel();
    this.filtro.data = this.montarDateModel(this.filtroCampos.dias ? this.filtroCampos.dias[0] : null);
    this.filtro.bairro = this.filtroCampos.bairros ? this.filtroCampos.bairros[0] : null;
    this.filtro.visualizacao = this.filtroCampos.visualizacoes ? this.filtroCampos.visualizacoes[0] : null;
    this.dataOptions.enableDates = this.filtroCampos.dias;
  }

  limpar(): void {
    this.isLoadingButtons = true;
    this.limparLayersMapa();
    this.scrollToView('filtro');

    this.filtro = new FiltroModel();
    this.filtro.visualizacao = this.filtroCampos.visualizacoes ? this.filtroCampos.visualizacoes[0] : null;
    this.filtro.bairro = this.filtroCampos.bairros ? this.filtroCampos.bairros[0] : null;

    this.service.getDiasDisponiveis(this.filtro.bairro.id).subscribe((dias: Array<IMyDate>) => {
      this.filtroCampos.dias = dias;
      this.dataOptions.enableDates = dias;
      this.filtro.data = this.montarDateModel(dias[0]);
      this.isLoadingButtons = false;
    }, () => {
      this.isLoadingButtons = false;
    });
  }

  private scrollToView(id: string): void {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView();
    }
  }
}
