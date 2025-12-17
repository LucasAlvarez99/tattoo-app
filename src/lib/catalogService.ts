// src/lib/catalogService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DesignFolder, DesignImage } from './mockData';
import { localAuth } from './localAuthService';
import { getUserKey } from './userDataService';

const getFoldersKey = (): string => {
  const user = localAuth.getUser();
  if (!user) return '@tattoo_app:folders';
  return getUserKey(user.id, 'folders');
};

const getDesignsKey = (): string => {
  const user = localAuth.getUser();
  if (!user) return '@tattoo_app:designs';
  return getUserKey(user.id, 'designs');
};

// ==================== CRUD DE CARPETAS ====================

export const getAllFolders = async (): Promise<DesignFolder[]> => {
  try {
    const key = getFoldersKey();
    const data = await AsyncStorage.getItem(key);
    const folders = data ? JSON.parse(data) : [];
    
    // Actualizar conteo de diseños
    for (const folder of folders) {
      const designs = await getDesignsByFolder(folder.id);
      folder.designCount = designs.length;
    }
    
    return folders;
  } catch (error) {
    console.error('Error obteniendo carpetas:', error);
    return [];
  }
};

export const createFolder = async (
  folder: Omit<DesignFolder, 'id' | 'designCount' | 'createdAt'>
): Promise<DesignFolder> => {
  try {
    const folders = await getAllFolders();
    
    const newFolder: DesignFolder = {
      ...folder,
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      designCount: 0,
      createdAt: new Date(),
    };
    
    folders.push(newFolder);
    const key = getFoldersKey();
    await AsyncStorage.setItem(key, JSON.stringify(folders));
    
    return newFolder;
  } catch (error) {
    console.error('Error creando carpeta:', error);
    throw error;
  }
};

export const updateFolder = async (
  id: string,
  updates: Partial<Omit<DesignFolder, 'id' | 'designCount' | 'createdAt'>>
): Promise<DesignFolder | null> => {
  try {
    const folders = await getAllFolders();
    const index = folders.findIndex(folder => folder.id === id);
    
    if (index === -1) {
      throw new Error('Carpeta no encontrada');
    }
    
    folders[index] = {
      ...folders[index],
      ...updates,
    };
    
    const key = getFoldersKey();
    await AsyncStorage.setItem(key, JSON.stringify(folders));
    return folders[index];
  } catch (error) {
    console.error('Error actualizando carpeta:', error);
    return null;
  }
};

export const deleteFolder = async (id: string): Promise<boolean> => {
  try {
    // Primero eliminar todos los diseños de la carpeta
    const designs = await getDesignsByFolder(id);
    for (const design of designs) {
      await deleteDesign(design.id);
    }
    
    // Luego eliminar la carpeta
    const folders = await getAllFolders();
    const filtered = folders.filter(folder => folder.id !== id);
    
    const key = getFoldersKey();
    await AsyncStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando carpeta:', error);
    return false;
  }
};

// ==================== CRUD DE DISEÑOS ====================

export const getAllDesigns = async (): Promise<DesignImage[]> => {
  try {
    const key = getDesignsKey();
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo diseños:', error);
    return [];
  }
};

export const getDesignsByFolder = async (folderId: string): Promise<DesignImage[]> => {
  try {
    const designs = await getAllDesigns();
    return designs.filter(design => design.folderId === folderId);
  } catch (error) {
    console.error('Error obteniendo diseños de la carpeta:', error);
    return [];
  }
};

export const createDesign = async (
  design: Omit<DesignImage, 'id' | 'createdAt'>
): Promise<DesignImage> => {
  try {
    const designs = await getAllDesigns();
    
    const newDesign: DesignImage = {
      ...design,
      id: `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    
    designs.push(newDesign);
    const key = getDesignsKey();
    await AsyncStorage.setItem(key, JSON.stringify(designs));
    
    return newDesign;
  } catch (error) {
    console.error('Error creando diseño:', error);
    throw error;
  }
};

export const updateDesign = async (
  id: string,
  updates: Partial<Omit<DesignImage, 'id' | 'folderId' | 'createdAt'>>
): Promise<DesignImage | null> => {
  try {
    const designs = await getAllDesigns();
    const index = designs.findIndex(design => design.id === id);
    
    if (index === -1) {
      throw new Error('Diseño no encontrado');
    }
    
    designs[index] = {
      ...designs[index],
      ...updates,
    };
    
    const key = getDesignsKey();
    await AsyncStorage.setItem(key, JSON.stringify(designs));
    return designs[index];
  } catch (error) {
    console.error('Error actualizando diseño:', error);
    return null;
  }
};

export const deleteDesign = async (id: string): Promise<boolean> => {
  try {
    const designs = await getAllDesigns();
    const filtered = designs.filter(design => design.id !== id);
    
    const key = getDesignsKey();
    await AsyncStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando diseño:', error);
    return false;
  }
};

// ==================== MOVER DISEÑO ENTRE CARPETAS ====================

export const moveDesignToFolder = async (
  designId: string,
  newFolderId: string
): Promise<boolean> => {
  try {
    const designs = await getAllDesigns();
    const index = designs.findIndex(design => design.id === designId);
    
    if (index === -1) {
      throw new Error('Diseño no encontrado');
    }
    
    designs[index].folderId = newFolderId;
    const key = getDesignsKey();
    await AsyncStorage.setItem(key, JSON.stringify(designs));
    
    return true;
  } catch (error) {
    console.error('Error moviendo diseño:', error);
    return false;
  }
};

// ==================== BÚSQUEDA ====================

export const searchDesigns = async (query: string): Promise<DesignImage[]> => {
  try {
    const designs = await getAllDesigns();
    const lowerQuery = query.toLowerCase();
    
    return designs.filter(design =>
      design.name?.toLowerCase().includes(lowerQuery) ||
      design.notes?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error buscando diseños:', error);
    return [];
  }
};

// ==================== ESTADÍSTICAS ====================

export const getCatalogStats = async () => {
  try {
    const folders = await getAllFolders();
    const designs = await getAllDesigns();
    
    const totalDesigns = designs.length;
    const designsWithPrice = designs.filter(d => d.referencePrice).length;
    const averagePrice = designs
      .filter(d => d.referencePrice)
      .reduce((sum, d) => sum + (d.referencePrice || 0), 0) / (designsWithPrice || 1);
    
    return {
      totalFolders: folders.length,
      totalDesigns,
      designsWithPrice,
      averagePrice: Math.round(averagePrice),
    };
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      totalFolders: 0,
      totalDesigns: 0,
      designsWithPrice: 0,
      averagePrice: 0,
    };
  }
};

// ==================== INICIALIZACIÓN ====================

export const initializeCatalog = async () => {
  try {
    const foldersKey = getFoldersKey();
    const designsKey = getDesignsKey();
    
    const existingFolders = await AsyncStorage.getItem(foldersKey);
    const existingDesigns = await AsyncStorage.getItem(designsKey);
    
    if (!existingFolders) {
      await AsyncStorage.setItem(foldersKey, JSON.stringify([]));
    }
    
    if (!existingDesigns) {
      await AsyncStorage.setItem(designsKey, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error inicializando catálogo:', error);
  }
};