// src/lib/studioService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAuth } from './localAuthService';
import { getUserKey } from './userDataService';

// ==================== TIPOS ====================

export type StudioData = {
  name: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  googleMapsLink: string;
  workingHours: string;
  description?: string;
};

// ==================== STORAGE ====================

const getStudioKey = (): string => {
  const user = localAuth.getUser();
  if (!user) return '@tattoo_app:studio_data';
  return getUserKey(user.id, 'studio_data');
};

// ==================== CRUD ====================

export const getStudioData = async (): Promise<StudioData | null> => {
  try {
    const key = getStudioKey();
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error obteniendo datos del estudio:', error);
    return null;
  }
};

export const updateStudioData = async (
  updates: Partial<StudioData>
): Promise<StudioData | null> => {
  try {
    const currentData = await getStudioData();
    
    if (!currentData) {
      throw new Error('No hay datos del estudio inicializados');
    }
    
    const updatedData: StudioData = {
      ...currentData,
      ...updates,
    };
    
    const key = getStudioKey();
    await AsyncStorage.setItem(key, JSON.stringify(updatedData));
    
    return updatedData;
  } catch (error) {
    console.error('Error actualizando datos del estudio:', error);
    return null;
  }
};

export const setStudioData = async (data: StudioData): Promise<StudioData> => {
  try {
    const key = getStudioKey();
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error guardando datos del estudio:', error);
    throw error;
  }
};

// ==================== INICIALIZACIÓN ====================

export const initializeStudioData = async (defaultData: StudioData) => {
  try {
    const key = getStudioKey();
    const existing = await AsyncStorage.getItem(key);
    if (!existing) {
      await AsyncStorage.setItem(key, JSON.stringify(defaultData));
    }
  } catch (error) {
    console.error('Error inicializando datos del estudio:', error);
  }
};