/**
 * Transactions Screen - SpendSmart
 * View, add, edit, and delete transactions
 */

import React, { useState } from "react";
import { ScrollView, View, Text, Pressable, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, GlassButton, GlassChip, GlassModal, GlassHeader } from "@/components/glass-components";
import { useTransactions } from "@/lib/transaction-context";
import { getCategoryColor, getCategoryIcon, CATEGORY_NAMES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/category-utils";
import { useColors } from "@/hooks/use-colors";
import { TransactionType, TransactionCategory } from "@/lib/types";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { AnimatedView } from "@/components/ui/animated-view";
import { useSlideUp, staggerDelay } from "@/lib/animations";
import { Spacing, colorWithOpacity } from "@/lib/ui-utils";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TransactionsScreen() {
  const colors = useColors();
  const { state: transactionState, deleteTransaction } = useTransactions();
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTransactions = transactionState.transactions
    .filter((t) => filterType === "all" || t.type === filterType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string) => {
    Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteTransaction(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer className="pb-24">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: Spacing.xl, paddingBottom: 32 }}>
          {/* Header */}
          <AnimatedView animation="slide-down" duration={400}>
            <GlassHeader 
              title="Transactions" 
              subtitle="Manage your income and expenses"
              showLogo={false}
            />
          </AnimatedView>

          <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.lg }}>
            {/* Filter Chips */}
            <AnimatedView animation="slide-up" delay={100} duration={400}>
              <View style={{ flexDirection: "row", gap: Spacing.sm, flexWrap: "wrap" }}>
                <GlassChip
                  label="All"
                  selected={filterType === "all"}
                  onPress={() => setFilterType("all")}
                />
                <GlassChip
                  label="Income"
                  selected={filterType === "income"}
                  onPress={() => setFilterType("income")}
                />
                <GlassChip
                  label="Expense"
                  selected={filterType === "expense"}
                  onPress={() => setFilterType("expense")}
                />
              </View>
            </AnimatedView>

            {/* Transactions List */}
            {filteredTransactions.length > 0 ? (
              <View style={{ gap: Spacing.sm }}>
                {filteredTransactions.map((transaction, index) => (
                  <AnimatedView key={transaction.id} animation="slide-up" delay={staggerDelay(index, 50)} duration={300}>
                    <Pressable
                      onLongPress={() => handleDelete(transaction.id)}
                      onPress={() => Haptics.impactAsync(ImpactFeedbackStyle.Light)}
                    >
                      <GlassCard variant="elevated" className="flex-row items-center justify-between">
                        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.md, flex: 1 }}>
                          <View
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 22,
                              backgroundColor: colorWithOpacity(getCategoryColor(transaction.category), 0.2),
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text style={{ fontSize: 22 }}>
                              {getCategoryIcon(transaction.category)}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 16 }}>
                              {CATEGORY_NAMES[transaction.category]}
                            </Text>
                            <Text style={{ fontSize: 12, color: colors.muted }}>
                              {new Date(transaction.date).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 18,
                            color: transaction.type === "income" ? colors.success : colors.error,
                          }}
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </Text>
                      </GlassCard>
                    </Pressable>
                  </AnimatedView>
                ))}
              </View>
            ) : (
              <AnimatedView animation="scale" delay={200} duration={400}>
                <GlassCard className="items-center justify-center py-8">
                  <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground, marginBottom: 8 }}>No transactions</Text>
                  <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
                    {filterType === "all"
                      ? "Start by adding your first transaction"
                      : `No ${filterType} transactions yet`}
                  </Text>
                </GlassCard>
              </AnimatedView>
            )}

            {/* Add Button */}
            <AnimatedView animation="slide-up" delay={300} duration={400}>
              <GlassButton
                onPress={() => setShowAddModal(true)}
                variant="primary"
                size="lg"
                icon={<IconSymbol name="plus.circle.fill" size={20} color="#FFFFFF" />}
              >
                Add Transaction
              </GlassButton>
            </AnimatedView>
          </View>
        </View>
      </ScrollView>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </ScreenContainer>
  );
}

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}

function AddTransactionModal({ visible, onClose }: AddTransactionModalProps) {
  const colors = useColors();
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSave = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert("Error", "Amount must be greater than 0");
      return;
    }

    Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    await addTransaction({
      type,
      amount: parseFloat(amount),
      category,
      date,
      notes: notes || undefined,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAmount("");
    setNotes("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory(type === "income" ? "salary" : "food");
    onClose();
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title="Add Transaction">
      <View className="gap-4">
        {/* Type Toggle */}
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => setType("income")}
            style={{ flex: 1 }}
          >
            <View
              className={`p-3 rounded-lg border items-center ${
                type === "income" ? "bg-success/20" : "bg-surface/50"
              }`}
              style={{
                borderColor: type === "income" ? colors.success : colors.border,
              }}
            >
              <Text
                className="font-semibold"
                style={{
                  color: type === "income" ? colors.success : colors.muted,
                }}
              >
                Income
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setType("expense")}
            style={{ flex: 1 }}
          >
            <View
              className={`p-3 rounded-lg border items-center ${
                type === "expense" ? "bg-error/20" : "bg-surface/50"
              }`}
              style={{
                borderColor: type === "expense" ? colors.error : colors.border,
              }}
            >
              <Text
                className="font-semibold"
                style={{
                  color: type === "expense" ? colors.error : colors.muted,
                }}
              >
                Expense
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Amount Input */}
        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">Amount</Text>
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

        {/* Category Picker */}
        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat as TransactionCategory)}
              >
                <View
                  className={`p-2 rounded-lg border ${
                    category === cat ? "bg-primary/20" : "bg-surface/50"
                  }`}
                  style={{
                    borderColor: category === cat ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color: category === cat ? colors.primary : colors.muted,
                    }}
                  >
                    {CATEGORY_NAMES[cat]}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Date Picker */}
        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">Date</Text>
          <View className="p-3 rounded-lg border bg-surface/50"
            style={{ borderColor: colors.border }}>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              className="text-foreground font-semibold"
            />
          </View>
        </View>

        {/* Notes Input */}
        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">Notes (Optional)</Text>
          <View className="p-3 rounded-lg border bg-surface/50 h-20"
            style={{ borderColor: colors.border }}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes..."
              placeholderTextColor={colors.muted}
              multiline
              className="text-foreground"
            />
          </View>
        </View>

        {/* Action Buttons */}
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
