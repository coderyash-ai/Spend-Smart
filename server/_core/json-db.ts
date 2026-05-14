import { promises as fs } from 'fs';
import path from 'path';
import type { User, InsertUser } from '../../drizzle/schema';

interface DatabaseSchema {
  users: User[];
}

const DB_PATH = path.join(process.cwd(), 'server/data/database.json');

let database: DatabaseSchema = {
  users: []
};

async function loadDatabase() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    database = JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is corrupted, start with empty database
    await saveDatabase();
  }
}

async function saveDatabase() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(database, null, 2));
    console.log('[JSON DB] Database saved to:', DB_PATH);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

export async function initJsonDb() {
  await loadDatabase();
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await loadDatabase();
  return database.users.find(user => user.email === email);
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  await loadDatabase();
  return database.users.find(user => user.openId === openId);
}

export async function upsertUser(userData: InsertUser): Promise<void> {
  await loadDatabase();
  
  const existingIndex = userData.email 
    ? database.users.findIndex(user => user.email === userData.email)
    : userData.openId 
    ? database.users.findIndex(user => user.openId === userData.openId)
    : -1;

  if (existingIndex >= 0) {
    // Update existing user - only update provided fields
    const existingUser = database.users[existingIndex];
    
    // Only update fields that are provided in userData
    if (userData.name !== undefined) existingUser.name = userData.name;
    if (userData.email !== undefined) existingUser.email = userData.email;
    if (userData.password !== undefined) existingUser.password = userData.password;
    if (userData.openId !== undefined) existingUser.openId = userData.openId;
    if (userData.loginMethod !== undefined) existingUser.loginMethod = userData.loginMethod;
    if (userData.role !== undefined) existingUser.role = userData.role;
    if (userData.lastSignedIn !== undefined) existingUser.lastSignedIn = userData.lastSignedIn;
    
    existingUser.updatedAt = new Date();
  } else {
    // Create new user
    const newUser: User = {
      id: Date.now(),
      openId: userData.openId || null,
      name: userData.name || null,
      email: userData.email || null,
      password: userData.password || null,
      loginMethod: userData.loginMethod || null,
      role: userData.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: userData.lastSignedIn || new Date(),
    };
    database.users.push(newUser);
  }

  await saveDatabase();
}
