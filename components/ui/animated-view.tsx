/**
 * Animated View Component
 * Reusable animated container for smooth entry animations
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewProps } from 'react-native';
import { Easing } from 'react-native';

interface AnimatedViewProps extends ViewProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  duration?: number;
  style?: any;
}

export function AnimatedView({
  children,
  animation = 'fade',
  delay = 0,
  duration = 300,
  style,
  ...props
}: AnimatedViewProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideYAnim = useRef(new Animated.Value(animation === 'slide-up' ? 30 : animation === 'slide-down' ? -30 : 0)).current;
  const slideXAnim = useRef(new Animated.Value(animation === 'slide-left' ? 30 : animation === 'slide-right' ? -30 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(animation === 'scale' ? 0.9 : 1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      const animations: Animated.CompositeAnimation[] = [];

      // Fade animation
      if (animation === 'fade' || animation.includes('slide')) {
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            easing: Easing.ease,
            useNativeDriver: true,
          })
        );
      }

      // Slide up animation
      if (animation === 'slide-up') {
        animations.push(
          Animated.timing(slideYAnim, {
            toValue: 0,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        );
      }

      // Slide down animation
      if (animation === 'slide-down') {
        animations.push(
          Animated.timing(slideYAnim, {
            toValue: 0,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        );
      }

      // Slide left animation
      if (animation === 'slide-left') {
        animations.push(
          Animated.timing(slideXAnim, {
            toValue: 0,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        );
      }

      // Slide right animation
      if (animation === 'slide-right') {
        animations.push(
          Animated.timing(slideXAnim, {
            toValue: 0,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        );
      }

      // Scale animation
      if (animation === 'scale') {
        animations.push(
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            easing: Easing.ease,
            useNativeDriver: true,
          })
        );
      }

      // Run all animations
      if (animations.length > 0) {
        Animated.parallel(animations).start();
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [animation, delay, duration, fadeAnim, slideYAnim, slideXAnim, scaleAnim]);

  // Build animated style
  const animatedStyle: any = {
    opacity: animation === 'scale' ? fadeAnim : (animation === 'fade' ? fadeAnim : 1),
    transform: [
      ...(animation.includes('slide') ? [{ translateY: slideYAnim }] : []),
      ...(animation.includes('slide') && (animation === 'slide-left' || animation === 'slide-right') ? [{ translateX: slideXAnim }] : []),
      ...(animation === 'scale' ? [{ scale: scaleAnim }] : []),
    ],
  };

  return (
    <Animated.View
      style={[animatedStyle, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
