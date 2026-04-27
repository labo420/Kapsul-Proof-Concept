import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
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
import { useGuest } from "@/contexts/GuestContext";
import { useEvents } from "@/contexts/EventContext";
import NeonProgressBar from "@/components/NeonProgressBar";

type UploadState = "idle" | "uploading" | "done";

const ACTIVE_EVENT_ID = "demo";

export default function GuestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { guestId, acceptedTerms, setAcceptedTerms } = useGuest();
  const { events, incrementPhotoCount } = useEvents();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [showTerms, setShowTerms] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const activeEvent = events[0];
  const liveCount = activeEvent?.photoCount ?? uploadCount;

  useEffect(() => {
    if (!activeEvent) return;
    const timer = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.3) incrementPhotoCount(activeEvent.id);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeEvent?.id]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const simulateUpload = () => {
    setUploadState("uploading");
    setProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setUploadState("done");
          setUploadCount(c => c + 1);
          if (activeEvent) incrementPhotoCount(activeEvent.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setTimeout(() => {
            setUploadState("idle");
            setProgress(0);
          }, 1200);
        }, 400);
      } else {
        setProgress(p);
      }
    }, 120);
  };

  const handleCamera = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!acceptedTerms) {
      setShowTerms(true);
      return;
    }
    if (Platform.OS === "web") {
      simulateUpload();
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!result.canceled) {
      simulateUpload();
    }
  };

  const handleGallery = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!acceptedTerms) {
      setShowTerms(true);
      return;
    }
    if (Platform.OS === "web") {
      simulateUpload();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets.length > 0) {
      simulateUpload();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: topPad + 16,
          paddingBottom: bottomPad + 100,
          paddingHorizontal: 20,
          flex: 1,
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.logo, { color: colors.foreground }]}>
              Kapsul
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {guestId ?? "---"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/scan")}
            style={[
              styles.scanBtn,
              {
                backgroundColor: colors.muted,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="qr-code-outline" size={18} color={colors.foreground} />
            <Text style={[styles.scanBtnText, { color: colors.foreground }]}>Partecipa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.counterSection}>
          <Text style={[styles.counterLabel, { color: colors.mutedForeground }]}>
            {activeEvent ? activeEvent.name : "Foto caricate"}
          </Text>
          <Text style={[styles.counterValue, { color: colors.primary, fontFamily: "SpaceMono_400Regular" }]}>
            {String(liveCount).padStart(6, "0")}
          </Text>
          <View style={[styles.counterDivider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity
            onPress={handleCamera}
            disabled={uploadState === "uploading"}
            style={[
              styles.bigBtn,
              styles.primaryBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: uploadState === "uploading" ? 0.6 : 1,
              },
            ]}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={32} color={colors.primaryForeground} />
            <Text style={[styles.bigBtnText, { color: colors.primaryForeground }]}>
              Scatta Ora
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGallery}
            disabled={uploadState === "uploading"}
            style={[
              styles.bigBtn,
              styles.secondaryBtn,
              {
                backgroundColor: colors.secondary,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: uploadState === "uploading" ? 0.6 : 1,
              },
            ]}
            activeOpacity={0.85}
          >
            <Ionicons name="images" size={32} color={colors.foreground} />
            <Text style={[styles.bigBtnText, { color: colors.foreground }]}>
              Carica dal Rullino
            </Text>
          </TouchableOpacity>
        </View>

        {uploadState !== "idle" && (
          <View
            style={[
              styles.progressSection,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary + "33",
                borderRadius: colors.radius,
              },
            ]}
          >
            <NeonProgressBar
              progress={progress}
              label={uploadState === "done" ? "Completato" : "Caricamento in corso"}
            />
            {uploadState === "done" && (
              <View style={styles.doneRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                <Text style={[styles.doneText, { color: colors.primary }]}>
                  Foto salvata
                </Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.push("/wall")}
          style={[
            styles.wallLink,
            {
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="view-grid" size={16} color={colors.mutedForeground} />
          <Text style={[styles.wallLinkText, { color: colors.mutedForeground }]}>
            Vedi le foto dell'evento
          </Text>
          <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showTerms}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius * 2,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Prima di caricare
            </Text>
            <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
              Caricando foto su Kapsul accetti che le immagini siano condivise con gli altri partecipanti all'evento. Non caricare contenuti inappropriati.
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setTermsChecked(v => !v);
              }}
              style={styles.checkboxRow}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: termsChecked ? colors.primary : "transparent",
                    borderColor: termsChecked ? colors.primary : colors.mutedForeground,
                    borderRadius: 4,
                  },
                ]}
              >
                {termsChecked && (
                  <Ionicons name="checkmark" size={14} color={colors.primaryForeground} />
                )}
              </View>
              <Text style={[styles.checkboxLabel, { color: colors.foreground }]}>
                Accetto i Termini per caricare le foto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!termsChecked) return;
                setAcceptedTerms(true);
                setShowTerms(false);
                setTermsChecked(false);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              style={[
                styles.acceptBtn,
                {
                  backgroundColor: termsChecked ? colors.primary : colors.muted,
                  borderRadius: colors.radius,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.acceptBtnText,
                  { color: termsChecked ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                Continua
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTerms(false)}
              style={styles.cancelLink}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>
                Annulla
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 32,
  },
  logo: {
    fontSize: 26,
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 0,
  },
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  scanBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
  counterSection: {
    alignItems: "center",
    marginBottom: 36,
    gap: 8,
  },
  counterLabel: {
    fontSize: 10,
    letterSpacing: 3,
  },
  counterValue: {
    fontSize: 52,
    letterSpacing: 8,
    lineHeight: 60,
  },
  counterDivider: {
    height: 1,
    width: 120,
    marginTop: 8,
  },
  buttonsSection: {
    gap: 14,
    marginBottom: 24,
  },
  bigBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 28,
  },
  primaryBtn: {},
  secondaryBtn: {
    borderWidth: 1,
  },
  bigBtnText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  progressSection: {
    padding: 16,
    gap: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  doneText: {
    fontSize: 11,
    letterSpacing: 2,
  },
  wallLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    justifyContent: "space-between",
  },
  wallLinkText: {
    fontSize: 13,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 40,
  },
  modalCard: {
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  acceptBtn: {
    paddingVertical: 16,
    alignItems: "center",
  },
  acceptBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  cancelLink: {
    alignItems: "center",
  },
  cancelText: {
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
