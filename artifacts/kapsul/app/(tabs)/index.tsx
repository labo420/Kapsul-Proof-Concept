import { Camera, Plus, QrCode } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/contexts/EventContext";
import { PLAN_LIMITS } from "@/contexts/PlanContext";
import GradientButton from "@/components/GradientButton";
import GradientBadge from "@/components/GradientBadge";

const DELIVERY_LABELS: Record<string, string> = {
  party: "Party",
  morning_after: "Morning After",
  vault: "Vault",
};

const SPRING = { damping: 20, stiffness: 200, mass: 0.9 } as const;

function useFadeSlideIn(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(22);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 340 }));
    translateY.value = withDelay(delay, withSpring(0, SPRING));
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

function AnimatedCard({ index, children }: { index: number; children: React.ReactNode }) {
  const delay = 220 + index * 80;
  const style = useFadeSlideIn(delay);
  return <Animated.View style={style}>{children}</Animated.View>;
}

type SortBy = "createdAt" | "eventDate";

export default function HostScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events } = useEvents();
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === "createdAt") {
      return b.createdAt - a.createdAt;
    }
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    const aValid = !isNaN(dateA);
    const bValid = !isNaN(dateB);
    if (aValid && bValid) return dateB - dateA;
    if (aValid) return -1;
    if (bValid) return 1;
    return b.createdAt - a.createdAt;
  });

  const logoStyle = useFadeSlideIn(0);
  const createBtnStyle = useFadeSlideIn(110);
  const emptyStateStyle = useFadeSlideIn(220);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: topPad + 20,
          paddingBottom: bottomPad + 100,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Animated.View style={logoStyle}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoGradient}
            >
              <Text style={styles.logoText}>Piclo</Text>
            </LinearGradient>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              I tuoi eventi
            </Text>
          </Animated.View>

          <Animated.View style={createBtnStyle}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/create-event");
              }}
              style={{ borderRadius: 999, overflow: "hidden" }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createBtn}
              >
                <Plus size={18} color="#fff" />
                <Text style={styles.createBtnText}>Nuovo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {events.length === 0 ? (
          <Animated.View style={[styles.emptyState, emptyStateStyle]}>
            <LinearGradient
              colors={[colors.gradientStart + "30", colors.gradientEnd + "30"]}
              style={[styles.emptyIcon, { borderRadius: 28 }]}
            >
              <Camera size={44} color={colors.gradientStart} />
            </LinearGradient>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Crea il tuo primo{"\n"}evento
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Genera un QR code e lascia che gli ospiti carichino le foto automaticamente
            </Text>
            <GradientButton
              label="Crea evento"
              onPress={() => router.push("/create-event")}
              size="lg"
            />
          </Animated.View>
        ) : (
          <>
            <View style={styles.sortRow}>
              {(["createdAt", "eventDate"] as SortBy[]).map((opt) => {
                const active = sortBy === opt;
                const label = opt === "createdAt" ? "Data creazione" : "Data evento";
                return active ? (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.85}
                    style={{ borderRadius: 999, overflow: "hidden" }}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSortBy(opt);
                    }}
                  >
                    <LinearGradient
                      colors={[colors.gradientStart, colors.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.sortPill}
                    >
                      <Text style={styles.sortPillTextActive}>{label}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.7}
                    style={[
                      styles.sortPill,
                      styles.sortPillInactive,
                      { backgroundColor: colors.muted, borderColor: colors.border },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSortBy(opt);
                    }}
                  >
                    <Text style={[styles.sortPillTextInactive, { color: colors.mutedForeground }]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          <View style={styles.eventList}>
            {sortedEvents.map((event, index) => (
              <AnimatedCard key={event.id} index={index}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/event/${event.id}`);
                  }}
                  activeOpacity={0.8}
                  style={{
                    borderRadius: colors.radius,
                    overflow: "hidden",
                    shadowColor: colors.gradientStart,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <LinearGradient
                    colors={[colors.card, colors.muted]}
                    style={[
                      styles.eventCard,
                      {
                        borderColor: colors.gradientStart + "50",
                        borderRadius: colors.radius,
                      },
                    ]}
                  >
                    {event.coverImageUri ? (
                      <View style={[styles.cardCoverWrap, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}>
                        <Image
                          source={{ uri: event.coverImageUri }}
                          style={styles.cardCover}
                          contentFit="cover"
                        />
                        <LinearGradient
                          colors={["transparent", colors.card]}
                          style={styles.cardCoverFade}
                        />
                      </View>
                    ) : null}
                    <View style={styles.eventCardTop}>
                      <View style={styles.eventInfo}>
                        <Text style={[styles.eventName, { color: colors.foreground }]} numberOfLines={1}>
                          {event.name}
                        </Text>
                        <Text style={[styles.eventDate, { color: colors.mutedForeground }]}>
                          {event.date}
                        </Text>
                      </View>
                      <View style={{ gap: 6, alignItems: "flex-end" }}>
                        <GradientBadge
                          label={DELIVERY_LABELS[event.deliveryMode] ?? event.deliveryMode}
                          variant="soft"
                        />
                        <GradientBadge
                          label={PLAN_LIMITS[event.plan ?? "party"].label}
                        />
                        <LinearGradient
                          colors={[
                            event.themeGradientStart ?? "#6366F1",
                            event.themeGradientEnd ?? "#EC4899",
                          ]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.themeDot}
                        />
                      </View>
                    </View>
                    <View style={[styles.eventCardBottom, { borderTopColor: colors.border }]}>
                      <View style={styles.statItem}>
                        <Text style={[styles.photoCount, { color: colors.primary }]}>
                          {event.photoCount}
                        </Text>
                        <Text style={[styles.photoLabel, { color: colors.mutedForeground }]}>foto</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          router.push(`/qr/${event.id}`);
                        }}
                        style={{ borderRadius: 999, overflow: "hidden" }}
                      >
                        <LinearGradient
                          colors={[colors.gradientStart, colors.gradientEnd]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.qrBtn}
                        >
                          <QrCode size={14} color="#fff" />
                          <Text style={styles.qrBtnText}>QR</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </AnimatedCard>
            ))}
          </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  logoGradient: {
    borderRadius: 8,
    paddingHorizontal: 2,
    paddingVertical: 1,
    alignSelf: "flex-start",
    backgroundColor: "transparent",
  },
  logoText: {
    fontSize: 28,
    fontFamily: "LilitaOne_400Regular",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: "500",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 52,
    gap: 18,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  sortRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  sortPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  sortPillInactive: {
    borderWidth: 1,
  },
  sortPillTextActive: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  sortPillTextInactive: {
    fontSize: 13,
    fontWeight: "600",
  },
  eventList: {
    gap: 14,
  },
  eventCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  eventCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    gap: 12,
  },
  eventInfo: {
    flex: 1,
    gap: 4,
  },
  eventName: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  eventDate: {
    fontSize: 13,
    fontWeight: "500",
  },
  eventCardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  photoCount: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  photoLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  qrBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  qrBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  themeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  cardCoverWrap: {
    height: 100,
    overflow: "hidden",
    position: "relative",
  },
  cardCover: {
    width: "100%",
    height: "100%",
  },
  cardCoverFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
  },
});
