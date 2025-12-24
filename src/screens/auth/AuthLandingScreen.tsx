/**
 * Nossa Maternidade - AuthLandingScreen (Premium)
 *
 * DESIGN REFERENCES:
 * - Flo App (período/gravidez) - 200M+ downloads
 * - Calm - Meditação premium
 * - Headspace - UX clean
 * - Peanut - Comunidade materna
 *
 * PATTERN: Full hero + floating bottom sheet + zero scroll
 *
 * @version 1.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Linking,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { signInWithApple, signInWithGoogle } from "../../api/social-auth";
import { Tokens, brand, neutral, shadows, typography } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Navigation types
type AuthStackParamList = {
  AuthLanding: undefined;
  EmailAuth: undefined;
  Login: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "AuthLanding">;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const isCompact = SCREEN_HEIGHT < 700;

// Assets
const LOGO = require("../../../assets/logo-01.png");
const HERO = require("../../../assets/onboarding/images/nath-profile-small.jpg");

// Legal URLs
const TERMS_URL = "https://nossamaternidade.com.br/termos";
const PRIVACY_URL = "https://nossamaternidade.com.br/privacidade";

// ============================================
// DESIGN SYSTEM - Calm FemTech (from Tokens)
// ============================================
const DS = {
  // Core
  white: neutral[0],
  black: neutral[900],

  // Brand (from tokens)
  primary: brand.primary[500],
  accent: brand.accent[500],

  // Text (from tokens)
  text: {
    primary: Tokens.text.light.primary,
    secondary: Tokens.text.light.secondary,
    muted: Tokens.text.light.tertiary,
    inverse: Tokens.text.light.inverse,
    inverseMuted: "rgba(255,255,255,0.85)",
  },

  // UI
  border: neutral[200],
  inputBg: neutral[50],

  // States (from tokens)
  error: Tokens.semantic.light.error,
  success: Tokens.semantic.light.success,
};

// ============================================
// COMPONENTS
// ============================================

const PressableScale = ({
  onPress,
  disabled,
  children,
  style,
}: {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: object;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  }, [disabled, onPress]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        disabled={disabled}
        style={style}
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

// Social button - Premium style
const SocialButton = ({
  type,
  onPress,
  loading,
  disabled,
}: {
  type: "apple" | "google";
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}) => {
  const isApple = type === "apple";

  return (
    <PressableScale onPress={onPress} disabled={disabled || loading}>
      <View
        style={[
          styles.socialBtn,
          isApple ? styles.socialBtnApple : styles.socialBtnGoogle,
          disabled && styles.socialBtnDisabled,
        ]}
        accessibilityLabel={`Continuar com ${isApple ? "Apple" : "Google"}`}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color={isApple ? DS.white : DS.text.primary} size="small" />
        ) : (
          <>
            {isApple ? (
              <Ionicons name="logo-apple" size={22} color={DS.white} />
            ) : (
              <Image
                source={require("../../../assets/google-logo.jpg")}
                style={styles.googleLogo}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.socialBtnText, isApple && styles.socialBtnTextWhite]}>
              Continuar com {isApple ? "Apple" : "Google"}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
};

// Email button - Outline style
const EmailButton = ({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled: boolean;
}) => (
  <PressableScale onPress={onPress} disabled={disabled}>
    <View
      style={[styles.emailBtn, disabled && styles.socialBtnDisabled]}
      accessibilityLabel="Continuar com e-mail"
      accessibilityRole="button"
    >
      <Ionicons name="mail-outline" size={20} color={DS.text.primary} />
      <Text style={styles.emailBtnText}>Continuar com e-mail</Text>
    </View>
  </PressableScale>
);

// ============================================
// MAIN SCREEN
// ============================================
export default function AuthLandingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  // Loading states
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anyLoading = appleLoading || googleLoading;

  // Handlers
  const handleApple = useCallback(async () => {
    try {
      setAppleLoading(true);
      setError(null);
      logger.info("Iniciando login com Apple", "AuthLanding");
      const res = await signInWithApple();
      if (!res.success) {
        setError(res.error || "Erro ao entrar com Apple");
        logger.warn("Login Apple falhou", "AuthLanding", { error: res.error });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error("Exceção no login Apple", "AuthLanding", e instanceof Error ? e : new Error(errorMsg));
    } finally {
      setAppleLoading(false);
    }
  }, []);

  const handleGoogle = useCallback(async () => {
    try {
      setGoogleLoading(true);
      setError(null);
      logger.info("Iniciando login com Google", "AuthLanding");
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || "Erro ao entrar com Google");
        logger.warn("Login Google falhou", "AuthLanding", { error: res.error });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error("Exceção no login Google", "AuthLanding", e instanceof Error ? e : new Error(errorMsg));
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  const handleEmail = useCallback(() => {
    setError(null);
    navigation.navigate("EmailAuth");
  }, [navigation]);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  // Layout calculations
  const heroHeight = SCREEN_HEIGHT * (isCompact ? 0.48 : 0.52);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ===============================
          HERO - Full width, premium
         =============================== */}
      <View style={[styles.hero, { height: heroHeight }]}>
        <ExpoImage
          source={HERO}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          contentPosition="top center"
          transition={400}
        />

        {/* Gradient overlay - Calm FemTech style */}
        <LinearGradient
          colors={[
            "rgba(125, 185, 213, 0.12)", // Azul suave no topo
            "rgba(0,0,0,0.20)",
            "rgba(31, 41, 55, 0.88)", // Escuro acolhedor embaixo
          ]}
          locations={[0, 0.4, 1]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Top bar - Logo + Brand */}
        <Animated.View
          entering={FadeIn.duration(600)}
          style={[styles.topBar, { paddingTop: insets.top + 12 }]}
        >
          <Image source={LOGO} style={styles.logo} />
          <Text style={styles.brand}>Nossa Maternidade</Text>
        </Animated.View>

        {/* Hero content */}
        <View style={styles.heroContent}>
          {/* Headline */}
          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <Text style={styles.headline}>Sua jornada{"\n"}começa aqui</Text>
            <Text style={styles.subheadline}>
              Rotinas reais, apoio e conteúdo{"\n"}diário pra sua fase.
            </Text>
          </Animated.View>

          {/* Badge - por Nathalia Valente */}
          <Animated.View entering={FadeInUp.delay(350).springify()} style={styles.badge}>
            <Text style={styles.badgeText}>por Nathalia Valente</Text>
          </Animated.View>
        </View>
      </View>

      {/* ===============================
          BOTTOM SHEET - Premium card
         =============================== */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        style={[
          styles.bottomSheet,
          {
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Error message */}
        {error && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color={DS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        {/* Social buttons */}
        <View style={styles.buttonsContainer}>
          {/* iOS: Apple first */}
          {Platform.OS === "ios" && (
            <SocialButton
              type="apple"
              onPress={handleApple}
              loading={appleLoading}
              disabled={anyLoading && !appleLoading}
            />
          )}

          {/* Google */}
          <SocialButton
            type="google"
            onPress={handleGoogle}
            loading={googleLoading}
            disabled={anyLoading && !googleLoading}
          />

          {/* Android: Apple after Google */}
          {Platform.OS !== "ios" && (
            <SocialButton
              type="apple"
              onPress={handleApple}
              loading={appleLoading}
              disabled={anyLoading && !appleLoading}
            />
          )}

          {/* Email */}
          <EmailButton onPress={handleEmail} disabled={anyLoading} />
        </View>

        {/* Microcopy */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.microcopyContainer}>
          <Text style={styles.microcopy}>Você não está sozinha.</Text>
        </Animated.View>

        {/* Legal */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.legalContainer}>
          <Text style={styles.legal}>
            Ao continuar, você concorda com nossos{" "}
            <Text style={styles.legalLink} onPress={() => handleOpenLink(TERMS_URL)}>
              Termos
            </Text>{" "}
            e{" "}
            <Text style={styles.legalLink} onPress={() => handleOpenLink(PRIVACY_URL)}>
              Privacidade
            </Text>
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// ============================================
// STYLES - Premium, pixel-perfect
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.black,
  },

  // Hero
  hero: {
    position: "relative",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing["2xl"],
    gap: Tokens.spacing.sm,
    zIndex: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  brand: {
    fontSize: 15,
    fontWeight: "600",
    color: DS.text.inverse,
    fontFamily: typography.fontFamily.semibold,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingBottom: Tokens.spacing["4xl"],
  },

  // Headline
  headline: {
    fontSize: isCompact ? 30 : 34,
    fontWeight: "800",
    color: DS.text.inverse,
    fontFamily: typography.fontFamily.extrabold,
    lineHeight: isCompact ? 38 : 42,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: "400",
    color: DS.text.inverseMuted,
    fontFamily: typography.fontFamily.base,
    lineHeight: 22,
    marginTop: 8,
  },

  // Badge
  badge: {
    alignSelf: "flex-start",
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: DS.text.inverseMuted,
    fontFamily: typography.fontFamily.semibold,
    letterSpacing: 0.3,
  },

  // Bottom Sheet
  bottomSheet: {
    flex: 1,
    backgroundColor: DS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing["2xl"],
    marginTop: -24,
    ...shadows.lg,
  },

  // Error
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Tokens.semantic.light.errorLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Tokens.radius.md,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Tokens.semantic.light.errorText,
    fontFamily: typography.fontFamily.medium,
  },

  // Buttons
  buttonsContainer: {
    gap: 12,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: Tokens.radius.lg,
    gap: 12,
  },
  socialBtnApple: {
    backgroundColor: DS.black,
  },
  socialBtnGoogle: {
    backgroundColor: DS.white,
    borderWidth: 1.5,
    borderColor: DS.border,
  },
  socialBtnDisabled: {
    opacity: 0.5,
  },
  socialBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: DS.text.primary,
    fontFamily: typography.fontFamily.semibold,
  },
  socialBtnTextWhite: {
    color: DS.white,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },

  // Email button
  emailBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: Tokens.radius.lg,
    gap: 10,
    backgroundColor: DS.inputBg,
    borderWidth: 1.5,
    borderColor: DS.border,
  },
  emailBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: DS.text.primary,
    fontFamily: typography.fontFamily.semibold,
  },

  // Microcopy
  microcopyContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  microcopy: {
    fontSize: 14,
    fontWeight: "500",
    color: DS.text.muted,
    fontFamily: typography.fontFamily.medium,
    fontStyle: "italic",
  },

  // Legal
  legalContainer: {
    marginTop: "auto",
    paddingTop: 16,
  },
  legal: {
    fontSize: 12,
    color: DS.text.muted,
    textAlign: "center",
    lineHeight: 18,
    fontFamily: typography.fontFamily.base,
  },
  legalLink: {
    color: DS.text.secondary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
