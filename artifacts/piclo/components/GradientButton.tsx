import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: "lg" | "md" | "sm";
  variant?: "gradient" | "outline" | "ghost";
}

const PRESS_SPRING = { damping: 7, stiffness: 340, mass: 0.8 } as const;
const RELEASE_SPRING = { damping: 9, stiffness: 220, mass: 0.8 } as const;

export default function GradientButton({
  label,
  onPress,
  icon,
  disabled = false,
  size = "md",
  variant = "gradient",
}: GradientButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.93, PRESS_SPRING);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, RELEASE_SPRING);
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const paddingV = size === "lg" ? 18 : size === "sm" ? 10 : 14;
  const fontSize = size === "lg" ? 17 : size === "sm" ? 13 : 15;

  if (variant === "outline") {
    return (
      <Animated.View style={[animatedStyle, { opacity: disabled ? 0.4 : 1 }]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[
            styles.base,
            {
              borderWidth: 1.5,
              borderColor: disabled ? colors.border : colors.primary,
              borderRadius: 999,
              paddingVertical: paddingV,
            },
          ]}
        >
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.label, { color: colors.primary, fontSize }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === "ghost") {
    return (
      <Animated.View style={[animatedStyle, { opacity: disabled ? 0.4 : 1 }]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[styles.base, { paddingVertical: paddingV }]}
        >
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.label, { color: colors.mutedForeground, fontSize }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[animatedStyle, { borderRadius: 999, overflow: "hidden", opacity: disabled ? 0.45 : 1 }]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, { paddingVertical: paddingV }]}
        >
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.label, { color: "#fff", fontSize }]}>{label}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  label: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
