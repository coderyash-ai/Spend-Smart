import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";
import { GlassHeader, GlassAvatar } from "@/components/glass-components";
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { AnimatedView } from "@/components/ui/animated-view";
import { Spacing, Shadows, colorWithOpacity } from "@/lib/ui-utils";

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Haptics.impactAsync(ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => logout(), style: "destructive" },
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      // TODO: Implement actual profile update logic
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
      Alert.alert("Success", "Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setEditedName(user?.name || "");
  }, [user?.name]);

  return (
    <ScreenContainer>
      <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      {/* App Header */}
      <AnimatedView animation="slide-down" duration={400}>
        <GlassHeader 
          title="SpendSmart"
          subtitle={user?.name ? `${user.name}'s Settings` : 'Settings & Profile'}
        />
      </AnimatedView>

      {/* Profile Section */}
      <AnimatedView animation="slide-up" delay={100} duration={400}>
        <View style={{
          backgroundColor: colors.surface,
          marginHorizontal: Spacing.lg,
          marginTop: -16,
          borderRadius: 20,
          padding: 24,
          ...Shadows.lg,
        }}>
          <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>Profile</Text>

          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View style={{ marginBottom: 16 }}>
              <GlassAvatar name={user?.name || "User"} size="xl" />
            </View>

            {isEditingProfile ? (
              <View style={{ width: "100%", gap: 12 }}>
                <TextInput
                  style={{
                    width: "100%",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    color: colors.foreground,
                  }}
                  placeholder="Your name"
                  placeholderTextColor={colors.muted}
                  value={editedName}
                  onChangeText={setEditedName}
                  editable={!isLoading}
                />
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.surface,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                    onPress={() => {
                      setIsEditingProfile(false);
                      setEditedName(user?.name || "");
                    }}
                    disabled={isLoading}
                  >
                    <Text style={{ color: colors.foreground, fontWeight: "600" }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: colors.primary,
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: "center",
                    }}
                    onPress={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "600", marginBottom: 4 }}>
                  {user?.name || "User"}
                </Text>
                <Text style={{ color: colors.muted, marginBottom: 16 }}>{user?.email}</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: colorWithOpacity(colors.primary, 0.1),
                    paddingHorizontal: 24,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}
                  onPress={() => setIsEditingProfile(true)}
                >
                  <Text style={{ color: colors.primary, fontWeight: "600" }}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="person.fill" size={20} color={colors.muted} />
                <Text style={{ marginLeft: 12, color: colors.foreground }}>Username</Text>
              </View>
              <Text style={{ color: colors.muted }}>{user?.username || "N/A"}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="envelope.fill" size={20} color={colors.muted} />
                <Text style={{ marginLeft: 12, color: colors.foreground }}>Email</Text>
              </View>
              <Text style={{ color: colors.muted }}>{user?.email}</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="calendar" size={20} color={colors.muted} />
                <Text style={{ marginLeft: 12, color: colors.foreground }}>Member Since</Text>
              </View>
              <Text style={{ color: colors.muted }}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </AnimatedView>

      
      {/* Account Actions */}
      <AnimatedView animation="slide-up" delay={200} duration={400}>
        <View style={{
          backgroundColor: colors.surface,
          marginHorizontal: Spacing.lg,
          marginBottom: 32,
          borderRadius: 20,
          padding: 24,
          ...Shadows.md,
        }}>
          <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>Account</Text>

          <View style={{ gap: 12 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}
              onPress={() => Alert.alert("Info", "Change password feature coming soon!")}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="lock.fill" size={20} color={colors.muted} />
                <Text style={{ marginLeft: 12, color: colors.foreground }}>Change Password</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}
              onPress={() => Alert.alert("Info", "Export data feature coming soon!")}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="square.and.arrow.up" size={20} color={colors.muted} />
                <Text style={{ marginLeft: 12, color: colors.foreground }}>Export Data</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 }}
              onPress={() => Alert.alert("Info", "Privacy policy coming soon!")}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <IconSymbol name="shield.fill" size={20} color={colors.muted} />
                <Text style={{ marginLeft: 12, color: colors.foreground }}>Privacy Policy</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: colorWithOpacity(colors.error, 0.1),
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 24,
            }}
            onPress={handleLogout}
          >
            <Text style={{ color: colors.error, fontWeight: "bold", fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </AnimatedView>
      </ScrollView>
    </ScreenContainer>
  );
}
