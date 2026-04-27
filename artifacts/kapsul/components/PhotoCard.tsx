import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
    scale.value = withSpring(1.03, {}, () => {
      scale.value = withSpring(1);
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
          backgroundColor: colors.card,
          borderColor: colors.border,
          width,
          borderRadius: colors.radius,
          overflow: "hidden",
        },
      ]}
    >
      <Image
        source={{ uri }}
        style={{ width, height }}
        resizeMode="cover"
      />

      {reported ? (
        <View
          style={[
            styles.reportedOverlay,
            { height, backgroundColor: "rgba(14,14,15,0.92)" },
          ]}
        >
          <Ionicons name="flag" size={22} color={colors.mutedForeground} />
          <Text style={[styles.reportedText, { color: colors.mutedForeground }]}>
            Segnalata
          </Text>
        </View>
      ) : null}

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.reactions}>
          {REACTIONS.map(emoji => (
            <TouchableOpacity
              key={emoji}
              onPress={() => handleReaction(emoji)}
              style={styles.reactionBtn}
            >
              <Text style={styles.emoji}>{emoji}</Text>
              {(reactions[emoji] ?? 0) > 0 && (
                <Text style={[styles.reactionCount, { color: colors.mutedForeground }]}>
                  {reactions[emoji]}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {!reported && (
          <TouchableOpacity onPress={handleReport} style={styles.reportBtn}>
            <Feather name="flag" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 10,
  },
  reportedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  reportedText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  reactions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  reactionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  emoji: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 11,
    fontWeight: "600",
  },
  reportBtn: {
    padding: 4,
  },
});
