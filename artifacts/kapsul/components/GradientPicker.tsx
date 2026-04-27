import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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
import { HueSaturationValuePicker } from "react-native-reanimated-color-picker";
import { useColors } from "@/hooks/useColors";

type TwoOrMoreColors = [string, string, ...string[]];

const QUICK_PRESETS = [
  { emoji: "🖤", name: "Kapsul", start: "#8B5CF6", end: "#EC4899" },
  { emoji: "✨", name: "Oro & Rosa", start: "#D4AF37", end: "#F4A0B5" },
  { emoji: "🔥", name: "Fuoco", start: "#F59E0B", end: "#F97316" },
  { emoji: "🌊", name: "Oceano", start: "#06B6D4", end: "#84CC16" },
  { emoji: "🔵", name: "Notte Blu", start: "#3B82F6", end: "#06B6D4" },
  { emoji: "🌸", name: "Rosa & Viola", start: "#F472B6", end: "#A855F7" },
  { emoji: "🍋", name: "Limone", start: "#FDE047", end: "#86EFAC" },
  { emoji: "❄️", name: "Ghiaccio", start: "#BAE6FD", end: "#E0E7FF" },
];

function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)        { r = c; g = x; b = 0; }
  else if (h < 120)  { r = x; g = c; b = 0; }
  else if (h < 180)  { r = 0; g = c; b = x; }
  else if (h < 240)  { r = 0; g = x; b = c; }
  else if (h < 300)  { r = x; g = 0; b = c; }
  else               { r = c; g = 0; b = x; }
  const toHex = (n: number) =>
    Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsv(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return [0, 1, 1];
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta > 0) {
    if (max === r) h = ((g - b) / delta + 6) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : delta / max;
  return [h, s, max];
}

interface PickerSheetProps {
  initialColor: string;
  colorStart: string;
  colorEnd: string;
  onLiveChange: (hex: string) => void;
  onConfirm: (hex: string) => void;
  onCancel: () => void;
}

function ColorPickerSheet({
  initialColor,
  colorStart,
  colorEnd,
  onLiveChange,
  onConfirm,
  onCancel,
}: PickerSheetProps) {
  const colors = useColors();
  const [currentHex, setCurrentHex] = useState(initialColor);
  const [h0, s0, v0] = hexToHsv(initialColor);

  const handleChange = ({ h, s, v }: { h: number; s: number; v: number }) => {
    const hex = hsvToHex(h, s, v);
    setCurrentHex(hex);
    onLiveChange(hex);
  };

  return (
    <View style={[styles.pickerSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.sheetHandle}>
        <View style={[styles.handleBar, { backgroundColor: colors.mutedForeground }]} />
      </View>

      <View style={styles.previewRow}>
        <View style={[styles.colorPreviewBig, { backgroundColor: currentHex }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.hexLabel, { color: colors.mutedForeground }]}>HEX</Text>
          <Text style={[styles.hexValue, { color: colors.foreground }]}>
            {currentHex.toUpperCase()}
          </Text>
        </View>
      </View>

      <HueSaturationValuePicker
        wheelStyle={styles.colorWheel}
        sliderStyle={styles.colorWheelSlider}
        initialHue={h0}
        initialSaturation={s0}
        initialValue={v0}
        onColorChange={handleChange}
        onColorChangeComplete={handleChange}
      />

      <View style={styles.pickerButtons}>
        <TouchableOpacity
          onPress={onCancel}
          style={[styles.cancelBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Annulla</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onConfirm(currentHex)}
          style={{ flex: 1, borderRadius: 999, overflow: "hidden" }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colorStart, colorEnd] as TwoOrMoreColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmBtn}
          >
            <Text style={styles.confirmBtnText}>Conferma</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface Props {
  colorStart: string;
  colorEnd: string;
  onChangeStart: (color: string) => void;
  onChangeEnd: (color: string) => void;
}

export default function GradientPicker({ colorStart, colorEnd, onChangeStart, onChangeEnd }: Props) {
  const colors = useColors();
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [savedStart, setSavedStart] = useState(colorStart);
  const [savedEnd, setSavedEnd] = useState(colorEnd);

  const openPicker = (which: "start" | "end") => {
    setSavedStart(colorStart);
    setSavedEnd(colorEnd);
    setShowPicker(which);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleLiveChange = (hex: string) => {
    if (showPicker === "start") onChangeStart(hex);
    else if (showPicker === "end") onChangeEnd(hex);
  };

  const handleConfirm = (hex: string) => {
    if (showPicker === "start") onChangeStart(hex);
    else if (showPicker === "end") onChangeEnd(hex);
    setShowPicker(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCancel = () => {
    onChangeStart(savedStart);
    onChangeEnd(savedEnd);
    setShowPicker(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colorStart, colorEnd] as TwoOrMoreColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.previewBar}
      />

      <View style={styles.swatchRow}>
        <TouchableOpacity
          style={styles.swatchWrap}
          onPress={() => openPicker("start")}
          activeOpacity={0.8}
        >
          <View style={[styles.swatch, { backgroundColor: colorStart }]}>
            <Ionicons name="color-palette" size={18} color="#fff" />
          </View>
          <Text style={[styles.swatchLabel, { color: colors.mutedForeground }]}>Colore 1</Text>
        </TouchableOpacity>

        <View style={styles.arrowWrap}>
          <LinearGradient
            colors={[colorStart, colorEnd] as TwoOrMoreColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.arrowLine}
          />
          <Ionicons name="arrow-forward" size={16} color={colors.mutedForeground} />
        </View>

        <TouchableOpacity
          style={styles.swatchWrap}
          onPress={() => openPicker("end")}
          activeOpacity={0.8}
        >
          <View style={[styles.swatch, { backgroundColor: colorEnd }]}>
            <Ionicons name="color-palette" size={18} color="#fff" />
          </View>
          <Text style={[styles.swatchLabel, { color: colors.mutedForeground }]}>Colore 2</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          setShowPresets((v) => !v);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={[styles.presetsToggle, { borderColor: colors.border, backgroundColor: colors.muted }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.presetsToggleText, { color: colors.mutedForeground }]}>
          Suggerimenti rapidi
        </Text>
        <Ionicons
          name={showPresets ? "chevron-up" : "chevron-down"}
          size={14}
          color={colors.mutedForeground}
        />
      </TouchableOpacity>

      {showPresets && (
        <View style={styles.presetsGrid}>
          {QUICK_PRESETS.map((p) => (
            <TouchableOpacity
              key={p.name}
              onPress={() => {
                onChangeStart(p.start);
                onChangeEnd(p.end);
                Haptics.selectionAsync();
              }}
              activeOpacity={0.8}
              style={styles.presetCard}
            >
              <LinearGradient
                colors={[p.start, p.end] as TwoOrMoreColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.presetGradient}
              />
              <Text style={styles.presetEmoji}>{p.emoji}</Text>
              <Text style={[styles.presetName, { color: colors.mutedForeground }]} numberOfLines={1}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        visible={showPicker !== null}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancel}>
          <Pressable onPress={() => {}}>
            {showPicker !== null && (
              <ColorPickerSheet
                initialColor={showPicker === "start" ? savedStart : savedEnd}
                colorStart={colorStart}
                colorEnd={colorEnd}
                onLiveChange={handleLiveChange}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  previewBar: {
    height: 64,
    borderRadius: 16,
  },
  swatchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  swatchWrap: {
    alignItems: "center",
    gap: 8,
  },
  swatch: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  swatchLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  arrowWrap: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  arrowLine: {
    height: 2,
    width: "100%",
    borderRadius: 999,
  },
  presetsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "center",
  },
  presetsToggleText: {
    fontSize: 13,
    fontWeight: "600",
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  presetCard: {
    width: "22%",
    alignItems: "center",
    gap: 6,
  },
  presetGradient: {
    width: "100%",
    aspectRatio: 2,
    borderRadius: 8,
  },
  presetEmoji: {
    fontSize: 16,
  },
  presetName: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  pickerSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 44 : 24,
    gap: 20,
  },
  sheetHandle: {
    alignItems: "center",
    marginBottom: 4,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  colorPreviewBig: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  hexLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  hexValue: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "SpaceMono_400Regular",
    letterSpacing: 1,
  },
  colorWheel: {
    width: "100%",
    aspectRatio: 1,
  },
  colorWheelSlider: {
    width: "100%",
    height: 36,
    marginTop: 8,
    borderRadius: 18,
  },
  pickerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
  confirmBtn: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#fff",
  },
});
