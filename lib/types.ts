/**
 * SpendSmart Data Models
 */

export type TransactionType = "income" | "expense";

export type IncomeCategory = "salary" | "bonus" | "refund" | "other";
export type ExpenseCategory = "food" | "transport" | "bills" | "entertainment" | "shopping" | "health" | "other";
export type TransactionCategory = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  notes?: string;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface BudgetSettings {
  monthlyLimit: number;
  categoryLimits?: Partial<Record<ExpenseCategory, number>>;
  month: string; // YYYY-MM format
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  month: string;
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface WeeklyTrend {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Mon, Tue, etc.
  income: number;
  expense: number;
  net: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface FilterOptions {
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  categories?: TransactionCategory[];
  type?: TransactionType;
  amountMin?: number;
  amountMax?: number;
  searchText?: string;
}

export interface ExportOptions {
  format: "csv" | "pdf";
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  includeCharts: boolean;
  includeBudgetSummary: boolean;
  includeCategoryBreakdown: boolean;
}
