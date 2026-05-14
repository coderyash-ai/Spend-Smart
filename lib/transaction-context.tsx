/**
 * Transaction Context - Global state management for transactions
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Transaction, FilterOptions, CategorySpending, WeeklyTrend } from "./types";
import { transactionStorage } from "./storage";

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

type TransactionAction =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: { id: string; updates: Partial<Transaction> } }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: TransactionState = {
  transactions: [],
  loading: true,
  error: null,
};

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload, loading: false };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [...state.transactions, action.payload] };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface TransactionContextType {
  state: TransactionState;
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
  getFilteredTransactions: (filters: FilterOptions) => Transaction[];
  getCategorySpending: (month?: string) => CategorySpending[];
  getWeeklyTrend: (month?: string) => WeeklyTrend[];
  getTotalIncome: (month?: string) => number;
  getTotalExpense: (month?: string) => number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const transactions = await transactionStorage.getAll();
      dispatch({ type: "SET_TRANSACTIONS", payload: transactions });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load transactions" });
    }
  };

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const now = new Date().toISOString();
      const newTransaction: Transaction = {
        ...transaction,
        id: `${Date.now()}-${Math.random()}`,
        createdAt: now,
        updatedAt: now,
      };
      await transactionStorage.add(newTransaction);
      dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add transaction" });
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await transactionStorage.update(id, updates);
      dispatch({ type: "UPDATE_TRANSACTION", payload: { id, updates } });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update transaction" });
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionStorage.delete(id);
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete transaction" });
      throw error;
    }
  };

  const getFilteredTransactions = (filters: FilterOptions): Transaction[] => {
    return state.transactions.filter((t) => {
      if (filters.type && t.type !== filters.type) return false;
      if (filters.categories && !filters.categories.includes(t.category)) return false;
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      if (filters.amountMin && t.amount < filters.amountMin) return false;
      if (filters.amountMax && t.amount > filters.amountMax) return false;
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const notesMatch = t.notes?.toLowerCase().includes(searchLower) ?? false;
        const categoryMatch = t.category.toLowerCase().includes(searchLower);
        if (!notesMatch && !categoryMatch) return false;
      }
      return true;
    });
  };

  const getCategorySpending = (month?: string): CategorySpending[] => {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const filtered = state.transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(targetMonth)
    );

    const categoryMap = new Map<string, number>();
    filtered.forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category: category as any,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      transactionCount: filtered.filter((t) => t.category === category).length,
    }));
  };

  const getWeeklyTrend = (month?: string): WeeklyTrend[] => {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const trends: Record<string, WeeklyTrend> = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      trends[dateStr] = {
        date: dateStr,
        dayOfWeek: dayNames[date.getDay()],
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    state.transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= weekAgo && tDate <= today;
      })
      .forEach((t) => {
        const trend = trends[t.date];
        if (trend) {
          if (t.type === "income") {
            trend.income += t.amount;
          } else {
            trend.expense += t.amount;
          }
          trend.net = trend.income - trend.expense;
        }
      });

    return Object.values(trends);
  };

  const getTotalIncome = (month?: string): number => {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    return state.transactions
      .filter((t) => t.type === "income" && t.date.startsWith(targetMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = (month?: string): number => {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    return state.transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(targetMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const value: TransactionContextType = {
    state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    getFilteredTransactions,
    getCategorySpending,
    getWeeklyTrend,
    getTotalIncome,
    getTotalExpense,
  };

  return (
    <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return context;
}
