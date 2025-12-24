/**
 * Nossa Maternidade - EmailAuthScreen
 *
 * Tela de autenticação por e-mail (Magic Link)
 * Design clean, focado na entrada do e-mail
 *
 * @version 1.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useCallback, useRef } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
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
import { signInWithMagicLink } from "../../api/auth";
import { Tokens, brand, neutral, typography } from "../../theme/tokens";
import { logger } from "../../utils/logger";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Navigation types
type AuthStackParamList = {
  AuthLanding: undefined;
  EmailAuth: undefined;
  Login: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "EmailAuth">;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const isCompact = SCREEN_HEIGHT < 700;

// ============================================
// DESIGN SYSTEM (from Tokens)
// ============================================
const DS = {
  white: neutral[0],
  black: neutral[900],
  primary: brand.primary[500],
  accent: brand.accent[500],
  text: {
    primary: Tokens.text.light.primary,
    secondary: Tokens.text.light.secondary,
    muted: Tokens.text.light.tertiary,
    inverse: Tokens.text.light.inverse,
  },
  border: neutral[200],
  inputBg: neutral[50],
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

// ============================================
// MAIN SCREEN
// ============================================
export default function EmailAuthScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  // State
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState(false);

  // Validation
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const canSubmit = email.trim().length > 0 && !loading;

  // Handlers
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();

    // Validate
    if (!email.trim()) {
      setError("Digite seu e-mail");
      return;
    }
    if (!isValidEmail(email)) {
      setError("E-mail inválido");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      logger.info("Enviando magic link", "EmailAuth", { email: email.trim() });

      const { error: apiError } = await signInWithMagicLink(email.trim());

      if (apiError) {
        const errorMsg = apiError instanceof Error ? apiError.message : String(apiError);
        setError(errorMsg);
        logger.warn("Erro ao enviar magic link", "EmailAuth", { error: errorMsg });
        return;
      }

      setSuccess(true);
      logger.info("Magic link enviado com sucesso", "EmailAuth");
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      setError(errorMsg);
      logger.error("Exceção ao enviar magic link", "EmailAuth", e instanceof Error ? e : new Error(errorMsg));
    } finally {
      setLoading(false);
    }
  }, [email]);

  const handleChangeEmail = useCallback((text: string) => {
    setEmail(text);
    if (error) setError(null);
    if (success) setSuccess(false);
  }, [error, success]);

  // Success state
  if (success) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        <View style={[styles.successContainer, { paddingTop: insets.top + 60 }]}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.successIcon}>
            <Ionicons name="mail-open" size={64} color={DS.success} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)}>
            <Text style={styles.successTitle}>Verifique seu e-mail</Text>
            <Text style={styles.successText}>
              Enviamos um link mágico para{"\n"}
              <Text style={styles.successEmail}>{email}</Text>
            </Text>
            <Text style={styles.successHint}>
              Clique no link para entrar automaticamente.{"\n"}
              Pode levar alguns segundos para chegar.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.successActions}>
            <PressableScale onPress={handleBack} disabled={false}>
              <View style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={DS.text.primary} />
                <Text style={styles.backButtonText}>Voltar</Text>
              </View>
            </PressableScale>
          </Animated.View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <Pressable onPress={Keyboard.dismiss} style={styles.flex}>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
            <Pressable
              onPress={handleBack}
              style={styles.backIconButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Voltar"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={24} color={DS.text.primary} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.delay(100)}>
              <Text style={styles.title}>Entrar com e-mail</Text>
              <Text style={styles.subtitle}>
                Enviaremos um link mágico para você entrar sem precisar de senha.
              </Text>
            </Animated.View>

            {/* Email Input */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.inputContainer}>
              <View
                style={[
                  styles.inputBox,
                  focused && styles.inputBoxFocused,
                  error && styles.inputBoxError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={focused ? DS.primary : DS.text.muted}
                />
                <TextInput
                  ref={inputRef}
                  value={email}
                  onChangeText={handleChangeEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor={DS.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!loading}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="send"
                  style={styles.input}
                  accessibilityLabel="E-mail"
                />
              </View>

              {/* Error */}
              {error && (
                <Animated.View entering={FadeIn.duration(200)} style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={16} color={DS.error} />
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}
            </Animated.View>

            {/* Submit Button */}
            <Animated.View entering={FadeInDown.delay(300)} style={styles.submitContainer}>
              <PressableScale onPress={handleSubmit} disabled={!canSubmit}>
                <LinearGradient
                  colors={[brand.accent[400], brand.accent[500]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                >
                  {loading ? (
                    <ActivityIndicator color={DS.white} size="small" />
                  ) : (
                    <Text style={styles.submitBtnText}>Enviar link</Text>
                  )}
                </LinearGradient>
              </PressableScale>
            </Animated.View>

            {/* Info */}
            <Animated.View entering={FadeInDown.delay(400)} style={styles.infoContainer}>
              <Ionicons name="shield-checkmark" size={16} color={DS.text.muted} />
              <Text style={styles.infoText}>
                Sem senha, mais seguro. O link expira em 24 horas.
              </Text>
            </Animated.View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DS.white,
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingBottom: Tokens.spacing.lg,
  },
  backIconButton: {
    width: 44,
    height: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.xl,
  },

  // Title
  title: {
    fontSize: isCompact ? 26 : 30,
    fontWeight: "800",
    color: DS.text.primary,
    fontFamily: typography.fontFamily.extrabold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: DS.text.secondary,
    fontFamily: typography.fontFamily.base,
    lineHeight: 22,
    marginTop: 8,
  },

  // Input
  inputContainer: {
    marginTop: Tokens.spacing["3xl"],
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DS.inputBg,
    borderWidth: 1.5,
    borderColor: DS.border,
    borderRadius: Tokens.radius.lg,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  inputBoxFocused: {
    borderColor: DS.primary,
    backgroundColor: DS.white,
  },
  inputBoxError: {
    borderColor: DS.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: DS.text.primary,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
  },

  // Error
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: DS.error,
    fontFamily: typography.fontFamily.medium,
  },

  // Submit
  submitContainer: {
    marginTop: Tokens.spacing["2xl"],
  },
  submitBtn: {
    height: 56,
    borderRadius: Tokens.radius.lg,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: brand.accent[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },
  submitBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: DS.white,
    fontFamily: typography.fontFamily.bold,
  },

  // Info
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Tokens.spacing["2xl"],
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: DS.text.muted,
    fontFamily: typography.fontFamily.base,
  },

  // Success state
  successContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Tokens.spacing["3xl"],
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Tokens.semantic.light.successLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Tokens.spacing["2xl"],
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: DS.text.primary,
    fontFamily: typography.fontFamily.extrabold,
    textAlign: "center",
  },
  successText: {
    fontSize: 15,
    color: DS.text.secondary,
    fontFamily: typography.fontFamily.base,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 12,
  },
  successEmail: {
    fontWeight: "700",
    color: DS.text.primary,
    fontFamily: typography.fontFamily.bold,
  },
  successHint: {
    fontSize: 14,
    color: DS.text.muted,
    fontFamily: typography.fontFamily.base,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 16,
  },
  successActions: {
    marginTop: Tokens.spacing["4xl"],
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: DS.text.primary,
    fontFamily: typography.fontFamily.semibold,
  },
});
