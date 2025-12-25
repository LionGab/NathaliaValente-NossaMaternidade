/**
 * Nossa Maternidade - AuthLandingScreen (Premium)
 *
 * DESIGN: Pink Clean + Blue Clean ✨
 *
 * PATTERN: Full hero + floating bottom sheet + zero scroll
 *
 * @version 2.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
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
import { signInWithApple, signInWithFacebook, signInWithGoogle } from "../../api/social-auth";
import { Tokens, brand, neutral, shadows, typography } from "../../theme/tokens";
import { logger } from "../../utils/logger";

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
// DESIGN SYSTEM - Pink Clean + Blue Clean ✨
// ============================================
const DS = {
  // Core
  white: neutral[0],
  black: neutral[900],

  // Brand (from tokens) - Pink Clean + Blue Clean
  primary: brand.primary[500], // #1AB8FF - Blue Clean
  accent: brand.accent[500], // #FF5C94 - Pink Clean

  // Text (from tokens)
  text: {
    primary: Tokens.text.light.primary,
    secondary: Tokens.text.light.secondary,
    muted: Tokens.text.light.tertiary,
    inverse: Tokens.text.light.inverse,
    inverseMuted: "rgba(255,255,255,0.85)",
    accent: brand.accent[500], // Pink Clean for highlights
  },

  // UI
  border: neutral[200],
  inputBg: brand.primary[50], // Light blue background

  // States (from tokens)
  error: Tokens.semantic.light.error,
  success: Tokens.semantic.light.success,

  // Gradients for hero overlay
  gradient: {
    blueClean: "rgba(26, 184, 255, 0.15)", // Blue Clean overlay
    pinkClean: "rgba(255, 92, 148, 0.08)", // Pink Clean subtle
  },
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
  type: "apple" | "google" | "facebook";
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}) => {
  const isApple = type === "apple";
  const isFacebook = type === "facebook";

  return (
    <PressableScale onPress={onPress} disabled={disabled || loading}>
      <View
        style={[
          styles.socialBtn,
          isApple
            ? styles.socialBtnApple
            : isFacebook
              ? styles.socialBtnFacebook
              : styles.socialBtnGoogle,
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
            ) : isFacebook ? (
              <Ionicons name="logo-facebook" size={22} color={DS.white} />
            ) : (
              <Image
                source={require("../../../assets/google-logo.jpg")}
                style={styles.googleLogo}
                resizeMode="contain"
              />
            )}
            <Text
              style={[
                styles.socialBtnText,
                isApple && styles.socialBtnTextWhite,
                isFacebook && styles.socialBtnTextWhite,
              ]}
            >
              Continuar com {isApple ? "Apple" : isFacebook ? "Facebook" : "Google"}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
};

// Email button - Outline style
const EmailButton = ({ onPress, disabled }: { onPress: () => void; disabled: boolean }) => (
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
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anyLoading = appleLoading || googleLoading || facebookLoading;

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
      } else {
        // Login bem-sucedido
        // No web: redirect acontece automaticamente, sessão será processada via detectSessionInUrl
        // No native: sessão já foi criada, onAuthStateChange vai disparar automaticamente
        logger.info("Login Apple iniciado com sucesso", "AuthLanding", {
          platform: Platform.OS,
          hasUser: !!res.user,
        });
        // Não fazer nada aqui - aguardar onAuthStateChange atualizar o estado
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error(
        "Exceção no login Apple",
        "AuthLanding",
        e instanceof Error ? e : new Error(errorMsg)
      );
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
      } else {
        // Login bem-sucedido
        // No web: redirect acontece automaticamente, sessão será processada via detectSessionInUrl
        // No native: sessão já foi criada, onAuthStateChange vai disparar automaticamente
        logger.info("Login Google iniciado com sucesso", "AuthLanding", {
          platform: Platform.OS,
          hasUser: !!res.user,
        });
        // Não fazer nada aqui - aguardar onAuthStateChange atualizar o estado
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error(
        "Exceção no login Google",
        "AuthLanding",
        e instanceof Error ? e : new Error(errorMsg)
      );
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  const handleFacebook = useCallback(async () => {
    try {
      setFacebookLoading(true);
      setError(null);
      logger.info("Iniciando login com Facebook", "AuthLanding");
      const res = await signInWithFacebook();
      if (!res.success) {
        setError(res.error || "Erro ao entrar com Facebook");
        logger.warn("Login Facebook falhou", "AuthLanding", { error: res.error });
      } else {
        // Login bem-sucedido
        // No web: redirect acontece automaticamente, sessão será processada via detectSessionInUrl
        // No native: sessão já foi criada, onAuthStateChange vai disparar automaticamente
        logger.info("Login Facebook iniciado com sucesso", "AuthLanding", {
          platform: Platform.OS,
          hasUser: !!res.user,
        });
        // Não fazer nada aqui - aguardar onAuthStateChange atualizar o estado
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error(
        "Exceção no login Facebook",
        "AuthLanding",
        e instanceof Error ? e : new Error(errorMsg)
      );
    } finally {
      setFacebookLoading(false);
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

        {/* Gradient overlay - Pink Clean + Blue Clean ✨ */}
        <LinearGradient
          colors={[
            DS.gradient.blueClean, // Blue Clean no topo
            DS.gradient.pinkClean, // Pink Clean sutil
            "rgba(10, 21, 32, 0.90)", // Dark blue clean embaixo
          ]}
          locations={[0, 0.35, 1]}
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

          {/* Facebook */}
          <SocialButton
            type="facebook"
            onPress={handleFacebook}
            loading={facebookLoading}
            disabled={anyLoading && !facebookLoading}
          />

          {/* Android: Apple after Google and Facebook */}
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

  // Badge - Pink Clean accent ✨
  badge: {
    alignSelf: "flex-start",
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 92, 148, 0.15)", // Pink Clean subtle bg
    borderWidth: 1,
    borderColor: "rgba(255, 92, 148, 0.3)", // Pink Clean border
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: DS.text.inverse,
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
  socialBtnFacebook: {
    backgroundColor: "#1877F2", // Facebook brand color
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

  // Microcopy - Pink Clean accent ✨
  microcopyContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  microcopy: {
    fontSize: 14,
    fontWeight: "600",
    color: DS.accent, // Pink Clean highlight
    fontFamily: typography.fontFamily.semibold,
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
    color: DS.primary, // Blue Clean for links
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
