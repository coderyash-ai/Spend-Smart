/**
 * Glassmorphism Component Library - Enhanced
 * Reusable glass-effect components with website-quality design for SpendSmart
 */

import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Modal, ScrollView, Animated, ActivityIndicator, ViewProps, TextInputProps } from "react-native";
import { cn } from "@/lib/utils";
import { useColors } from "@/hooks/use-colors";
import { useScaleAnimation } from "@/lib/animations";
import { Shadows, BorderRadius, Spacing, colorWithOpacity } from "@/lib/ui-utils";
import { IconSymbol } from "@/components/ui/icon-symbol";

/**
 * GlassCard - Enhanced glass container with variants
 */
interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient' | 'outlined';
  animated?: boolean;
  intensity?: number;
}

export function GlassCard({ 
  children, 
  variant = 'default',
  animated = false,
  intensity: _intensity = 90, 
  className, 
  style,
  ...props 
}: GlassCardProps) {
  const colors = useColors();
  const { scale, handlers } = useScaleAnimation(animated ? 0.98 : 1);

  const variantStyles = {
    default: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      ...Shadows.md,
    },
    elevated: {
      backgroundColor: colors.surfaceElevated || colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      ...Shadows.xl,
    },
    gradient: {
      backgroundColor: colorWithOpacity(colors.primary, 0.1),
      borderColor: colors.primary,
      borderWidth: 1,
      ...Shadows.md,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: colors.primary,
      borderWidth: 2,
      ...Shadows.none,
    },
  };

  const cardContent = (
    <View
      className={cn("rounded-3xl p-4", className)}
      style={[
        variantStyles[variant],
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  if (animated) {
    return (
      <Animated.View
        style={{ transform: [{ scale }] }}
        {...handlers}
      >
        {cardContent}
      </Animated.View>
    );
  }

  return cardContent;
}

/**
 * GlassButton - Enhanced glass-styled button with gradients and icons
 */
interface GlassButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

export function GlassButton({
  onPress,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  gradient = true,
  className,
}: GlassButtonProps) {
  const colors = useColors();
  const { scale, handlers } = useScaleAnimation(0.96);

  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing['2xl'] },
    lg: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['3xl'] },
  };

  const getButtonStyle = () => {
    if (disabled) {
      return {
        backgroundColor: colorWithOpacity(colors.muted, 0.3),
        borderColor: colors.border,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: gradient ? colors.primary : colors.primary,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
          borderWidth: 2,
        };
      case 'danger':
        return {
          backgroundColor: colors.error,
          borderColor: 'transparent',
        };
      case 'accent':
        return {
          backgroundColor: gradient ? colors.accent : colors.accent,
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: 'transparent',
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return colorWithOpacity(colors.foreground, 0.5);
    if (variant === 'secondary') return colors.primary;
    return '#FFFFFF';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          opacity: pressed || disabled ? 0.8 : 1,
          ...Shadows.md,
        },
      ]}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          ...handlers,
        }}
      >
        <View
          className={cn(
            "rounded-2xl flex-row items-center justify-center gap-2",
            className
          )}
          style={[
            sizeStyles[size],
            getButtonStyle(),
            { borderRadius: BorderRadius.xl },
          ]}
          {...handlers}
        >
          {loading ? (
            <ActivityIndicator color={getTextColor()} size="small" />
          ) : (
            <>
              {icon}
              {typeof children === "string" ? (
                <Text 
                  className={cn("font-semibold", size === "sm" ? "text-sm" : size === "lg" ? "text-base" : "text-base")}
                  style={{ color: getTextColor() }}
                >
                  {children}
                </Text>
              ) : (
                children
              )}
            </>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

/**
 * GlassInput - Enhanced glass-styled text input with icons
 */
interface GlassInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export function GlassInput({ label, error, icon, leftIcon, className, style, ...props }: GlassInputProps) {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="gap-2">
      {label && <Text className="text-sm font-semibold text-foreground">{label}</Text>}
      <View
        className="rounded-2xl flex-row items-center"
        style={{
          borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
          backgroundColor: colors.surface,
          borderWidth: isFocused ? 2 : 1,
          ...Shadows.sm,
        }}
      >
        {leftIcon && (
          <View style={{ paddingLeft: Spacing.md, paddingRight: Spacing.sm }}>
            {leftIcon}
          </View>
        )}
        <TextInput
          className={cn(
            "flex-1 text-foreground",
            leftIcon ? "pl-0" : "px-4",
            "py-3",
            className
          )}
          placeholderTextColor={colors.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {icon && (
          <View style={{ paddingRight: Spacing.md, paddingLeft: Spacing.sm }}>
            {icon}
          </View>
        )}
      </View>
      {error && <Text className="text-xs text-error">{error}</Text>}
    </View>
  );
}

/**
 * GlassModal - Glass-styled modal overlay
 */
interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function GlassModal({ visible, onClose, children, title }: GlassModalProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
        <View
          className="w-11/12 max-w-md rounded-3xl border"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            scrollEnabled={false}
          >
            <View className="p-6 gap-4">
              {title && (
                <Text className="text-2xl font-bold text-foreground">{title}</Text>
              )}
              {children}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/**
 * GlassBadge - Small glass badge for labels
 */
interface GlassBadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "error" | "warning";
  size?: "sm" | "md";
}

export function GlassBadge({ children, variant = "primary", size = "sm" }: GlassBadgeProps) {
  const colors = useColors();

  const variantColors = {
    primary: colors.primary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  const sizeClasses = {
    sm: "px-2 py-1",
    md: "px-3 py-2",
  };

  return (
    <View
      className={cn("rounded-full border", sizeClasses[size])}
      style={{
        borderColor: variantColors[variant],
        backgroundColor: `${variantColors[variant]}1A`,
      }}
    >
      <Text
        className={cn(
          "font-semibold text-center",
          size === "sm" ? "text-xs" : "text-sm"
        )}
        style={{ color: variantColors[variant] }}
      >
        {typeof children === "string" ? children : children}
      </Text>
    </View>
  );
}

/**
 * GlassChip - Selectable glass chip
 */
interface GlassChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function GlassChip({ label, selected = false, onPress }: GlassChipProps) {
  const colors = useColors();

  return (
    <Pressable onPress={onPress}>
      <View
        className="rounded-full border px-4 py-2"
        style={{
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? `${colors.primary}22` : colors.surface,
        }}
      >
        <Text
          className="font-medium text-center"
          style={{
            color: selected ? colors.primary : colors.foreground,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * GlassProgressBar - Glass-styled progress indicator
 */
interface GlassProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
}

export function GlassProgressBar({ progress, color, height = 8 }: GlassProgressBarProps) {
  const colors = useColors();
  const barColor = color || colors.primary;

  return (
    <View
      className="rounded-full border"
      style={{
        height,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View
        style={{
          height: "100%",
          width: `${Math.min(progress, 100)}%`,
          backgroundColor: barColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

/**
 * GlassStatCard - Card displaying a statistic
 */
interface GlassStatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

export function GlassStatCard({ label, value, icon, color }: GlassStatCardProps) {
  const colors = useColors();

  return (
    <GlassCard className="flex-1" variant="elevated">
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-muted">{label}</Text>
          {icon}
        </View>
        <Text
          className="text-2xl font-bold"
          style={{ color: color || colors.foreground }}
        >
          {value}
        </Text>
      </View>
    </GlassCard>
  );
}

/**
 * GlassAvatar - User avatar with gradient background
 */
interface GlassAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GlassAvatar({ name, size = 'md' }: GlassAvatarProps) {
  const colors = useColors();
  
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };
  
  const fontSizeMap = {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 36,
  };
  
  const diameter = sizeMap[size];
  const fontSize = fontSizeMap[size];
  
  return (
    <View
      style={{
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        backgroundColor: colorWithOpacity(colors.primary, 0.2),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: colors.primary,
          fontSize,
          fontWeight: 'bold',
        }}
      >
        {name?.charAt(0)?.toUpperCase() || 'U'}
      </Text>
    </View>
  );
}

/**
 * GlassListItem - Enhanced list item with press animation
 */
interface GlassListItemProps {
  children: React.ReactNode;
  onPress?: () => void;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function GlassListItem({ children, onPress, icon, rightIcon }: GlassListItemProps) {
  const colors = useColors();
  const { scale, handlers } = useScaleAnimation(0.98);
  
  const content = (
    <View
      className="flex-row items-center gap-3 p-4"
      style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {icon}
      <View style={{ flex: 1 }}>{children}</View>
      {rightIcon}
    </View>
  );
  
  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <Animated.View style={{ transform: [{ scale }] }} {...handlers}>
          {content}
        </Animated.View>
      </Pressable>
    );
  }
  
  return content;
}

/**
 * GlassHeader - Website-style page header with gradient
 */
interface GlassHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function GlassHeader({ title, subtitle, showLogo = true }: GlassHeaderProps) {
  const colors = useColors();
  
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing['3xl'],
        paddingBottom: Spacing['3xl'],
        alignItems: 'center',
      }}
    >
      {showLogo && (
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: Spacing.lg,
            ...Shadows.lg,
          }}
        >
          <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>
            SS
          </Text>
        </View>
      )}
      <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginBottom: subtitle ? 8 : 0 }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textAlign: 'center' }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
