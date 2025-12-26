// src/lib/messageTemplateService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAuth } from './localAuthService';
import { getUserKey } from './userDataService';

// ==================== TIPOS ====================

export type MessageTemplate = {
  id: string;
  name: string;
  type: 'reminder' | 'confirmation' | 'followup' | 'custom';
  message: string;
  channels: ('whatsapp' | 'email' | 'instagram')[];
  enabled: boolean;
  sendBefore?: number; // Horas antes (positivo) o después (negativo)
};

// ==================== STORAGE ====================

const getTemplatesKey = (): string => {
  const user = localAuth.getUser();
  if (!user) return '@tattoo_app:message_templates';
  return getUserKey(user.id, 'message_templates');
};

// ==================== CRUD ====================

export const getAllTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    const key = getTemplatesKey();
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo plantillas:', error);
    return [];
  }
};

export const getTemplateById = async (id: string): Promise<MessageTemplate | null> => {
  try {
    const templates = await getAllTemplates();
    return templates.find(t => t.id === id) || null;
  } catch (error) {
    console.error('Error obteniendo plantilla:', error);
    return null;
  }
};

export const createTemplate = async (
  template: Omit<MessageTemplate, 'id'>
): Promise<MessageTemplate> => {
  try {
    const templates = await getAllTemplates();
    
    const newTemplate: MessageTemplate = {
      ...template,
      id: `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    templates.push(newTemplate);
    const key = getTemplatesKey();
    await AsyncStorage.setItem(key, JSON.stringify(templates));
    
    return newTemplate;
  } catch (error) {
    console.error('Error creando plantilla:', error);
    throw error;
  }
};

export const updateTemplate = async (
  id: string,
  updates: Partial<Omit<MessageTemplate, 'id'>>
): Promise<MessageTemplate | null> => {
  try {
    const templates = await getAllTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Plantilla no encontrada');
    }
    
    templates[index] = {
      ...templates[index],
      ...updates,
    };
    
    const key = getTemplatesKey();
    await AsyncStorage.setItem(key, JSON.stringify(templates));
    return templates[index];
  } catch (error) {
    console.error('Error actualizando plantilla:', error);
    return null;
  }
};

export const deleteTemplate = async (id: string): Promise<boolean> => {
  try {
    const templates = await getAllTemplates();
    const filtered = templates.filter(t => t.id !== id);
    
    const key = getTemplatesKey();
    await AsyncStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando plantilla:', error);
    return false;
  }
};

// ==================== CONSULTAS ====================

export const getEnabledTemplates = async (): Promise<MessageTemplate[]> => {
  try {
    const templates = await getAllTemplates();
    return templates.filter(t => t.enabled);
  } catch (error) {
    console.error('Error obteniendo plantillas activas:', error);
    return [];
  }
};

export const getTemplatesByType = async (
  type: MessageTemplate['type']
): Promise<MessageTemplate[]> => {
  try {
    const templates = await getAllTemplates();
    return templates.filter(t => t.type === type);
  } catch (error) {
    console.error('Error obteniendo plantillas por tipo:', error);
    return [];
  }
};

// ==================== FORMATEO ====================

export const formatMessage = (
  template: string,
  data: {
    nombre?: string;
    fecha?: string;
    hora?: string;
    precio?: number;
    estudio?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    instagram?: string;
  }
): string => {
  let message = template;
  
  const replacements: Record<string, string> = {
    '{nombre}': data.nombre || '',
    '{fecha}': data.fecha || '',
    '{hora}': data.hora || '',
    '{precio}': data.precio ? `$${data.precio.toLocaleString()}` : '',
    '{estudio}': data.estudio || '',
    '{direccion}': data.direccion || '',
    '{telefono}': data.telefono || '',
    '{email}': data.email || '',
    '{instagram}': data.instagram || '',
  };
  
  Object.entries(replacements).forEach(([key, value]) => {
    message = message.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  });
  
  return message;
};

// ==================== INICIALIZACIÓN ====================

export const initializeTemplates = async (defaultTemplates: MessageTemplate[]) => {
  try {
    const key = getTemplatesKey();
    const existing = await AsyncStorage.getItem(key);
    if (!existing) {
      await AsyncStorage.setItem(key, JSON.stringify(defaultTemplates));
    }
  } catch (error) {
    console.error('Error inicializando plantillas:', error);
  }
};