import {IMyDateModel} from 'angular-mydatepicker';
import {Bairro} from './bairro';

export class Filtro {
  visualizacao: string;
  bairro: Bairro;
  data: IMyDateModel;

  constructor(visualizacao: string, bairro: Bairro, data: IMyDateModel) {
    this.visualizacao = visualizacao;
    this.bairro = bairro;
    this.data = data;
  }
}
