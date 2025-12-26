// src/lib/priceService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localAuth } from './localAuthService';
import { getUserKey } from './userDataService';

// ==================== TIPOS ====================

export type PriceCategory = {
  id: string;
  name: string;
  description?: string;
  items: PriceItem[];
  isActive: boolean;
  createdAt: Date;
};

export type PriceItem = {
  id: string;
  categoryId: string;
  name: string;
  basePrice: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
};

// ==================== STORAGE ====================

const getPricesKey = (): string => {
  const user = localAuth.getUser();
  if (!user) return '@tattoo_app:prices';
  return getUserKey(user.id, 'prices');
};

// ==================== CRUD DE CATEGORÍAS ====================

export const getAllCategories = async (): Promise<PriceCategory[]> => {
  try {
    const key = getPricesKey();
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data, (key, value) => {
      if (key === 'createdAt') return new Date(value);
      return value;
    }) : [];
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<PriceCategory | null> => {
  try {
    const categories = await getAllCategories();
    return categories.find(cat => cat.id === id) || null;
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    return null;
  }
};

export const createCategory = async (
  category: Omit<PriceCategory, 'id' | 'createdAt'>
): Promise<PriceCategory> => {
  try {
    const categories = await getAllCategories();
    
    const newCategory: PriceCategory = {
      ...category,
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    
    categories.push(newCategory);
    const key = getPricesKey();
    await AsyncStorage.setItem(key, JSON.stringify(categories));
    
    return newCategory;
  } catch (error) {
    console.error('Error creando categoría:', error);
    throw error;
  }
};

export const updateCategory = async (
  id: string,
  updates: Partial<Omit<PriceCategory, 'id' | 'createdAt'>>
): Promise<PriceCategory | null> => {
  try {
    const categories = await getAllCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index === -1) {
      throw new Error('Categoría no encontrada');
    }
    
    categories[index] = {
      ...categories[index],
      ...updates,
    };
    
    const key = getPricesKey();
    await AsyncStorage.setItem(key, JSON.stringify(categories));
    return categories[index];
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    return null;
  }
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const categories = await getAllCategories();
    const filtered = categories.filter(cat => cat.id !== id);
    
    const key = getPricesKey();
    await AsyncStorage.setItem(key, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    return false;
  }
};

// ==================== CRUD DE ITEMS ====================

export const addPriceItem = async (
  categoryId: string,
  item: Omit<PriceItem, 'id' | 'createdAt'>
): Promise<PriceItem | null> => {
  try {
    const categories = await getAllCategories();
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error('Categoría no encontrada');
    }
    
    const newItem: PriceItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    
    categories[categoryIndex].items.push(newItem);
    
    const key = getPricesKey();
    await AsyncStorage.setItem(key, JSON.stringify(categories));
    
    return newItem;
  } catch (error) {
    console.error('Error agregando item:', error);
    return null;
  }
};

export const updatePriceItem = async (
  categoryId: string,
  itemId: string,
  updates: Partial<Omit<PriceItem, 'id' | 'categoryId' | 'createdAt'>>
): Promise<PriceItem | null> => {
  try {
    const categories = await getAllCategories();
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error('Categoría no encontrada');
    }
    
    const itemIndex = categories[categoryIndex].items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Item no encontrado');
    }
    
    categories[categoryIndex].items[itemIndex] = {
      ...categories[categoryIndex].items[itemIndex],
      ...updates,
    };
    
    const key = getPricesKey();
    await AsyncStorage.setItem(key, JSON.stringify(categories));
    
    return categories[categoryIndex].items[itemIndex];
  } catch (error) {
    console.error('Error actualizando item:', error);
    return null;
  }
};

export const deletePriceItem = async (
  categoryId: string,
  itemId: string
): Promise<boolean> => {
  try {
    const categories = await getAllCategories();
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
      throw new Error('Categoría no encontrada');
    }
    
    categories[categoryIndex].items = categories[categoryIndex].items.filter(
      item => item.id !== itemId
    );
    
    const key = getPricesKey();
    await AsyncStorage.setItem(key, JSON.stringify(categories));
    
    return true;
  } catch (error) {
    console.error('Error eliminando item:', error);
    return false;
  }
};

// ==================== CONSULTAS ====================

export const getActiveCategories = async (): Promise<PriceCategory[]> => {
  try {
    const categories = await getAllCategories();
    return categories.filter(cat => cat.isActive && cat.items.some(item => item.isActive));
  } catch (error) {
    console.error('Error obteniendo categorías activas:', error);
    return [];
  }
};

export const calculateQuote = async (selectedItemIds: string[]): Promise<number> => {
  try {
    const categories = await getAllCategories();
    let total = 0;
    
    selectedItemIds.forEach(itemId => {
      categories.forEach(category => {
        const item = category.items.find(i => i.id === itemId && i.isActive);
        if (item) {
          total += item.basePrice;
        }
      });
    });
    
    return total;
  } catch (error) {
    console.error('Error calculando cotización:', error);
    return 0;
  }
};

// ==================== INICIALIZACIÓN ====================

export const initializePrices = async (defaultCategories: PriceCategory[]) => {
  try {
    const key = getPricesKey();
    const existing = await AsyncStorage.getItem(key);
    if (!existing) {
      await AsyncStorage.setItem(key, JSON.stringify(defaultCategories));
    }
  } catch (error) {
    console.error('Error inicializando precios:', error);
  }
};