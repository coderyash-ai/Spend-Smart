/**
 * Dashboard Screen - SpendSmart
 * Overview of spending, budget status, and quick insights
 */

import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, GlassButton, GlassStatCard, GlassBadge, GlassHeader } from "@/components/glass-components";
import { useTransactions } from "@/lib/transaction-context";
import { useBudget } from "@/lib/budget-context";
import { getCategoryColor, getCategoryIcon, CATEGORY_NAMES } from "@/lib/category-utils";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { PieChart, BarChart } from "react-native-chart-kit";
import { AnimatedView } from "@/components/ui/animated-view";
import { useFadeIn, useSlideUp, staggerDelay } from "@/lib/animations";
import { Spacing, Shadows } from "@/lib/ui-utils";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { state: transactionState, getTotalIncome, getTotalExpense, getWeeklyTrend, getCategorySpending: getCategories } = useTransactions();
  const { budget } = useBudget();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalIncome = getTotalIncome(currentMonth);
  const totalExpense = getTotalExpense(currentMonth);
  const netBalance = totalIncome - totalExpense;
  const categorySpending = getCategories(currentMonth);
  const weeklyTrend = getWeeklyTrend(currentMonth);

  // Prepare pie chart data
  const pieChartData = categorySpending.slice(0, 5).map((cat) => ({
    name: CATEGORY_NAMES[cat.category].substring(0, 8),
    value: cat.amount,
    color: getCategoryColor(cat.category),
    legendFontColor: colors.foreground,
    legendFontSize: 12,
  }));

  // Prepare bar chart data
  const barChartData = {
    labels: weeklyTrend.map((t) => t.dayOfWeek),
    datasets: [
      {
        data: weeklyTrend.map((t) => t.expense),
        color: () => colors.error,
        strokeWidth: 2,
      },
    ],
  };

  const budgetRemaining = budget ? Math.max(0, budget.monthlyLimit - totalExpense) : 0;
  const budgetPercentage = budget && budget.monthlyLimit > 0 ? (totalExpense / budget.monthlyLimit) * 100 : 0;
  const budgetStatus =
    budgetPercentage > 100 ? "exceeded" : budgetPercentage > 80 ? "warning" : "safe";

  return (
    <ScreenContainer className="pb-24">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: Spacing['2xl'], paddingBottom: 32 }}>
          {/* Header with Logo */}
          <AnimatedView animation="slide-down" duration={400}>
            <GlassHeader 
              title="SpendSmart" 
              subtitle={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            />
          </AnimatedView>

          {/* Summary Cards */}
          <View style={{ flexDirection: "row", gap: Spacing.md, paddingHorizontal: Spacing.lg }}>
            <AnimatedView animation="slide-up" delay={staggerDelay(0, 100)} duration={400} style={{ flex: 1 }}>
              <GlassStatCard
                label="Income"
                value={`$${totalIncome.toFixed(2)}`}
                color={colors.success}
                icon={<IconSymbol name="arrow.down.left" size={20} color={colors.success} />}
              />
            </AnimatedView>
            <AnimatedView animation="slide-up" delay={staggerDelay(1, 100)} duration={400} style={{ flex: 1 }}>
              <GlassStatCard
                label="Expense"
                value={`$${totalExpense.toFixed(2)}`}
                color={colors.error}
                icon={<IconSymbol name="arrow.up.right" size={20} color={colors.error} />}
              />
            </AnimatedView>
          </View>

          {/* Net Balance Card */}
          <AnimatedView animation="scale" delay={200} duration={500} style={{ paddingHorizontal: Spacing.lg }}>
            <GlassCard variant="gradient" style={{ alignItems: "center", justifyContent: "center", paddingVertical: 32 }}>
              <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 8 }}>Net Balance</Text>
              <Text
                style={{ color: netBalance >= 0 ? colors.success : colors.error, fontSize: 40, fontWeight: "bold" }}
              >
                ${netBalance.toFixed(2)}
              </Text>
            </GlassCard>
          </AnimatedView>

          {/* Budget Status */}
          {budget && budget.monthlyLimit > 0 && (
            <AnimatedView animation="slide-up" delay={300} duration={400} style={{ paddingHorizontal: Spacing.lg }}>
              <GlassCard>
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "600" }}>Monthly Budget</Text>
                    <GlassBadge
                      variant={budgetStatus === "exceeded" ? "error" : budgetStatus === "warning" ? "warning" : "success"}
                      size="sm"
                    >
                      {budgetStatus === "exceeded" ? "Exceeded" : budgetStatus === "warning" ? "Warning" : "On Track"}
                    </GlassBadge>
                  </View>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: colors.muted, fontSize: 14 }}>Spent</Text>
                      <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "600" }}>${totalExpense.toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: colors.muted, fontSize: 14 }}>Remaining</Text>
                      <Text
                        style={{ color: budgetRemaining > 0 ? colors.success : colors.error, fontSize: 14, fontWeight: "600" }}
                      >
                        ${budgetRemaining.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </AnimatedView>
          )}

          {/* Charts Section */}
          {pieChartData.length > 0 && (
            <AnimatedView animation="fade" delay={400} duration={500} style={{ paddingHorizontal: Spacing.lg }}>
              <View style={{ gap: 16 }}>
                <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "600" }}>Spending by Category</Text>
                <GlassCard style={{ alignItems: "center" }}>
                  <PieChart
                    data={pieChartData}
                    width={300}
                    height={220}
                    chartConfig={{
                      backgroundColor: "transparent",
                      backgroundGradientFrom: "transparent",
                      backgroundGradientTo: "transparent",
                      color: () => colors.border,
                      labelColor: () => colors.foreground,
                    }}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    hasLegend={true}
                  />
                </GlassCard>
              </View>
            </AnimatedView>
          )}

          {weeklyTrend.length > 0 && (
            <AnimatedView animation="fade" delay={500} duration={500} style={{ paddingHorizontal: Spacing.lg }}>
              <View style={{ gap: 16 }}>
                <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "600" }}>Weekly Trend</Text>
                <GlassCard style={{ alignItems: "center" }}>
                  <BarChart
                    data={barChartData}
                    width={300}
                    height={220}
                    chartConfig={{
                      backgroundColor: "transparent",
                      backgroundGradientFrom: "transparent",
                      backgroundGradientTo: "transparent",
                      color: () => colors.border,
                      labelColor: () => colors.foreground,
                      barPercentage: 0.7,
                    }}
                    verticalLabelRotation={0}
                    fromZero={true}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    yAxisLabel="$"
                    yAxisSuffix=""
                  />
                </GlassCard>
              </View>
            </AnimatedView>
          )}

          {/* Quick Actions */}
          <AnimatedView animation="slide-up" delay={600} duration={400} style={{ paddingHorizontal: Spacing.lg, gap: 12 }}>
            <Link href="/transactions" asChild>
              <GlassButton
                onPress={() => Haptics.impactAsync(ImpactFeedbackStyle.Medium)}
                variant="primary"
                size="lg"
                icon={<IconSymbol name="list.bullet" size={20} color="#FFFFFF" />}
              >
                View All Transactions
              </GlassButton>
            </Link>
            <Link href="/budget" asChild>
              <GlassButton
                onPress={() => Haptics.impactAsync(ImpactFeedbackStyle.Medium)}
                variant="secondary"
                size="lg"
                icon={<IconSymbol name="chart.pie.fill" size={20} color={colors.primary} />}
              >
                Manage Budget
              </GlassButton>
            </Link>
          </AnimatedView>

          {/* Empty State */}
          {transactionState.transactions.length === 0 && (
            <AnimatedView animation="scale" delay={300} duration={500} style={{ paddingHorizontal: Spacing.lg }}>
              <GlassCard style={{ alignItems: "center", justifyContent: "center", paddingVertical: 32 }}>
                <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "600", marginBottom: 16 }}>No transactions yet</Text>
                <Text style={{ color: colors.muted, fontSize: 14, textAlign: "center", marginBottom: 16 }}>
                  Start tracking your spending by adding your first transaction
                </Text>
                <Link href="/transactions" asChild>
                  <GlassButton
                    onPress={() => Haptics.impactAsync(ImpactFeedbackStyle.Medium)}
                    variant="primary"
                  >
                    Add Transaction
                  </GlassButton>
                </Link>
              </GlassCard>
            </AnimatedView>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
