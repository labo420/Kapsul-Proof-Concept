import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import Svg, { Path as SvgPath } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
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
  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

function GlowOrb({ color, style }: { color: string; style: object }) {
  return <View style={[styles.glowOrb, { backgroundColor: color }, style]} />;
}

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const cardAnim = useFadeSlideIn(80);
  const formAnim = useFadeSlideIn(180);
  const footerAnim = useFadeSlideIn(280);

  const signInScale = useSharedValue(1);
  const signInAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signInScale.value }],
  }));

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Attenzione", "Inserisci email e password");
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert("Errore", err instanceof Error ? err.message : "Login fallito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <GlowOrb color="rgba(99,102,241,0.28)" style={{ width: 280, height: 280, top: -60, left: -80 }} />
      <GlowOrb color="rgba(236,72,153,0.14)" style={{ width: 320, height: 320, bottom: -80, right: -100 }} />
      <GlowOrb color="rgba(139,92,246,0.20)" style={{ width: 220, height: 220, top: "38%", left: "15%" }} />

      <KeyboardAvoidingView
        style={styles.kbAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
          style={{ backgroundColor: "transparent" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.cardWrap, cardAnim]}>
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[styles.cardInner, { backgroundColor: colors.card + "E6", borderColor: colors.border }]}>
              <View style={styles.logoSection}>
                <Image
                  source={require("../assets/images/piclo-logo-white.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>Scan. Drop. Relive.</Text>
              </View>

              <Animated.View style={[styles.form, formAnim]}>
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>EMAIL</Text>
                  <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: emailFocused ? colors.primary : colors.border }]}>
                    <Mail size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                    <TextInput
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
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>PASSWORD</Text>
                  <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: passwordFocused ? colors.primary : colors.border }]}>
                    <Lock size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                    <TextInput
                      ref={passwordRef}
                      style={[styles.input, styles.inputFlex, { color: colors.foreground }]}
                      placeholder="••••••••"
                      placeholderTextColor={colors.mutedForeground + "80"}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      returnKeyType="go"
                      onSubmitEditing={handleSignIn}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                      {showPassword ? <EyeOff size={16} color={colors.mutedForeground} /> : <Eye size={16} color={colors.mutedForeground} />}
                    </TouchableOpacity>
                  </View>
                </View>

                <Animated.View style={[styles.ctaWrap, signInAnimStyle]}>
                  <Pressable
                    onPressIn={() => { signInScale.value = withSpring(0.95, PRESS_SPRING); }}
                    onPressOut={() => { signInScale.value = withSpring(1, RELEASE_SPRING); }}
                    onPress={handleSignIn}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={[colors.gradientStart, colors.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.ctaButton, { opacity: loading ? 0.7 : 1 }]}
                    >
                      <Text style={styles.ctaText}>{loading ? "Accesso in corso..." : "Accedi"}</Text>
                      {!loading && <ArrowRight size={18} color="#fff" />}
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              </Animated.View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.footer, footerAnim]}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>Non hai un account?{" "}</Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={[styles.footerLink, { color: colors.foreground }]}>Creane uno</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glowOrb: { position: "absolute", borderRadius: 999, opacity: 1 },
  kbAvoid: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 20, justifyContent: "center" },
  cardWrap: { borderRadius: 28, overflow: "hidden" },
  cardInner: { borderRadius: 28, borderWidth: 1, padding: 28 },
  logoSection: { alignItems: "center", marginBottom: 28 },
  logoImage: { width: 150, height: 44, marginBottom: 8 },
  logoSub: { fontSize: 13, marginTop: 4, letterSpacing: 0.4, fontFamily: "Inter_400Regular" },
  form: { gap: 16 },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 1.2, fontFamily: "Inter_600SemiBold" },
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
