import { User } from '@/types';
import { INITIAL_USERS } from './mockData';

const STORAGE_KEY = 'iencinas_users';
const SESSION_KEY = 'iencinas_session';

export function getUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  return JSON.parse(stored);
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  saveUsers([...users, newUser]);
  return newUser;
}

export function updateUser(id: string, data: Partial<User>): void {
  const users = getUsers();
  const updated = users.map(u => u.id === id ? { ...u, ...data } : u);
  saveUsers(updated);
}

export function deleteUser(id: string): void {
  const users = getUsers();
  saveUsers(users.filter(u => u.id !== id));
}
