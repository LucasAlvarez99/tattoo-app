// src/lib/localAuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@tattoo_app:user';
const ACCOUNTS_KEY = '@tattoo_app:accounts';

export type User = {
  id: string;
  email: string;
  fullName: string;
  studioName: string;
  phone: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  trialEndsAt: Date;
  createdAt: Date;
};

export type Account = {
  email: string;
  password: string;
  user: User;
};

// ==================== INICIALIZACIÓN ====================

const initializeDefaultAccount = async () => {
  try {
    const accounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (!accounts) {
      // Crear cuenta por defecto
      const defaultAccount: Account = {
        email: 'admin',
        password: 'admin',
        user: {
          id: 'user_default',
          email: 'admin@tattoo.com',
          fullName: 'Admin Tatuador',
          studioName: 'Studio Ink Master',
          phone: '+54 9 11 1234-5678',
          subscriptionStatus: 'trial',
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
          createdAt: new Date(),
        },
      };
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify([defaultAccount]));
    }
  } catch (error) {
    console.error('Error inicializando cuenta:', error);
  }
};

// ==================== AUTENTICACIÓN ====================

class LocalAuth {
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  async initialize() {
    await initializeDefaultAccount();
    // Intentar cargar usuario guardado
    const savedUser = await AsyncStorage.getItem(USER_KEY);
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser, (key, value) => {
        if (key === 'trialEndsAt' || key === 'createdAt') {
          return new Date(value);
        }
        return value;
      });
      this.notifyListeners();
    }
  }

  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const accountsData = await AsyncStorage.getItem(ACCOUNTS_KEY);
      if (!accountsData) {
        return { user: null, error: 'No hay cuentas registradas' };
      }

      const accounts: Account[] = JSON.parse(accountsData, (key, value) => {
        if (key === 'trialEndsAt' || key === 'createdAt') {
          return new Date(value);
        }
        return value;
      });

      const account = accounts.find(
        acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (!account) {
        return { user: null, error: 'Credenciales incorrectas' };
      }

      this.currentUser = account.user;
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(account.user));
      this.notifyListeners();

      return { user: account.user, error: null };
    } catch (error) {
      console.error('Error en login:', error);
      return { user: null, error: 'Error al iniciar sesión' };
    }
  }

  async register(
    email: string,
    password: string,
    fullName: string,
    studioName: string,
    phone: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const accountsData = await AsyncStorage.getItem(ACCOUNTS_KEY);
      const accounts: Account[] = accountsData ? JSON.parse(accountsData) : [];

      // Verificar si el email ya existe
      const existingAccount = accounts.find(
        acc => acc.email.toLowerCase() === email.toLowerCase()
      );

      if (existingAccount) {
        return { user: null, error: 'Este email ya está registrado' };
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase(),
        fullName,
        studioName,
        phone,
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días trial
        createdAt: new Date(),
      };

      const newAccount: Account = {
        email: email.toLowerCase(),
        password,
        user: newUser,
      };

      accounts.push(newAccount);
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

      // Auto-login
      this.currentUser = newUser;
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
      this.notifyListeners();

      return { user: newUser, error: null };
    } catch (error) {
      console.error('Error en registro:', error);
      return { user: null, error: 'Error al crear la cuenta' };
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    await AsyncStorage.removeItem(USER_KEY);
    this.notifyListeners();
  }

  getUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  async updateUser(updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    if (!this.currentUser) return;

    this.currentUser = {
      ...this.currentUser,
      ...updates,
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(this.currentUser));

    // También actualizar en la lista de cuentas
    const accountsData = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (accountsData) {
      const accounts: Account[] = JSON.parse(accountsData);
      const accountIndex = accounts.findIndex(acc => acc.user.id === this.currentUser!.id);
      if (accountIndex !== -1) {
        accounts[accountIndex].user = this.currentUser;
        await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      }
    }

    this.notifyListeners();
  }

  // ==================== CAMBIO DE CONTRASEÑA ====================

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'No hay usuario autenticado' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      const accountsData = await AsyncStorage.getItem(ACCOUNTS_KEY);
      if (!accountsData) {
        return { success: false, error: 'No se encontraron las cuentas' };
      }

      const accounts: Account[] = JSON.parse(accountsData);
      const accountIndex = accounts.findIndex(
        acc => acc.user.id === this.currentUser!.id
      );

      if (accountIndex === -1) {
        return { success: false, error: 'Cuenta no encontrada' };
      }

      // Verificar contraseña actual
      if (accounts[accountIndex].password !== currentPassword) {
        return { success: false, error: 'La contraseña actual es incorrecta' };
      }

      // Actualizar contraseña
      accounts[accountIndex].password = newPassword;
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));

      return { success: true, error: null };
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      return { success: false, error: 'Error al cambiar la contraseña' };
    }
  }

  // ==================== RECUPERACIÓN DE CONTRASEÑA ====================

  async requestPasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const accountsData = await AsyncStorage.getItem(ACCOUNTS_KEY);
      if (!accountsData) {
        return { success: false, error: 'No se encontró la cuenta' };
      }

      const accounts: Account[] = JSON.parse(accountsData);
      const account = accounts.find(
        acc => acc.email.toLowerCase() === email.toLowerCase()
      );

      if (!account) {
        return { success: false, error: 'No existe una cuenta con ese email' };
      }

      // En una app real, aquí enviarías un email
      // Por ahora, solo retornamos éxito
      return { 
        success: true, 
        error: null 
      };
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      return { success: false, error: 'Error al procesar la solicitud' };
    }
  }

  // ==================== VALIDACIONES ====================

  async emailExists(email: string): Promise<boolean> {
    try {
      const accountsData = await AsyncStorage.getItem(ACCOUNTS_KEY);
      if (!accountsData) return false;

      const accounts: Account[] = JSON.parse(accountsData);
      return accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      console.error('Error verificando email:', error);
      return false;
    }
  }

  // ==================== LISTENERS ====================

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const localAuth = new LocalAuth();