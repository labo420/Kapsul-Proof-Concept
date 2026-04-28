import { ArrowRight, Camera, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import Svg, { Path as SvgPath } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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

function GlowOrb({
  color,
  style,
}: {
  color: string;
  style: object;
}) {
  return (
    <View
      style={[styles.glowOrb, { backgroundColor: color, pointerEvents: "none" }, style]}
    />
  );
}

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const cardAnim = useFadeSlideIn(80);
  const formAnim = useFadeSlideIn(180);
  const footerAnim = useFadeSlideIn(280);

  const signInScale = useSharedValue(1);
  const signInAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: signInScale.value }],
  }));

  const handleSignIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Glow orbs */}
      <GlowOrb
        color="rgba(99,102,241,0.28)"
        style={{ width: 280, height: 280, top: -60, left: -80 }}
      />
      <GlowOrb
        color="rgba(236,72,153,0.14)"
        style={{ width: 320, height: 320, bottom: -80, right: -100 }}
      />
      <GlowOrb
        color="rgba(139,92,246,0.20)"
        style={{ width: 220, height: 220, top: "38%", left: "15%" }}
      />

      <KeyboardAvoidingView
        style={[styles.kbAvoid, { backgroundColor: "transparent" }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
          ]}
          style={{ backgroundColor: "transparent" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Glass card */}
          <Animated.View style={[styles.cardWrap, cardAnim]}>
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            <View
              style={[
                styles.cardInner,
                {
                  backgroundColor: colors.card + "E6",
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Logo */}
              <View style={styles.logoSection}>
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoIcon}
                >
                  <Camera size={24} color="#fff" />
                </LinearGradient>
                <Text style={styles.logoText}>KAPSUL</Text>
                <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>
                  Capture the moment
                </Text>
              </View>

              {/* Form */}
              <Animated.View style={[styles.form, formAnim]}>
                {/* Email */}
                <View style={styles.fieldGroup}>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                    EMAIL
                  </Text>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        backgroundColor: colors.input,
                        borderColor: emailFocused ? colors.primary : colors.border,
                      },
                    ]}
                  >
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

                {/* Password */}
                <View style={styles.fieldGroup}>
                  <View style={styles.fieldLabelRow}>
                    <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                      PASSWORD
                    </Text>
                    <TouchableOpacity onPress={() => {}}>
                      <Text style={[styles.forgotLink, { color: colors.gradientMid }]}>
                        Forgot?
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        backgroundColor: colors.input,
                        borderColor: passwordFocused ? colors.primary : colors.border,
                      },
                    ]}
                  >
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
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                      style={styles.eyeBtn}
                    >
                      {showPassword ? (
                        <EyeOff size={16} color={colors.mutedForeground} />
                      ) : (
                        <Eye size={16} color={colors.mutedForeground} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* CTA */}
                <Animated.View style={[styles.ctaWrap, signInAnimStyle]}>
                  <Pressable
                    onPressIn={() => {
                      signInScale.value = withSpring(0.95, PRESS_SPRING);
                    }}
                    onPressOut={() => {
                      signInScale.value = withSpring(1, RELEASE_SPRING);
                    }}
                    onPress={handleSignIn}
                  >
                    <LinearGradient
                      colors={[colors.gradientStart, colors.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.ctaButton}
                    >
                      <Text style={styles.ctaText}>Sign In</Text>
                      <ArrowRight size={18} color="#fff" />
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              </Animated.View>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>
                  O CONTINUA CON
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social buttons */}
              <View style={styles.socialRow}>
                <TouchableOpacity
                  style={[styles.socialBtn, { backgroundColor: colors.input, borderColor: colors.border }]}
                  activeOpacity={0.7}
                >
                  <GoogleIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.socialBtn, { backgroundColor: colors.input, borderColor: colors.border }]}
                  activeOpacity={0.7}
                >
                  <AppleIcon color={colors.foreground} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View style={[styles.footer, footerAnim]}>
            <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
              Non hai un account?{" "}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.footerLink, { color: colors.foreground }]}>
                Creane uno
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function GoogleIcon() {
  return (
    <View style={{ width: 20, height: 20 }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: "#4285F4", textAlign: "center", lineHeight: 20 }}>G</Text>
    </View>
  );
}

function AppleIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
      <SvgPath d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.74-.78 1.79.11 2.89 1.1 3.53 2.15-3.13 1.94-2.61 5.95.42 7.15-.71 1.65-1.63 2.82-2.77 3.65zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  glowOrb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 1,
    // blur simulated by large radius + soft color
  },
  kbAvoid: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  cardWrap: {
    borderRadius: 28,
    overflow: "hidden",
  },
  cardInner: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 4,
    fontFamily: "Inter_700Bold",
  },
  logoSub: {
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0.4,
    fontFamily: "Inter_400Regular",
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.2,
    fontFamily: "Inter_600SemiBold",
  },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgotLink: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  inputFlex: {
    flex: 1,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 6,
  },
  ctaWrap: {
    marginTop: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
    borderRadius: 999,
  },
  ctaText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
    fontFamily: "Inter_700Bold",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4,
    fontFamily: "Inter_600SemiBold",
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
});
