import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
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
import { useGuest } from "@/contexts/GuestContext";
import { useEvents } from "@/contexts/EventContext";
import { usePlan } from "@/contexts/PlanContext";

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

function SectionHeader({ label }: { label: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>
      {label}
    </Text>
  );
}

function SettingRow({
  icon,
  label,
  right,
  onPress,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[
        styles.settingRow,
        {
          backgroundColor: colors.card,
          borderBottomColor: isLast ? "transparent" : colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.settingIconWrap,
          { backgroundColor: colors.gradientStart + "22" },
        ]}
      >
        {icon}
      </View>
      <Text style={[styles.settingLabel, { color: colors.foreground }]}>
        {label}
      </Text>
      <View style={styles.settingRight}>
        {right ?? (
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { guestId, resetGuest } = useGuest();
  const { events, resetEvents } = useEvents();
  const { hasUsedFreeTrial, resetPlan } = usePlan();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const style0 = useFadeSlideIn(0);
  const style1 = useFadeSlideIn(80);
  const style2 = useFadeSlideIn(160);
  const style3 = useFadeSlideIn(240);
  const style4 = useFadeSlideIn(320);

  const totalPhotos = events.reduce((sum, e) => sum + e.photoCount, 0);
  const partyEvents = events.filter((e) => e.plan === "party").length;
  const proEvents = events.filter((e) => e.plan === "pro").length;

  const avatarInitials = guestId
    ? guestId.replace("Guest_", "").slice(0, 2)
    : "??";

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Reset dati demo",
      "Tutti gli eventi, le impostazioni e il Free Trial verranno cancellati. L'app tornerà allo stato iniziale.",
      [
        { text: "Annulla", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all([resetEvents(), resetGuest(), resetPlan()]);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace("/(tabs)");
            } catch {
              Alert.alert("Errore", "Il reset non è riuscito. Riprova.");
            }
          },
        },
      ]
    );
  };

  const stats = [
    { label: "Eventi creati", value: String(events.length), emoji: "🎉" },
    { label: "Foto raccolte", value: String(totalPhotos), emoji: "📸" },
    { label: "Eventi Party", value: String(partyEvents), emoji: "⚡️" },
    { label: "Eventi Pro", value: String(proEvents), emoji: "👑" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: topPad + 20,
          paddingBottom: bottomPad + 120,
          paddingHorizontal: 20,
          gap: 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.headerRow, style0]}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logoText}>Kapsul</Text>
          </LinearGradient>
        </Animated.View>

        {/* Identità */}
        <Animated.View style={style0}>
          <LinearGradient
            colors={[colors.card, colors.muted]}
            style={[
              styles.identityCard,
              {
                borderColor: colors.gradientStart + "40",
                borderRadius: colors.radius,
              },
            ]}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </LinearGradient>
            <View style={styles.identityInfo}>
              <Text style={[styles.guestId, { color: colors.foreground }]}>
                {guestId ?? "---"}
              </Text>
              <Text style={[styles.guestLabel, { color: colors.mutedForeground }]}>
                ID anonimo · generato automaticamente
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Statistiche Host */}
        <Animated.View style={style1}>
          <SectionHeader label="LE MIE STATISTICHE" />
          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <LinearGradient
                key={s.label}
                colors={[colors.card, colors.muted]}
                style={[
                  styles.statCard,
                  { borderColor: colors.border, borderRadius: colors.radius },
                ]}
              >
                <Text style={styles.statEmoji}>{s.emoji}</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: colors.foreground, fontFamily: "SpaceMono_400Regular" },
                  ]}
                >
                  {s.value}
                </Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
                  {s.label}
                </Text>
              </LinearGradient>
            ))}
          </View>
        </Animated.View>

        {/* Free Trial */}
        <Animated.View style={style2}>
          <SectionHeader label="FREE TRIAL" />
          <LinearGradient
            colors={
              hasUsedFreeTrial
                ? [colors.muted, colors.muted]
                : [colors.gradientStart + "18", colors.gradientEnd + "18"]
            }
            style={[
              styles.trialCard,
              {
                borderColor: hasUsedFreeTrial
                  ? colors.border
                  : colors.gradientStart + "50",
                borderRadius: colors.radius,
              },
            ]}
          >
            <View
              style={[
                styles.trialIconWrap,
                {
                  backgroundColor: hasUsedFreeTrial
                    ? colors.border
                    : colors.gradientStart + "30",
                },
              ]}
            >
              <Text style={{ fontSize: 22 }}>
                {hasUsedFreeTrial ? "✓" : "🎁"}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[styles.trialTitle, { color: colors.foreground }]}>
                {hasUsedFreeTrial
                  ? "Free Trial già usato"
                  : "Free Trial disponibile"}
              </Text>
              <Text
                style={[styles.trialSub, { color: colors.mutedForeground }]}
              >
                {hasUsedFreeTrial
                  ? "Disponibile una sola volta per account"
                  : "Crea il tuo primo evento gratis · 10 foto · 20 ospiti"}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Impostazioni */}
        <Animated.View style={style3}>
          <SectionHeader label="IMPOSTAZIONI" />
          <View
            style={[
              styles.settingsGroup,
              { borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <SettingRow
              icon={
                <Ionicons name="notifications-outline" size={16} color={colors.gradientStart} />
              }
              label="Notifiche"
              right={
                <Switch
                  value={notifEnabled}
                  onValueChange={(v) => {
                    setNotifEnabled(v);
                    Haptics.selectionAsync();
                  }}
                  trackColor={{
                    false: colors.border,
                    true: colors.gradientStart,
                  }}
                  thumbColor="#fff"
                />
              }
            />
            <SettingRow
              icon={
                <Ionicons name="save-outline" size={16} color={colors.gradientStart} />
              }
              label="Salvataggio automatico foto"
              isLast
              right={
                <Switch
                  value={autoSaveEnabled}
                  onValueChange={(v) => {
                    setAutoSaveEnabled(v);
                    Haptics.selectionAsync();
                  }}
                  trackColor={{
                    false: colors.border,
                    true: colors.gradientStart,
                  }}
                  thumbColor="#fff"
                />
              }
            />
          </View>
        </Animated.View>

        {/* Legale */}
        <Animated.View style={style4}>
          <SectionHeader label="LEGALE" />
          <View
            style={[
              styles.settingsGroup,
              { borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <SettingRow
              icon={
                <Ionicons name="document-text-outline" size={16} color={colors.gradientStart} />
              }
              label="Termini di Servizio"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL("https://kapsul.app/terms");
              }}
            />
            <SettingRow
              icon={
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.gradientStart} />
              }
              label="Privacy Policy"
              isLast
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Linking.openURL("https://kapsul.app/privacy");
              }}
            />
          </View>
        </Animated.View>

        {/* App */}
        <Animated.View style={style4}>
          <SectionHeader label="APP" />
          <View
            style={[
              styles.settingsGroup,
              { borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <SettingRow
              icon={
                <Ionicons name="information-circle-outline" size={16} color={colors.gradientStart} />
              }
              label="Versione"
              isLast={false}
              right={
                <Text style={[styles.versionText, { color: colors.mutedForeground }]}>
                  1.0.0-beta
                </Text>
              }
            />
            <TouchableOpacity
              onPress={handleReset}
              activeOpacity={0.7}
              style={[
                styles.settingRow,
                {
                  backgroundColor: colors.card,
                  borderBottomColor: "transparent",
                },
              ]}
            >
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: colors.destructive + "22" },
                ]}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.destructive}
                />
              </View>
              <Text style={[styles.settingLabel, { color: colors.destructive }]}>
                Reset dati demo
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  logoGradient: {
    borderRadius: 8,
    paddingHorizontal: 2,
    paddingVertical: 1,
    alignSelf: "flex-start",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
  identityInfo: { flex: 1, gap: 4 },
  guestId: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  guestLabel: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 17,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "47.5%",
    borderWidth: 1,
    padding: 16,
    gap: 6,
    alignItems: "flex-start",
  },
  statEmoji: { fontSize: 20 },
  statValue: {
    fontSize: 28,
    letterSpacing: -0.5,
    fontWeight: "400",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  trialCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderWidth: 1,
  },
  trialIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  trialTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  trialSub: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 17,
  },
  settingsGroup: {
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  settingRight: {
    alignItems: "flex-end",
  },
  versionText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
