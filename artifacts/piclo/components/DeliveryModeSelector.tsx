import { Check, Zap, Sun, Lock, type LucideIcon } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { DeliveryMode } from "@/contexts/EventContext";

interface DeliveryModeSelectorProps {
  selected: DeliveryMode;
  onSelect: (mode: DeliveryMode) => void;
  vaultHours: number;
  onVaultHoursChange: (h: number) => void;
}

const MODES: { id: DeliveryMode; icon: LucideIcon; title: string; subtitle: string }[] = [
  {
    id: "party",
    icon: Zap,
    title: "Party Mode",
    subtitle: "Foto visibili in tempo reale",
  },
  {
    id: "morning_after",
    icon: Sun,
    title: "Morning After",
    subtitle: "Sbloccate alle 06:00 del mattino",
  },
  {
    id: "vault",
    icon: Lock,
    title: "Vault Mode",
    subtitle: "Sbloccate dopo X ore",
  },
];

const HOUR_OPTIONS = [1, 2, 3, 6, 12, 24, 48, 72];

export default function DeliveryModeSelector({
  selected,
  onSelect,
  vaultHours,
  onVaultHoursChange,
}: DeliveryModeSelectorProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {MODES.map(mode => {
        const isSelected = selected === mode.id;
        return (
          <TouchableOpacity
            key={mode.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(mode.id);
            }}
            activeOpacity={0.75}
            style={{ borderRadius: colors.radius, overflow: "hidden", marginBottom: 10 }}
          >
            {isSelected ? (
              <LinearGradient
                colors={[colors.gradientStart + "20", colors.gradientEnd + "20"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.modeCard,
                  {
                    borderColor: colors.gradientStart + "80",
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <ModeCardContent mode={mode} isSelected colors={colors} />
              </LinearGradient>
            ) : (
              <View
                style={[
                  styles.modeCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <ModeCardContent mode={mode} isSelected={false} colors={colors} />
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {selected === "vault" && (
        <View style={[styles.hoursRow, { borderTopColor: colors.border }]}>
          <Text style={[styles.hoursLabel, { color: colors.mutedForeground }]}>Sblocca dopo</Text>
          <View style={styles.hoursChips}>
            {HOUR_OPTIONS.map(h => (
              <TouchableOpacity
                key={h}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onVaultHoursChange(h);
                }}
                style={{ borderRadius: 999, overflow: "hidden" }}
              >
                {vaultHours === h ? (
                  <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.chip}
                  >
                    <Text style={[styles.chipText, { color: "#fff" }]}>{h}h</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.chip, { backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border }]}>
                    <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{h}h</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function ModeCardContent({
  mode,
  isSelected,
  colors,
}: {
  mode: (typeof MODES)[number];
  isSelected: boolean;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  const ModeIcon = mode.icon;
  return (
    <View style={styles.modeInner}>
      <View style={styles.modeLeft}>
        {isSelected ? (
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.iconWrap}
          >
            <ModeIcon size={22} color="#fff" />
          </LinearGradient>
        ) : (
          <View style={[styles.iconWrap, { backgroundColor: colors.muted }]}>
            <ModeIcon size={22} color={colors.foreground} />
          </View>
        )}
        <View style={styles.modeText}>
          <Text style={[styles.modeTitle, { color: isSelected ? "#fff" : colors.foreground }]}>
            {mode.title}
          </Text>
          <Text style={[styles.modeSubtitle, { color: colors.mutedForeground }]}>
            {mode.subtitle}
          </Text>
        </View>
      </View>
      {isSelected && (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.checkCircle}
        >
          <Check size={12} color="#fff" />
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  modeCard: {
    borderWidth: 1,
  },
  modeInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  modeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modeText: {
    flex: 1,
    gap: 3,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  modeSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  hoursRow: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 10,
    marginTop: 4,
  },
  hoursLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  hoursChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
