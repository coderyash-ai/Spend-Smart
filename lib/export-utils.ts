/**
 * Export Utilities - CSV and PDF export functionality
 */

import { Transaction, ExportOptions } from "./types";
import { CATEGORY_NAMES } from "./category-utils";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

/**
 * Generate CSV content from transactions
 */
export function generateCSV(transactions: Transaction[]): string {
  const headers = ["Date", "Type", "Category", "Amount", "Notes"];
  const rows = transactions.map((t) => [
    t.date,
    t.type.toUpperCase(),
    CATEGORY_NAMES[t.category],
    t.amount.toFixed(2),
    t.notes || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");

  return csvContent;
}

/**
 * Export transactions as CSV file
 */
export async function exportAsCSV(
  transactions: Transaction[],
  filename: string = "spendsmart-export.csv"
): Promise<void> {
  try {
    const csvContent = generateCSV(transactions);
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Transactions",
        UTI: "public.comma-separated-values-text",
      });
    }
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw error;
  }
}

/**
 * Generate PDF content (simple text-based for now)
 */
export function generatePDFContent(
  transactions: Transaction[],
  totalIncome: number,
  totalExpense: number,
  options: ExportOptions
): string {
  const dateRange = options.dateFrom && options.dateTo
    ? `${options.dateFrom} to ${options.dateTo}`
    : "All time";

  let content = "SPENDSMART - TRANSACTION EXPORT\n";
  content += "================================\n\n";
  content += `Export Date: ${new Date().toLocaleDateString()}\n`;
  content += `Date Range: ${dateRange}\n\n`;

  if (options.includeBudgetSummary) {
    content += "SUMMARY\n";
    content += "-------\n";
    content += `Total Income: $${totalIncome.toFixed(2)}\n`;
    content += `Total Expense: $${totalExpense.toFixed(2)}\n`;
    content += `Net Balance: $${(totalIncome - totalExpense).toFixed(2)}\n\n`;
  }

  content += "TRANSACTIONS\n";
  content += "------------\n";
  transactions.forEach((t) => {
    content += `${t.date} | ${t.type.toUpperCase()} | ${CATEGORY_NAMES[t.category]} | $${t.amount.toFixed(2)}`;
    if (t.notes) {
      content += ` | ${t.notes}`;
    }
    content += "\n";
  });

  return content;
}

/**
 * Export transactions as PDF (text-based)
 */
export async function exportAsPDF(
  transactions: Transaction[],
  totalIncome: number,
  totalExpense: number,
  options: ExportOptions,
  filename: string = "spendsmart-export.txt"
): Promise<void> {
  try {
    const pdfContent = generatePDFContent(transactions, totalIncome, totalExpense, options);
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, pdfContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: "Export Transactions",
      });
    }
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}

/**
 * Export transactions based on options
 */
export async function exportTransactions(
  transactions: Transaction[],
  totalIncome: number,
  totalExpense: number,
  options: ExportOptions
): Promise<void> {
  if (options.format === "csv") {
    const timestamp = new Date().toISOString().slice(0, 10);
    await exportAsCSV(transactions, `spendsmart-${timestamp}.csv`);
  } else if (options.format === "pdf") {
    const timestamp = new Date().toISOString().slice(0, 10);
    await exportAsPDF(transactions, totalIncome, totalExpense, options, `spendsmart-${timestamp}.txt`);
  }
}
