import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email.trim().toLowerCase(), password.trim());
      
      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        console.log('Login successful, navigating to tabs...');
        router.replace("/(tabs)");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Login Failed", "Invalid email or password");
      }
    } catch (error) {
      console.error('Login error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <View className="px-6 py-8">
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-blue-600 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-3xl font-bold">SS</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </Text>
              <Text className="text-center text-gray-600 px-4">
                Sign in to your SpendSmart account
              </Text>
            </View>

            <View className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className={`w-full py-4 rounded-xl items-center ${isLoading ? 'bg-gray-400' : 'bg-blue-600'}`}
                onPress={() => {
                  console.log('Login button pressed');
                  handleLogin();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-bold text-lg">Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-blue-600 font-bold">Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6 bg-blue-50 rounded-xl p-4">
              <Text className="text-center text-sm text-blue-800 font-semibold mb-2">
                Test Accounts
              </Text>
              <Text className="text-center text-xs text-blue-700">
                Email: test@example.com | Password: password123
              </Text>
              <Text className="text-center text-xs text-blue-700">
                Email: demo@example.com | Password: demo123
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
