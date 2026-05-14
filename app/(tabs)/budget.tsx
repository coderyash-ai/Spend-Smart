/**
 * Budget Screen - SpendSmart
 * Set and track monthly budget
 */

import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, GlassButton, GlassProgressBar, GlassModal, GlassBadge, GlassHeader } from "@/components/glass-components";
import { useTransactions } from "@/lib/transaction-context";
import { useBudget } from "@/lib/budget-context";
import { getCategoryColor, CATEGORY_NAMES, EXPENSE_CATEGORIES } from "@/lib/category-utils";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { AnimatedView } from "@/components/ui/animated-view";
import { useSlideUp, staggerDelay } from "@/lib/animations";
import { Spacing } from "@/lib/ui-utils";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function BudgetScreen() {
  const colors = useColors();
  const { getTotalExpense, getCategorySpending } = useTransactions();
  const { budget, setBudgetLimit, loading } = useBudget();
  const [showEditModal, setShowEditModal] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalExpense = getTotalExpense(currentMonth);
  const categorySpending = getCategorySpending(currentMonth);

  if (loading || !budget) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Loading budget...</Text>
      </ScreenContainer>
    );
  }

  const budgetRemaining = Math.max(0, budget.monthlyLimit - totalExpense);
  const budgetPercentage = budget.monthlyLimit > 0 ? (totalExpense / budget.monthlyLimit) * 100 : 0;
  const budgetStatus =
    budgetPercentage > 100 ? "exceeded" : budgetPercentage > 80 ? "warning" : "safe";

  return (
    <ScreenContainer className="pb-24">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: Spacing.xl, paddingBottom: 32 }}>
          {/* Header */}
          <AnimatedView animation="slide-down" duration={400}>
            <GlassHeader 
              title="Monthly Budget" 
              subtitle={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              showLogo={false}
            />
          </AnimatedView>

          <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.lg }}>
            {/* Current Budget Overview */}
            <AnimatedView animation="scale" delay={100} duration={500}>
              <GlassCard variant="gradient">
                <View style={{ gap: 16 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>Budget Limit</Text>
                    <Text style={{ fontSize: 28, fontWeight: "bold", color: colors.primary }}>${budget.monthlyLimit.toFixed(2)}</Text>
                  </View>

                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Spent</Text>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.error }}>${totalExpense.toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Remaining</Text>
                      <Text
                        style={{ fontSize: 14, fontWeight: "600", color: budgetRemaining > 0 ? colors.success : colors.error }}
                      >
                        ${budgetRemaining.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <GlassProgressBar
                    progress={budgetPercentage}
                    color={
                      budgetStatus === "exceeded"
                        ? colors.error
                        : budgetStatus === "warning"
                        ? colors.warning
                        : colors.success
                    }
                  />

                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12, color: colors.muted }}>{budgetPercentage.toFixed(1)}% used</Text>
                    <GlassBadge
                      variant={budgetStatus === "exceeded" ? "error" : budgetStatus === "warning" ? "warning" : "success"}
                      size="sm"
                    >
                      {budgetStatus === "exceeded" ? "Exceeded" : budgetStatus === "warning" ? "Warning" : "On Track"}
                    </GlassBadge>
                  </View>
                </View>
              </GlassCard>
            </AnimatedView>

            {/* Edit Budget Button */}
            <AnimatedView animation="slide-up" delay={200} duration={400}>
              <GlassButton
                onPress={() => setShowEditModal(true)}
                variant="secondary"
                size="lg"
                icon={<IconSymbol name="pencil" size={20} color={colors.primary} />}
              >
                Edit Budget Limit
              </GlassButton>
            </AnimatedView>

            {/* Category Breakdown */}
            {categorySpending.length > 0 && (
              <AnimatedView animation="fade" delay={300} duration={500}>
                <View style={{ gap: Spacing.lg }}>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>Spending by Category</Text>
                  {categorySpending.map((cat, index) => (
                    <AnimatedView key={cat.category} animation="slide-up" delay={staggerDelay(index, 100)} duration={300}>
                      <GlassCard>
                        <View style={{ gap: 8 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ fontWeight: "600", color: colors.foreground }}>{CATEGORY_NAMES[cat.category]}</Text>
                            <Text style={{ fontWeight: "bold", color: colors.foreground }}>${cat.amount.toFixed(2)}</Text>
                          </View>
                          <GlassProgressBar
                            progress={Math.min((cat.amount / (budget.monthlyLimit / 7)) * 100, 100)}
                            color={getCategoryColor(cat.category)}
                          />
                          <Text style={{ fontSize: 12, color: colors.muted }}>{cat.transactionCount} transactions</Text>
                        </View>
                      </GlassCard>
                    </AnimatedView>
                  ))}
                </View>
              </AnimatedView>
            )}

            {/* Empty State */}
            {categorySpending.length === 0 && (
              <AnimatedView animation="scale" delay={200} duration={400}>
                <GlassCard className="items-center justify-center py-8">
                  <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>No spending yet</Text>
                  <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
                    Add transactions to see your spending breakdown by category
                  </Text>
                </GlassCard>
              </AnimatedView>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Edit Budget Modal */}
      <EditBudgetModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentLimit={budget.monthlyLimit}
      />
    </ScreenContainer>
  );
}

interface EditBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  currentLimit: number;
}

function EditBudgetModal({ visible, onClose, currentLimit }: EditBudgetModalProps) {
  const colors = useColors();
  const { setBudgetLimit } = useBudget();
  const [amount, setAmount] = useState(currentLimit.toString());

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) < 0) {
      Alert.alert("Error", "Budget cannot be negative");
      return;
    }

    Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    await setBudgetLimit(parseFloat(amount));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title="Set Monthly Budget">
      <View className="gap-4">
        <Text className="text-sm text-muted">Enter your monthly budget limit</Text>

        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">Budget Amount</Text>
          <View className="flex-row items-center gap-2 p-3 rounded-lg border bg-surface/50"
            style={{ borderColor: colors.border }}>
            <Text className="text-lg font-bold text-foreground">$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              className="flex-1 text-lg font-semibold text-foreground"
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <GlassButton
            onPress={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Cancel
          </GlassButton>
          <GlassButton
            onPress={handleSave}
            variant="primary"
            size="md"
            className="flex-1"
          >
            Save
          </GlassButton>
        </View>
      </View>
    </GlassModal>
  );
}
