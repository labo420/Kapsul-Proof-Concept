import { Feather, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  Share,
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

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({ message: `Partecipa a ${event?.name ?? "Kapsul"}!\n${eventLink}` });
    } catch {}
  };

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
        style={[styles.topGradient, { paddingTop: topPad + 8 }]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace("/")} style={styles.navBtn}>
            <Ionicons name="checkmark-done" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: colors.foreground }]}>QR Code</Text>
          <View style={styles.navBtn} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: bottomPad + 40,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.decoContainer} pointerEvents="none">
          <View style={[styles.decoDot, { width: 80, height: 80, top: 20, right: -20, backgroundColor: colors.gradientStart + "18" }]} />
          <View style={[styles.decoDot, { width: 50, height: 50, top: 60, left: -10, backgroundColor: colors.gradientEnd + "18" }]} />
          <View style={[styles.decoDot, { width: 30, height: 30, top: 160, right: 20, backgroundColor: colors.gradientStart + "22" }]} />
          <View style={[styles.decoDot, { width: 18, height: 18, top: 40, left: 60, backgroundColor: colors.gradientEnd + "30" }]} />
        </View>

        <Text style={[styles.eventName, { color: colors.foreground }]}>{event.name}</Text>
        <Text style={[styles.eventDate, { color: colors.mutedForeground }]}>{event.date}</Text>

        <View style={[styles.modeBadge, { backgroundColor: colors.primary + "18", borderRadius: 999, borderWidth: 1, borderColor: colors.primary + "40" }]}>
          <Text style={[styles.modeBadgeText, { color: colors.primary }]}>
            {DELIVERY_LABELS[event.deliveryMode]}
          </Text>
        </View>

        <View style={styles.qrWrapper}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={styles.qrGradientBorder}
          >
            <View style={styles.qrInner}>
              <QRCode value={eventLink} size={200} backgroundColor="#fff" color="#08060F" />
            </View>
          </LinearGradient>
        </View>

        <TouchableOpacity
          onPress={handleShare}
          style={{ borderRadius: 999, overflow: "hidden", width: "100%", marginBottom: 12 }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareBtn}
          >
            <Ionicons name="share-social-outline" size={20} color="#fff" />
            <Text style={styles.shareBtnText}>Condividi con gli ospiti</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={[styles.qrHint, { color: colors.mutedForeground }]}>
          Gli ospiti inquadrano questo QR — nessun download
        </Text>

        <View style={[styles.linkRow, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={[styles.linkText, { color: colors.mutedForeground }]} numberOfLines={1}>
            {eventLink}
          </Text>
          <TouchableOpacity
            onPress={handleCopy}
            style={{ borderRadius: 999, overflow: "hidden" }}
            activeOpacity={0.7}
          >
            {copied ? (
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.copyBtn}
              >
                <Ionicons name="checkmark" size={16} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={[styles.copyBtn, { backgroundColor: colors.muted }]}>
                <Feather name="copy" size={15} color={colors.foreground} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.infoRow}>
            <Text style={{ fontSize: 18 }}>🚀</Text>
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Nessun download richiesto — solo scansione e via
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={{ fontSize: 18 }}>🎭</Text>
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Anonimo automatico — zero attrito per gli ospiti
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/create-event")}
          style={[styles.newEventBtn, { borderColor: colors.border, borderRadius: 999 }]}
          activeOpacity={0.7}
        >
          <Feather name="plus" size={15} color={colors.mutedForeground} />
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
  topGradient: {
    paddingBottom: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  navBtn: { width: 40, alignItems: "center" },
  topTitle: { fontSize: 16, fontWeight: "700" },
  errorText: { textAlign: "center", marginTop: 100, fontSize: 16 },
  eventName: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 14,
  },
  modeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 32,
  },
  modeBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  qrWrapper: {
    marginBottom: 16,
  },
  qrGradientBorder: {
    padding: 3,
    borderRadius: 22,
  },
  qrInner: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
  },
  qrHint: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 28,
  },
  linkRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 10,
    marginBottom: 18,
  },
  linkText: { flex: 1, fontSize: 12, fontWeight: "500" },
  copyBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  infoCard: {
    width: "100%",
    padding: 18,
    borderWidth: 1,
    gap: 14,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
    fontWeight: "500",
  },
  decoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: "hidden",
  },
  decoDot: {
    position: "absolute",
    borderRadius: 999,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  shareBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  newEventBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
  },
  newEventText: { fontSize: 14, fontWeight: "600" },
});
