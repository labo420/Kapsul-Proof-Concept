import { Camera as CameraIcon, Check, ChevronRight, Download, EyeOff, Film, Images, Lock, LogOut, QrCode } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { preventScreenCaptureAsync, allowScreenCaptureAsync } from "expo-screen-capture";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import { useEvents } from "@/contexts/EventContext";
import { PLAN_LIMITS } from "@/contexts/PlanContext";
import GradientButton from "@/components/GradientButton";
import NeonProgressBar from "@/components/NeonProgressBar";
import { apiUploadPhoto, apiRemoveGuest, apiGetPhotos } from "@/lib/api";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const SHEET_SPRING = { damping: 22, stiffness: 240, mass: 1, overshootClamping: false } as const;

type UploadState = "idle" | "uploading" | "done";

export default function GuestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setActiveGradient } = useTheme();
  const { user, token } = useAuth();
  const { guestId, acceptedTerms, setAcceptedTerms, currentEventId, setCurrentEventId, guestTokens } = useGuest();
  const uploaderId = user?.id ?? guestId;
  const { events, getEvent, refreshEvent, incrementPhotoCount } = useEvents();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadBatchCurrent, setUploadBatchCurrent] = useState(0);
  const [uploadBatchTotal, setUploadBatchTotal] = useState(0);
  const [showTerms, setShowTerms] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const activeEvent = currentEventId ? getEvent(currentEventId) : null;

  useFocusEffect(
    useCallback(() => {
      preventScreenCaptureAsync("guest").catch(() => {});
      return () => {
        allowScreenCaptureAsync("guest").catch(() => {});
      };
    }, [])
  );

  const handleRefresh = useCallback(async () => {
    if (!currentEventId) return;
    setRefreshing(true);
    try {
      await refreshEvent(currentEventId, guestTokens[currentEventId]);
    } catch {
    } finally {
      setRefreshing(false);
    }
  }, [currentEventId, guestTokens, refreshEvent]);

  useFocusEffect(
    useCallback(() => {
      if (currentEventId) refreshEvent(currentEventId, guestTokens[currentEventId]).catch(() => {});
      if (activeEvent?.themeGradientStart && activeEvent?.themeGradientEnd) {
        setActiveGradient({
          start: activeEvent.themeGradientStart,
          end: activeEvent.themeGradientEnd,
        });
      }
      return () => {
        setActiveGradient(null);
      };
    }, [activeEvent?.id, activeEvent?.themeGradientStart, activeEvent?.themeGradientEnd, setActiveGradient, currentEventId, refreshEvent, guestTokens])
  );

  const liveCount = activeEvent?.photoCount ?? uploadCount;
  const activePlan = activeEvent?.plan ?? "party";
  const planLimits = PLAN_LIMITS[activePlan];
  const isLimitReached = liveCount >= planLimits.maxPhotos;

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);
  const pressScale = useSharedValue(1);
  const successBounce = useSharedValue(1);

  const enterOpacity0 = useSharedValue(0);
  const enterY0 = useSharedValue(22);
  const enterOpacity1 = useSharedValue(0);
  const enterY1 = useSharedValue(22);
  const enterOpacity2 = useSharedValue(0);
  const enterY2 = useSharedValue(22);
  const enterOpacity3 = useSharedValue(0);
  const enterY3 = useSharedValue(22);

  const ENTER_SPRING = { damping: 20, stiffness: 200, mass: 0.9 } as const;

  const sheetTranslateY = useSharedValue(SCREEN_HEIGHT);
  const sheetOpacity = useSharedValue(0);
  const dragStartY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragStartY.value = sheetTranslateY.value;
    })
    .onUpdate((e) => {
      const next = dragStartY.value + e.translationY;
      sheetTranslateY.value = Math.max(0, next);
    })
    .onEnd((e) => {
      const shouldClose = e.translationY > 100 || e.velocityY > 800;
      if (shouldClose) {
        sheetOpacity.value = withTiming(0, { duration: 160 });
        sheetTranslateY.value = withSpring(
          SCREEN_HEIGHT,
          { ...SHEET_SPRING, damping: 30 },
          () => {
            runOnJS(setTermsVisible)(false);
            runOnJS(setShowTerms)(false);
          }
        );
      } else {
        sheetTranslateY.value = withSpring(0, SHEET_SPRING);
      }
    });

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 900 }),
        withTiming(0.6, { duration: 900 })
      ),
      -1,
      false
    );

    const delays = [0, 100, 200, 300];
    const opacities = [enterOpacity0, enterOpacity1, enterOpacity2, enterOpacity3];
    const ys = [enterY0, enterY1, enterY2, enterY3];
    delays.forEach((d, i) => {
      opacities[i].value = withDelay(d, withTiming(1, { duration: 340 }));
      ys[i].value = withDelay(d, withSpring(0, ENTER_SPRING));
    });
  }, []);

  const enterStyle0 = useAnimatedStyle(() => ({
    opacity: enterOpacity0.value,
    transform: [{ translateY: enterY0.value }],
  }));
  const enterStyle1 = useAnimatedStyle(() => ({
    opacity: enterOpacity1.value,
    transform: [{ translateY: enterY1.value }],
  }));
  const enterStyle2 = useAnimatedStyle(() => ({
    opacity: enterOpacity2.value,
    transform: [{ translateY: enterY2.value }],
  }));
  const enterStyle3 = useAnimatedStyle(() => ({
    opacity: enterOpacity3.value,
    transform: [{ translateY: enterY3.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const cameraPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const successBounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successBounce.value }],
  }));

  const openTerms = () => {
    setTermsVisible(true);
    sheetTranslateY.value = SCREEN_HEIGHT;
    sheetOpacity.value = 0;
    sheetTranslateY.value = withSpring(0, SHEET_SPRING);
    sheetOpacity.value = withTiming(1, { duration: 180 });
  };

  const closeTerms = () => {
    sheetOpacity.value = withTiming(0, { duration: 160 });
    sheetTranslateY.value = withSpring(SCREEN_HEIGHT, { ...SHEET_SPRING, damping: 30 }, () => {
      runOnJS(setTermsVisible)(false);
      runOnJS(setShowTerms)(false);
    });
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
    opacity: sheetOpacity.value,
  }));

  useEffect(() => {
    if (showTerms) {
      openTerms();
    }
  }, [showTerms]);

  useEffect(() => {
    if (!activeEvent) return;
  }, [activeEvent?.id]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const doUpload = async (fileUri: string, mimeType: string, batchCurrent = 1, batchTotal = 1) => {
    if (!uploaderId) return;
    setUploadState("uploading");
    setUploadBatchCurrent(batchCurrent);
    setUploadBatchTotal(batchTotal);
    setProgress(0);
    try {
      if (activeEvent) {
        await apiUploadPhoto(
          activeEvent.id,
          token ?? null,
          guestTokens[activeEvent.id] ?? null,
          fileUri,
          mimeType,
          (pct) => setProgress(pct)
        );
        incrementPhotoCount(activeEvent.id);
      }
      setProgress(100);
      setUploadCount((c) => c + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      successBounce.value = withSpring(1.18, { damping: 5, stiffness: 280 }, () => {
        successBounce.value = withSpring(1, { damping: 10, stiffness: 200 });
      });
      if (batchCurrent === batchTotal) {
        setUploadState("done");
        setTimeout(() => {
          setUploadState("idle");
          setProgress(0);
          setUploadBatchCurrent(0);
          setUploadBatchTotal(0);
        }, 1400);
      }
    } catch (err) {
      setUploadState("idle");
      setProgress(0);
      setUploadBatchCurrent(0);
      setUploadBatchTotal(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      throw err;
    }
  };

  const handleCamera = async () => {
    if (isLimitReached) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!acceptedTerms) { setShowTerms(true); return; }
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      await doUpload(asset.uri, asset.mimeType ?? "image/jpeg");
    }
  };

  const handleGallery = async () => {
    if (isLimitReached) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!acceptedTerms) { setShowTerms(true); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets.length > 0) {
      const total = result.assets.length;
      for (let i = 0; i < total; i++) {
        const asset = result.assets[i];
        try {
          await doUpload(asset.uri, asset.mimeType ?? "image/jpeg", i + 1, total);
        } catch {
          // continue with next photo on failure
        }
      }
    }
  };

  async function handleLeaveEvent() {
    if (!activeEvent || !guestId) return;

    let myPhotoCount = 0;
    try {
      const photos = await apiGetPhotos(activeEvent.id, guestTokens[activeEvent.id] ?? undefined, token ?? undefined);
      myPhotoCount = photos.filter((p) => p.guestId === guestId).length;
    } catch {
    }

    const photoLabel =
      myPhotoCount === 0
        ? "Non hai ancora caricato foto in questo evento."
        : `Verranno eliminate anche le tue ${myPhotoCount} foto caricate. Questa azione è irreversibile.`;

    Alert.alert(
      "Lascia evento",
      `Vuoi lasciare questo evento? ${photoLabel}`,
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Lascia",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRemoveGuest(activeEvent.id, guestId, guestTokens[activeEvent.id] ?? "");
              setCurrentEventId(null);
              router.push("/scan");
            } catch {
              Alert.alert("Errore", "Impossibile lasciare l'evento. Riprova.");
            }
          },
        },
      ]
    );
  }

  if (!currentEventId) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={{ alignItems: "center", paddingHorizontal: 40, gap: 16 }}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            style={{ width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" }}
          >
            <QrCode size={38} color="#fff" />
          </LinearGradient>
          <Text style={[styles.logo, { color: colors.foreground, marginTop: 8 }]}>Nessun evento attivo</Text>
          <Text style={{ color: colors.mutedForeground, textAlign: "center", fontSize: 15, lineHeight: 22 }}>
            Scansiona il QR code dell'evento o inserisci il codice manualmente per partecipare.
          </Text>
          <GradientButton
            label="Partecipa a un evento"
            onPress={() => router.push("/scan")}
            size="lg"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {activeEvent?.coverImageUri ? (
        <View style={styles.coverHero}>
          <Image
            source={{ uri: activeEvent.coverImageUri }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.coverFade}
          />
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={{
          paddingTop: activeEvent?.coverImageUri ? 8 : topPad + 20,
          paddingBottom: bottomPad + 120,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {activeEvent?.coverImageUri ? (
          <View style={{ height: 170 }} />
        ) : null}
        <Animated.View style={[styles.header, enterStyle0]}>
          <View>
            <Image
              source={require("../../assets/images/piclo-logo-white.png")}
              style={styles.logoImage}
              contentFit="contain"
            />
            <Text style={[styles.guestId, { color: colors.mutedForeground }]}>
              {guestId ?? "---"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/scan")}
            style={[styles.scanBtn, { backgroundColor: colors.muted, borderRadius: 999, borderWidth: 1, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <QrCode size={18} color={colors.foreground} />
            <Text style={[styles.scanBtnText, { color: colors.foreground }]}>Partecipa</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.counterSection, enterStyle1]}>
          <Text style={[styles.counterLabel, { color: colors.mutedForeground }]}>
            {activeEvent ? activeEvent.name : "Foto caricate"}
          </Text>
          <Text style={[styles.counterValue, { color: colors.foreground, fontFamily: "SpaceMono_400Regular" }]}>
            {String(liveCount).padStart(4, "0")}
          </Text>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.counterBar}
          />
        </Animated.View>

        {isLimitReached && (
          <Animated.View style={enterStyle2}>
            <View style={[styles.limitBanner, { backgroundColor: colors.card, borderColor: colors.gradientEnd + "60" }]}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.limitIcon}
              >
                <Lock size={16} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[styles.limitTitle, { color: colors.foreground }]}>
                  Limite raggiunto ({planLimits.maxPhotos} foto)
                </Text>
                <Text style={[styles.limitSub, { color: colors.mutedForeground }]}>
                  Passa a {activePlan === "free" ? "Party (1,99€)" : "Piclo Pro (9,99€)"} per continuare
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        <Animated.View style={[styles.cameraSection, enterStyle2]}>
          <Pressable
            onPress={handleCamera}
            disabled={uploadState === "uploading" || isLimitReached}
            onPressIn={() => {
              pressScale.value = withSpring(0.88, { damping: 7, stiffness: 350, mass: 0.7 });
            }}
            onPressOut={() => {
              pressScale.value = withSpring(1, { damping: 5, stiffness: 260, mass: 0.8 });
            }}
            style={styles.cameraBtnWrap}
          >
            <Animated.View style={[styles.cameraPulse, pulseStyle]}>
              <LinearGradient
                colors={[colors.gradientStart + "50", colors.gradientEnd + "50"]}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            <Animated.View style={cameraPressStyle}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                style={styles.cameraBtn}
              >
                <CameraIcon size={42} color="#fff" />
              </LinearGradient>
            </Animated.View>
          </Pressable>
          <Text style={[styles.cameraBtnLabel, { color: colors.foreground }]}>
            Scatta una foto
          </Text>
          <Text style={[styles.cameraHint, { color: colors.mutedForeground }]}>
            Tocca per aprire la fotocamera
          </Text>
        </Animated.View>

        <Animated.View style={enterStyle3}>
          <TouchableOpacity
            onPress={handleGallery}
            disabled={uploadState === "uploading"}
            style={[styles.galleryBtn, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            activeOpacity={0.8}
          >
            <Images size={22} color={colors.primary} />
            <Text style={[styles.galleryBtnText, { color: colors.foreground }]}>
              Carica dal rullino
            </Text>
            <ChevronRight size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </Animated.View>

        {uploadState !== "idle" && (
          <View
            style={[
              styles.progressSection,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <NeonProgressBar
              progress={progress}
              label={
                uploadState === "done"
                  ? "Completato!"
                  : uploadBatchTotal > 1
                  ? `foto ${uploadBatchCurrent} di ${uploadBatchTotal}`
                  : "Caricamento..."
              }
            />
            {uploadState === "done" && (
              <Animated.View style={[styles.doneRow, successBounceStyle]}>
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  style={styles.doneIcon}
                >
                  <Check size={14} color="#fff" />
                </LinearGradient>
                <Text style={[styles.doneText, { color: colors.foreground }]}>
                  Foto aggiunta con successo
                </Text>
              </Animated.View>
            )}
          </View>
        )}

        <Animated.View style={[enterStyle3, { gap: 10 }]}>
          {activeEvent && !activeEvent.guestsCanView && (
            <View style={[styles.viewOnlyBanner, { backgroundColor: colors.muted, borderColor: colors.border, borderRadius: colors.radius }]}>
              <EyeOff size={15} color={colors.mutedForeground} />
              <Text style={[styles.viewOnlyText, { color: colors.mutedForeground }]}>
                Stai visualizzando solo le tue foto
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={() => router.push("/wall")}
            style={[styles.wallLink, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            activeOpacity={0.7}
          >
            <Film size={20} color={colors.foreground} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.wallLinkText, { color: colors.foreground }]}>
                Guarda il Guest Wall
              </Text>
              <Text style={[styles.wallLinkSub, { color: colors.mutedForeground }]}>
                {activeEvent?.guestsCanView === false ? "Le tue foto" : "Sfoglia tutte le foto dell'evento"}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </TouchableOpacity>

          {activeEvent && activeEvent.guestsCanDownload !== false && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/wall");
              }}
              style={[styles.downloadPhotoBtn, { borderRadius: colors.radius, overflow: "hidden" }]}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.downloadPhotoBtnGradient}
              >
                <Download size={18} color="#fff" />
                <Text style={styles.downloadPhotoBtnText}>Scarica le tue foto</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>

        {activeEvent && (
          <Animated.View style={enterStyle3}>
            <TouchableOpacity
              onPress={handleLeaveEvent}
              style={[styles.leaveBtn, { borderColor: "#FF4466" + "44", borderRadius: colors.radius }]}
              activeOpacity={0.7}
            >
              <LogOut size={18} color="#FF4466" />
              <Text style={styles.leaveBtnText}>Lascia evento</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>

      <Modal
        visible={termsVisible}
        transparent
        animationType="none"
        onRequestClose={closeTerms}
      >
        <Pressable style={styles.modalOverlay} onPress={closeTerms}>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.modalCard,
                sheetStyle,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 24 },
              ]}
            >
              <Pressable onPress={() => {}}>
                <View style={styles.dragHandleWrap}>
                  <View style={[styles.dragHandle, { backgroundColor: colors.mutedForeground }]} />
                </View>
                <LinearGradient
                colors={[colors.gradientStart + "20", colors.gradientEnd + "20"]}
                style={styles.modalHeader}
              >
                <CameraIcon size={48} color={colors.gradientStart} />
              </LinearGradient>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Prima di caricare
              </Text>
              <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
                Le foto caricate su Piclo saranno visibili agli altri partecipanti. Non caricare contenuti inappropriati.
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
                    termsChecked
                      ? { borderWidth: 0, borderRadius: 6 }
                      : { backgroundColor: "transparent", borderColor: colors.mutedForeground, borderWidth: 2, borderRadius: 6 },
                  ]}
                >
                  {termsChecked ? (
                    <LinearGradient
                      colors={[colors.gradientStart, colors.gradientEnd]}
                      style={[StyleSheet.absoluteFill, { borderRadius: 6, alignItems: "center", justifyContent: "center" }]}
                    >
                      <Check size={14} color="#fff" />
                    </LinearGradient>
                  ) : null}
                </View>
                <Text style={[styles.checkboxLabel, { color: colors.foreground }]}>
                  Accetto i Termini per caricare le foto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!termsChecked) return;
                  setAcceptedTerms(true);
                  setTermsChecked(false);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  closeTerms();
                }}
                disabled={!termsChecked}
                style={{ borderRadius: 999, overflow: "hidden", opacity: termsChecked ? 1 : 0.4 }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.acceptBtn}
                >
                  <Text style={styles.acceptBtnText}>Continua</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeTerms} style={styles.cancelLink}>
                <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Annulla</Text>
              </TouchableOpacity>
            </Pressable>
            </Animated.View>
          </GestureDetector>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  coverHero: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 0,
  },
  coverFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
  },
  logoImage: { width: 100, height: 32 },
  guestId: {
    fontSize: 12,
    marginTop: 3,
    fontWeight: "500",
  },
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  scanBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  counterSection: {
    alignItems: "center",
    marginBottom: 44,
    gap: 6,
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  counterValue: {
    fontSize: 64,
    letterSpacing: 6,
    lineHeight: 72,
    fontWeight: "400",
  },
  counterBar: {
    height: 3,
    width: 80,
    borderRadius: 999,
    marginTop: 6,
  },
  cameraSection: {
    alignItems: "center",
    marginBottom: 28,
    gap: 14,
  },
  cameraBtnWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
  },
  cameraPulse: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraBtn: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBtnLabel: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  cameraHint: {
    fontSize: 13,
    fontWeight: "500",
  },
  galleryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  galleryBtnText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  progressSection: {
    padding: 18,
    gap: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  doneIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: {
    fontSize: 14,
    fontWeight: "600",
  },
  wallLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
  },
  wallLinkText: {
    fontSize: 15,
    fontWeight: "600",
  },
  wallLinkSub: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  viewOnlyBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  viewOnlyText: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  downloadPhotoBtn: {
    marginBottom: 0,
  },
  downloadPhotoBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  downloadPhotoBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.88)",
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 36,
  },
  modalCard: {
    borderWidth: 1,
    padding: 24,
    gap: 16,
    overflow: "hidden",
  },
  modalHeader: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
  },
  acceptBtn: {
    paddingVertical: 16,
    alignItems: "center",
  },
  acceptBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  cancelLink: {
    alignItems: "center",
    paddingTop: 4,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  dragHandleWrap: {
    alignItems: "center",
    paddingBottom: 12,
    marginTop: -4,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.35,
  },
  limitBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  limitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  limitTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  limitSub: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 17,
  },
  leaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  leaveBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF4466",
  },
});
