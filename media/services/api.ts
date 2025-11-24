import axios from 'axios';
import { Paciente, TriagemRequest, SearchParams, UnidadeSaude, TriagemResponse } from '../types';

const BASE_URL = 'http://68.221.129.45'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const apiService = {

  login: async (documento: string) => {
    try {
      const response = await api.get('/api/Pacientes');
      const listaPacientes = Array.isArray(response.data) ? response.data : [];
      
      const usuarioEncontrado = listaPacientes.find((p: any) => p.documento === documento);
      
      if (usuarioEncontrado) {
        return {
          id: usuarioEncontrado.id,
          nome: usuarioEncontrado.nomeCompleto,
          token: "token-simulado-front"
        };
      } else {
        throw new Error("Usuário não encontrado. Verifique seu CPF ou cadastre-se primeiro.");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      if (error.message && error.message.includes("não encontrado")) {
        throw error;
      } else if (error.response?.status === 404) {
        throw new Error("Usuário não encontrado. Verifique seu CPF.");
      } else if (error.response?.status >= 500) {
        throw new Error("Erro no servidor. Tente novamente mais tarde.");
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        throw new Error("Erro de conexão. Verifique sua internet.");
      } else {
        throw new Error("Erro ao fazer login. Tente novamente.");
      }
    }
  },

  criarPaciente: async (paciente: Paciente) => {
    const response = await api.post('/api/Pacientes', paciente);
    return response.data;
  },

  buscarPerfil: async (id: number) => {
    const response = await api.get(`/api/Pacientes/${id}`);
    return response.data;
  },

  atualizarPerfil: async (id: number, dados: Partial<Paciente>) => {
    try {
      console.log(`Atualizando perfil ID ${id} com dados:`, dados);
      const response = await api.put(`/api/Pacientes/${id}`, dados);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dados da resposta:", error.response.data);
      }
      throw error;
    }
  },

  excluirConta: async (id: number) => {
    const response = await api.delete(`/api/Pacientes/${id}`);
    return response.data;
  },

  analisarSintomas: async (dados: TriagemRequest) => {
    const response = await api.post('/api/Triagens/analisar', dados);
    return response.data;
  },

  buscarHistorico: async (params: SearchParams) => {
    const queryParams: any = {
      page: params.page || 1,
      size: params.size || 50,
      sort: params.sort || 'dataDesc'
    };
    if (params.pacienteId) {
      queryParams.pacienteId = params.pacienteId;
    }
    if (params.status) {
      queryParams.status = params.status;
    }
    const response = await api.get('/api/Triagens/search', { params: queryParams });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data?.items && Array.isArray(response.data.items)) {
      return response.data.items;
    } else {
      console.warn('Formato de resposta inesperado:', response.data);
      return [];
    }
  },

  cancelarTriagem: async (id: number) => {
    const response = await api.patch(`/api/Triagens/${id}/cancelar`);
    return response.data;
  },

  listarUnidades: async () => {
    const response = await api.get('/api/UnidadesSaude');
    return response.data;
  }
};

export default api;