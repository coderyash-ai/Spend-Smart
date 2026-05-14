import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_DB_KEY = 'spendsmart_users';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Initialize the database with default users if empty
export async function initializeDatabase(): Promise<void> {
  try {
    const existingUsers = await getUsers();
    if (existingUsers.length === 0) {
      const defaultUsers: User[] = [
        {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          name: "Test User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          username: "demo",
          email: "demo@example.com",
          password: "demo123",
          name: "Demo User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      await saveUsers(defaultUsers);
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_DB_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Failed to get users:', error);
    return [];
  }
}

// Save users to database
export async function saveUsers(users: User[]): Promise<void> {
  try {
    await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Failed to find user by email:', error);
    return null;
  }
}

// Find user by username
export async function findUserByUsername(username: string): Promise<User | null> {
  try {
    const users = await getUsers();
    return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
  } catch (error) {
    console.error('Failed to find user by username:', error);
    return null;
  }
}

// Authenticate user by email and password
export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await findUserByEmail(email);
    if (user && user.password === password) {
      const { password: _, ...authUser } = user;
      return authUser;
    }
    return null;
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    return null;
  }
}

// Register new user
export async function registerUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuthUser | null> {
  try {
    const users = await getUsers();
    
    // Check if email already exists
    const existingUserByEmail = await findUserByEmail(userData.email);
    if (existingUserByEmail) {
      return null;
    }
    
    // Check if username already exists
    const existingUserByUsername = await findUserByUsername(userData.username);
    if (existingUserByUsername) {
      return null;
    }
    
    // Create new user
    const newUser: User = {
      ...userData,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await saveUsers(users);
    
    const { password: _, ...authUser } = newUser;
    return authUser;
  } catch (error) {
    console.error('Failed to register user:', error);
    return null;
  }
}
