import { User, HistoryEntry, TutorResponse } from '../types';

/**
 * MOCK BACKEND SERVICE
 * 
 * Since we don't have a real Express/SQLite server in this frontend-only environment,
 * this service simulates database tables using LocalStorage.
 * 
 * Tables simulated:
 * - users (id, name, email, password)
 * - history (id, userId, data, timestamp)
 */

const DELAY_MS = 600; // Simulate network latency

// --- Helpers ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// --- Auth "Routes" ---

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  await sleep(DELAY_MS);
  
  const usersStr = localStorage.getItem('db_users');
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  if (users.find((u: any) => u.email === email)) {
    throw new Error("That email is already signed up!");
  }

  const newUser = { id: generateId(), name, email, password };
  users.push(newUser);
  localStorage.setItem('db_users', JSON.stringify(users));
  
  // Return user without password
  const { password: _, ...userSafe } = newUser;
  return userSafe;
};

export const login = async (email: string, password: string): Promise<User> => {
  await sleep(DELAY_MS);
  
  const usersStr = localStorage.getItem('db_users');
  const users = usersStr ? JSON.parse(usersStr) : [];
  
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const { password: _, ...userSafe } = user;
  return userSafe;
};

// --- History/Cache "Routes" ---

export const saveHistory = async (userId: string, data: TutorResponse): Promise<HistoryEntry> => {
  // Don't simulate delay for saving to make UI snappy
  const historyStr = localStorage.getItem('db_history');
  const history = historyStr ? JSON.parse(historyStr) : [];

  const entry: HistoryEntry = {
    id: generateId(),
    userId,
    timestamp: Date.now(),
    data
  };

  history.unshift(entry); // Add to top
  localStorage.setItem('db_history', JSON.stringify(history));
  
  return entry;
};

export const getHistory = async (userId: string): Promise<HistoryEntry[]> => {
  await sleep(DELAY_MS / 2); // Fast fetch
  
  const historyStr = localStorage.getItem('db_history');
  const history: HistoryEntry[] = historyStr ? JSON.parse(historyStr) : [];
  
  return history.filter(h => h.userId === userId);
};

export const clearHistory = async (userId: string): Promise<void> => {
    const historyStr = localStorage.getItem('db_history');
    let history: HistoryEntry[] = historyStr ? JSON.parse(historyStr) : [];
    
    // Remove items for this user
    history = history.filter(h => h.userId !== userId);
    
    localStorage.setItem('db_history', JSON.stringify(history));
}
