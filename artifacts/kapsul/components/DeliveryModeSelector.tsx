import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { DeliveryMode } from "@/contexts/EventContext";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface DeliveryModeSelectorProps {
  selected: DeliveryMode;
  onSelect: (mode: DeliveryMode) => void;
  vaultHours: number;
  onVaultHoursChange: (h: number) => void;
}

const MODES: { id: DeliveryMode; icon: IoniconsName; title: string; subtitle: string }[] = [
  {
    id: "party",
    icon: "flash",
    title: "Party Mode",
    subtitle: "Foto visibili in tempo reale",
  },
  {
    id: "morning_after",
    icon: "sunny",
    title: "Morning After",
    subtitle: "Sbloccate alle 06:00 del mattino",
  },
  {
    id: "vault",
    icon: "lock-closed",
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
            style={[
              styles.modeCard,
              {
                backgroundColor: isSelected ? colors.primary + "15" : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderRadius: colors.radius,
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.modeLeft}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: isSelected ? colors.primary + "25" : colors.muted },
                ]}
              >
                <Ionicons
                  name={mode.icon}
                  size={20}
                  color={isSelected ? colors.primary : colors.mutedForeground}
                />
              </View>
              <View style={styles.modeText}>
                <Text
                  style={[
                    styles.modeTitle,
                    { color: isSelected ? colors.primary : colors.foreground },
                  ]}
                >
                  {mode.title}
                </Text>
                <Text style={[styles.modeSubtitle, { color: colors.mutedForeground }]}>
                  {mode.subtitle}
                </Text>
              </View>
            </View>
            {isSelected && (
              <View
                style={[
                  styles.checkCircle,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="checkmark" size={12} color={colors.primaryForeground} />
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
                style={[
                  styles.chip,
                  {
                    backgroundColor: vaultHours === h ? colors.primary : colors.muted,
                    borderColor: vaultHours === h ? colors.primary : colors.border,
                    borderRadius: 999,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: vaultHours === h ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {h}h
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
  },
  modeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modeText: {
    flex: 1,
    gap: 2,
  },
  modeTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  modeSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  hoursRow: {
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 10,
  },
  hoursLabel: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  hoursChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
});
