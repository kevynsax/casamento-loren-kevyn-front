import { ConvidadoDTO } from './Convidado.DTO';

export interface ConviteDTO{
  id: number;
  nomeConvite: string;
  respondido: boolean;
  convidados: ConvidadoDTO[];
}

