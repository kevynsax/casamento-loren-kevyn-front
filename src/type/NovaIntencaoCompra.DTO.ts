export interface NovaIntencaoCompraDTO {
  nome: string;
  mensagem: string;
  idProduto: number;
}

export interface IntencaoCompraResponseDTO {
  id: number;
  qrCodePix: string;
}

export interface Compra {
  id: number;
  nome: string;
  mensagem: string;
  total: number;
  tipoPagamento: 'CARTAO' | 'PIX';
  dataPagamento: string;
  dataCompra: string;
  statusPagamento: 'PENDENTE' | 'FINALIZADO';
}

