import { ArrowRight, Camera as CameraIcon, Check, ChevronLeft, ChevronRight, Download, Eye, EyeOff, ImageIcon, Images, Lock, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useEvents, type DeliveryMode } from "@/contexts/EventContext";
import { usePlan, PLAN_LIMITS, type EventPlan } from "@/contexts/PlanContext";
import DeliveryModeSelector from "@/components/DeliveryModeSelector";
import ScreenTransition from "@/components/ScreenTransition";
import PlanCard from "@/components/PlanCard";
import GradientPicker from "@/components/GradientPicker";
import EventDatePicker, { formatDateIT } from "@/components/EventDatePicker";
import EventTimePicker, { formatTimeHHMM } from "@/components/EventTimePicker";

const STEPS = ["Dettagli", "Tema", "Modalità", "Permessi", "Piano"];

export default function CreateEventScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { createEvent } = useEvents();
  const { hasUsedFreeTrial, markFreeTrialUsed } = usePlan();

  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventDateObj, setEventDateObj] = useState<Date | null>(null);
  const [eventTimeObj, setEventTimeObj] = useState<Date | null>(null);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("morning_after");
  const [focusedField, setFocusedField] = useState<"name" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<EventPlan>("party");
  const [gradientStart, setGradientStart] = useState("#6366F1");
  const [gradientEnd, setGradientEnd] = useState("#EC4899");
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [showCoverSheet, setShowCoverSheet] = useState(false);
  const [guestsCanView, setGuestsCanView] = useState(true);
  const [guestsCanDownload, setGuestsCanDownload] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const LAST_STEP = STEPS.length - 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateIsInPast = eventDateObj !== null && eventDateObj < today;

  const canProceed =
    step === 0
      ? eventName.trim().length > 0 && eventDateObj !== null && !dateIsInPast && eventTimeObj !== null
      : true;

  const handleNext = async () => {
    Keyboard.dismiss();
    if (step < LAST_STEP) {
      setStep(step + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      if (selectedPlan === "free") {
        await markFreeTrialUsed();
      }
      const event = await createEvent({
        name: eventName.trim(),
        date: eventDateObj ? formatDateIT(eventDateObj) : "",
        startTime: eventTimeObj ? formatTimeHHMM(eventTimeObj) : null,
        deliveryMode,
        plan: selectedPlan,
        themeGradientStart: gradientStart,
        themeGradientEnd: gradientEnd,
        coverImageUri,
        guestsCanView,
        guestsCanDownload,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/qr/${event.id}`);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep(step - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const pickCoverFromGallery = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setCoverImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const pickCoverFromCamera = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setCoverImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePickCover = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annulla", "Fotocamera", "Scegli dalla galleria"],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) pickCoverFromCamera();
          else if (index === 2) pickCoverFromGallery();
        }
      );
    } else {
      setShowCoverSheet(true);
    }
  };

  const plans: EventPlan[] = hasUsedFreeTrial
    ? ["party", "pro"]
    : ["free", "party", "pro"];

  return (
    <ScreenTransition>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="light-content" />

        <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChevronLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.topTitle, { color: colors.foreground }]}>
            Nuovo evento
          </Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.progressStrip}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.progressItem}>
              {i <= step ? (
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.stepDot, { borderRadius: 999 }]}
                >
                  {i < step ? (
                    <Check size={11} color="#fff" />
                  ) : (
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  )}
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.stepDot,
                    { backgroundColor: colors.muted, borderRadius: 999 },
                  ]}
                >
                  <Text
                    style={[styles.stepNum, { color: colors.mutedForeground }]}
                  >
                    {i + 1}
                  </Text>
                </View>
              )}
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color:
                      i <= step ? colors.foreground : colors.mutedForeground,
                  },
                ]}
              >
                {s}
              </Text>
              {i < STEPS.length - 1 && (
                <View style={styles.stepLineWrap}>
                  <View
                    style={[
                      styles.stepLineBg,
                      { backgroundColor: colors.border },
                    ]}
                  />
                  {i < step && (
                    <LinearGradient
                      colors={[colors.gradientStart, colors.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.stepLineFill}
                    />
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingBottom: bottomPad + 110 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 ? (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Di che evento{"\n"}si tratta?
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                Dai un nome all'evento e scegli la data
              </Text>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.mutedForeground }]}
                >
                  NOME EVENTO
                </Text>
                <TextInput
                  value={eventName}
                  onChangeText={setEventName}
                  placeholder="es. Matrimonio Luca & Sara"
                  placeholderTextColor={colors.mutedForeground}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.input,
                      borderColor:
                        focusedField === "name"
                          ? colors.gradientStart
                          : eventName.trim()
                          ? colors.primary + "70"
                          : colors.border,
                      borderRadius: colors.radius,
                      shadowColor:
                        focusedField === "name"
                          ? colors.gradientStart
                          : "transparent",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: focusedField === "name" ? 0.45 : 0,
                      shadowRadius: 8,
                    },
                  ]}
                  returnKeyType="next"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  DATA
                </Text>
                <EventDatePicker
                  value={eventDateObj}
                  onChange={setEventDateObj}
                  hasError={dateIsInPast}
                  errorMessage="La data deve essere nel futuro"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  ORA DI INIZIO
                </Text>
                <EventTimePicker
                  value={eventTimeObj}
                  onChange={setEventTimeObj}
                />
              </View>
            </View>
          ) : step === 1 ? (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Scegli il look{"\n"}dell'evento
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                I colori e la foto che vedranno i tuoi ospiti
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  FOTO COPERTINA (opzionale)
                </Text>
                {coverImageUri ? (
                  <View style={styles.coverPreviewWrap}>
                    <Image
                      source={{ uri: coverImageUri }}
                      style={[styles.coverPreview, { borderRadius: colors.radius }]}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      onPress={() => setCoverImageUri(null)}
                      style={[styles.coverRemoveBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                    >
                      <X size={16} color={colors.foreground} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handlePickCover}
                    style={[
                      styles.coverPickerBtn,
                      {
                        backgroundColor: colors.input,
                        borderColor: colors.border,
                        borderRadius: colors.radius,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[colors.gradientStart + "30", colors.gradientEnd + "30"]}
                      style={styles.coverPickerIcon}
                    >
                      <ImageIcon size={22} color={colors.primary} />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.coverPickerTitle, { color: colors.foreground }]}>
                        Aggiungi foto copertina
                      </Text>
                      <Text style={[styles.coverPickerSub, { color: colors.mutedForeground }]}>
                        Visibile agli ospiti quando entrano
                      </Text>
                    </View>
                    <ChevronRight size={16} color={colors.mutedForeground} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                  GRADIENTE COLORI
                </Text>
                <GradientPicker
                  colorStart={gradientStart}
                  colorEnd={gradientEnd}
                  onChangeStart={setGradientStart}
                  onChangeEnd={setGradientEnd}
                />
              </View>
            </View>
          ) : step === 2 ? (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Come condividi{"\n"}le foto?
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                Scegli quando gli ospiti potranno vedere le foto
              </Text>
              <DeliveryModeSelector
                selected={deliveryMode}
                onSelect={setDeliveryMode}
              />
            </View>
          ) : step === 3 ? (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Permessi{"\n"}degli ospiti
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                Decidi cosa possono fare gli ospiti con le foto
              </Text>
              <View style={[styles.permissionsCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setGuestsCanView(v => !v);
                  }}
                  activeOpacity={0.7}
                  style={styles.permissionRow}
                >
                  <View style={[styles.permissionIcon, { backgroundColor: guestsCanView ? colors.gradientStart + "22" : colors.muted }]}>
                    {guestsCanView ? (
                      <Eye size={18} color={colors.gradientStart} />
                    ) : (
                      <EyeOff size={18} color={colors.mutedForeground} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.permissionTitle, { color: colors.foreground }]}>
                      Ospiti vedono tutte le foto
                    </Text>
                    <Text style={[styles.permissionSub, { color: colors.mutedForeground }]}>
                      {guestsCanView ? "Galleria completa visibile a tutti" : "Ogni ospite vede solo le proprie foto"}
                    </Text>
                  </View>
                  <Switch
                    value={guestsCanView}
                    onValueChange={(v) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setGuestsCanView(v);
                    }}
                    trackColor={{ false: colors.border, true: colors.gradientStart + "88" }}
                    thumbColor={guestsCanView ? colors.gradientStart : colors.mutedForeground}
                  />
                </TouchableOpacity>
                <View style={[styles.permissionDivider, { backgroundColor: colors.border }]} />
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setGuestsCanDownload(v => !v);
                  }}
                  activeOpacity={0.7}
                  style={styles.permissionRow}
                >
                  <View style={[styles.permissionIcon, { backgroundColor: guestsCanDownload ? colors.gradientStart + "22" : colors.muted }]}>
                    <Download size={18} color={guestsCanDownload ? colors.gradientStart : colors.mutedForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.permissionTitle, { color: colors.foreground }]}>
                      Ospiti possono scaricare
                    </Text>
                    <Text style={[styles.permissionSub, { color: colors.mutedForeground }]}>
                      {guestsCanDownload ? "Download abilitato per tutti" : "Download disabilitato per gli ospiti"}
                    </Text>
                  </View>
                  <Switch
                    value={guestsCanDownload}
                    onValueChange={(v) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setGuestsCanDownload(v);
                    }}
                    trackColor={{ false: colors.border, true: colors.gradientStart + "88" }}
                    thumbColor={guestsCanDownload ? colors.gradientStart : colors.mutedForeground}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Scegli il piano{"\n"}per questo evento
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: colors.mutedForeground },
                ]}
              >
                Pagamento una tantum. Nessun abbonamento.
              </Text>

              <View style={{ gap: 12 }}>
                {plans.map((plan) => (
                  <PlanCard
                    key={plan}
                    plan={plan}
                    limits={PLAN_LIMITS[plan]}
                    selected={selectedPlan === plan}
                    onSelect={() => {
                      setSelectedPlan(plan);
                      Haptics.selectionAsync();
                    }}
                    badge={plan === "pro" ? "PIÙ POPOLARE" : undefined}
                    disabled={plan === "free" && hasUsedFreeTrial}
                  />
                ))}
              </View>

              <View
                style={[
                  styles.infoBox,
                  { backgroundColor: colors.muted, borderColor: colors.border },
                ]}
              >
                <Lock
                  size={14}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[styles.infoText, { color: colors.mutedForeground }]}
                >
                  Il pagamento è simulato in questa demo. Nessun addebito reale.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.footer,
            {
              paddingBottom: bottomPad + 24,
              borderTopColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceed}
            style={{
              borderRadius: 999,
              overflow: "hidden",
              opacity: canProceed ? 1 : 0.35,
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>
                {step === LAST_STEP
                  ? selectedPlan === "free"
                    ? "Inizia gratis"
                    : `Paga ${PLAN_LIMITS[selectedPlan].price} e crea evento`
                  : "Avanti"}
              </Text>
              {step === LAST_STEP ? (
                <Check size={18} color="#fff" />
              ) : (
                <ArrowRight size={18} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showCoverSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCoverSheet(false)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setShowCoverSheet(false)}
        />
        <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text style={[styles.sheetTitle, { color: colors.foreground }]}>
            Foto copertina
          </Text>
          <TouchableOpacity
            style={[styles.sheetOption, { borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => {
              setShowCoverSheet(false);
              pickCoverFromCamera();
            }}
          >
            <LinearGradient
              colors={[colors.gradientStart + "30", colors.gradientEnd + "30"]}
              style={styles.sheetOptionIcon}
            >
              <CameraIcon size={22} color={colors.primary} />
            </LinearGradient>
            <Text style={[styles.sheetOptionText, { color: colors.foreground }]}>
              Fotocamera
            </Text>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sheetOption, { borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => {
              setShowCoverSheet(false);
              pickCoverFromGallery();
            }}
          >
            <LinearGradient
              colors={[colors.gradientStart + "30", colors.gradientEnd + "30"]}
              style={styles.sheetOptionIcon}
            >
              <Images size={22} color={colors.primary} />
            </LinearGradient>
            <Text style={[styles.sheetOptionText, { color: colors.foreground }]}>
              Scegli dalla galleria
            </Text>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sheetCancel, { backgroundColor: colors.muted }]}
            activeOpacity={0.7}
            onPress={() => setShowCoverSheet(false)}
          >
            <Text style={[styles.sheetCancelText, { color: colors.mutedForeground }]}>
              Annulla
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScreenTransition>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: { width: 40 },
  topTitle: { fontSize: 17, fontWeight: "700" },
  progressStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 0,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepDot: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { fontSize: 12, fontWeight: "800", color: "#fff" },
  stepLabel: { fontSize: 11, fontWeight: "600" },
  stepLineWrap: {
    width: 28,
    height: 3,
    marginHorizontal: 4,
    overflow: "hidden",
    borderRadius: 999,
    position: "relative",
  },
  stepLineBg: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
  },
  stepLineFill: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
  },
  form: { gap: 24 },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "500",
    marginTop: -8,
  },
  inputGroup: { gap: 10 },
  inputLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: "500",
  },
  coverPickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  coverPickerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  coverPickerTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  coverPickerSub: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  coverPreviewWrap: {
    position: "relative",
  },
  coverPreview: {
    width: "100%",
    height: 160,
  },
  coverRemoveBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    gap: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  sheetOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  sheetCancel: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
  permissionsCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  permissionSub: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 2,
  },
  permissionDivider: {
    height: 1,
    marginHorizontal: 16,
  },
});
