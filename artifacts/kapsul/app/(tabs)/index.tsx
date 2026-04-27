import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/contexts/EventContext";
import GradientButton from "@/components/GradientButton";
import GradientBadge from "@/components/GradientBadge";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const DELIVERY_LABELS: Record<string, string> = {
  party: "⚡️ Party",
  morning_after: "🌅 Morning After",
  vault: "🔒 Vault",
};

const DELIVERY_ICONS: Record<string, IoniconsName> = {
  party: "flash",
  morning_after: "sunny",
  vault: "lock-closed",
};

export default function HostScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events } = useEvents();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: topPad + 20,
          paddingBottom: bottomPad + 100,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoGradient}
            >
              <Text style={styles.logoText}>Kapsul</Text>
            </LinearGradient>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              I tuoi eventi
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/create-event");
            }}
            style={{ borderRadius: 999, overflow: "hidden" }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createBtn}
            >
              <Feather name="plus" size={18} color="#fff" />
              <Text style={styles.createBtnText}>Nuovo</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[colors.gradientStart + "30", colors.gradientEnd + "30"]}
              style={[styles.emptyIcon, { borderRadius: 28 }]}
            >
              <Text style={{ fontSize: 44 }}>📸</Text>
            </LinearGradient>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Crea il tuo primo{"\n"}evento
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Genera un QR code e lascia che gli ospiti carichino le foto automaticamente
            </Text>
            <GradientButton
              label="Crea evento"
              onPress={() => router.push("/create-event")}
              size="lg"
            />
          </View>
        ) : (
          <View style={styles.eventList}>
            {events.map(event => (
              <TouchableOpacity
                key={event.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/event/${event.id}`);
                }}
                activeOpacity={0.8}
                style={{ borderRadius: colors.radius, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={[colors.card, colors.muted]}
                  style={[
                    styles.eventCard,
                    {
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <View style={styles.eventCardTop}>
                    <View style={styles.eventInfo}>
                      <Text style={[styles.eventName, { color: colors.foreground }]} numberOfLines={1}>
                        {event.name}
                      </Text>
                      <Text style={[styles.eventDate, { color: colors.mutedForeground }]}>
                        {event.date}
                      </Text>
                    </View>
                    <GradientBadge
                      label={DELIVERY_LABELS[event.deliveryMode] ?? event.deliveryMode}
                      variant="soft"
                    />
                  </View>
                  <View style={[styles.eventCardBottom, { borderTopColor: colors.border }]}>
                    <View style={styles.statItem}>
                      <Text style={[styles.photoCount, { color: colors.primary }]}>
                        {event.photoCount}
                      </Text>
                      <Text style={[styles.photoLabel, { color: colors.mutedForeground }]}>foto</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push(`/qr/${event.id}`);
                      }}
                      style={{ borderRadius: 999, overflow: "hidden" }}
                    >
                      <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.qrBtn}
                      >
                        <Ionicons name="qr-code-outline" size={14} color="#fff" />
                        <Text style={styles.qrBtnText}>QR</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  logoGradient: {
    borderRadius: 8,
    paddingHorizontal: 2,
    paddingVertical: 1,
    alignSelf: "flex-start",
    backgroundColor: "transparent",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: "500",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 52,
    gap: 18,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  eventList: {
    gap: 14,
  },
  eventCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  eventCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    gap: 12,
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventName: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  eventDate: {
    fontSize: 13,
    fontWeight: "500",
  },
  eventCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  photoCount: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  qrBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});
