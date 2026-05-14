/**
 * Animation Utilities
 * Reusable animation hooks and helpers for smooth UI transitions
 */

import { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Fade-in animation hook
 */
export function useFadeIn(duration = 300, delay = 0) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, duration, delay]);

  return { opacity: fadeAnim };
}

/**
 * Slide-up animation hook
 */
export function useSlideUp(duration = 400, delay = 0) {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [slideAnim, fadeAnim, duration, delay]);

  return {
    transform: [{ translateY: slideAnim }],
    opacity: fadeAnim,
  };
}

/**
 * Scale animation for press interactions
 */
export function useScaleAnimation(pressScale = 0.96) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: pressScale,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return {
    scale: scaleAnim,
    isPressed,
    handlers: { onPressIn: handlePressIn, onPressOut: handlePressOut },
  };
}

/**
 * Stagger delay for list animations
 */
export function staggerDelay(index: number, baseDelay = 50): number {
  return index * baseDelay;
}

/**
 * Progress bar animation hook
 */
export function useProgressAnimation(initialProgress = 0, duration = 600) {
  const progressAnim = useRef(new Animated.Value(initialProgress)).current;

  const animateProgress = (newProgress: number) => {
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  return { progress: progressAnim, animateProgress };
}

/**
 * Modal animation hook (scale + fade)
 */
export function useModalAnimation(visible: boolean, duration = 250) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
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
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, fadeAnim, duration]);

  return {
    transform: [{ scale: scaleAnim }],
    opacity: fadeAnim,
  };
}

/**
 * Create an animated value
 */
export function createAnimatedValue(initialValue: number) {
  return new Animated.Value(initialValue);
}

/**
 * Easing functions for animations
 */
export const EasingFunctions = {
  ease: Easing.ease,
  linear: Easing.linear,
  quadratic: Easing.quad,
  cubic: Easing.cubic,
  bounce: Easing.bounce,
  elastic: Easing.elastic(1.5),
  out: Easing.out,
  in: Easing.in,
  inOut: Easing.inOut,
};
