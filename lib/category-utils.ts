/**
 * Category Utilities - Names, icons, and colors for transaction categories
 */

import { TransactionCategory, IncomeCategory, ExpenseCategory } from "./types";

export const INCOME_CATEGORIES: IncomeCategory[] = ["salary", "bonus", "refund", "other"];
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "food",
  "transport",
  "bills",
  "entertainment",
  "shopping",
  "health",
  "other",
];

export const CATEGORY_NAMES: Record<TransactionCategory, string> = {
  salary: "Salary",
  bonus: "Bonus",
  refund: "Refund",
  food: "Food & Dining",
  transport: "Transport",
  bills: "Bills & Utilities",
  entertainment: "Entertainment",
  shopping: "Shopping",
  health: "Health & Medical",
  other: "Other",
};

export const CATEGORY_ICONS: Record<TransactionCategory, string> = {
  salary: "💰",
  bonus: "🎁",
  refund: "↩️",
  food: "🍽️",
  transport: "🚗",
  bills: "📄",
  entertainment: "🎬",
  shopping: "🛍️",
  health: "⚕️",
  other: "📌",
};

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  salary: "#0a7ea4",
  bonus: "#22C55E",
  refund: "#3B82F6",
  food: "#F59E0B",
  transport: "#EF4444",
  bills: "#8B5CF6",
  entertainment: "#EC4899",
  shopping: "#F97316",
  health: "#06B6D4",
  other: "#6B7280",
};

export function getCategoryName(category: TransactionCategory): string {
  return CATEGORY_NAMES[category] || category;
}

export function getCategoryIcon(category: TransactionCategory): string {
  return CATEGORY_ICONS[category] || "📌";
}

export function getCategoryColor(category: TransactionCategory): string {
  return CATEGORY_COLORS[category] || "#6B7280";
}

export function isIncomeCategory(category: TransactionCategory): boolean {
  return INCOME_CATEGORIES.includes(category as IncomeCategory);
}

export function isExpenseCategory(category: TransactionCategory): boolean {
  return EXPENSE_CATEGORIES.includes(category as ExpenseCategory);
}
