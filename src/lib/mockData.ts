// ==================== TIPOS ====================

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
  uri: string;
  name?: string;
  notes?: string;
  referencePrice?: number;
  createdAt: Date;
};

export type DesignFolder = {
  id: string;
  name: string;
  description?: string;
  color: string;
  designCount: number;
  createdAt: Date;
};

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
  sendBefore?: number;
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
    date: new Date('2025-10-13T15:00:00'),
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
    date: new Date('2025-10-14T18:00:00'),
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

// ==================== PRECIOS ====================

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
      {
        id: 'bodypart-chest',
        categoryId: 'bodypart',
        name: 'Pecho completo',
        basePrice: 180000,
        description: 'Pecho de hombro a hombro',
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
  {
    id: 'extras',
    name: 'Extras y Servicios',
    description: 'Servicios adicionales',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    items: [
      {
        id: 'extra-design',
        categoryId: 'extras',
        name: 'Diseño personalizado',
        basePrice: 5000,
        description: 'Creación de diseño exclusivo',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'extra-coverup',
        categoryId: 'extras',
        name: 'Cobertura de tatuaje',
        basePrice: 10000,
        description: 'Extra por tapar tatuaje existente',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'extra-touch',
        categoryId: 'extras',
        name: 'Retoque',
        basePrice: 0,
        description: 'Gratis primer año',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'extra-session',
        categoryId: 'extras',
        name: 'Sesión adicional',
        basePrice: 15000,
        description: 'Para proyectos de múltiples sesiones',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
    ],
  },
];

export let mockPriceCategories: PriceCategory[] = JSON.parse(
  JSON.stringify(defaultPriceCategories)
);

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
    sendBefore: -168,
  },
];

// ==================== FUNCIONES HELPER - APPOINTMENTS ====================

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

// ==================== FUNCIONES HELPER - PRECIOS ====================

export const updatePriceItem = (
  categoryId: string,
  itemId: string,
  updates: Partial<PriceItem>
) => {
  mockPriceCategories = mockPriceCategories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        items: cat.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        ),
      };
    }
    return cat;
  });
};

export const addPriceItem = (categoryId: string, newItem: Omit<PriceItem, 'id' | 'createdAt'>) => {
  mockPriceCategories = mockPriceCategories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        items: [
          ...cat.items,
          {
            ...newItem,
            id: `${categoryId}-${Date.now()}`,
            createdAt: new Date(),
          },
        ],
      };
    }
    return cat;
  });
};

export const deletePriceItem = (categoryId: string, itemId: string) => {
  mockPriceCategories = mockPriceCategories.map(cat => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        items: cat.items.filter(item => item.id !== itemId),
      };
    }
    return cat;
  });
};

export const addPriceCategory = (newCategory: Omit<PriceCategory, 'id' | 'createdAt'>) => {
  mockPriceCategories = [
    ...mockPriceCategories,
    {
      ...newCategory,
      id: `cat-${Date.now()}`,
      createdAt: new Date(),
    },
  ];
};

export const updatePriceCategory = (categoryId: string, updates: Partial<PriceCategory>) => {
  mockPriceCategories = mockPriceCategories.map(cat =>
    cat.id === categoryId ? { ...cat, ...updates } : cat
  );
};

export const deletePriceCategory = (categoryId: string) => {
  mockPriceCategories = mockPriceCategories.filter(cat => cat.id !== categoryId);
};

export const calculateFlexibleQuote = (selectedItems: string[]): number => {
  let total = 0;
  
  selectedItems.forEach(itemId => {
    mockPriceCategories.forEach(category => {
      const item = category.items.find(i => i.id === itemId);
      if (item) {
        total += item.basePrice;
      }
    });
  });
  
  return total;
};

// ==================== FUNCIONES HELPER - MENSAJES ====================

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