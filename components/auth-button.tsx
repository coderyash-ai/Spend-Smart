import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";

interface AuthButtonProps {
  variant?: "login" | "register";
  onPress?: () => void;
}

export function AuthButton({ variant = "login", onPress }: AuthButtonProps) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isAuthenticated) {
    return (
      <TouchableOpacity
        className="bg-red-500 px-4 py-2 rounded-lg items-center"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="bg-blue-600 px-4 py-2 rounded-lg items-center"
      onPress={onPress}
    >
      <Text className="text-white font-semibold">
        {variant === "login" ? "Sign In" : "Sign Up"}
      </Text>
    </TouchableOpacity>
  );
}
