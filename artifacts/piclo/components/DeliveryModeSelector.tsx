import { Check, Zap, Sun } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { DeliveryMode } from "@/contexts/EventContext";

interface DeliveryModeSelectorProps {
  selected: DeliveryMode;
  onSelect: (mode: DeliveryMode) => void;
}

export default function DeliveryModeSelector({ selected, onSelect }: DeliveryModeSelectorProps) {
  const colors = useColors();

  const morningSelected = selected === "morning_after";
  const nowSelected = selected === "now";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect("morning_after");
        }}
        activeOpacity={0.75}
        style={{ borderRadius: colors.radius, overflow: "hidden", marginBottom: 10 }}
      >
        {morningSelected ? (
          <LinearGradient
            colors={[colors.gradientStart + "28", colors.gradientEnd + "28"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.card, { borderColor: colors.gradientStart + "90", borderRadius: colors.radius }]}
          >
            <CardContent
              icon={<Sun size={24} color="#fff" />}
              iconBg={{ type: "gradient", start: colors.gradientStart, end: colors.gradientEnd }}
              title="Rivela la mattina dopo"
              subtitle={"Le foto si sbloccano alle 06:00\ndel mattino successivo"}
              badge="CONSIGLIATO"
              isSelected
              colors={colors}
            />
          </LinearGradient>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <CardContent
              icon={<Sun size={24} color={colors.foreground} />}
              iconBg={{ type: "flat", color: colors.muted }}
              title="Rivela la mattina dopo"
              subtitle={"Le foto si sbloccano alle 06:00\ndel mattino successivo"}
              isSelected={false}
              colors={colors}
            />
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onSelect("now");
        }}
        activeOpacity={0.75}
        style={{ borderRadius: colors.radius, overflow: "hidden" }}
      >
        {nowSelected ? (
          <LinearGradient
            colors={[colors.gradientStart + "28", colors.gradientEnd + "28"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.card, { borderColor: colors.gradientStart + "90", borderRadius: colors.radius }]}
          >
            <CardContent
              icon={<Zap size={24} color="#fff" />}
              iconBg={{ type: "gradient", start: colors.gradientStart, end: colors.gradientEnd }}
              title="Mostra subito"
              subtitle="Le foto sono visibili appena vengono caricate"
              isSelected
              colors={colors}
            />
          </LinearGradient>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <CardContent
              icon={<Zap size={24} color={colors.foreground} />}
              iconBg={{ type: "flat", color: colors.muted }}
              title="Mostra subito"
              subtitle="Le foto sono visibili appena vengono caricate"
              isSelected={false}
              colors={colors}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

type IconBg =
  | { type: "gradient"; start: string; end: string }
  | { type: "flat"; color: string };

function CardContent({
  icon,
  iconBg,
  title,
  subtitle,
  badge,
  isSelected,
  colors,
}: {
  icon: React.ReactNode;
  iconBg: IconBg;
  title: string;
  subtitle: string;
  badge?: string;
  isSelected: boolean;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={styles.cardInner}>
      {iconBg.type === "gradient" ? (
        <LinearGradient
          colors={[iconBg.start, iconBg.end]}
          style={styles.iconWrap}
        >
          {icon}
        </LinearGradient>
      ) : (
        <View style={[styles.iconWrap, { backgroundColor: iconBg.color }]}>
          {icon}
        </View>
      )}

      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          <Text style={[styles.cardTitle, { color: isSelected ? "#fff" : colors.foreground }]}>
            {title}
          </Text>
          {badge && (
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>{badge}</Text>
            </LinearGradient>
          )}
        </View>
        <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
          {subtitle}
        </Text>
      </View>

      {isSelected && (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.checkCircle}
        >
          <Check size={13} color="#fff" />
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  card: {
    borderWidth: 1,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
