export interface ConvidadoDTO {
    id: number;
    nome: string;
    respondido: boolean;
    statusPresenca: 'SEMRESPOSTA' | 'COMPARECERA' | 'NEGADO';
    crianca: boolean;
    selecionado: boolean;
}
