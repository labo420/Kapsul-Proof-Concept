import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
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

const STEPS = ["Dettagli", "Modalità", "Piano"];

export default function CreateEventScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { createEvent } = useEvents();
  const { hasUsedFreeTrial, markFreeTrialUsed } = usePlan();

  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("party");
  const [vaultHours, setVaultHours] = useState(24);
  const [focusedField, setFocusedField] = useState<"name" | "date" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<EventPlan>("party");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const canProceed =
    step === 0
      ? eventName.trim().length > 0 && eventDate.trim().length > 0
      : true;

  const handleNext = async () => {
    Keyboard.dismiss();
    if (step < 2) {
      setStep(step + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      if (selectedPlan === "free") {
        await markFreeTrialUsed();
      }
      const event = createEvent({
        name: eventName.trim(),
        date: eventDate.trim(),
        deliveryMode,
        vaultHours: deliveryMode === "vault" ? vaultHours : undefined,
        plan: selectedPlan,
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
            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
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
                    <Ionicons name="checkmark" size={11} color="#fff" />
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
                Di che evento{"\n"}si tratta? 🎉
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
                <Text
                  style={[styles.inputLabel, { color: colors.mutedForeground }]}
                >
                  DATA
                </Text>
                <TextInput
                  value={eventDate}
                  onChangeText={setEventDate}
                  placeholder="es. 28 Aprile 2026"
                  placeholderTextColor={colors.mutedForeground}
                  onFocus={() => setFocusedField("date")}
                  onBlur={() => setFocusedField(null)}
                  style={[
                    styles.input,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.input,
                      borderColor:
                        focusedField === "date"
                          ? colors.gradientEnd
                          : eventDate.trim()
                          ? colors.primary + "70"
                          : colors.border,
                      borderRadius: colors.radius,
                      shadowColor:
                        focusedField === "date"
                          ? colors.gradientEnd
                          : "transparent",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: focusedField === "date" ? 0.45 : 0,
                      shadowRadius: 8,
                    },
                  ]}
                  returnKeyType="done"
                  onSubmitEditing={canProceed ? handleNext : undefined}
                />
              </View>
            </View>
          ) : step === 1 ? (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Quando sbloccare{"\n"}le foto? 🔓
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
                vaultHours={vaultHours}
                onVaultHoursChange={setVaultHours}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Scegli il piano{"\n"}per questo evento 🚀
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
                <Ionicons
                  name="lock-closed"
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
                {step === 2
                  ? selectedPlan === "free"
                    ? "Inizia gratis 🎁"
                    : `Paga ${PLAN_LIMITS[selectedPlan].price} e crea evento`
                  : step === 1
                  ? "Avanti"
                  : "Avanti"}
              </Text>
              <Feather
                name={step === 2 ? "check" : "arrow-right"}
                size={18}
                color="#fff"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 32,
    gap: 0,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepDot: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { fontSize: 12, fontWeight: "800", color: "#fff" },
  stepLabel: { fontSize: 13, fontWeight: "600" },
  stepLineWrap: {
    width: 40,
    height: 3,
    marginHorizontal: 6,
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
  inputGroup: { gap: 8 },
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
});
