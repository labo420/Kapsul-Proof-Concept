import { Ionicons } from "@expo/vector-icons";
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
  party: "Party Mode",
  morning_after: "Morning After",
  vault: "Vault Mode",
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
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
          Evento non trovato
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.topBar, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.foreground }]} numberOfLines={1}>
          {event.name}
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/qr/${event.id}`)}
          style={styles.backBtn}
        >
          <Ionicons name="qr-code-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.label, { color: colors.mutedForeground }]}>DATA</Text>
          <Text style={[styles.value, { color: colors.foreground }]}>{event.date}</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.label, { color: colors.mutedForeground }]}>MODALITÀ</Text>
          <Text style={[styles.value, { color: colors.primary }]}>
            {DELIVERY_LABELS[event.deliveryMode]}
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.label, { color: colors.mutedForeground }]}>FOTO</Text>
          <Text
            style={[
              styles.counter,
              { color: colors.primary, fontFamily: "SpaceMono_400Regular" },
            ]}
          >
            {String(event.photoCount).padStart(6, "0")}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/wall")}
          style={[
            styles.wallBtn,
            { backgroundColor: colors.primary, borderRadius: colors.radius },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons name="images-outline" size={20} color={colors.primaryForeground} />
          <Text style={[styles.wallBtnText, { color: colors.primaryForeground }]}>
            Vedi Guest Wall
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/qr/${event.id}`)}
          style={[
            styles.qrBtn,
            {
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="qr-code-outline" size={20} color={colors.foreground} />
          <Text style={[styles.qrBtnText, { color: colors.foreground }]}>
            Mostra QR Code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, alignItems: "center" },
  topTitle: { fontSize: 16, fontWeight: "600", flex: 1, textAlign: "center" },
  errorText: { textAlign: "center", marginTop: 100, fontSize: 16 },
  content: {
    flex: 1,
    padding: 20,
    gap: 14,
  },
  infoCard: {
    borderWidth: 1,
    padding: 20,
    gap: 6,
  },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  counter: {
    fontSize: 36,
    letterSpacing: 6,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  wallBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  wallBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderWidth: 1,
  },
  qrBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
