import axios from 'axios';
import { Paciente, TriagemRequest, SearchParams, UnidadeSaude, TriagemResponse } from '../types';

const USE_MOCK = true; 

const BASE_URL = 'http://192.168.1.XX:5000'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let mockHistorico: TriagemResponse[] = [
    
];

let mockPaciente = {
    id: 1,
    nomeCompleto: "Ivanildo Silva",
    documento: "42090511877",
    dataNascimento: "1996-07-06",
    telefone: "(11) 98888-8888",
    endereco: "Rua Exemplo, 123",
    latitude: -23.5,
    longitude: -46.6
};

const MOCK_UNIDADES: UnidadeSaude[] = [
    { id: 1, nome: "UBS Vila Mariana", endereco: "Rua Domingos de Morais, 123", cidade: "São Paulo", zona: "Sul", telefone: "(11) 5555-1001" },
    { id: 2, nome: "Hosp. Mun. Tatuapé", endereco: "Av. Celso Garcia, 999", cidade: "São Paulo", zona: "Leste", telefone: "(11) 5555-1002" },
    { id: 3, nome: "AMA Sé", endereco: "Rua Frederico Alvarenga, 50", cidade: "São Paulo", zona: "Centro", telefone: "(11) 5555-1003" },
    { id: 4, nome: "UBS Freguesia do Ó", endereco: "Av. Itaberaba, 400", cidade: "São Paulo", zona: "Norte", telefone: "(11) 5555-1004" },
    { id: 5, nome: "UPA Lapa", endereco: "Rua Trajano, 200", cidade: "São Paulo", zona: "Oeste", telefone: "(11) 5555-1005" },
    { id: 6, nome: "Hosp. Campo Limpo", endereco: "Estrada de Itapecerica, 1500", cidade: "São Paulo", zona: "Sul", telefone: "(11) 5555-1006" },
];

export const apiService = {

  login: async (documento: string) => {
      if (USE_MOCK) {
          await new Promise(resolve => setTimeout(resolve, 500));
          if (documento === "12345678900" || documento === "1") {
              return { id: 1, nome: mockPaciente.nomeCompleto, token: "fake-token" };
          }
          return { id: 1, nome: mockPaciente.nomeCompleto, token: "fake-token" };
      }
      const response = await api.post('/api/Auth/login', { documento });
      return response.data;
  },

  criarPaciente: async (paciente: Paciente) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      mockPaciente = { ...mockPaciente, ...paciente, id: 1 };
      return mockPaciente;
    }
    const response = await api.post('/api/Pacientes', paciente);
    return response.data;
  },

  buscarPerfil: async (id: number) => {
      if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 500));
          return { ...mockPaciente };
      }
      const response = await api.get(`/api/Pacientes/${id}`);
      return response.data;
  },

  atualizarPerfil: async (id: number, dados: Partial<Paciente>) => {
      if (USE_MOCK) {
          console.log("Mock: Atualizando perfil...", dados);
          await new Promise(r => setTimeout(r, 1000));
          mockPaciente = { ...mockPaciente, ...dados };
          return { success: true };
      }
      const response = await api.put(`/api/Pacientes/${id}`, dados);
      return response.data;
  },

  excluirConta: async (id: number) => {
      if (USE_MOCK) {
          console.log("Mock: Deletando conta...");
          await new Promise(r => setTimeout(r, 1500));
          return { success: true };
      }
      const response = await api.delete(`/api/Pacientes/${id}`);
      return response.data;
  },

  analisarSintomas: async (dados: TriagemRequest) => {
    if (USE_MOCK) {
        console.log("Mock: Criando triagem...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const texto = dados.sintomasDescricao.toLowerCase();
        const urgenciaCalculada = (texto.includes('dor') || texto.includes('ar') || texto.includes('febre')) ? 3 : 1;

        const novaTriagem: TriagemResponse = {
            id: Math.floor(Math.random() * 10000),
            pacienteId: 1,
            unidadeSaudeId: 1,
            sintomasDescricao: dados.sintomasDescricao,
            nivelUrgencia: urgenciaCalculada,
            status: 1,
            dataCriacao: new Date().toISOString(),
            qrCodeBase64: "QR_MOCK_" + Date.now(),
            links: { self: "", cancelar: "" }
        };

        mockHistorico.unshift(novaTriagem);
        return novaTriagem;
    }
    const response = await api.post('/api/Triagens/analisar', dados);
    return response.data;
  },

  buscarHistorico: async (params: SearchParams) => {
    if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...mockHistorico];
    }
    const response = await api.get('/api/Triagens/search', { params });
    return response.data;
  },

  cancelarTriagem: async (id: number) => {
    if (USE_MOCK) {
        console.log(`Mock: Cancelando triagem ${id}...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockHistorico.findIndex(t => t.id === id);
        if (index !== -1) mockHistorico[index].status = 0;
        return { success: true };
    }
    
    const response = await api.patch(`/api/Triagens/${id}/cancelar`);
    return response.data;
  },

  listarUnidades: async () => {
      if (USE_MOCK) {
          return MOCK_UNIDADES;
      }
      const response = await api.get('/api/UnidadesSaude');
      return response.data;
  }
};

export default api;