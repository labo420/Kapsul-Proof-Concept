import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import DeliveryModeSelector from "@/components/DeliveryModeSelector";

const STEPS = ["Dettagli", "Modalità"];

export default function CreateEventScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { createEvent } = useEvents();
  const [step, setStep] = useState(0);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("party");
  const [vaultHours, setVaultHours] = useState(24);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const canProceed = step === 0 ? eventName.trim().length > 0 && eventDate.trim().length > 0 : true;

  const handleNext = () => {
    Keyboard.dismiss();
    if (step === 0) {
      setStep(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      const event = createEvent({
        name: eventName.trim(),
        date: eventDate.trim(),
        deliveryMode,
        vaultHours: deliveryMode === "vault" ? vaultHours : undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(`/qr/${event.id}`);
    }
  };

  const handleBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep(0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.topBar, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: colors.foreground }]}>
          Nuovo evento
        </Text>
        <View style={styles.backBtn} />
      </View>

      <View style={[styles.stepsRow, { borderBottomColor: colors.border }]}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: i <= step ? colors.primary : colors.muted,
                  borderColor: i <= step ? colors.primary : colors.border,
                },
              ]}
            >
              {i < step ? (
                <Ionicons name="checkmark" size={11} color={colors.primaryForeground} />
              ) : (
                <Text style={[styles.stepNum, { color: i === step ? colors.primaryForeground : colors.mutedForeground }]}>
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                { color: i <= step ? colors.foreground : colors.mutedForeground },
              ]}
            >
              {s}
            </Text>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, { backgroundColor: i < step ? colors.primary : colors.border }]} />
            )}
          </View>
        ))}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: bottomPad + 100,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 0 ? (
          <View style={styles.form}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Di che evento si tratta?
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
              Dai un nome al tuo evento e scegli la data
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>
                NOME EVENTO
              </Text>
              <TextInput
                value={eventName}
                onChangeText={setEventName}
                placeholder="es. Matrimonio Luca & Sara"
                placeholderTextColor={colors.mutedForeground}
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.input,
                    borderColor: eventName.trim() ? colors.primary + "66" : colors.border,
                    borderRadius: colors.radius,
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
              <TextInput
                value={eventDate}
                onChangeText={setEventDate}
                placeholder="es. 28 Aprile 2026"
                placeholderTextColor={colors.mutedForeground}
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.input,
                    borderColor: eventDate.trim() ? colors.primary + "66" : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
                returnKeyType="done"
                onSubmitEditing={canProceed ? handleNext : undefined}
              />
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Quando sbloccare le foto?
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
              Scegli quando i tuoi ospiti potranno vedere le foto caricate
            </Text>
            <DeliveryModeSelector
              selected={deliveryMode}
              onSelect={setDeliveryMode}
              vaultHours={vaultHours}
              onVaultHoursChange={setVaultHours}
            />
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
          style={[
            styles.nextBtn,
            {
              backgroundColor: canProceed ? colors.primary : colors.muted,
              borderRadius: colors.radius,
            },
          ]}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.nextBtnText,
              { color: canProceed ? colors.primaryForeground : colors.mutedForeground },
            ]}
          >
            {step === 0 ? "Avanti" : "Crea evento"}
          </Text>
          <Feather
            name={step === 0 ? "arrow-right" : "check"}
            size={18}
            color={canProceed ? colors.primaryForeground : colors.mutedForeground}
          />
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
  topTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    gap: 0,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  stepNum: {
    fontSize: 11,
    fontWeight: "700",
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  stepLine: {
    width: 40,
    height: 1,
    marginHorizontal: 8,
  },
  form: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 28,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
