// src/lib/userDataService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Servicio para gestionar datos aislados por usuario
 * Cada usuario tiene su propio espacio de datos
 */

// Generar keys únicas por usuario
export const getUserKey = (userId: string, dataType: string): string => {
  return `@tattoo_app:user_${userId}:${dataType}`;
};

// Inicializar datos vacíos para un nuevo usuario
export const initializeNewUserData = async (userId: string): Promise<void> => {
  try {
    const keys = [
      getUserKey(userId, 'appointments'),
      getUserKey(userId, 'clients'),
      getUserKey(userId, 'folders'),
      getUserKey(userId, 'designs'),
      getUserKey(userId, 'prices'),
    ];

    // Inicializar todos con arrays vacíos
    await Promise.all(
      keys.map(key => AsyncStorage.setItem(key, JSON.stringify([])))
    );

    console.log(`✅ Datos inicializados para usuario: ${userId}`);
  } catch (error) {
    console.error('Error inicializando datos de usuario:', error);
  }
};

// Verificar si un usuario ya tiene datos inicializados
export const userHasData = async (userId: string): Promise<boolean> => {
  try {
    const appointmentsKey = getUserKey(userId, 'appointments');
    const data = await AsyncStorage.getItem(appointmentsKey);
    return data !== null;
  } catch (error) {
    console.error('Error verificando datos de usuario:', error);
    return false;
  }
};

// Limpiar todos los datos de un usuario (útil para logout/reset)
export const clearUserData = async (userId: string): Promise<void> => {
  try {
    const keys = [
      getUserKey(userId, 'appointments'),
      getUserKey(userId, 'clients'),
      getUserKey(userId, 'folders'),
      getUserKey(userId, 'designs'),
      getUserKey(userId, 'prices'),
    ];

    await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
    console.log(`🗑️ Datos eliminados para usuario: ${userId}`);
  } catch (error) {
    console.error('Error limpiando datos de usuario:', error);
  }
};