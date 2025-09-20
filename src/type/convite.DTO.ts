export interface ConviteDTO{
  id: number;
  nomeConvite: String;
  respondido: boolean;
  convidados: Convidado[];
}

export interface Convidado{
    id: number;
    nome: String;
    statusPresenca: String;
}