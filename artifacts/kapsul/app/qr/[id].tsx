import { Feather, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import React, { useState } from "react";
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

const DELIVERY_LABELS: Record<string, string> = {
  party: "Party Mode",
  morning_after: "Morning After",
  vault: "Vault Mode",
};

const DELIVERY_DESCS: Record<string, string> = {
  party: "Foto visibili in tempo reale",
  morning_after: "Sbloccate alle 06:00 del mattino",
  vault: "Sbloccate dopo X ore",
};

export default function QRScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getEvent } = useEvents();
  const [copied, setCopied] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const event = getEvent(id ?? "");
  const eventLink = `https://kapsul.app/join/${id}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(eventLink);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <TouchableOpacity onPress={() => router.replace("/")} style={styles.backBtn}>
          <Ionicons name="checkmark-done" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>QR Code</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 28,
          paddingBottom: bottomPad + 40,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.eventName, { color: colors.foreground }]}>
          {event.name}
        </Text>
        <Text style={[styles.eventDate, { color: colors.mutedForeground }]}>
          {event.date}
        </Text>

        <View
          style={[
            styles.modeBadge,
            {
              backgroundColor: colors.primary + "20",
              borderRadius: 999,
              marginBottom: 32,
            },
          ]}
        >
          <Text style={[styles.modeBadgeText, { color: colors.primary }]}>
            {DELIVERY_LABELS[event.deliveryMode]}
          </Text>
          <Text style={[styles.modeDesc, { color: colors.mutedForeground }]}>
            {" • "}{DELIVERY_DESCS[event.deliveryMode]}
          </Text>
        </View>

        <View
          style={[
            styles.qrContainer,
            {
              backgroundColor: "#ffffff",
              borderRadius: colors.radius * 2,
              borderColor: colors.primary + "40",
              shadowColor: colors.primary,
            },
          ]}
        >
          <QRCode
            value={eventLink}
            size={220}
            backgroundColor="#ffffff"
            color="#000000"
          />
        </View>

        <Text style={[styles.orLabel, { color: colors.mutedForeground, fontFamily: "SpaceMono_400Regular" }]}>
          — oppure condividi il link —
        </Text>

        <View
          style={[
            styles.linkRow,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text
            style={[styles.linkText, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {eventLink}
          </Text>
          <TouchableOpacity
            onPress={handleCopy}
            style={[
              styles.copyBtn,
              {
                backgroundColor: copied ? colors.primary : colors.muted,
                borderRadius: colors.radius / 2,
              },
            ]}
            activeOpacity={0.7}
          >
            {copied ? (
              <Ionicons name="checkmark" size={16} color={colors.primaryForeground} />
            ) : (
              <Feather name="copy" size={16} color={colors.foreground} />
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Gli invitati inquadrano il QR — nessun download richiesto
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Login anonimo automatico — zero attrito
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/create-event")}
          style={[
            styles.newEventBtn,
            { borderColor: colors.border, borderRadius: colors.radius },
          ]}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={16} color={colors.mutedForeground} />
          <Text style={[styles.newEventText, { color: colors.mutedForeground }]}>
            Crea un altro evento
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  topTitle: { fontSize: 16, fontWeight: "600" },
  errorText: { textAlign: "center", marginTop: 100, fontSize: 16 },
  eventName: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 4 },
  eventDate: { fontSize: 14, marginBottom: 16 },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  modeBadgeText: { fontSize: 13, fontWeight: "700" },
  modeDesc: { fontSize: 12 },
  qrContainer: {
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 28,
  },
  orLabel: {
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 16,
  },
  linkRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 20,
  },
  linkText: { flex: 1, fontSize: 12 },
  copyBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  newEventBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
  },
  newEventText: { fontSize: 14 },
});
