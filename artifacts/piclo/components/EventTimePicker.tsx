import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Clock } from "lucide-react-native";
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

export function formatTimeHHMM(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface Props {
  value: Date | null;
  onChange: (date: Date) => void;
}

export default function EventTimePicker({ value, onChange }: Props) {
  const colors = useColors();
  const [showPicker, setShowPicker] = useState(false);

  const fallback = new Date();
  fallback.setHours(20, 0, 0, 0);

  const handleNativeChange = (_e: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selected) onChange(selected);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPicker(true);
  };

  const hasValue = value !== null;

  if (Platform.OS === "web") {
    const inputVal = value ? formatTimeHHMM(value) : "";

    return (
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.input,
            borderColor: hasValue ? colors.primary + "70" : colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Clock size={18} color={colors.mutedForeground} />
        <input
          type="time"
          value={inputVal}
          onChange={(e) => {
            const parts = e.target.value.split(":");
            if (parts.length >= 2) {
              const d = new Date();
              d.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
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
            borderColor: hasValue ? colors.primary + "70" : colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Clock size={18} color={hasValue ? colors.primary : colors.mutedForeground} />
        <Text
          style={[
            styles.fieldText,
            { color: hasValue ? colors.foreground : colors.mutedForeground },
          ]}
        >
          {value ? formatTimeHHMM(value) : "Seleziona orario"}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={value ?? fallback}
          mode="time"
          display="spinner"
          is24Hour
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
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Orario di inizio</Text>
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
              value={value ?? fallback}
              mode="time"
              display="spinner"
              is24Hour
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
