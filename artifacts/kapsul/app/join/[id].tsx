import { AlertTriangle, Users, XCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { useGuest } from "@/contexts/GuestContext";
import { useEvents } from "@/contexts/EventContext";
import { apiJoinEvent } from "@/lib/api";

type JoinState = "loading" | "success" | "error";
type ErrorKind = "not_found" | "expired" | "full" | "unknown";

const ERROR_MESSAGES: Record<ErrorKind, { title: string; body: string }> = {
  not_found: {
    title: "Evento non trovato",
    body: "Questo link non corrisponde a nessun evento. Controlla il link ricevuto dall'organizzatore.",
  },
  expired: {
    title: "Evento terminato",
    body: "Questo evento non è più attivo. Contatta l'organizzatore per ulteriori informazioni.",
  },
  full: {
    title: "Evento al completo",
    body: "Questo evento ha raggiunto il limite massimo di ospiti. Contatta l'organizzatore.",
  },
  unknown: {
    title: "Qualcosa è andato storto",
    body: "Non è stato possibile unirti all'evento. Riprova tra qualche momento.",
  },
};

export default function JoinScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { guestId, setCurrentEventId, setGuestToken } = useGuest();
  const { refreshEvent } = useEvents();

  const [joinState, setJoinState] = useState<JoinState>("loading");
  const [errorKind, setErrorKind] = useState<ErrorKind>("unknown");
  const didJoin = useRef(false);

  const pulse = useSharedValue(0.6);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900 }),
        withTiming(0.6, { duration: 900 })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    if (!id || didJoin.current) return;
    didJoin.current = true;
    joinEvent(id);
  }, [id]);

  async function joinEvent(eventId: string) {
    try {
      const { event, guestToken } = await apiJoinEvent(
        eventId,
        guestId ?? "anon"
      );
      if (!event.isActive) {
        setErrorKind("expired");
        setJoinState("error");
        return;
      }
      if (guestToken) await setGuestToken(eventId, guestToken);
      await refreshEvent(eventId, guestToken);
      await setCurrentEventId(eventId);
      setJoinState("success");
      setTimeout(() => {
        router.replace("/(tabs)/guest");
      }, 700);
    } catch (err) {
      const code = (err as Error & { code?: string }).code;
      const msg = (err as Error).message ?? "";
      if (code === "guest_limit_reached" || msg.includes("limit")) {
        setErrorKind("full");
      } else if (msg.includes("404") || msg.includes("not found")) {
        setErrorKind("not_found");
      } else if (msg.includes("active") || msg.includes("expired")) {
        setErrorKind("expired");
      } else {
        setErrorKind("unknown");
      }
      setJoinState("error");
    }
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#6366F118", "transparent"]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.logoRow}>
        <LinearGradient
          colors={["#6366F1", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoCircle}
        >
          <Users size={22} color="#fff" />
        </LinearGradient>
        <Text style={styles.logoText}>Piclo</Text>
      </View>

      <View style={styles.center}>
        {joinState === "loading" && (
          <>
            <Animated.View style={[styles.spinnerRing, pulseStyle]}>
              <LinearGradient
                colors={["#6366F1", "#8B5CF6", "#EC4899"]}
                style={styles.spinnerGradientRing}
              />
            </Animated.View>
            <ActivityIndicator
              size="large"
              color="#6366F1"
              style={styles.spinner}
            />
            <Text style={styles.loadingTitle}>Accesso in corso…</Text>
            <Text style={styles.loadingBody}>
              Stiamo unendoti all'evento, un momento
            </Text>
          </>
        )}

        {joinState === "success" && (
          <>
            <LinearGradient
              colors={["#6366F1", "#EC4899"]}
              style={styles.successCircle}
            >
              <Users size={36} color="#fff" />
            </LinearGradient>
            <Text style={styles.successTitle}>Benvenuto!</Text>
            <Text style={styles.loadingBody}>
              Stai per entrare nell'evento…
            </Text>
          </>
        )}

        {joinState === "error" && (
          <>
            <View style={styles.errorCircle}>
              <XCircle size={48} color="#FF4466" />
            </View>
            <View
              style={[
                styles.errorCard,
                { borderColor: "#FF446640", backgroundColor: "#FF446612" },
              ]}
            >
              <AlertTriangle size={18} color="#FF4466" />
              <View style={styles.errorCardText}>
                <Text style={styles.errorTitle}>
                  {ERROR_MESSAGES[errorKind].title}
                </Text>
                <Text style={styles.errorBody}>
                  {ERROR_MESSAGES[errorKind].body}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={styles.backBtn}
              activeOpacity={0.75}
            >
              <Text style={styles.backBtnText}>Torna alla home</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#08060F",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 18,
    fontFamily: "LilitaOne_400Regular",
    color: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  spinnerRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
  },
  spinnerGradientRing: {
    flex: 1,
    borderRadius: 60,
    opacity: 0.25,
  },
  spinner: {
    marginBottom: 4,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  loadingBody: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 20,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  errorCircle: {
    marginBottom: 8,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    maxWidth: 320,
  },
  errorCardText: {
    flex: 1,
    gap: 6,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FF4466",
  },
  errorBody: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 18,
  },
  backBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#2D2540",
    backgroundColor: "#130F1C",
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#9CA3AF",
  },
});
