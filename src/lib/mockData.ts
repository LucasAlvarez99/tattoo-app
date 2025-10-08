export type Client = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
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
};

export type DesignFolder = {
  id: string;
  name: string;
  description?: string;
  designCount: number;
};

export const mockClients: Client[] = [
  {
    id: '1',
    fullName: 'Juan Pérez',
    phone: '+54 9 11 2345-6789',
    email: 'juan@email.com',
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
    date: new Date('2025-10-08T15:00:00'),
    durationMinutes: 120,
    status: 'confirmed',
    notes: 'Tatuaje en brazo',
    price: 25000,
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'María González',
    date: new Date('2025-10-08T18:00:00'),
    durationMinutes: 60,
    status: 'pending',
    notes: 'Primera sesión',
    price: 15000,
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Carlos Rodríguez',
    date: new Date('2025-10-10T14:00:00'),
    durationMinutes: 180,
    status: 'pending',
    price: 35000,
  },
];

export const mockFolders: DesignFolder[] = [
  { id: '1', name: 'Vikingos', description: 'Diseños nórdicos', designCount: 12 },
  { id: '2', name: 'Amor', description: 'Diseños románticos', designCount: 8 },
  { id: '3', name: 'Tribal', description: 'Diseños tribales', designCount: 15 },
  { id: '4', name: 'Minimalista', description: 'Diseños simples', designCount: 20 },
];