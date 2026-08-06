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
}

const USERS_STORAGE_KEY = 'unified_user_management_v1';

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr-1',
    fullName: 'Riccardo Monaco (Admin)',
    email: 'riccardo.monaco@gmail.com',
    role: 'admin',
    status: 'active',
    companyOrTitle: 'Amministratore Capo di Sistema',
    canPublish: true,
    canDelete: true,
    canImportMassive: true,
    canManageUsers: true,
    lastLogin: 'Oggi 10:42',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop'
  },
  {
    id: 'usr-2',
    fullName: 'Elena Rinaldi (Capo Redattore)',
    email: 'elena.rinaldi@automotive-intel.com',
    role: 'editor',
    status: 'active',
    companyOrTitle: 'Redazione Contenuti Storici',
    canPublish: true,
    canDelete: false,
    canImportMassive: true,
    canManageUsers: false,
    lastLogin: 'Oggi 09:15',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop'
  },
  {
    id: 'usr-3',
    fullName: 'Marco Benetti (Data Curator)',
    email: 'm.benetti@automotive-intel.com',
    role: 'editor',
    status: 'active',
    companyOrTitle: 'Curatore Banca Dati',
    canPublish: false,
    canDelete: false,
    canImportMassive: true,
    canManageUsers: false,
    lastLogin: 'Ieri 18:20',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop'
  },
  {
    id: 'usr-4',
    fullName: 'Scuderia Modena Classics (Dealer)',
    email: 'info@scuderiamodena.it',
    role: 'dealer',
    status: 'active',
    companyOrTitle: 'Concessionaria Certificata',
    canPublish: false,
    canDelete: false,
    canImportMassive: false,
    canManageUsers: false,
    lastLogin: '2 giorni fa',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop'
  },
  {
    id: 'usr-5',
    fullName: 'Giuseppe Rossi (Utente Registrato)',
    email: 'giuseppe.rossi@outlook.it',
    role: 'registered_user',
    status: 'active',
    companyOrTitle: 'Collezionista Privato',
    canPublish: false,
    canDelete: false,
    canImportMassive: false,
    canManageUsers: false,
    lastLogin: 'Oggi 08:00'
  }
];

function loadUsers(): AppUser[] {
  try {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
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
  private listeners: (() => void)[] = [];

  constructor() {
    this.users = loadUsers();
  }

  private save() {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
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

  public addUser(user: Omit<AppUser, 'id' | 'lastLogin'>): AppUser {
    const newUser: AppUser = {
      ...user,
      id: `usr-${Date.now()}`,
      lastLogin: 'Appena creato'
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
      if (newRole === 'admin') {
        updated.canPublish = true;
        updated.canDelete = true;
        updated.canImportMassive = true;
        updated.canManageUsers = true;
      } else if (newRole === 'editor' || newRole === 'data_manager') {
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
      this.save();
      return true;
    }
    return false;
  }
}

export const userManagementStore = new UserManagementStore();
