/**
 * Export Screen - SpendSmart
 * Export data as CSV or PDF
 */

import React, { useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, GlassButton, GlassChip } from "@/components/glass-components";
import { useTransactions } from "@/lib/transaction-context";
import { useColors } from "@/hooks/use-colors";
import { exportTransactions } from "@/lib/export-utils";
import { ExportOptions } from "@/lib/types";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

export default function ExportScreen() {
  const colors = useColors();
  const { state: transactionState, getTotalIncome, getTotalExpense, getFilteredTransactions } = useTransactions();
  const [format, setFormat] = useState<"csv" | "pdf">("csv");
  const [dateRange, setDateRange] = useState<"all" | "month" | "quarter" | "custom">("all");
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalIncome = getTotalIncome(currentMonth);
  const totalExpense = getTotalExpense(currentMonth);

  // Determine date range
  const getDateRange = () => {
    const today = new Date();
    let from: string | undefined;
    let to: string | undefined;

    switch (dateRange) {
      case "month":
        from = currentMonth + "-01";
        to = today.toISOString().split("T")[0];
        break;
      case "quarter":
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        from = quarterStart.toISOString().split("T")[0];
        to = today.toISOString().split("T")[0];
        break;
      case "all":
      default:
        break;
    }

    return { from, to };
  };

  const { from, to } = getDateRange();
  const filteredTransactions = getFilteredTransactions({
    dateFrom: from,
    dateTo: to,
  });

  const handleExport = async () => {
    try {
      setLoading(true);
      Haptics.impactAsync(ImpactFeedbackStyle.Medium);

      const options: ExportOptions = {
        format,
        dateFrom: from,
        dateTo: to,
        includeCharts: false,
        includeBudgetSummary: true,
        includeCategoryBreakdown: true,
      };

      await exportTransactions(
        filteredTransactions,
        filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
        filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
        options
      );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Export Failed", "Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const exportExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <ScreenContainer className="pb-24">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Export Data</Text>
            <Text className="text-sm text-muted">Share your transactions</Text>
          </View>

          {/* Format Selection */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Export Format</Text>
            <View className="flex-row gap-3">
              <GlassChip
                label="CSV (Spreadsheet)"
                selected={format === "csv"}
                onPress={() => setFormat("csv")}
              />
              <GlassChip
                label="PDF (Report)"
                selected={format === "pdf"}
                onPress={() => setFormat("pdf")}
              />
            </View>
          </View>

          {/* Date Range Selection */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Date Range</Text>
            <View className="flex-row flex-wrap gap-2">
              <GlassChip
                label="All Time"
                selected={dateRange === "all"}
                onPress={() => setDateRange("all")}
              />
              <GlassChip
                label="This Month"
                selected={dateRange === "month"}
                onPress={() => setDateRange("month")}
              />
              <GlassChip
                label="This Quarter"
                selected={dateRange === "quarter"}
                onPress={() => setDateRange("quarter")}
              />
            </View>
          </View>

          {/* Export Preview */}
          <GlassCard>
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground">Export Preview</Text>

              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Transactions</Text>
                  <Text className="text-sm font-semibold text-foreground">{filteredTransactions.length}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Total Income</Text>
                  <Text className="text-sm font-semibold text-success">${exportIncome.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Total Expense</Text>
                  <Text className="text-sm font-semibold text-error">${exportExpense.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Net Balance</Text>
                  <Text
                    className="text-sm font-semibold"
                    style={{
                      color: exportIncome - exportExpense >= 0 ? colors.success : colors.error,
                    }}
                  >
                    ${(exportIncome - exportExpense).toFixed(2)}
                  </Text>
                </View>
              </View>

              <View className="border-t" style={{ borderColor: colors.border }} />

              <View className="gap-1">
                <Text className="text-xs text-muted">File Format</Text>
                <Text className="text-sm font-semibold text-foreground">
                  {format === "csv" ? "Comma-Separated Values (.csv)" : "Text Report (.txt)"}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Export Info */}
          <GlassCard>
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">What's Included</Text>
              <Text className="text-xs text-muted">✓ All transaction details</Text>
              <Text className="text-xs text-muted">✓ Budget summary</Text>
              <Text className="text-xs text-muted">✓ Category breakdown</Text>
              <Text className="text-xs text-muted">✓ Date range filter applied</Text>
            </View>
          </GlassCard>

          {/* Export Button */}
          <GlassButton
            onPress={handleExport}
            disabled={loading || filteredTransactions.length === 0}
            variant="primary"
            size="lg"
          >
            {loading ? "Exporting..." : "Export & Share"}
          </GlassButton>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <GlassCard className="items-center justify-center py-8">
              <Text className="text-lg font-semibold text-foreground mb-2">No transactions to export</Text>
              <Text className="text-sm text-muted text-center">
                Add some transactions first, then come back to export
              </Text>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
