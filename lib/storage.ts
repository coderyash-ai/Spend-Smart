/**
 * AsyncStorage Service for SpendSmart
 * Handles persistence of transactions and budget settings
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction, BudgetSettings } from "./types";

const TRANSACTIONS_KEY = "@spendsmart_transactions";
const BUDGET_KEY = "@spendsmart_budget";

/**
 * Transaction Storage
 */
export const transactionStorage = {
  async getAll(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading transactions:", error);
      return [];
    }
  },

  async add(transaction: Transaction): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = [...existing, transaction];
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Transaction>): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = existing.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      );
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const existing = await this.getAll();
      const updated = existing.filter((t) => t.id !== id);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TRANSACTIONS_KEY);
    } catch (error) {
      console.error("Error clearing transactions:", error);
      throw error;
    }
  },
};

/**
 * Budget Storage
 */
export const budgetStorage = {
  async get(month: string): Promise<BudgetSettings | null> {
    try {
      const data = await AsyncStorage.getItem(`${BUDGET_KEY}_${month}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error reading budget:", error);
      return null;
    }
  },

  async set(budget: BudgetSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(`${BUDGET_KEY}_${budget.month}`, JSON.stringify(budget));
    } catch (error) {
      console.error("Error saving budget:", error);
      throw error;
    }
  },

  async delete(month: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${BUDGET_KEY}_${month}`);
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw error;
    }
  },
};
