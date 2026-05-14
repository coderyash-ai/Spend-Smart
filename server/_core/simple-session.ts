import { getUserByEmail } from './json-db';
import type { User } from '../../drizzle/schema';

const sessions = new Map<string, { userId: number; timestamp: number }>();

export function createSessionToken(user: User): string {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessions.set(token, { userId: user.id, timestamp: Date.now() });
  return token;
}

export function getUserFromToken(token: string): User | null {
  const session = sessions.get(token);
  if (!session) return null;
  
  // Check if session is older than 24 hours
  if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
    sessions.delete(token);
    return null;
  }
  
  // For now, we'll need to implement a way to get user by ID
  // This is a simplified version - in production you'd want proper session storage
  return null; // Placeholder
}

export function clearSession(token: string): void {
  sessions.delete(token);
}
