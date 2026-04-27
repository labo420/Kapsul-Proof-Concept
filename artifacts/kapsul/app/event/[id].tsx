import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/contexts/EventContext";

const DELIVERY_LABELS: Record<string, string> = {
  party: "⚡️ Party Mode",
  morning_after: "🌅 Morning After",
  vault: "🔒 Vault Mode",
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getEvent } = useEvents();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const event = getEvent(id ?? "");

  if (!event) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Evento non trovato</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.gradientStart + "18", "transparent"]}
        style={[styles.headerGradient, { paddingTop: topPad + 8 }]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: colors.foreground }]} numberOfLines={1}>
            {event.name}
          </Text>
          <TouchableOpacity onPress={() => router.push(`/qr/${event.id}`)} style={styles.backBtn}>
            <Ionicons name="qr-code-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <LinearGradient
          colors={[colors.gradientStart + "14", colors.gradientEnd + "14"]}
          style={[styles.statsCard, { borderRadius: colors.radius, borderWidth: 1, borderColor: colors.gradientStart + "40" }]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>DATA</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{event.date}</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statBlock}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>MODALITÀ</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {DELIVERY_LABELS[event.deliveryMode]}
              </Text>
            </View>
          </View>
          <View style={[styles.photoBanner, { borderTopColor: colors.gradientStart + "30" }]}>
            <Text style={[styles.photoCountLabel, { color: colors.mutedForeground }]}>FOTO CARICATE</Text>
            <Text style={[styles.photoCount, { color: "#fff" }]}>
              {event.photoCount}
            </Text>
          </View>
        </LinearGradient>

        <TouchableOpacity
          onPress={() => router.push("/wall")}
          style={{ borderRadius: 999, overflow: "hidden" }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.wallBtn}
          >
            <Ionicons name="images-outline" size={20} color="#fff" />
            <Text style={styles.wallBtnText}>Vedi Guest Wall</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/qr/${event.id}`)}
          style={[styles.qrBtn, { borderColor: colors.border, borderRadius: 999 }]}
          activeOpacity={0.7}
        >
          <Ionicons name="qr-code-outline" size={20} color={colors.foreground} />
          <Text style={[styles.qrBtnText, { color: colors.foreground }]}>Mostra QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerGradient: { paddingBottom: 14 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  backBtn: { width: 40, alignItems: "center" },
  topTitle: { fontSize: 17, fontWeight: "700", flex: 1, textAlign: "center" },
  errorText: { textAlign: "center", marginTop: 100, fontSize: 16 },
  content: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  statsCard: {
    overflow: "hidden",
  },
  statsRow: {
    flexDirection: "row",
    padding: 20,
    gap: 16,
    alignItems: "flex-start",
  },
  statBlock: {
    flex: 1,
    gap: 5,
  },
  statDivider: {
    width: 1,
    height: "100%",
    alignSelf: "stretch",
    minHeight: 40,
  },
  statLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  photoBanner: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  photoCountLabel: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  photoCount: {
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 58,
  },
  wallBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  wallBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderWidth: 1.5,
  },
  qrBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
