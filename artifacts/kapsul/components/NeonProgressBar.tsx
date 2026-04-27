import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface NeonProgressBarProps {
  progress: number;
  label?: string;
}

const CHARS = "ABCDEF0123456789";

function randomHex(len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s;
}

export default function NeonProgressBar({ progress, label }: NeonProgressBarProps) {
  const colors = useColors();
  const width = useSharedValue(0);
  const [hexStr, setHexStr] = React.useState(randomHex(16));

  useEffect(() => {
    width.value = withTiming(progress, {
      duration: 400,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setHexStr(randomHex(16));
      }, 80);
      return () => clearInterval(interval);
    }
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as any,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.primary, fontFamily: "SpaceMono_400Regular" }]}>
          {label ?? "UPLOADING..."}
        </Text>
        <Text style={[styles.pct, { color: colors.primary, fontFamily: "SpaceMono_400Regular" }]}>
          {Math.round(progress)}%
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.muted, borderColor: colors.primary + "33" }]}>
        <Animated.View
          style={[
            styles.fill,
            barStyle,
            { backgroundColor: colors.primary },
          ]}
        />
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.scanlines} />
        </View>
      </View>
      <Text
        style={[styles.hexText, { color: colors.mutedForeground, fontFamily: "SpaceMono_400Regular" }]}
        numberOfLines={1}
      >
        {`> ${hexStr}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  pct: {
    fontSize: 11,
    letterSpacing: 1,
  },
  track: {
    height: 8,
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 1,
  },
  fill: {
    height: "100%",
    borderRadius: 2,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  scanlines: {
    flex: 1,
    opacity: 0.08,
  },
  hexText: {
    fontSize: 10,
    letterSpacing: 1,
  },
});
