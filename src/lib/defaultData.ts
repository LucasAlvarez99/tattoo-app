// src/lib/defaultData.ts
// Datos iniciales que se usan al crear una cuenta nueva

import { Client, Appointment, DesignFolder, DesignImage } from './types';
import { PriceCategory } from './priceService';
import { MessageTemplate } from './messageTemplateService';
import { StudioData } from './studioService';

// ==================== CLIENTES MOCK ====================

export const defaultClients: Client[] = [
  {
    id: 'client_1',
    fullName: 'Juan Pérez',
    phone: '+54 9 11 2345-6789',
    email: 'juan@email.com',
    instagram: '@juanperez',
    notes: 'Cliente frecuente',
    totalSessions: 5,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'client_2',
    fullName: 'María González',
    phone: '+54 9 11 3456-7890',
    email: 'maria@email.com',
    totalSessions: 1,
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 'client_3',
    fullName: 'Carlos Rodríguez',
    phone: '+54 9 11 4567-8901',
    totalSessions: 3,
    createdAt: new Date('2024-06-20'),
  },
];

// ==================== CITAS MOCK ====================

export const defaultAppointments: Appointment[] = [
  {
    id: 'apt_1',
    clientId: 'client_1',
    clientName: 'Juan Pérez',
    date: new Date('2025-12-20T15:00:00'),
    durationMinutes: 120,
    status: 'confirmed',
    notes: 'Tatuaje en brazo',
    price: 25000,
    reminderSent: false,
  },
  {
    id: 'apt_2',
    clientId: 'client_2',
    clientName: 'María González',
    date: new Date('2025-12-21T18:00:00'),
    durationMinutes: 60,
    status: 'pending',
    notes: 'Primera sesión',
    price: 15000,
    reminderSent: false,
  },
  {
    id: 'apt_3',
    clientId: 'client_3',
    clientName: 'Carlos Rodríguez',
    date: new Date('2025-12-22T14:00:00'),
    durationMinutes: 180,
    status: 'pending',
    price: 35000,
    reminderSent: false,
  },
];

// ==================== PRECIOS POR DEFECTO ====================

export const defaultPriceCategories: PriceCategory[] = [
  {
    id: 'size',
    name: 'Por Tamaño',
    description: 'Cotización según dimensiones',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    items: [
      {
        id: 'size-mini',
        categoryId: 'size',
        name: 'Mini (hasta 5cm)',
        basePrice: 15000,
        description: 'Tatuajes pequeños y simples',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'size-small',
        categoryId: 'size',
        name: 'Pequeño (5-10cm)',
        basePrice: 25000,
        description: 'Tamaño ideal para muñecas, tobillos',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'size-medium',
        categoryId: 'size',
        name: 'Mediano (10-20cm)',
        basePrice: 45000,
        description: 'Antebrazo, pantorrilla',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'size-large',
        categoryId: 'size',
        name: 'Grande (20cm+)',
        basePrice: 80000,
        description: 'Espalda, muslo, pecho',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
    ],
  },
  {
    id: 'bodypart',
    name: 'Por Pieza/Zona',
    description: 'Cotización por parte del cuerpo',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    items: [
      {
        id: 'bodypart-arm',
        categoryId: 'bodypart',
        name: 'Brazo completo',
        basePrice: 150000,
        description: 'Manga completa de hombro a muñeca',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'bodypart-half-arm',
        categoryId: 'bodypart',
        name: 'Media manga',
        basePrice: 80000,
        description: 'Hombro a codo o codo a muñeca',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'bodypart-leg',
        categoryId: 'bodypart',
        name: 'Pierna completa',
        basePrice: 180000,
        description: 'Muslo a tobillo',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'bodypart-back',
        categoryId: 'bodypart',
        name: 'Espalda completa',
        basePrice: 250000,
        description: 'Espalda entera',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
    ],
  },
  {
    id: 'session',
    name: 'Por Sesión',
    description: 'Cotización por tiempo de trabajo',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    items: [
      {
        id: 'session-1h',
        categoryId: 'session',
        name: 'Sesión 1 hora',
        basePrice: 20000,
        description: 'Una hora de trabajo',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'session-2h',
        categoryId: 'session',
        name: 'Sesión 2 horas',
        basePrice: 35000,
        description: 'Dos horas de trabajo',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'session-3h',
        categoryId: 'session',
        name: 'Sesión 3 horas',
        basePrice: 50000,
        description: 'Tres horas de trabajo',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'session-4h',
        categoryId: 'session',
        name: 'Sesión 4+ horas',
        basePrice: 65000,
        description: 'Sesión extendida',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
    ],
  },
  {
    id: 'style',
    name: 'Por Estilo',
    description: 'Complejidad y técnica',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    items: [
      {
        id: 'style-linework',
        categoryId: 'style',
        name: 'Linework/Minimalista',
        basePrice: 18000,
        description: 'Líneas simples, diseño limpio',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'style-blackwork',
        categoryId: 'style',
        name: 'Blackwork',
        basePrice: 25000,
        description: 'Relleno sólido negro',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'style-color',
        categoryId: 'style',
        name: 'Color',
        basePrice: 30000,
        description: 'Con relleno de color',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'style-realistic',
        categoryId: 'style',
        name: 'Realismo',
        basePrice: 40000,
        description: 'Alto nivel de detalle y sombreado',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
    ],
  },
];

// ==================== PLANTILLAS DE MENSAJES ====================

export const defaultMessageTemplates: MessageTemplate[] = [
  {
    id: 'tmpl_1',
    name: 'Recordatorio de Cita',
    type: 'reminder',
    message: 'Hola {nombre}! 👋 Te recordamos tu cita mañana {fecha} a las {hora} en {estudio}. ¡Te esperamos! 🎨',
    channels: ['whatsapp', 'email'],
    enabled: true,
    sendBefore: 24,
  },
  {
    id: 'tmpl_2',
    name: 'Confirmación de Cita',
    type: 'confirmation',
    message: '✅ Cita confirmada para {fecha} a las {hora}.\nPrecio estimado: {precio}\n\n📍 {estudio}\n{direccion}',
    channels: ['whatsapp'],
    enabled: true,
  },
  {
    id: 'tmpl_3',
    name: 'Seguimiento Post-Sesión',
    type: 'followup',
    message: 'Hola {nombre}! 🌟 ¿Cómo va la cicatrización de tu tatuaje? Recordá seguir los cuidados que te indicamos. Cualquier duda, escribinos! 💪',
    channels: ['whatsapp'],
    enabled: false,
    sendBefore: -168, // 7 días después
  },
];

// ==================== DATOS DEL ESTUDIO ====================

export const defaultStudioData: StudioData = {
  name: 'Studio Ink Master',
  address: 'Av. Corrientes 1234, CABA',
  phone: '+54 9 11 1234-5678',
  email: 'info@inkmaster.com',
  instagram: '@inkmaster.studio',
  googleMapsLink: 'https://maps.google.com/?q=-34.603722,-58.381592',
  workingHours: 'Lun-Vie: 10:00-20:00 | Sáb: 10:00-18:00',
  description: 'Estudio profesional de tatuajes con más de 10 años de experiencia',
};

// ==================== CATÁLOGO (VACÍO POR DEFECTO) ====================

export const defaultFolders: DesignFolder[] = [];
export const defaultDesigns: DesignImage[] = [];