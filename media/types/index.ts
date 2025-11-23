// types/index.ts

export interface Paciente {
  id?: number; // Opcional na criação
  nomeCompleto: string;
  documento: string;
  dataNascimento: string;
  telefone: string;
  endereco: string;
  latitude: number;
  longitude: number;
}

export interface UnidadeSaude {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  zona: 'Norte' | 'Sul' | 'Leste' | 'Oeste' | 'Centro'; // NOVO CAMPO
  telefone?: string;
  // ocupacao, latitude e longitude podem sair ou ficar opcionais
}

export interface TriagemRequest {
  pacienteId: number;
  sintomasDescricao: string;
}

export interface TriagemResponse {
  id: number;
  pacienteId: number;
  unidadeSaudeId: number;
  sintomasDescricao: string;
  nivelUrgencia: number;
  status: number; // Supondo que 1 = Aberta
  dataCriacao: string;
  qrCodeBase64: string;
  links: {
    self: string;
    cancelar: string;
  };
}

// Interface para os parâmetros de busca
export interface SearchParams {
  page?: number;
  size?: number;
  pacienteId?: number;
  status?: string;
  sort?: 'dataAsc' | 'dataDesc';
}