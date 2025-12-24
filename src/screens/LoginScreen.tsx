/**
 * Nossa Maternidade - LoginScreen v3 (Premium Design)
 * Design moderno e atraente com gradientes e visual impactante
 *
 * @version 3.0.0
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tokens } from "../theme/tokens";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"Login">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LOGO_IMAGE = require("../../assets/logo-01.png");

// Design Tokens
const COLORS = {
  // Backgrounds
  bgGradientStart: "#FDF8F9",
  bgGradientEnd: "#F0F4FF",

  // Primary brand
  primary: Tokens.brand.primary[500],
  accent: Tokens.brand.accent[500],

  // Buttons
  appleBg: "#000000",
  appleText: "#FFFFFF",
  googleBg: "#FFFFFF",
  googleText: "#1F1F1F",
  googleBorder: "#DADCE0",
  ctaBg: Tokens.brand.accent[500],
  ctaText: "#FFFFFF",

  // Text
  textPrimary: Tokens.neutral[900],
  textSecondary: Tokens.neutral[600],
  textMuted: Tokens.neutral[400],
  textLink: Tokens.brand.primary[500],

  // Input
  inputBg: "#FFFFFF",
  inputBorder: Tokens.neutral[200],
  inputBorderFocus: Tokens.brand.primary[500],

  // Divider
  divider: Tokens.neutral[200],

  // Error
  error: Tokens.semantic.light.error,
};

// ===========================================
// COMPONENTE: AnimatedPressable
// ===========================================
interface AnimatedPressableProps {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: object;
}

function AnimatedPressable({ onPress, disabled, children, style }: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => {
          if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }
        }}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        }}
        disabled={disabled}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

// ===========================================
// COMPONENTE: SocialAuthButton (Premium)
// ===========================================
interface SocialAuthButtonProps {
  provider: "apple" | "google";
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

function SocialAuthButton({ provider, onPress, disabled = false, loading = false }: SocialAuthButtonProps) {
  const isApple = provider === "apple";

  return (
    <AnimatedPressable onPress={onPress} disabled={disabled || loading}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isApple ? COLORS.appleBg : COLORS.googleBg,
          borderRadius: 16,
          height: 56,
          borderWidth: isApple ? 0 : 1,
          borderColor: COLORS.googleBorder,
          gap: 12,
          opacity: disabled ? 0.5 : 1,
          // Shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isApple ? 0.15 : 0.08,
          shadowRadius: 12,
          elevation: isApple ? 6 : 3,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={isApple ? COLORS.appleText : COLORS.googleText} />
        ) : (
          <>
            {isApple ? (
              <Ionicons name="logo-apple" size={22} color={COLORS.appleText} />
            ) : (
              <Image
                source={require("../../assets/google-logo.jpg")}
                style={{ width: 22, height: 22, borderRadius: 4 }}
                resizeMode="contain"
              />
            )}
            <Text
              style={{
                color: isApple ? COLORS.appleText : COLORS.googleText,
                fontSize: 17,
                fontWeight: "600",
                fontFamily: "Manrope_600SemiBold",
                letterSpacing: -0.2,
              }}
            >
              Continuar com {isApple ? "Apple" : "Google"}
            </Text>
          </>
        )}
      </View>
    </AnimatedPressable>
  );
}

// ===========================================
// COMPONENTE: Divider
// ===========================================
function Divider() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 28,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: COLORS.divider }} />
      <Text
        style={{
          paddingHorizontal: 16,
          color: COLORS.textMuted,
          fontSize: 13,
          fontWeight: "500",
          fontFamily: "Manrope_500Medium",
        }}
      >
        ou continue com email
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: COLORS.divider }} />
    </View>
  );
}

// ===========================================
// COMPONENTE: EmailInput (Premium)
// ===========================================
interface EmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
}

function EmailInput({ value, onChangeText, error, disabled }: EmailInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: COLORS.textPrimary,
          marginBottom: 10,
          fontFamily: "Manrope_600SemiBold",
        }}
      >
        Email
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.inputBg,
          borderWidth: 2,
          borderColor: error ? COLORS.error : isFocused ? COLORS.inputBorderFocus : COLORS.inputBorder,
          borderRadius: 14,
          paddingHorizontal: 16,
          height: 56,
          // Shadow when focused
          shadowColor: isFocused ? COLORS.inputBorderFocus : "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: isFocused ? 2 : 0,
        }}
      >
        <Ionicons
          name="mail-outline"
          size={20}
          color={isFocused ? COLORS.inputBorderFocus : COLORS.textMuted}
          style={{ marginRight: 12 }}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="seu@email.com"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            fontSize: 16,
            color: COLORS.textPrimary,
            fontWeight: "500",
            fontFamily: "Manrope_500Medium",
            paddingVertical: 0,
          }}
        />
      </View>

      {error && (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, marginLeft: 4 }}>
          <Ionicons name="alert-circle" size={14} color={COLORS.error} style={{ marginRight: 6 }} />
          <Text
            style={{
              fontSize: 13,
              color: COLORS.error,
              fontFamily: "Manrope_500Medium",
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}

// ===========================================
// COMPONENTE: CTAButton (Premium com Gradiente)
// ===========================================
interface CTAButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: string;
}

function CTAButton({ onPress, loading, disabled, children }: CTAButtonProps) {
  return (
    <AnimatedPressable onPress={onPress} disabled={disabled || loading}>
      <LinearGradient
        colors={[Tokens.brand.accent[500], "#E91E8C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          height: 56,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.6 : 1,
          // Shadow
          shadowColor: Tokens.brand.accent[500],
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.ctaText} />
        ) : (
          <Text
            style={{
              color: COLORS.ctaText,
              fontSize: 17,
              fontWeight: "700",
              fontFamily: "Manrope_700Bold",
              letterSpacing: -0.2,
            }}
          >
            {children}
          </Text>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}

// ===========================================
// COMPONENTE PRINCIPAL: LoginScreen
// ===========================================
export default function LoginScreen({ navigation }: Props) {
  void navigation;
  const insets = useSafeAreaInsets();

  // Estados
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Validação
  const validateEmail = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // Handlers
  const handleApplePress = () => {
    setAppleLoading(true);
    setError(null);
    setTimeout(() => setAppleLoading(false), 2000);
  };

  const handleGooglePress = () => {
    setGoogleLoading(true);
    setError(null);
    setTimeout(() => setGoogleLoading(false), 2000);
  };

  const handleContinueEmail = () => {
    Keyboard.dismiss();

    if (!email) {
      setError("Digite seu email para continuar");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTimeout(() => setIsLoading(false), 2000);
  };

  // Responsividade
  const horizontalPadding = SCREEN_WIDTH < 360 ? 20 : 28;
  const logoSize = SCREEN_WIDTH < 340 ? 80 : 100;

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.bgGradientStart, COLORS.bgGradientEnd]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingTop: Math.max(insets.top + 20, 40),
              paddingBottom: Math.max(insets.bottom + 20, 40),
              paddingHorizontal: horizontalPadding,
              maxWidth: 420,
              alignSelf: "center",
              width: "100%",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo com glow effect */}
            <Animated.View
              entering={FadeInUp.duration(600).delay(100)}
              style={{
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <View
                style={{
                  shadowColor: Tokens.brand.accent[500],
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.25,
                  shadowRadius: 24,
                  elevation: 10,
                }}
              >
                <Image
                  source={LOGO_IMAGE}
                  style={{
                    width: logoSize,
                    height: logoSize,
                    borderRadius: logoSize / 2,
                    borderWidth: 3,
                    borderColor: "#FFFFFF",
                  }}
                  resizeMode="cover"
                  accessibilityLabel="Logo Nossa Maternidade"
                />
              </View>
            </Animated.View>

            {/* Header */}
            <Animated.View
              entering={FadeInUp.duration(600).delay(200)}
              style={{ alignItems: "center", marginBottom: 36 }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: COLORS.textPrimary,
                  marginBottom: 8,
                  fontFamily: "Manrope_800ExtraBold",
                  letterSpacing: -1,
                }}
              >
                Bem-vinda
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: COLORS.textSecondary,
                  textAlign: "center",
                  fontFamily: "Manrope_500Medium",
                }}
              >
                Sua jornada de maternidade começa aqui
              </Text>
            </Animated.View>

            {/* Social Login */}
            <Animated.View entering={FadeInDown.duration(500).delay(300)} style={{ gap: 14 }}>
              <SocialAuthButton
                provider="apple"
                onPress={handleApplePress}
                loading={appleLoading}
                disabled={isLoading || googleLoading}
              />
              <SocialAuthButton
                provider="google"
                onPress={handleGooglePress}
                loading={googleLoading}
                disabled={isLoading || appleLoading}
              />
            </Animated.View>

            {/* Divisor */}
            <Animated.View entering={FadeInDown.duration(500).delay(400)}>
              <Divider />
            </Animated.View>

            {/* Campo Email */}
            <Animated.View entering={FadeInDown.duration(500).delay(500)}>
              <EmailInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError(null);
                }}
                error={error || undefined}
                disabled={isLoading || appleLoading || googleLoading}
              />
            </Animated.View>

            {/* Botão Continue */}
            <Animated.View entering={FadeInDown.duration(500).delay(600)} style={{ marginTop: 20 }}>
              <CTAButton
                onPress={handleContinueEmail}
                loading={isLoading}
                disabled={appleLoading || googleLoading}
              >
                Continuar
              </CTAButton>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInDown.duration(500).delay(700)} style={{ marginTop: 28 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.textMuted,
                  textAlign: "center",
                  lineHeight: 18,
                  fontFamily: "Manrope_400Regular",
                }}
              >
                Ao continuar, você concorda com nossos{"\n"}
                <Text
                  style={{ color: COLORS.textLink, fontWeight: "600" }}
                  onPress={() => {}}
                >
                  Termos de Serviço
                </Text>
                {"  "}
                <Text style={{ color: COLORS.textMuted }}>e</Text>
                {"  "}
                <Text
                  style={{ color: COLORS.textLink, fontWeight: "600" }}
                  onPress={() => {}}
                >
                  Política de Privacidade
                </Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Pressable>
  );
}
