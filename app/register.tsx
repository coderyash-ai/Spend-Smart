import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { registerUser } from "@/lib/json-db";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await registerUser({
        username: username.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim()
      });
      
      if (newUser) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Registration successful! Please sign in.", [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Registration Failed", "Username or email already exists");
      }
    } catch (error) {
      console.error('Registration error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-100">
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <View className="px-6 py-8">
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-indigo-600 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-3xl font-bold">SS</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </Text>
              <Text className="text-center text-gray-600 px-4">
                Join SpendSmart and manage your expenses
              </Text>
            </View>

            <View className="bg-white rounded-2xl shadow-xl p-6 space-y-5">
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Username</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  placeholder="Choose a username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Full Name</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

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
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm Password</Text>
                <TextInput
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                className={`w-full py-4 rounded-xl items-center ${isLoading ? 'bg-gray-400' : 'bg-indigo-600'}`}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-bold text-lg">Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-indigo-600 font-bold">Sign In</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-6 bg-indigo-50 rounded-xl p-4">
              <Text className="text-center text-sm text-indigo-800 font-semibold mb-2">
                Requirements
              </Text>
              <Text className="text-center text-xs text-indigo-700">
                Username: 3+ characters
              </Text>
              <Text className="text-center text-xs text-indigo-700">
                Password: 6+ characters
              </Text>
              <Text className="text-center text-xs text-indigo-700">
                Valid email address required
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
