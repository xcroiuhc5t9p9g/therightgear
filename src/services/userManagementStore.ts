import { UserRole } from '../types';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'suspended';
  companyOrTitle?: string;
  canPublish: boolean;
  canDelete: boolean;
  canImportMassive: boolean;
  canManageUsers: boolean;
  lastLogin: string;
  avatarUrl?: string;
  password?: string;
  vatNumber?: string;
  businessType?: string;
  preferredBrands?: string[];
  collectorGoal?: string;
  createdAt?: string;
}

const USERS_STORAGE_KEY = 'unified_user_management_v1';
const CURRENT_USER_ID_KEY = 'unified_current_user_id_v1';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-1',
    fullName: 'Riccardo Monaco',
    email: 'riccardo.monaco@gmail.com',
    password: 'Riccardo#2026Admin!',
    role: 'super_admin',
    status: 'active',
    companyOrTitle: 'Chief System Administrator',
    canPublish: true,
    canDelete: true,
    canImportMassive: true,
    canManageUsers: true,
    lastLogin: 'Today 10:42',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    createdAt: '2026-08-01'
  },
  {
    id: 'usr-2',
    fullName: 'Elena Rinaldi (Editor-in-Chief)',
    email: 'elena.rinaldi@automotive-intel.com',
    role: 'editor',
    status: 'active',
    companyOrTitle: 'Historical Content Editorial',
    canPublish: true,
    canDelete: false,
    canImportMassive: true,
    canManageUsers: false,
    lastLogin: 'Today 09:15',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    createdAt: '2026-08-02'
  },
  {
    id: 'usr-3',
    fullName: 'Marco Benetti (Data Curator)',
    email: 'm.benetti@automotive-intel.com',
    role: 'editor',
    status: 'active',
    companyOrTitle: 'Database Curator',
    canPublish: false,
    canDelete: false,
    canImportMassive: true,
    canManageUsers: false,
    lastLogin: 'Yesterday 18:20',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    createdAt: '2026-08-03'
  },
  {
    id: 'usr-4',
    fullName: 'Scuderia Modena Classics (Dealer)',
    email: 'info@scuderiamodena.it',
    role: 'corporate_user',
    status: 'active',
    companyOrTitle: 'Certified Dealership',
    canPublish: false,
    canDelete: false,
    canImportMassive: false,
    canManageUsers: false,
    lastLogin: '2 days ago',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    createdAt: '2026-08-04'
  },
  {
    id: 'usr-5',
    fullName: 'Giuseppe Rossi (Registered User)',
    email: 'giuseppe.rossi@outlook.it',
    role: 'private_user',
    status: 'active',
    companyOrTitle: 'Private Collector',
    canPublish: false,
    canDelete: false,
    canImportMassive: false,
    canManageUsers: false,
    lastLogin: 'Today 08:00',
    createdAt: '2026-08-05'
  }
];

function loadUsers(): AppUser[] {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure riccardo.monaco@gmail.com is present & is admin with default password
        const riccardoIndex = parsed.findIndex(u => u.email?.toLowerCase() === 'riccardo.monaco@gmail.com');
        if (riccardoIndex === -1) {
          parsed.unshift(INITIAL_USERS[0]);
        } else {
          parsed[riccardoIndex].password = 'Riccardo#2026Admin!';
          parsed[riccardoIndex].role = 'super_admin';
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading users from storage:', e);
  }
  return INITIAL_USERS;
}

class UserManagementStore {
  private users: AppUser[];
  private currentUserId: string;
  private listeners: (() => void)[] = [];

  constructor() {
    this.users = loadUsers();
    
    // Load current active user ID from localStorage or default to 'usr-1' (Riccardo Monaco - Admin)
    const savedCurrentId = typeof window !== 'undefined' ? localStorage.getItem(CURRENT_USER_ID_KEY) : null;
    if (savedCurrentId && this.users.some(u => u.id === savedCurrentId)) {
      this.currentUserId = savedCurrentId;
    } else {
      this.currentUserId = 'usr-1'; // Default: Riccardo Monaco (Admin)
    }
  }

  private save() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
      localStorage.setItem(CURRENT_USER_ID_KEY, this.currentUserId);
    } catch (e) {
      console.error('Error saving users to storage:', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getAll(): AppUser[] {
    return [...this.users];
  }

  public getById(id: string): AppUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public getByEmail(email: string): AppUser | undefined {
    const clean = email.trim().toLowerCase();
    return this.users.find(u => u.email.trim().toLowerCase() === clean);
  }

  public getCurrentUser(): AppUser {
    const found = this.users.find(u => u.id === this.currentUserId);
    if (found) return found;
    // Fallback to Riccardo Monaco (Admin)
    const admin = this.users.find(u => u.email.toLowerCase() === 'riccardo.monaco@gmail.com');
    if (admin) return admin;
    return this.users[0];
  }

  public setCurrentUser(userOrId: AppUser | string): AppUser {
    const id = typeof userOrId === 'string' ? userOrId : userOrId.id;
    const user = this.getById(id);
    if (user) {
      this.currentUserId = id;
      user.lastLogin = 'Oggi (Sessione Attiva)';
      this.save();
      return user;
    }
    return this.getCurrentUser();
  }

  public registerUser(data: {
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
    companyOrTitle?: string;
    vatNumber?: string;
    businessType?: string;
    preferredBrands?: string[];
    collectorGoal?: string;
  }): AppUser {
    const existing = this.getByEmail(data.email);
    if (existing) {
      // Update existing user or set as current
      this.setCurrentUser(existing.id);
      return existing;
    }

    const isRiccardoAdmin = data.email.trim().toLowerCase() === 'riccardo.monaco@gmail.com';
    const role: UserRole = isRiccardoAdmin ? 'super_admin' : data.role;

    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      password: data.password || 'password123',
      role: role,
      status: 'active',
      companyOrTitle: data.companyOrTitle || (role === 'super_admin' ? 'Amministratore Capo' : role === 'corporate_user' ? 'Concessionaria' : 'Utente Registrato'),
      vatNumber: data.vatNumber,
      businessType: data.businessType,
      preferredBrands: data.preferredBrands,
      collectorGoal: data.collectorGoal,
      canPublish: role === 'super_admin' || role === 'editor',
      canDelete: role === 'super_admin',
      canImportMassive: role === 'super_admin' || role === 'editor',
      canManageUsers: role === 'super_admin',
      lastLogin: 'Appena registrato',
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.users.unshift(newUser);
    this.currentUserId = newUser.id;
    this.save();
    return newUser;
  }

  public loginUser(email: string, password?: string): AppUser | null {
    const user = this.getByEmail(email);
    if (user) {
      this.currentUserId = user.id;
      user.lastLogin = 'Appena effettuato';
      this.save();
      return user;
    }
    return null;
  }

  public addUser(user: Omit<AppUser, 'id' | 'lastLogin'>): AppUser {
    const newUser: AppUser = {
      ...user,
      id: `usr-${Date.now()}`,
      lastLogin: 'Appena creato',
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.users.unshift(newUser);
    this.save();
    return newUser;
  }

  public updateUserRole(id: string, newRole: UserRole): AppUser | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      const updated = { ...this.users[idx], role: newRole };
      // Update permissions based on role defaults
      if (newRole === 'super_admin') {
        updated.canPublish = true;
        updated.canDelete = true;
        updated.canImportMassive = true;
        updated.canManageUsers = true;
      } else if (newRole as string === 'editor') {
        updated.canPublish = true;
        updated.canDelete = false;
        updated.canImportMassive = true;
        updated.canManageUsers = false;
      } else {
        updated.canPublish = false;
        updated.canDelete = false;
        updated.canImportMassive = false;
        updated.canManageUsers = false;
      }
      this.users[idx] = updated;
      this.save();
      return updated;
    }
    return undefined;
  }

  public updateUserProfile(id: string, updates: Partial<AppUser>): AppUser | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.save();
      return this.users[idx];
    }
    return undefined;
  }

  public toggleUserPermission(id: string, perm: 'canPublish' | 'canDelete' | 'canImportMassive' | 'canManageUsers'): AppUser | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = {
        ...this.users[idx],
        [perm]: !this.users[idx][perm]
      };
      this.save();
      return this.users[idx];
    }
    return undefined;
  }

  public toggleUserStatus(id: string): AppUser | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      const current = this.users[idx].status;
      const nextStatus = current === 'active' ? 'suspended' : 'active';
      this.users[idx] = { ...this.users[idx], status: nextStatus };
      this.save();
      return this.users[idx];
    }
    return undefined;
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    if (this.users.length !== initialLen) {
      if (this.currentUserId === id && this.users.length > 0) {
        this.currentUserId = this.users[0].id;
      }
      this.save();
      return true;
    }
    return false;
  }
}

export const userManagementStore = new UserManagementStore();

