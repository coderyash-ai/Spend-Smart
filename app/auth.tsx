import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <View className="items-center">
          <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">SS</Text>
          </View>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600 font-medium">Authenticating...</Text>
          <Text className="mt-2 text-gray-400 text-sm">Checking your session</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
