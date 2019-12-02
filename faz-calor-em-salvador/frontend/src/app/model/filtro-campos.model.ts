import {BairroModel} from './bairro.model';
import {IntervaloModel} from './intervalo.model';
import {IMyDate} from 'angular-mydatepicker';

export class FiltroCamposModel {
  visualizacoes: string[];
  bairros: Array<BairroModel>;
  intervalos: Array<IntervaloModel>;
  dias: Array<IMyDate>;
}
