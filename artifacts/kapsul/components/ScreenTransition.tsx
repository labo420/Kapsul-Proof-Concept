import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 240,
  mass: 0.9,
  overshootClamping: false,
} as const;

interface ScreenTransitionProps {
  children: React.ReactNode;
  variant?: "scale_fade" | "slide_up";
}

export default function ScreenTransition({
  children,
  variant = "scale_fade",
}: ScreenTransitionProps) {
  const scale = useSharedValue(variant === "scale_fade" ? 0.94 : 1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(variant === "slide_up" ? 40 : 0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    if (variant === "scale_fade") {
      scale.value = withSpring(1, SPRING_CONFIG);
    } else {
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform:
      variant === "scale_fade"
        ? [{ scale: scale.value }]
        : [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
