import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGuest } from "@/contexts/GuestContext";
import { useEvents } from "@/contexts/EventContext";
import { apiJoinEvent } from "@/lib/api";

type ScanState = "scanning" | "success" | "error";
type ErrorKind = "invalid" | "expired" | "full" | "unknown";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function extractEventId(raw: string): string | null {
  try {
    const patterns = [
      /kapsul\.app\/join\/([^/?#]+)/i,
      /kapsul:\/\/event\/([^/?#]+)/i,
      /^([a-zA-Z0-9]{10,})$/,
    ];
    for (const pattern of patterns) {
      const match = raw.match(pattern);
      if (match) return match[1];
    }
    return null;
  } catch {
    return null;
  }
}

export default function ScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { guestId, setCurrentEventId, setGuestToken } = useGuest();
  const { refreshEvent } = useEvents();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [scanState, setScanState] = useState<ScanState>("scanning");
  const [errorKind, setErrorKind] = useState<ErrorKind>("unknown");
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "pending">("pending");
  const scanLock = useRef(false);

  const scanLineY = useSharedValue(0);
  const successScale = useSharedValue(0);
  const errorShake = useSharedValue(0);

  useEffect(() => {
    scanLineY.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(0, { duration: 1800 })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    if (Platform.OS === "web") {
      setCameraPermission("denied");
      return;
    }
    Camera.requestCameraPermissionsAsync().then(({ status }) => {
      setCameraPermission(status === "granted" ? "granted" : "denied");
    }).catch(() => {
      setCameraPermission("denied");
    });
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    top: `${scanLineY.value * 100}%`,
  }));

  const successScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const errorShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: errorShake.value }],
  }));

  function triggerError(kind: ErrorKind) {
    setErrorKind(kind);
    setScanState("error");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    errorShake.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
    setTimeout(() => {
      scanLock.current = false;
      setScanState("scanning");
    }, 2500);
  }

  async function handleScanResult(raw: string) {
    if (scanLock.current || scanState !== "scanning") return;
    scanLock.current = true;

    const eventId = extractEventId(raw);
    if (!eventId) {
      triggerError("invalid");
      return;
    }

    try {
      const { event, guestToken } = await apiJoinEvent(eventId, guestId ?? "anon");
      if (!event.isActive) {
        triggerError("expired");
        return;
      }
      if (guestToken) await setGuestToken(eventId, guestToken);
      await refreshEvent(eventId);
      await setCurrentEventId(eventId);
      setScanState("success");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      successScale.value = withSequence(
        withTiming(1.15, { duration: 200 }),
        withTiming(1, { duration: 160 })
      );
      setTimeout(() => {
        router.replace("/(tabs)/guest");
      }, 900);
    } catch (err) {
      const code = (err as Error & { code?: string }).code;
      if (code === "guest_limit_reached") {
        scanLock.current = false;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(
          "Evento al completo",
          "Questo evento ha raggiunto il limite massimo di ospiti. Contatta l'organizzatore per ulteriori informazioni.",
          [{ text: "OK" }]
        );
      } else {
        triggerError("unknown");
      }
    }
  }

  function handleSkip() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentEventId(null);
    router.push("/(tabs)/guest");
  }

  function handleRetry() {
    scanLock.current = false;
    setScanState("scanning");
  }

  const errorMessages: Record<ErrorKind, { title: string; body: string }> = {
    invalid: {
      title: "QR non valido",
      body: "Questo QR code non è un evento Kapsul. Chiedi all'organizzatore il codice corretto.",
    },
    expired: {
      title: "Evento scaduto",
      body: "Questo evento non è più attivo. Contatta l'organizzatore per ulteriori informazioni.",
    },
    full: {
      title: "Evento al completo",
      body: "Questo evento ha raggiunto il limite di ospiti. Contatta l'organizzatore per ulteriori informazioni.",
    },
    unknown: {
      title: "Errore di scansione",
      body: "Non è stato possibile leggere il QR code. Riprova.",
    },
  };

  const showCamera = cameraPermission === "granted" && Platform.OS !== "web";

  return (
    <View style={[styles.root, { backgroundColor: "#08060F" }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Partecipa</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.center}>
        {showCamera ? (
          <View style={styles.cameraContainer}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              onBarcodeScanned={({ data }) => handleScanResult(data)}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
            <View style={styles.overlay}>
              <View style={styles.overlayTop} />
              <View style={styles.overlayMiddle}>
                <View style={styles.overlaySide} />
                <Animated.View
                  style={[
                    styles.scanFrame,
                    {
                      borderColor:
                        scanState === "success"
                          ? colors.gradientStart
                          : scanState === "error"
                          ? "#FF4466"
                          : colors.primary,
                    },
                    scanState === "error" ? errorShakeStyle : {},
                  ]}
                >
                  <View style={[styles.corner, styles.tl, { borderColor: scanState === "error" ? "#FF4466" : colors.primary }]} />
                  <View style={[styles.corner, styles.tr, { borderColor: scanState === "error" ? "#FF4466" : colors.primary }]} />
                  <View style={[styles.corner, styles.bl, { borderColor: scanState === "error" ? "#FF4466" : colors.primary }]} />
                  <View style={[styles.corner, styles.br, { borderColor: scanState === "error" ? "#FF4466" : colors.primary }]} />

                  {scanState === "scanning" && (
                    <Animated.View
                      style={[
                        styles.scanLine,
                        { backgroundColor: colors.primary + "CC" },
                        scanLineStyle,
                      ]}
                    />
                  )}

                  {scanState === "success" && (
                    <Animated.View style={[styles.statusIcon, successScaleStyle]}>
                      <Ionicons name="checkmark-circle" size={64} color={colors.gradientStart} />
                    </Animated.View>
                  )}

                  {scanState === "error" && (
                    <View style={styles.statusIcon}>
                      <Ionicons name="close-circle" size={64} color="#FF4466" />
                    </View>
                  )}
                </Animated.View>
                <View style={styles.overlaySide} />
              </View>
              <View style={styles.overlayBottom} />
            </View>
          </View>
        ) : (
          <View style={[styles.mockScanner, { borderColor: colors.primary + "44" }]}>
            <View style={[styles.corner, styles.tl, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.tr, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bl, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.br, { borderColor: colors.primary }]} />

            {cameraPermission === "denied" && Platform.OS !== "web" ? (
              <View style={styles.permissionContent}>
                <Ionicons name="ban-outline" size={48} color="rgba(255,255,255,0.4)" />
                <Text style={styles.permissionText}>Accesso fotocamera negato</Text>
                <Text style={styles.permissionSub}>Abilita la fotocamera nelle impostazioni</Text>
              </View>
            ) : (
              <>
                <Animated.View style={[styles.scanLine, { backgroundColor: colors.primary + "88" }, scanLineStyle]} />
                <Ionicons name="qr-code-outline" size={60} color={colors.mutedForeground + "66"} />
              </>
            )}
          </View>
        )}

        {scanState === "error" && (
          <View style={[styles.feedbackCard, { backgroundColor: "#FF4466" + "18", borderColor: "#FF4466" + "44" }]}>
            <Ionicons name="warning-outline" size={20} color="#FF4466" />
            <View style={styles.feedbackCardText}>
              <Text style={[styles.feedbackTitle, { color: "#FF4466" }]}>
                {errorMessages[errorKind].title}
              </Text>
              <Text style={styles.feedbackBody}>
                {errorMessages[errorKind].body}
              </Text>
            </View>
          </View>
        )}

        {scanState === "success" && (
          <View style={[styles.feedbackCard, { backgroundColor: colors.gradientStart + "18", borderColor: colors.gradientStart + "44" }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.gradientStart} />
            <Text style={[styles.feedbackTitle, { color: colors.gradientStart }]}>
              Evento trovato! Accesso in corso…
            </Text>
          </View>
        )}

        {scanState === "scanning" && (
          <>
            <Text style={styles.hint}>Inquadra il QR code dell'evento</Text>
            <Text style={styles.subHint}>
              Il codice si trova sulla schermata dell'organizzatore
            </Text>
          </>
        )}

        {scanState === "error" && (
          <TouchableOpacity
            onPress={handleRetry}
            style={[styles.actionBtn, { borderColor: colors.primary + "44" }]}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color={colors.primary} />
            <Text style={[styles.actionBtnText, { color: colors.primary }]}>Riprova</Text>
          </TouchableOpacity>
        )}

        {scanState === "scanning" && (
          <TouchableOpacity
            onPress={handleSkip}
            style={[
              styles.skipBtn,
              {
                backgroundColor: colors.primary + "15",
                borderColor: colors.primary + "33",
                borderRadius: colors.radius,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipBtnText, { color: colors.primary }]}>
              Continua senza QR
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  backBtn: { width: 40 },
  topTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 20,
  },
  cameraContainer: {
    width: FRAME_SIZE + 80,
    height: FRAME_SIZE + 80,
    borderRadius: 16,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(8,6,15,0.72)",
  },
  overlayMiddle: {
    height: FRAME_SIZE,
    flexDirection: "row",
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(8,6,15,0.72)",
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(8,6,15,0.72)",
  },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  mockScanner: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: 8,
  },
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderWidth: 3,
  },
  tl: { top: -1, left: -1, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 8 },
  tr: { top: -1, right: -1, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 8 },
  bl: { bottom: -1, left: -1, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 8 },
  br: { bottom: -1, right: -1, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 8 },
  scanLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    left: 0,
  },
  statusIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  permissionContent: {
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  permissionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  permissionSub: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  hint: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
  },
  subHint: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    color: "rgba(255,255,255,0.45)",
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    maxWidth: 320,
  },
  feedbackCardText: { flex: 1, gap: 4 },
  feedbackTitle: { fontSize: 14, fontWeight: "700" },
  feedbackBody: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 18 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 999,
    marginTop: 4,
  },
  actionBtnText: { fontSize: 14, fontWeight: "600" },
  skipBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  skipBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
