import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

const MONTHS_IT = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export function formatDateIT(d: Date): string {
  return `${d.getDate()} ${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;
}

function todayMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
  hasError?: boolean;
  errorMessage?: string;
}

export default function EventDatePicker({ value, onChange, hasError, errorMessage }: Props) {
  const colors = useColors();
  const [showPicker, setShowPicker] = useState(false);
  const today = todayMidnight();

  const handleNativeChange = (_e: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selected) onChange(selected);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPicker(true);
  };

  const hasValue = value !== null;
  const borderColor = hasError
    ? "#FF4466"
    : hasValue
    ? colors.primary + "70"
    : colors.border;

  if (Platform.OS === "web") {
    const inputVal = value
      ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`
      : "";
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    return (
      <View>
        <View
          style={[
            styles.field,
            {
              backgroundColor: colors.input,
              borderColor,
              borderRadius: colors.radius,
            },
          ]}
        >
          <CalendarDays size={18} color={colors.mutedForeground} />
          <input
            type="date"
            value={inputVal}
            min={todayStr}
            onChange={(e) => {
              const parts = e.target.value.split("-");
              if (parts.length === 3) {
                const d = new Date(
                  Number(parts[0]),
                  Number(parts[1]) - 1,
                  Number(parts[2])
                );
                onChange(d);
              }
            }}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: hasValue ? colors.foreground : colors.mutedForeground,
              fontSize: 15,
              fontWeight: "500",
              cursor: "pointer",
            }}
          />
        </View>
        {hasError && errorMessage && (
          <Text style={[styles.errorText, { color: "#FF4466" }]}>{errorMessage}</Text>
        )}
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[
          styles.field,
          {
            backgroundColor: colors.input,
            borderColor,
            borderRadius: colors.radius,
          },
        ]}
      >
        <CalendarDays size={18} color={hasValue ? colors.primary : colors.mutedForeground} />
        <Text
          style={[
            styles.fieldText,
            { color: hasValue ? colors.foreground : colors.mutedForeground },
          ]}
        >
          {value ? formatDateIT(value) : "Seleziona una data"}
        </Text>
      </TouchableOpacity>

      {hasError && errorMessage && (
        <Text style={[styles.errorText, { color: "#FF4466" }]}>{errorMessage}</Text>
      )}

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={value ?? today}
          mode="date"
          display="calendar"
          minimumDate={today}
          onChange={handleNativeChange}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setShowPicker(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Seleziona data</Text>
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={{ borderRadius: 999, overflow: "hidden" }}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  style={styles.doneBtn}
                >
                  <Text style={styles.doneBtnText}>Fatto</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={value ?? today}
              mode="date"
              display="spinner"
              minimumDate={today}
              onChange={handleNativeChange}
              locale="it-IT"
              themeVariant="dark"
              style={{ width: "100%" }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
  },
  fieldText: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    paddingBottom: 40,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  doneBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
  },
  doneBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
