import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: "lg" | "md" | "sm";
  variant?: "gradient" | "outline" | "ghost";
}

export default function GradientButton({
  label,
  onPress,
  icon,
  disabled = false,
  size = "md",
  variant = "gradient",
}: GradientButtonProps) {
  const colors = useColors();

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const paddingV = size === "lg" ? 18 : size === "sm" ? 10 : 14;
  const fontSize = size === "lg" ? 17 : size === "sm" ? 13 : 15;

  if (variant === "outline") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.75}
        style={[
          styles.base,
          {
            borderWidth: 1.5,
            borderColor: disabled ? colors.border : colors.primary,
            borderRadius: 999,
            paddingVertical: paddingV,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={[styles.label, { color: colors.primary, fontSize }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === "ghost") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.65}
        style={[styles.base, { paddingVertical: paddingV, opacity: disabled ? 0.4 : 1 }]}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={[styles.label, { color: colors.mutedForeground, fontSize }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={{ borderRadius: 999, overflow: "hidden", opacity: disabled ? 0.45 : 1 }}
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
    </TouchableOpacity>
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
