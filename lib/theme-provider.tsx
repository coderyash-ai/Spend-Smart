import React from "react";
import { View } from "react-native";

// Simple provider without theme functionality
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}

// Empty context for compatibility
export function useThemeContext() {
  return {
    colorScheme: "light",
    setColorScheme: () => {},
  };
}
