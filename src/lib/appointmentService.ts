// src/lib/appointmentService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment } from './mockData';

const APPOINTMENTS_KEY = '@tattoo_app:appointments';

// ==================== CRUD DE CITAS ====================

export const getAllAppointments = async (): Promise<Appointment[]> => {
  try {
    const data = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error obteniendo citas:', error);
    return [];
  }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const appointments = await getAllAppointments();
    return appointments.find(apt => apt.id === id) || null;
  } catch (error) {
    console.error('Error obteniendo cita:', error);
    return null;
  }
};

export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'reminderSent'>
): Promise<Appointment> => {
  try {
    const appointments = await getAllAppointments();
    
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reminderSent: false,
    };
    
    appointments.push(newAppointment);
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    
    return newAppointment;
  } catch (error) {
    console.error('Error creando cita:', error);
    throw error;
  }
};

export const updateAppointment = async (
  id: string,
  updates: Partial<Omit<Appointment, 'id'>>
): Promise<Appointment | null> => {
  try {
    const appointments = await getAllAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    
    if (index === -1) {
      throw new Error('Cita no encontrada');
    }
    
    appointments[index] = {
      ...appointments[index],
      ...updates,
    };
    
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return appointments[index];
  } catch (error) {
    console.error('Error actualizando cita:', error);
    return null;
  }
};

export const deleteAppointment = async (id: string): Promise<boolean> => {
  try {
    const appointments = await getAllAppointments();
    const filtered = appointments.filter(apt => apt.id !== id);
    
    await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error eliminando cita:', error);
    return false;
  }
};

// ==================== CONSULTAS ESPECÍFICAS ====================

export const getAppointmentsByClient = async (clientId: string): Promise<Appointment[]> => {
  try {
    const appointments = await getAllAppointments();
    return appointments.filter(apt => apt.clientId === clientId);
  } catch (error) {
    console.error('Error obteniendo citas del cliente:', error);
    return [];
  }
};

export const getAppointmentsByDate = async (date: Date): Promise<Appointment[]> => {
  try {
    const appointments = await getAllAppointments();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= targetDate && aptDate < nextDay;
    });
  } catch (error) {
    console.error('Error obteniendo citas por fecha:', error);
    return [];
  }
};

export const getTodayAppointments = async (): Promise<Appointment[]> => {
  return getAppointmentsByDate(new Date());
};

export const getUpcomingAppointments = async (limit?: number): Promise<Appointment[]> => {
  try {
    const appointments = await getAllAppointments();
    const now = new Date();
    
    const upcoming = appointments
      .filter(apt => new Date(apt.date) > now && apt.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return limit ? upcoming.slice(0, limit) : upcoming;
  } catch (error) {
    console.error('Error obteniendo próximas citas:', error);
    return [];
  }
};

// ==================== INICIALIZACIÓN ====================

export const initializeAppointments = async (mockData: Appointment[]) => {
  try {
    const existing = await AsyncStorage.getItem(APPOINTMENTS_KEY);
    if (!existing) {
      await AsyncStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(mockData));
    }
  } catch (error) {
    console.error('Error inicializando citas:', error);
  }
};