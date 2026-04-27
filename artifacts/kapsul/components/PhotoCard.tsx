import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

const REACTIONS = ["❤️", "🔥", "😂", "😮"];

interface PhotoCardProps {
  uri: string;
  height: number;
  width: number;
}

export default function PhotoCard({ uri, height, width }: PhotoCardProps) {
  const colors = useColors();
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [reported, setReported] = useState(false);
  const scale = useSharedValue(1);

  const handleReaction = (emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
    scale.value = withSpring(1.05, { damping: 8, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 180 });
    });
  };

  const handleReport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setReported(true);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        {
          width,
          borderRadius: colors.radius,
          overflow: "hidden",
        },
      ]}
    >
      <Image source={{ uri }} style={{ width, height }} resizeMode="cover" />

      {reported && (
        <View style={[styles.reportedOverlay, { height, backgroundColor: "rgba(8,6,15,0.92)" }]}>
          <Ionicons name="flag" size={24} color={colors.mutedForeground} />
          <Text style={[styles.reportedText, { color: colors.mutedForeground }]}>Segnalata</Text>
        </View>
      )}

      <LinearGradient
        colors={["transparent", "rgba(8,6,15,0.82)"]}
        style={styles.gradientOverlay}
      >
        <View style={styles.reactionRow}>
          <View style={styles.reactions}>
            {REACTIONS.map(emoji => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReaction(emoji)}
                style={styles.reactionBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.emoji}>{emoji}</Text>
                {(reactions[emoji] ?? 0) > 0 && (
                  <Text style={[styles.reactionCount, { color: "#fff" }]}>
                    {reactions[emoji]}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {!reported && (
            <TouchableOpacity onPress={handleReport} style={styles.reportBtn} activeOpacity={0.7}>
              <Feather name="flag" size={13} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    backgroundColor: "#130F1C",
  },
  reportedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 2,
  },
  reportedText: {
    fontSize: 12,
    fontWeight: "500",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 28,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  reactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reactions: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  reactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  emoji: {
    fontSize: 15,
  },
  reactionCount: {
    fontSize: 11,
    fontWeight: "700",
  },
  reportBtn: {
    padding: 4,
  },
});
