import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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

export default function ScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.topBar, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>Partecipa</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.center}>
        <View
          style={[
            styles.scanner,
            {
              borderColor: colors.primary,
              borderRadius: colors.radius * 2,
            },
          ]}
        >
          <View style={[styles.corner, styles.tl, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.tr, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.bl, { borderColor: colors.primary }]} />
          <View style={[styles.corner, styles.br, { borderColor: colors.primary }]} />

          <View style={[styles.scanLine, { backgroundColor: colors.primary + "88" }]} />

          <Ionicons name="qr-code-outline" size={60} color={colors.mutedForeground + "66"} />
        </View>

        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          Inquadra il QR code dell'evento
        </Text>
        <Text style={[styles.subHint, { color: colors.mutedForeground + "88" }]}>
          Il telefono si aprirà automaticamente senza nessun download
        </Text>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(tabs)/guest");
          }}
          style={[
            styles.demoBtn,
            {
              backgroundColor: colors.primary + "15",
              borderColor: colors.primary + "33",
              borderRadius: colors.radius,
            },
          ]}
          activeOpacity={0.7}
        >
          <Text style={[styles.demoBtnText, { color: colors.primary }]}>
            Demo: Accedi come ospite
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
  backBtn: { width: 40 },
  topTitle: { fontSize: 16, fontWeight: "600" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 20,
  },
  scanner: {
    width: 240,
    height: 240,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderWidth: 3,
  },
  tl: { top: -1, left: -1, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 8 },
  tr: { top: -1, right: -1, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 8 },
  bl: { bottom: -1, left: -1, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 8 },
  br: { bottom: -1, right: -1, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 8 },
  scanLine: {
    position: "absolute",
    width: "80%",
    height: 2,
    top: "50%",
  },
  hint: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  subHint: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  demoBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  demoBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
