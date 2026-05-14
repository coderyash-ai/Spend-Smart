import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { getUserByEmail as getJsonUserByEmail, getUserByOpenId as getJsonUserByOpenId, upsertUser as jsonUpsertUser, initJsonDb } from "./_core/json-db";

// Initialize JSON database on startup
initJsonDb().catch(console.error);

// Use JSON database for testing (fallback to MySQL if available)
export async function getDb() {
  // Always return null for MySQL since we're using JSON DB for testing
  return null;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId && !user.email) {
    throw new Error("User openId or email is required for upsert");
  }

  try {
    await jsonUpsertUser(user);
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  try {
    return await getJsonUserByOpenId(openId);
  } catch (error) {
    console.error("[Database] Failed to get user by openId:", error);
    return undefined;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await getJsonUserByEmail(email);
  } catch (error) {
    console.error("[Database] Failed to get user by email:", error);
    return undefined;
  }
}

// TODO: add feature queries here as your schema grows.
