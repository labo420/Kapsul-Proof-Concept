import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface GradientBadgeProps {
  label: string;
  icon?: React.ReactNode;
  variant?: "gradient" | "soft";
}

export default function GradientBadge({ label, icon, variant = "gradient" }: GradientBadgeProps) {
  const colors = useColors();

  if (variant === "soft") {
    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.primary + "22",
            borderRadius: 999,
          },
        ]}
      >
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart + "30", colors.gradientEnd + "30"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.badge, { borderRadius: 999, borderWidth: 1, borderColor: colors.gradientStart + "60" }]}
    >
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
