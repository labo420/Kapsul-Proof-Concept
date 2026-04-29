import {
  Bell, ChevronLeft, FileText, Info, Save, ShieldCheck, Trash2, LogIn, Globe, Lock,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { useGuest } from "@/contexts/GuestContext";
import { useEvents } from "@/contexts/EventContext";
import { usePlan } from "@/contexts/PlanContext";

function SettingRow({
  icon, label, right, onPress, isLast,
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
      style={[styles.settingRow, {
        backgroundColor: colors.card,
        borderBottomColor: isLast ? "transparent" : colors.border,
      }]}
    >
      <View style={[styles.settingIconWrap, { backgroundColor: colors.gradientStart + "22" }]}>
        {icon}
      </View>
      <Text style={[styles.settingLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={styles.settingRight}>
        {right ?? <ChevronRight size={16} color={colors.mutedForeground} />}
      </View>
    </TouchableOpacity>
  );
}

function ChevronRight({ size, color }: { size: number; color: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color, fontSize: size + 4, lineHeight: size + 4, marginTop: -2 }}>›</Text>
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>{label}</Text>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, token, logout, updateProfile } = useAuth();
  const { resetGuest } = useGuest();
  const { resetEvents } = useEvents();
  const { resetPlan } = usePlan();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleTogglePrivacy = async () => {
    if (!user || !token) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await updateProfile({ isPublic: !user.isPublic });
    } catch {
      Alert.alert("Errore", "Impossibile aggiornare la privacy");
    }
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Esci dall'account", "Vuoi davvero uscire?", [
      { text: "Annulla", style: "cancel" },
      {
        text: "Esci",
        style: "destructive",
        onPress: async () => { await logout(); router.replace("/login"); },
      },
    ]);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Reset dati demo", "Tutti gli eventi locali e le impostazioni verranno cancellati.", [
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
            Alert.alert("Errore", "Il reset non è riuscito.");
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <ChevronLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Impostazioni</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── ACCOUNT ── */}
        <View style={styles.section}>
          <SectionHeader label="ACCOUNT" />
          <View style={[styles.settingsGroup, { borderColor: colors.border, borderRadius: 16 }]}>
            <SettingRow
              icon={<Bell size={16} color={colors.gradientStart} />}
              label="Notifiche push"
              right={
                <Switch
                  value={notifEnabled}
                  onValueChange={(v) => { setNotifEnabled(v); Haptics.selectionAsync(); }}
                  trackColor={{ false: colors.border, true: colors.gradientStart }}
                  thumbColor="#fff"
                />
              }
            />
            <SettingRow
              icon={user?.isPublic ? <Globe size={16} color={colors.gradientStart} /> : <Lock size={16} color={colors.gradientStart} />}
              label="Account pubblico"
              onPress={handleTogglePrivacy}
              right={
                <Switch
                  value={user?.isPublic ?? false}
                  onValueChange={handleTogglePrivacy}
                  trackColor={{ false: colors.border, true: colors.gradientStart }}
                  thumbColor="#fff"
                />
              }
              isLast
            />
          </View>
        </View>

        {/* ── PREFERENZE ── */}
        <View style={styles.section}>
          <SectionHeader label="PREFERENZE" />
          <View style={[styles.settingsGroup, { borderColor: colors.border, borderRadius: 16 }]}>
            <SettingRow
              icon={<Save size={16} color={colors.gradientStart} />}
              label="Salvataggio automatico foto"
              isLast
              right={
                <Switch
                  value={autoSaveEnabled}
                  onValueChange={(v) => { setAutoSaveEnabled(v); Haptics.selectionAsync(); }}
                  trackColor={{ false: colors.border, true: colors.gradientStart }}
                  thumbColor="#fff"
                />
              }
            />
          </View>
        </View>

        {/* ── INFORMAZIONI ── */}
        <View style={styles.section}>
          <SectionHeader label="INFORMAZIONI" />
          <View style={[styles.settingsGroup, { borderColor: colors.border, borderRadius: 16 }]}>
            <SettingRow
              icon={<FileText size={16} color={colors.gradientStart} />}
              label="Termini di Servizio"
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL("https://piclo.app/terms"); }}
            />
            <SettingRow
              icon={<ShieldCheck size={16} color={colors.gradientStart} />}
              label="Privacy Policy"
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); Linking.openURL("https://piclo.app/privacy"); }}
            />
            <SettingRow
              icon={<Info size={16} color={colors.gradientStart} />}
              label="Informazioni sull'app"
              isLast
              right={<Text style={{ color: colors.mutedForeground, fontSize: 13, fontFamily: "Inter_400Regular" }}>v1.0.0</Text>}
            />
          </View>
        </View>

        {/* ── ACCOUNT AZIONI ── */}
        <View style={styles.section}>
          <SectionHeader label="ACCOUNT" />
          <View style={[styles.settingsGroup, { borderColor: colors.border, borderRadius: 16 }]}>
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.7}
              style={[styles.settingRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: colors.destructive + "22" }]}>
                <LogIn size={16} color={colors.destructive} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.destructive }]}>Esci dall'account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReset}
              activeOpacity={0.7}
              style={[styles.settingRow, { backgroundColor: colors.card, borderBottomColor: "transparent" }]}
            >
              <View style={[styles.settingIconWrap, { backgroundColor: colors.destructive + "22" }]}>
                <Trash2 size={16} color={colors.destructive} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.destructive }]}>Reset dati locali</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ color: colors.mutedForeground, fontSize: 12, textAlign: "center", marginTop: 16, fontFamily: "Inter_400Regular" }}>
          Piclo v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18, fontWeight: "800", fontFamily: "Inter_700Bold",
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionHeader: {
    fontSize: 11, fontWeight: "700", letterSpacing: 2, textTransform: "uppercase",
    fontFamily: "Inter_700Bold", marginBottom: 8,
  },
  settingsGroup: { borderWidth: 1, overflow: "hidden" },
  settingRow: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  settingIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  settingLabel: {
    flex: 1, fontSize: 15, fontWeight: "500", fontFamily: "Inter_500Medium",
  },
  settingRight: { alignItems: "flex-end" },
});
