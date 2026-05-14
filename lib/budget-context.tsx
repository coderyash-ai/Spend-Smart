/**
 * Budget Context - Global state management for budget settings
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BudgetSettings, ExpenseCategory } from "./types";
import { budgetStorage } from "./storage";

interface BudgetContextType {
  budget: BudgetSettings | null;
  loading: boolean;
  error: string | null;
  setBudgetLimit: (limit: number) => Promise<void>;
  setCategoryLimit: (category: ExpenseCategory, limit: number) => Promise<void>;
  removeCategoryLimit: (category: ExpenseCategory) => Promise<void>;
  loadBudget: (month?: string) => Promise<void>;
  getCurrentMonth: () => string;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budget, setBudget] = useState<BudgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthString());

  // Load budget on mount and when month changes
  useEffect(() => {
    loadBudget(currentMonth);
  }, [currentMonth]);

  const loadBudget = async (month?: string) => {
    try {
      setLoading(true);
      const targetMonth = month || getCurrentMonthString();
      const existing = await budgetStorage.get(targetMonth);

      if (existing) {
        setBudget(existing);
      } else {
        // Create default budget
        const defaultBudget: BudgetSettings = {
          monthlyLimit: 0,
          categoryLimits: {},
          month: targetMonth,
        };
        setBudget(defaultBudget);
      }
      setError(null);
    } catch (err) {
      setError("Failed to load budget");
      console.error("Error loading budget:", err);
    } finally {
      setLoading(false);
    }
  };

  const setBudgetLimit = async (limit: number) => {
    try {
      if (!budget) return;
      const updated: BudgetSettings = {
        ...budget,
        monthlyLimit: limit,
      };
      await budgetStorage.set(updated);
      setBudget(updated);
      setError(null);
    } catch (err) {
      setError("Failed to update budget limit");
      throw err;
    }
  };

  const setCategoryLimit = async (category: ExpenseCategory, limit: number) => {
    try {
      if (!budget) return;
      const updated: BudgetSettings = {
        ...budget,
        categoryLimits: {
          ...(budget.categoryLimits || {}),
          [category]: limit,
        },
      };
      await budgetStorage.set(updated);
      setBudget(updated);
      setError(null);
    } catch (err) {
      setError("Failed to update category limit");
      throw err;
    }
  };

  const removeCategoryLimit = async (category: ExpenseCategory) => {
    try {
      if (!budget) return;
      const updated: BudgetSettings = {
        ...budget,
        categoryLimits: {
          ...(budget.categoryLimits || {}),
        },
      };
      delete updated.categoryLimits?.[category];
      await budgetStorage.set(updated);
      setBudget(updated);
      setError(null);
    } catch (err) {
      setError("Failed to remove category limit");
      throw err;
    }
  };

  const value: BudgetContextType = {
    budget,
    loading,
    error,
    setBudgetLimit,
    setCategoryLimit,
    removeCategoryLimit,
    loadBudget,
    getCurrentMonth: () => currentMonth,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within BudgetProvider");
  }
  return context;
}
