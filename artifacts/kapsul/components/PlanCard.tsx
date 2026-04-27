import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { EventPlan, PlanLimits } from "@/contexts/PlanContext";

interface Feature {
  label: string;
  included: boolean;
}

function planFeatures(plan: EventPlan, limits: PlanLimits): Feature[] {
  const photoLabel =
    plan === "free"
      ? "100 Foto · Il tuo primo Vault, gratis"
      : plan === "party"
      ? "Vault da 500 Foto · Abbastanza per 50 ospiti tutta la notte"
      : "Vault da 5.000 Foto · Nessun limite, nessun pensiero";

  return [
    { label: photoLabel, included: true },
    {
      label:
        limits.maxGuests >= 99999
          ? "Ospiti illimitati"
          : `Fino a ${limits.maxGuests} ospiti`,
      included: true,
    },
    { label: "Senza Watermark", included: !limits.hasWatermark },
    { label: "Download in alta risoluzione", included: limits.hasHdDownload },
    { label: "AI Video Recap (TikTok/IG)", included: limits.hasAiRecap },
  ];
}

interface PlanCardProps {
  plan: EventPlan;
  limits: PlanLimits;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  badge?: string;
}

export default function PlanCard({
  plan,
  limits,
  selected,
  onSelect,
  disabled,
  badge,
}: PlanCardProps) {
  const colors = useColors();
  const features = planFeatures(plan, limits);

  const isPro = plan === "pro";
  const isParty = plan === "party";

  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.8}
      style={{ borderRadius: colors.radius + 2, overflow: "hidden", opacity: disabled ? 0.42 : 1 }}
    >
      <LinearGradient
        colors={
          selected && isPro
            ? [colors.gradientStart + "28", colors.gradientEnd + "28"]
            : selected && isParty
            ? [colors.gradientStart + "20", colors.gradientStart + "10"]
            : ["transparent", "transparent"]
        }
        style={[
          styles.card,
          {
            borderColor: selected
              ? isPro
                ? colors.gradientEnd
                : isParty
                ? colors.gradientStart
                : colors.primary
              : colors.border,
            borderRadius: colors.radius + 2,
            backgroundColor: selected ? undefined : colors.card,
          },
        ]}
      >
        {badge ? (
          <View style={styles.badgeWrap}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badge}
            >
              <Text style={styles.badgeText}>{badge}</Text>
            </LinearGradient>
          </View>
        ) : null}

        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons
              name={limits.icon}
              size={24}
              color={isPro ? colors.gradientEnd : isParty ? colors.gradientStart : colors.primary}
            />
            <View>
              <Text style={[styles.planName, { color: colors.foreground }]}>
                {limits.label}
              </Text>
              {plan === "free" && (
                <Text style={[styles.planNote, { color: colors.mutedForeground }]}>
                  Solo per il primo evento
                </Text>
              )}
            </View>
          </View>
          <View style={styles.priceWrap}>
            <Text
              style={[
                styles.price,
                {
                  color: isPro
                    ? colors.gradientEnd
                    : isParty
                    ? colors.gradientStart
                    : colors.mutedForeground,
                },
              ]}
            >
              {limits.price}
            </Text>
            {plan !== "free" && (
              <Text style={[styles.perEvent, { color: colors.mutedForeground }]}>
                /evento
              </Text>
            )}
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.features}>
          {features.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <View
                style={[
                  styles.featureIconWrap,
                  {
                    backgroundColor: f.included
                      ? (isPro ? colors.gradientEnd : colors.gradientStart) + "22"
                      : colors.muted,
                  },
                ]}
              >
                <Ionicons
                  name={f.included ? "checkmark" : "close"}
                  size={12}
                  color={
                    f.included
                      ? isPro
                        ? colors.gradientEnd
                        : colors.gradientStart
                      : colors.mutedForeground
                  }
                />
              </View>
              <Text
                style={[
                  styles.featureLabel,
                  {
                    color: f.included ? colors.foreground : colors.mutedForeground,
                    textDecorationLine: f.included ? "none" : "line-through",
                  },
                ]}
              >
                {f.label}
              </Text>
            </View>
          ))}
        </View>

        {selected && (
          <View style={styles.selectedRow}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.selectedPill}
            >
              <Ionicons name="checkmark-circle" size={14} color="#fff" />
              <Text style={styles.selectedText}>Selezionato</Text>
            </LinearGradient>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    padding: 18,
    gap: 14,
  },
  badgeWrap: {
    position: "absolute",
    top: -1,
    right: 16,
    zIndex: 10,
  },
  badge: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  planName: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  planNote: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 1,
  },
  priceWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  perEvent: {
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: -18,
  },
  features: { gap: 9 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  selectedRow: {
    alignItems: "flex-start",
  },
  selectedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
});
