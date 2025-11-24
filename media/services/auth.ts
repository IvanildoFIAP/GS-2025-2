import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@media_user';
const USER_ID_KEY = '@media_user_id';
const USER_NAME_KEY = '@media_user_name';

export interface UserData {
  id: number;
  nome: string;
  token?: string;
}

export const authService = {
  saveUser: async (userData: UserData): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(USER_ID_KEY, userData.id.toString());
      await AsyncStorage.setItem(USER_NAME_KEY, userData.nome);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      throw error;
    }
  },

  getUser: async (): Promise<UserData | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }
  },

  getUserId: async (): Promise<number | null> => {
    try {
      const userId = await AsyncStorage.getItem(USER_ID_KEY);
      return userId ? parseInt(userId, 10) : null;
    } catch (error) {
      console.error('Erro ao obter ID do usuário:', error);
      return null;
    }
  },

  getUserName: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(USER_NAME_KEY);
    } catch (error) {
      console.error('Erro ao obter nome do usuário:', error);
      return null;
    }
  },

  clearUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem(USER_ID_KEY);
      await AsyncStorage.removeItem(USER_NAME_KEY);
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
      throw error;
    }
  },

  isLoggedIn: async (): Promise<boolean> => {
    try {
      const userId = await AsyncStorage.getItem(USER_ID_KEY);
      return userId !== null;
    } catch (error) {
      return false;
    }
  }
};

