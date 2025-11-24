import { Router } from 'expo-router';

export const Navigation = {
  home: (router: Router) => router.push('/(tabs)'),
  
  history: (router: Router) => router.push('/(tabs)/history'),
  
  profiles: (router: Router) => router.push('/(tabs)/profiles'),
  
  units: (router: Router) => router.push('/(tabs)/units'),
  
  login: (router: Router) => router.push('/login'),
  
  register: (router: Router) => router.push('/register'),
  
  result: (router: Router, params: {
    id: number | string;
    nivelUrgencia: number | string;
    qrCodeBase64?: string;
    sintomas: string;
  }) => {
    router.push({
      pathname: '/result',
      params: {
        id: String(params.id),
        nivelUrgencia: String(params.nivelUrgencia),
        qrCodeBase64: params.qrCodeBase64 || '',
        sintomas: params.sintomas
      }
    });
  },
  
  replaceHome: (router: Router) => router.replace('/(tabs)'),
  
  replaceLogin: (router: Router) => router.replace('/login'),
  
  replaceHistory: (router: Router) => router.replace('/(tabs)/history'),
  
  back: (router: Router) => router.back(),
  
  dismissAll: (router: Router) => router.dismissAll(),
};

