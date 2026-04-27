import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const handleReaction = (emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReactions(prev => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }));
    scale.value = withSpring(1.05, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const handleReport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    opacity.value = withTiming(0, { duration: 400 });
    setTimeout(() => setReported(true), 400);
  };

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (reported) return null;

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
      <View style={styles.footer}>
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
        <TouchableOpacity onPress={handleReport} style={styles.reportBtn}>
          <Feather name="flag" size={14} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
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
