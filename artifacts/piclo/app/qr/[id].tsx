import { Check, CheckCheck, Copy, Download, Plus, Rocket, Share2, Users } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import QRCode from "react-native-qrcode-svg";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
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
import { useTheme } from "@/contexts/ThemeContext";
import { useEvents } from "@/contexts/EventContext";
import ScreenTransition from "@/components/ScreenTransition";

const DELIVERY_LABELS: Record<string, string> = {
  now: "Mostra subito",
  morning_after: "Rivela la mattina dopo",
};

type QrVariant = "dark" | "light";

interface QRCodeRef {
  toDataURL: (callback: (dataURL: string) => void) => void;
}

const QR_VARIANTS: { key: QrVariant; label: string; qrColor: string; qrBg: string; containerBg: string }[] = [
  { key: "dark", label: "Scuro", qrColor: "#08060F", qrBg: "#ffffff", containerBg: "#ffffff" },
  { key: "light", label: "Chiaro", qrColor: "#ffffff", qrBg: "#08060F", containerBg: "#08060F" },
];

export default function QRScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setActiveGradient } = useTheme();
  const { getEvent } = useEvents();
  const [copied, setCopied] = useState(false);
  const [qrVariant, setQrVariant] = useState<QrVariant>("dark");
  const [downloading, setDownloading] = useState(false);
  const qrRef = useRef<QRCodeRef | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const event = getEvent(id ?? "");
  const eventLink = Linking.createURL(`/join/${id ?? ""}`);

  const activeVariant = QR_VARIANTS.find((v) => v.key === qrVariant)!;

  useFocusEffect(
    useCallback(() => {
      if (event?.themeGradientStart && event?.themeGradientEnd) {
        setActiveGradient({
          start: event.themeGradientStart,
          end: event.themeGradientEnd,
        });
      }
      return () => {
        setActiveGradient(null);
      };
    }, [event?.id, event?.themeGradientStart, event?.themeGradientEnd, setActiveGradient])
  );

  const handleCopy = async () => {
    await Clipboard.setStringAsync(eventLink);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({ message: `Partecipa a ${event?.name ?? "Piclo"}!\n${eventLink}` });
    } catch {}
  };

  const handleDownload = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Non disponibile", "Il download è disponibile solo su dispositivo mobile.");
      return;
    }
    if (!qrRef.current) return;

    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permesso negato", "Abilita l'accesso alla galleria nelle impostazioni per salvare il QR.");
        setDownloading(false);
        return;
      }

      qrRef.current.toDataURL(async (dataURL: string) => {
        try {
          const fileUri = `${FileSystem.cacheDirectory}qr-${id}-${qrVariant}.png`;
          await FileSystem.writeAsStringAsync(fileUri, dataURL, {
            encoding: FileSystem.EncodingType.Base64,
          });
          await MediaLibrary.saveToLibraryAsync(fileUri);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert("Salvato!", "Il QR code è stato salvato nella tua galleria.");
        } catch {
          Alert.alert("Errore", "Impossibile salvare il QR. Riprova.");
        } finally {
          setDownloading(false);
        }
      });
    } catch {
      Alert.alert("Errore", "Impossibile salvare il QR. Riprova.");
      setDownloading(false);
    }
  };

  if (!event) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Evento non trovato</Text>
      </View>
    );
  }

  return (
    <ScreenTransition>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />

      {event.coverImageUri ? (
        <View style={[styles.coverHero, { height: topPad + 180 }]}>
          <Image
            source={{ uri: event.coverImageUri }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.coverFade}
          />
        </View>
      ) : null}

      <LinearGradient
        colors={event.coverImageUri ? ["transparent", "transparent"] : [colors.gradientStart + "18", "transparent"]}
        style={[styles.topGradient, { paddingTop: event.coverImageUri ? topPad + 140 : topPad + 8 }]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace("/")} style={styles.navBtn}>
            <CheckCheck size={22} color={colors.primary} />
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
            <View style={[styles.qrInner, { backgroundColor: activeVariant.containerBg }]}>
              <QRCode
                value={eventLink}
                size={200}
                backgroundColor={activeVariant.qrBg}
                color={activeVariant.qrColor}
                getRef={(ref) => { qrRef.current = ref as unknown as QRCodeRef; }}
              />
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.variantToggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {QR_VARIANTS.map((v) => (
            <TouchableOpacity
              key={v.key}
              onPress={() => {
                setQrVariant(v.key);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.8}
              style={[
                styles.variantBtn,
                qrVariant === v.key && { backgroundColor: colors.primary },
              ]}
            >
              <View style={[styles.variantDot, {
                backgroundColor: v.qrColor,
                borderColor: v.qrBg,
                borderWidth: 1,
              }]} />
              <Text style={[
                styles.variantLabel,
                { color: qrVariant === v.key ? "#fff" : colors.mutedForeground },
              ]}>
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleDownload}
          disabled={downloading}
          style={{ borderRadius: 999, overflow: "hidden", width: "100%", marginBottom: 12 }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareBtn}
          >
            <Download size={20} color="#fff" />
            <Text style={styles.shareBtnText}>
              {downloading ? "Salvataggio…" : "Scarica QR"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          style={{ borderRadius: 999, overflow: "hidden", width: "100%", marginBottom: 28 }}
          activeOpacity={0.8}
        >
          <View style={[styles.shareOutlineBtn, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Share2 size={18} color={colors.foreground} />
            <Text style={[styles.shareOutlineBtnText, { color: colors.foreground }]}>Condividi con gli ospiti</Text>
          </View>
        </TouchableOpacity>

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
                <Check size={16} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={[styles.copyBtn, { backgroundColor: colors.muted }]}>
                <Copy size={15} color={colors.foreground} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.infoRow}>
            <Rocket size={18} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Scarica il QR per stamparlo o condividerlo come immagine
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Users size={18} color={colors.mutedForeground} />
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
          <Plus size={15} color={colors.mutedForeground} />
          <Text style={[styles.newEventText, { color: colors.mutedForeground }]}>
            Crea un altro evento
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  coverHero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  coverFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
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
    marginBottom: 20,
  },
  qrGradientBorder: {
    padding: 3,
    borderRadius: 22,
  },
  qrInner: {
    borderRadius: 20,
    padding: 18,
  },
  variantToggle: {
    flexDirection: "row",
    borderRadius: 999,
    borderWidth: 1,
    padding: 4,
    gap: 4,
    marginBottom: 20,
  },
  variantBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
  },
  variantDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  variantLabel: {
    fontSize: 14,
    fontWeight: "700",
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
  shareOutlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  shareOutlineBtnText: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.1,
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
