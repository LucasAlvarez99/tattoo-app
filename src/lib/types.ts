// src/lib/types.ts
// Tipos centralizados de la aplicación

// ==================== CLIENTES ====================

export type Client = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  instagram?: string;
  notes?: string;
  totalSessions: number;
  createdAt: Date;
};

// ==================== CITAS ====================

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Appointment = {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  price?: number;
  reminderSent?: boolean;
};

// ==================== CATÁLOGO ====================

export type DesignFolder = {
  id: string;
  name: string;
  description?: string;
  color: string;
  designCount: number;
  createdAt: Date;
};

export type DesignImage = {
  id: string;
  folderId: string;
  uri: string;
  name?: string;
  notes?: string;
  referencePrice?: number;
  createdAt: Date;
};