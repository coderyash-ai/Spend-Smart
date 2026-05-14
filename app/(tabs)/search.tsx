/**
 * Search & Filter Screen - SpendSmart
 * Find and filter transactions
 */

import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, GlassButton, GlassChip, GlassHeader } from "@/components/glass-components";
import { useTransactions } from "@/lib/transaction-context";
import { getCategoryIcon, CATEGORY_NAMES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/category-utils";
import { useColors } from "@/hooks/use-colors";
import { TransactionCategory, FilterOptions } from "@/lib/types";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { AnimatedView } from "@/components/ui/animated-view";
import { useSlideUp, staggerDelay } from "@/lib/animations";
import { Spacing, colorWithOpacity } from "@/lib/ui-utils";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function SearchScreen() {
  const colors = useColors();
  const { getFilteredTransactions } = useTransactions();
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<TransactionCategory[]>([]);
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");

  const filters: FilterOptions = {
    searchText: searchText || undefined,
    type: filterType === "all" ? undefined : filterType,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    amountMin: amountMin ? parseFloat(amountMin) : undefined,
    amountMax: amountMax ? parseFloat(amountMax) : undefined,
  };

  const filteredTransactions = getFilteredTransactions(filters);

  const allCategories = Array.from(
    new Set<TransactionCategory>([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
  );

  const handleCategoryToggle = (category: TransactionCategory) => {
    Haptics.impactAsync(ImpactFeedbackStyle.Light);
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    setSearchText("");
    setFilterType("all");
    setDateFrom("");
    setDateTo("");
    setSelectedCategories([]);
    setAmountMin("");
    setAmountMax("");
  };

  return (
    <ScreenContainer className="pb-24">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Search</Text>
            <Text className="text-sm text-muted">Find and filter transactions</Text>
          </View>

          {/* Search Bar */}
          <View className="p-3 rounded-lg border bg-surface/50" style={{ borderColor: colors.border }}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search by notes or category..."
              placeholderTextColor={colors.muted}
              className="text-foreground"
            />
          </View>

          {/* Type Filter */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Type</Text>
            <View className="flex-row gap-2">
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
          </View>

          {/* Date Range */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Date Range</Text>
            <View className="flex-row gap-2">
              <View className="flex-1 p-3 rounded-lg border bg-surface/50" style={{ borderColor: colors.border }}>
                <TextInput
                  value={dateFrom}
                  onChangeText={setDateFrom}
                  placeholder="From (YYYY-MM-DD)"
                  placeholderTextColor={colors.muted}
                  className="text-foreground text-sm"
                />
              </View>
              <View className="flex-1 p-3 rounded-lg border bg-surface/50" style={{ borderColor: colors.border }}>
                <TextInput
                  value={dateTo}
                  onChangeText={setDateTo}
                  placeholder="To (YYYY-MM-DD)"
                  placeholderTextColor={colors.muted}
                  className="text-foreground text-sm"
                />
              </View>
            </View>
          </View>

          {/* Category Filter */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Categories</Text>
            <View className="flex-row flex-wrap gap-2">
              {allCategories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => handleCategoryToggle(cat)}
                >
                  <View
                    className={`px-3 py-2 rounded-full border ${
                      selectedCategories.includes(cat) ? "bg-primary/20" : "bg-surface/50"
                    }`}
                    style={{
                      borderColor: selectedCategories.includes(cat) ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      className="text-xs font-semibold"
                      style={{
                        color: selectedCategories.includes(cat) ? colors.primary : colors.muted,
                      }}
                    >
                      {CATEGORY_NAMES[cat].substring(0, 10)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Amount Range */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Amount Range</Text>
            <View className="flex-row gap-2">
              <View className="flex-1 p-3 rounded-lg border bg-surface/50" style={{ borderColor: colors.border }}>
                <TextInput
                  value={amountMin}
                  onChangeText={setAmountMin}
                  placeholder="Min"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  className="text-foreground text-sm"
                />
              </View>
              <View className="flex-1 p-3 rounded-lg border bg-surface/50" style={{ borderColor: colors.border }}>
                <TextInput
                  value={amountMax}
                  onChangeText={setAmountMax}
                  placeholder="Max"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  className="text-foreground text-sm"
                />
              </View>
            </View>
          </View>

          {/* Clear Filters Button */}
          <GlassButton
            onPress={handleClearFilters}
            variant="secondary"
            size="md"
          >
            Clear Filters
          </GlassButton>

          {/* Results */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Results</Text>
              <Text className="text-sm text-muted">{filteredTransactions.length} found</Text>
            </View>

            {filteredTransactions.length > 0 ? (
              <View className="gap-2">
                {filteredTransactions.map((transaction) => (
                  <GlassCard key={transaction.id} className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <Text className="text-2xl">
                        {getCategoryIcon(transaction.category)}
                      </Text>
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">
                          {CATEGORY_NAMES[transaction.category]}
                        </Text>
                        <Text className="text-xs text-muted">
                          {new Date(transaction.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text
                      className="font-bold text-lg"
                      style={{
                        color: transaction.type === "income" ? colors.success : colors.error,
                      }}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </Text>
                  </GlassCard>
                ))}
              </View>
            ) : (
              <GlassCard className="items-center justify-center py-8">
                <Text className="text-lg font-semibold text-foreground mb-2">No results</Text>
                <Text className="text-sm text-muted text-center">
                  Try adjusting your filters
                </Text>
              </GlassCard>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
