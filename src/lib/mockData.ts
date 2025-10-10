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

export type Appointment = {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  price?: number;
  reminderSent?: boolean;
};

export type DesignImage = {
  id: string;
  folderId: string;
  uri: string; // URI local de la imagen
  name?: string;
  notes?: string;
  referencePrice?: number;
  createdAt: Date;
};

export type DesignFolder = {
  id: string;
  name: string;
  description?: string;
  color: string; // Color hex para el icono
  designCount: number;
  createdAt: Date;
};

export type PriceCategory = {
  id: string;
  name: string;
  items: PriceItem[];
};

export type PriceItem = {
  id: string;
  categoryId: string;
  name: string;
  basePrice: number;
  description?: string;
  modifier: number; // 0 para precio fijo, % para modificador (ej: 0.3 = +30%)
};

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

export type MessageTemplate = {
  id: string;
  name: string;
  type: 'reminder' | 'confirmation' | 'followup' | 'custom';
  message: string;
  channels: ('whatsapp' | 'email' | 'instagram')[];
  enabled: boolean;
  sendBefore?: number; // Horas antes (para recordatorios)
};

// ==================== DATOS MOCK ====================

export const mockClients: Client[] = [
  {
    id: '1',
    fullName: 'Juan Pérez',
    phone: '+54 9 11 2345-6789',
    email: 'juan@email.com',
    instagram: '@juanperez',
    notes: 'Cliente frecuente',
    totalSessions: 5,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    fullName: 'María González',
    phone: '+54 9 11 3456-7890',
    email: 'maria@email.com',
    totalSessions: 1,
    createdAt: new Date('2024-10-01'),
  },
  {
    id: '3',
    fullName: 'Carlos Rodríguez',
    phone: '+54 9 11 4567-8901',
    totalSessions: 3,
    createdAt: new Date('2024-06-20'),
  },
  {
    id: '4',
    fullName: 'Ana Martínez',
    phone: '+54 9 11 5678-9012',
    email: 'ana@email.com',
    totalSessions: 2,
    createdAt: new Date('2024-08-10'),
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Juan Pérez',
    date: new Date('2025-10-10T15:00:00'),
    durationMinutes: 120,
    status: 'confirmed',
    notes: 'Tatuaje en brazo',
    price: 25000,
    reminderSent: false,
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'María González',
    date: new Date('2025-10-11T18:00:00'),
    durationMinutes: 60,
    status: 'pending',
    notes: 'Primera sesión',
    price: 15000,
    reminderSent: false,
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Carlos Rodríguez',
    date: new Date('2025-10-15T14:00:00'),
    durationMinutes: 180,
    status: 'pending',
    price: 35000,
    reminderSent: false,
  },
];

export const mockFolders: DesignFolder[] = [];

export const mockDesigns: DesignImage[] = [];

export const mockPriceCategories: PriceCategory[] = [
  {
    id: 'size',
    name: 'Por Tamaño',
    items: [
      {
        id: 'size-mini',
        categoryId: 'size',
        name: 'Mini (hasta 5cm)',
        basePrice: 15000,
        description: 'Tatuajes pequeños y simples',
        modifier: 0,
      },
      {
        id: 'size-small',
        categoryId: 'size',
        name: 'Pequeño (5-10cm)',
        basePrice: 25000,
        description: 'Tamaño ideal para muñecas, tobillos',
        modifier: 0,
      },
      {
        id: 'size-medium',
        categoryId: 'size',
        name: 'Mediano (10-20cm)',
        basePrice: 45000,
        description: 'Antebrazo, pantorrilla',
        modifier: 0,
      },
      {
        id: 'size-large',
        categoryId: 'size',
        name: 'Grande (20cm+)',
        basePrice: 80000,
        description: 'Espalda, muslo, pecho',
        modifier: 0,
      },
    ],
  },
  {
    id: 'style',
    name: 'Por Estilo',
    items: [
      {
        id: 'style-minimal',
        categoryId: 'style',
        name: 'Minimalista',
        basePrice: 0,
        description: 'Líneas simples, diseño limpio',
        modifier: 0,
      },
      {
        id: 'style-color',
        categoryId: 'style',
        name: 'Color',
        basePrice: 0,
        description: 'Con relleno de color',
        modifier: 0.2,
      },
      {
        id: 'style-realistic',
        categoryId: 'style',
        name: 'Realista',
        basePrice: 0,
        description: 'Alto nivel de detalle',
        modifier: 0.3,
      },
      {
        id: 'style-coverup',
        categoryId: 'style',
        name: 'Cobertura',
        basePrice: 0,
        description: 'Tapar tatuaje existente',
        modifier: 0.5,
      },
    ],
  },
  {
    id: 'zone',
    name: 'Por Zona',
    items: [
      {
        id: 'zone-standard',
        categoryId: 'zone',
        name: 'Zona Estándar',
        basePrice: 0,
        description: 'Brazo, pierna, hombro',
        modifier: 0,
      },
      {
        id: 'zone-sensitive',
        categoryId: 'zone',
        name: 'Zona Sensible',
        basePrice: 10000,
        description: 'Costillas, pies, manos',
        modifier: 0,
      },
      {
        id: 'zone-back',
        categoryId: 'zone',
        name: 'Espalda Completa',
        basePrice: 20000,
        description: 'Proyecto de espalda entera',
        modifier: 0,
      },
    ],
  },
  {
    id: 'extras',
    name: 'Extras',
    items: [
      {
        id: 'extra-session',
        categoryId: 'extras',
        name: 'Sesión Adicional',
        basePrice: 15000,
        description: 'Para proyectos que requieren múltiples sesiones',
        modifier: 0,
      },
      {
        id: 'extra-design',
        categoryId: 'extras',
        name: 'Diseño Personalizado',
        basePrice: 5000,
        description: 'Creación de diseño exclusivo',
        modifier: 0,
      },
      {
        id: 'extra-touch',
        categoryId: 'extras',
        name: 'Retoque',
        basePrice: 0,
        description: 'Gratis primer año',
        modifier: 0,
      },
    ],
  },
];

export const mockStudioData: StudioData = {
  name: 'Studio Ink Master',
  address: 'Av. Corrientes 1234, CABA',
  phone: '+54 9 11 1234-5678',
  email: 'info@inkmaster.com',
  instagram: '@inkmaster.studio',
  googleMapsLink: 'https://maps.google.com/?q=-34.603722,-58.381592',
  workingHours: 'Lun-Vie: 10:00-20:00 | Sáb: 10:00-18:00',
  description: 'Estudio profesional de tatuajes con más de 10 años de experiencia',
};

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Recordatorio de Cita',
    type: 'reminder',
    message: 'Hola {nombre}! 👋 Te recordamos tu cita mañana {fecha} a las {hora} en {estudio}. ¡Te esperamos! 🎨',
    channels: ['whatsapp', 'email', 'instagram'],
    enabled: true,
    sendBefore: 24,
  },
  {
    id: '2',
    name: 'Confirmación de Cita',
    type: 'confirmation',
    message: '✅ Cita confirmada para {fecha} a las {hora}.\nPrecio estimado: ${precio}\nSi necesitás hacer cambios, avisanos con 24hs de anticipación.\n\n📍 {estudio}\n{direccion}',
    channels: ['whatsapp', 'email'],
    enabled: true,
  },
  {
    id: '3',
    name: 'Seguimiento Post-Sesión',
    type: 'followup',
    message: 'Hola {nombre}! 🌟 ¿Cómo va la cicatrización de tu tatuaje? Recordá seguir los cuidados que te indicamos. Cualquier duda, escribinos! 💪',
    channels: ['whatsapp', 'instagram'],
    enabled: true,
    sendBefore: -168, // 7 días después (negativo)
  },
];

// ==================== FUNCIONES HELPER ====================

export function getTodayAppointments(): Appointment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return mockAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= today && aptDate < tomorrow;
  });
}

export function getUpcomingAppointments(limit: number = 3): Appointment[] {
  const now = new Date();
  return mockAppointments
    .filter(apt => new Date(apt.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
}

export function getPendingAppointments(): Appointment[] {
  return mockAppointments.filter(apt => 
    apt.status === 'pending' || apt.status === 'confirmed'
  );
}

export function calculateQuote(
  sizeId: string,
  styleId: string,
  zoneId: string,
  extraIds: string[] = []
): number {
  let total = 0;

  // Precio base por tamaño
  const sizeItem = mockPriceCategories
    .find(cat => cat.id === 'size')
    ?.items.find(item => item.id === sizeId);
  
  if (sizeItem) {
    total = sizeItem.basePrice;
  }

  // Modificador por estilo
  const styleItem = mockPriceCategories
    .find(cat => cat.id === 'style')
    ?.items.find(item => item.id === styleId);
  
  if (styleItem && styleItem.modifier > 0) {
    total += total * styleItem.modifier;
  }

  // Precio adicional por zona
  const zoneItem = mockPriceCategories
    .find(cat => cat.id === 'zone')
    ?.items.find(item => item.id === zoneId);
  
  if (zoneItem) {
    total += zoneItem.basePrice;
    if (zoneItem.modifier > 0) {
      total += total * zoneItem.modifier;
    }
  }

  // Extras
  extraIds.forEach(extraId => {
    const extraItem = mockPriceCategories
      .find(cat => cat.id === 'extras')
      ?.items.find(item => item.id === extraId);
    
    if (extraItem) {
      total += extraItem.basePrice;
    }
  });

  return Math.round(total);
}

export function formatMessageTemplate(
  template: string,
  data: {
    nombre?: string;
    fecha?: string;
    hora?: string;
    precio?: number;
    estudio?: string;
    direccion?: string;
  }
): string {
  let message = template;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    message = message.replace(new RegExp(placeholder, 'g'), String(value || ''));
  });
  
  return message;
}