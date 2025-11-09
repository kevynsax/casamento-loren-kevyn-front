export interface MensagemDTO {
  id: number;
  nome: string;
  texto: string;
  dataEnvio: string;
  rotation?: string; // Added for UI display
}

export interface NovaMensagemDTO {
  nome: string;
  texto: string;
}

