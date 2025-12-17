// src/lib/clientService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from './mockData';
import { localAuth } from './localAuthService';
import { getUserKey } from './userDataService';

const getClientsKey = (): string => {
  const user = localAuth.getUser();
  if (!user) return '@tattoo_app:clients'; // Fallback
  return getUserKey(user.id, 'clients');
};

// ==================== TIPO EXTENDIDO DE CLIENTE ====================

export interface ExtendedClient extends Client {
  plannedSessions: number; // Sesiones planificadas
  completedSessions: number; // Sesiones completadas
}

// ==================== CRUD DE CLIENTES ====================

export const getAllClients = async (): Promise<ExtendedClient[]> => {
  try {
    const key = getClientsKey();
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }
};

export const getClientById = async (id: string): Promise<ExtendedClient | null> => {
  try {
    const clients = await getAllClients();
    return clients.find(client => client.id === id) || null;
  } catch (error) {
    console.error('Error obteniendo cliente:', error);
    return null;
  }
};

export const createClient = async (
  client: Omit<ExtendedClient, 'id' | 'totalSessions' | 'completedSessions' | 'createdAt'>
): Promise<ExtendedClient> => {
  try {
    const clients = await getAllClients();
    
    const newClient: ExtendedClient = {
      ...client,
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      totalSessions: 0,
      completedSessions: 0,
      createdAt: new Date(),
    };
    
    clients.push(newClient);
    const key = getClientsKey();
    await AsyncStorage.setItem(key, JSON.stringify(clients));
    
    return newClient;
  } catch (error) {
    console.error('Error creando cliente:', error);
    throw error;
  }
};

export const updateClient = async (
  id: string,
  updates: Partial<Omit<ExtendedClient, 'id' | 'createdAt'>>
): Promise<ExtendedClient | null> => {
  try {
    const clients = await getAllClients();
    const index = clients.findIndex(client => client.id === id);
    
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }
    
    clients[index] = {
      ...clients[index],
      ...updates,
    };
    
    const key = getClientsKey();
    await AsyncStorage.setItem(key, JSON.stringify(clients));
    return clients[index];
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    return null;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const clients = await getAllClients();
    const filtered = clients.filter(client => client.id !== id);
    
    const key = getClientsKey();
    await AsyncStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    return false;
  }
};

// ==================== ACTUALIZAR SESIONES ====================

export const incrementClientSessions = async (
  clientId: string,
  type: 'planned' | 'completed'
): Promise<void> => {
  try {
    const client = await getClientById(clientId);
    if (!client) return;
    
    if (type === 'planned') {
      await updateClient(clientId, {
        plannedSessions: client.plannedSessions + 1,
        totalSessions: client.totalSessions + 1,
      });
    } else {
      await updateClient(clientId, {
        completedSessions: client.completedSessions + 1,
      });
    }
  } catch (error) {
    console.error('Error incrementando sesiones:', error);
  }
};

export const decrementClientSessions = async (
  clientId: string,
  type: 'planned' | 'completed'
): Promise<void> => {
  try {
    const client = await getClientById(clientId);
    if (!client) return;
    
    if (type === 'planned') {
      await updateClient(clientId, {
        plannedSessions: Math.max(0, client.plannedSessions - 1),
        totalSessions: Math.max(0, client.totalSessions - 1),
      });
    } else {
      await updateClient(clientId, {
        completedSessions: Math.max(0, client.completedSessions - 1),
      });
    }
  } catch (error) {
    console.error('Error decrementando sesiones:', error);
  }
};

// ==================== BÚSQUEDA ====================

export const searchClients = async (query: string): Promise<ExtendedClient[]> => {
  try {
    const clients = await getAllClients();
    const lowerQuery = query.toLowerCase();
    
    return clients.filter(client =>
      client.fullName.toLowerCase().includes(lowerQuery) ||
      client.phone.includes(query) ||
      client.email?.toLowerCase().includes(lowerQuery) ||
      client.instagram?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error buscando clientes:', error);
    return [];
  }
};

// ==================== INICIALIZACIÓN ====================

export const initializeClients = async (mockData: Client[]) => {
  try {
    const key = getClientsKey();
    const existing = await AsyncStorage.getItem(key);
    if (!existing) {
      const extendedMockData: ExtendedClient[] = mockData.map(client => ({
        ...client,
        plannedSessions: 0,
        completedSessions: client.totalSessions,
      }));
      await AsyncStorage.setItem(key, JSON.stringify(extendedMockData));
    }
  } catch (error) {
    console.error('Error inicializando clientes:', error);
  }
};