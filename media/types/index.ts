export interface Paciente {
  id?: number;
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
  ocupacao: string;
  telefone?: string;
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
  status: number;
  dataCriacao: string;
  qrCodeBase64: string;
  links: {
    self: string;
    cancelar: string;
  };
}

export interface SearchParams {
  page?: number;
  size?: number;
  pacienteId?: number;
  status?: string;
  sort?: 'dataAsc' | 'dataDesc';
}