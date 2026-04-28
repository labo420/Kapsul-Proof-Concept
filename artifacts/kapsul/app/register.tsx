import { ArrowRight, Camera, Eye, EyeOff, Lock, Mail, User, AtSign } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

const SPRING = { damping: 20, stiffness: 200, mass: 0.9 } as const;
const PRESS_SPRING = { damping: 7, stiffness: 340, mass: 0.8 } as const;
const RELEASE_SPRING = { damping: 9, stiffness: 220, mass: 0.8 } as const;

function useFadeSlideIn(delay: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 360 }));
    translateY.value = withDelay(delay, withSpring(0, SPRING));
  }, []);
  return useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));
}

function GlowOrb({ color, style }: { color: string; style: object }) {
  return <View style={[styles.glowOrb, { backgroundColor: color }, style]} />;
}

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const cardAnim = useFadeSlideIn(60);
  const formAnim = useFadeSlideIn(160);
  const footerAnim = useFadeSlideIn(260);

  const ctaScale = useSharedValue(1);
  const ctaAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: ctaScale.value }] }));

  const checkUsername = async (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_.]/g, "");
    setUsername(clean);
    if (clean.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    try {
      const res = await fetch(`${API_BASE}/users/check-username?username=${encodeURIComponent(clean)}`);
      const data = await res.json() as { available: boolean };
      setUsernameStatus(data.available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  };

  const handleRegister = async () => {
    if (!displayName.trim() || !username || !email.trim() || !password) {
      Alert.alert("Attenzione", "Compila tutti i campi");
      return;
    }
    if (usernameStatus === "taken") {
      Alert.alert("Attenzione", "Username già in uso");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Attenzione", "La password deve essere di almeno 6 caratteri");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await register(email.trim(), username, displayName.trim(), password);
      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert("Errore", err instanceof Error ? err.message : "Registrazione fallita");
    } finally {
      setLoading(false);
    }
  };

  const usernameColor =
    usernameStatus === "available" ? "#22C55E" :
    usernameStatus === "taken" ? "#EF4444" :
    colors.border;

  const usernameHint =
    usernameStatus === "available" ? "✓ Username disponibile" :
    usernameStatus === "taken" ? "✗ Username già in uso" :
    usernameStatus === "checking" ? "Verifica in corso..." :
    "";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <GlowOrb color="rgba(99,102,241,0.28)" style={{ width: 280, height: 280, top: -60, left: -80 }} />
      <GlowOrb color="rgba(236,72,153,0.14)" style={{ width: 320, height: 320, bottom: -80, right: -100 }} />

      <KeyboardAvoidingView
        style={styles.kbAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
          style={{ backgroundColor: "transparent" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.cardWrap, cardAnim]}>
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[styles.cardInner, { backgroundColor: colors.card + "E6", borderColor: colors.border }]}>
              <View style={styles.logoSection}>
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoIcon}
                >
                  <Camera size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.logoText}>KAPSUL</Text>
                <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>Crea il tuo account</Text>
              </View>

              <Animated.View style={[styles.form, formAnim]}>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>NOME VISUALIZZATO</Text>
                  <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
                    <User size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder="Il tuo nome"
                      placeholderTextColor={colors.mutedForeground + "80"}
                      value={displayName}
                      onChangeText={setDisplayName}
                      returnKeyType="next"
                      onSubmitEditing={() => usernameRef.current?.focus()}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>USERNAME</Text>
                  <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: usernameColor }]}>
                    <AtSign size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                    <TextInput
                      ref={usernameRef}
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder="il_tuo_username"
                      placeholderTextColor={colors.mutedForeground + "80"}
                      value={username}
                      onChangeText={checkUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  </View>
                  {usernameHint ? (
                    <Text style={{ fontSize: 12, color: usernameColor, marginTop: 2, fontFamily: "Inter_400Regular" }}>
                      {usernameHint}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>EMAIL</Text>
                  <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
                    <Mail size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                    <TextInput
                      ref={emailRef}
                      style={[styles.input, { color: colors.foreground }]}
                      placeholder="nome@esempio.com"
                      placeholderTextColor={colors.mutedForeground + "80"}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onSubmitEditing={() => passwordRef.current?.focus()}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>PASSWORD</Text>
                  <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
                    <Lock size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                    <TextInput
                      ref={passwordRef}
                      style={[styles.input, styles.inputFlex, { color: colors.foreground }]}
                      placeholder="Min. 6 caratteri"
                      placeholderTextColor={colors.mutedForeground + "80"}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      returnKeyType="go"
                      onSubmitEditing={handleRegister}
                    />
                    <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                      {showPassword ? <EyeOff size={16} color={colors.mutedForeground} /> : <Eye size={16} color={colors.mutedForeground} />}
                    </TouchableOpacity>
                  </View>
                </View>

                <Animated.View style={[styles.ctaWrap, ctaAnimStyle]}>
                  <Pressable
                    onPressIn={() => { ctaScale.value = withSpring(0.95, PRESS_SPRING); }}
                    onPressOut={() => { ctaScale.value = withSpring(1, RELEASE_SPRING); }}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={[colors.gradientStart, colors.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.ctaButton, { opacity: loading ? 0.7 : 1 }]}
                    >
                      <Text style={styles.ctaText}>{loading ? "Registrazione..." : "Crea account"}</Text>
                      {!loading && <ArrowRight size={18} color="#fff" />}
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              </Animated.View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.footer, footerAnim]}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>Hai già un account?{" "}</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.footerLink, { color: colors.foreground }]}>Accedi</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glowOrb: { position: "absolute", borderRadius: 999 },
  kbAvoid: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, justifyContent: "center" },
  cardWrap: { borderRadius: 28, overflow: "hidden" },
  cardInner: { borderRadius: 28, borderWidth: 1, padding: 28 },
  logoSection: { alignItems: "center", marginBottom: 24 },
  logoIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  logoText: { fontSize: 20, fontWeight: "700", color: "#fff", letterSpacing: 4, fontFamily: "Inter_700Bold" },
  logoSub: { fontSize: 13, marginTop: 3, letterSpacing: 0.3, fontFamily: "Inter_400Regular" },
  form: { gap: 14 },
  fieldGroup: { gap: 5 },
  fieldLabel: { fontSize: 10, fontWeight: "600", letterSpacing: 1.2, fontFamily: "Inter_600SemiBold" },
  inputWrap: { flexDirection: "row", alignItems: "center", borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, height: 50 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  inputFlex: { flex: 1 },
  eyeBtn: { padding: 4, marginLeft: 6 },
  ctaWrap: { marginTop: 8, borderRadius: 999, overflow: "hidden" },
  ctaButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 8, borderRadius: 999 },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.2, fontFamily: "Inter_700Bold" },
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 24 },
  footerText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  footerLink: { fontSize: 14, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
});
