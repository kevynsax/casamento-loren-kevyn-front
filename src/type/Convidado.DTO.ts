export interface ConvidadoDTO {
    id: number;
    nome: string;
    respondido: boolean;
    statusPresenca: 'SEMRESPOSTA' | 'COMPARECERA' | 'FALTARA';
    crianca: boolean;
    selecionado: boolean;
}
