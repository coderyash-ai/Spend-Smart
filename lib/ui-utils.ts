/**
 * UI Utilities
 * Common styles, helpers, and constants for consistent UI design
 */

import { ViewStyle, TextStyle } from 'react-native';

/**
 * Shadow presets for different elevation levels
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  } as ViewStyle,
  
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  } as ViewStyle,
  
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  } as ViewStyle,
  
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,
};

/**
 * Border radius presets
 */
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

/**
 * Spacing scale (in pixels)
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

/**
 * Typography scale
 */
export const Typography = {
  display: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: 'bold' as const,
  } as TextStyle,
  
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 'bold' as const,
  } as TextStyle,
  
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 'bold' as const,
  } as TextStyle,
  
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  } as TextStyle,
  
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'normal' as const,
  } as TextStyle,
  
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'normal' as const,
  } as TextStyle,
  
  tiny: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal' as const,
  } as TextStyle,
} as const;

/**
 * Animation timing functions (in milliseconds)
 */
export const AnimationDuration = {
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
} as const;

/**
 * Gradient helper - creates gradient color array
 */
export function createGradient(colors: string[]): string[] {
  return colors;
}

/**
 * Get color with opacity
 */
export function colorWithOpacity(color: string, opacity: number): string {
  // Remove # if present
  const hex = color.replace('#', '');
  
  // Convert to rgba
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Common container style
 */
export const ContainerStyle = {
  flex: 1,
  paddingHorizontal: Spacing.lg,
} as ViewStyle;

/**
 * Card base style
 */
export const CardBaseStyle = {
  borderRadius: BorderRadius['2xl'],
  padding: Spacing.lg,
  ...Shadows.md,
} as ViewStyle;

/**
 * Button base style
 */
export const ButtonBaseStyle = {
  borderRadius: BorderRadius.xl,
  paddingVertical: Spacing.md,
  paddingHorizontal: Spacing['2xl'],
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
} as ViewStyle;

/**
 * Input base style
 */
export const InputBaseStyle = {
  borderRadius: BorderRadius.xl,
  padding: Spacing.md,
  borderWidth: 1,
} as ViewStyle;

/**
 * Combine multiple styles
 */
export function combineStyles(...styles: (ViewStyle | TextStyle | undefined)[]): any {
  return styles.filter(Boolean).reduce((acc, style) => ({ ...acc, ...style }), {});
}
