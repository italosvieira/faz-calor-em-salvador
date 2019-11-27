import {BairroModel} from './bairro.model';
import {IntervaloModel} from './intervalo.model';

export class FiltroCamposModel {
  visualizacoes: string[];
  bairros: Array<BairroModel>;
  intervalos: Array<IntervaloModel>;
}
