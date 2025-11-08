export interface ConvidadoDTO {
    id: number;
    nome: string;
    respondido: boolean;
    statusPresenca: 'SEMRESPOSTA' | 'CONFIRMADO' | 'NEGADO';
    crianca: boolean;
    selecionado: boolean;
}
