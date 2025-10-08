type User = {
  id: string;
  email: string;
  fullName: string;
  studioName: string;
  phone: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndsAt: Date;
};

const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'admin@tattoo.com',
  fullName: 'Admin Tatuador',
  studioName: 'Studio Ink Master',
  phone: '+54 9 11 1234-5678',
  subscriptionStatus: 'trial',
  trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};

class MockAuth {
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === 'admin' && password === 'admin') {
      this.currentUser = MOCK_USER;
      this.notifyListeners();
      return { user: MOCK_USER, error: null };
    }

    return { user: null, error: 'Credenciales incorrectas. Usa admin/admin' };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  initialize() {
    this.currentUser = null;
  }
}

export const mockAuth = new MockAuth();
export type { User };