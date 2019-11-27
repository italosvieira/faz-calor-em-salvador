import {BairroModel} from './bairro.model';
import {IntervaloModel} from './intervalo.model';
import {IMyDateModel} from 'angular-mydatepicker';

export class FiltroModel {
  visualizacao: string;
  bairro: BairroModel;
  data: IMyDateModel;
  intervalo: IntervaloModel;
}
