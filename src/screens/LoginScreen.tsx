/**
 * Nossa Maternidade - LoginScreen v2 (Polished)
 * Design premium iOS/Android com compliance Apple/Google
 *
 * Estados: DEFAULT | LOADING | ERROR | SUCCESS
 * Dark mode: Sim
 * Responsivo: 320px compact, 375px base, tablet 400px max
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"Login">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LOGO_IMAGE = require("../../assets/logo-01.png");

// ===========================================
// COMPONENTE: SocialAuthButton (POLISHED)
// Apple/Google com specs de brand guidelines
// Altura 52, radius 12, shadow sutil
// ===========================================
interface SocialAuthButtonProps {
  provider: "apple" | "google";
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

function SocialAuthButton({ provider, onPress, disabled = false, loading = false }: SocialAuthButtonProps) {
  const { isDark } = useTheme();

  const isApple = provider === "apple";
  const isGoogle = provider === "google";

  const getStyles = () => {
    if (isApple) {
      return {
        bg: "#000000",
        bgPressed: "#000000",
        text: "#FFFFFF",
        iconColor: "#FFFFFF",
        borderColor: "transparent",
        pressedOpacity: 0.85,
      };
    }

    // Google (spec exato)
    if (isDark) {
      return {
        bg: "#131314",
        bgPressed: "#1f1f1f",
        text: "#E3E3E3",
        iconColor: "#E3E3E3",
        borderColor: "#8E918F",
        pressedOpacity: 1,
      };
    }

    return {
      bg: "#FFFFFF",
      bgPressed: "#F8F8F8",
      text: "#1F1F1F",
      iconColor: "#1F1F1F",
      borderColor: "#747775",
      pressedOpacity: 1,
    };
  };

  const styles = getStyles();

  return (
    <Pressable
      onPress={() => {
        if (!disabled && !loading) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }
      }}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? styles.bgPressed : styles.bg,
        borderRadius: 12, // POLISH: 8 → 12
        height: 52, // POLISH: 48 → 52
        minHeight: 44,
        borderWidth: isGoogle ? 1 : 0,
        borderColor: styles.borderColor,
        gap: 8,
        opacity: disabled ? 0.5 : pressed ? styles.pressedOpacity : 1,
        // POLISH: Shadow sutil
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      })}
      accessibilityRole="button"
      accessibilityLabel={`Continuar com ${isApple ? "Apple" : "Google"}`}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styles.iconColor} />
      ) : (
        <>
          {isApple && <Ionicons name="logo-apple" size={24} color={styles.iconColor} />}
          {isGoogle && (
            <Image
              source={require("../../assets/google-logo.jpg")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          )}
          <Text
            style={{
              color: styles.text,
              fontSize: 16,
              fontWeight: "600",
              fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
            }}
          >
            Continuar com {isApple ? "Apple" : "Google"}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// ===========================================
// COMPONENTE: Divider (POLISHED)
// Linha mais sutil + padding horizontal 8
// ===========================================
function Divider() {
  const { text: textColors, neutral } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: neutral[200] }} />
      <Text
        style={{
          paddingHorizontal: 8, // POLISH: 16 → 8
          color: textColors.muted, // POLISH: tertiary → muted
          fontSize: 12,
          fontWeight: "400",
        }}
      >
        Ou continue com email
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: neutral[200] }} />
    </View>
  );
}

// ===========================================
// COMPONENTE: EmailInput (POLISHED)
// Altura 52, label SEM uppercase, focus halo
// ===========================================
interface EmailInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
}

function EmailInput({ label, value, onChangeText, error, disabled }: EmailInputProps) {
  const { brand, text: textColors, neutral, semantic } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return semantic.error;
    if (isFocused) return brand.primary[500];
    return neutral[300];
  };

  return (
    <View>
      {/* Label SEM uppercase */}
      <Text
        style={{
          fontSize: 13, // POLISH: 12/13
          fontWeight: "500",
          color: textColors.secondary, // POLISH: secondary (não muted)
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      {/* Input Container */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: neutral[50],
          borderWidth: 1.5,
          borderColor: getBorderColor(),
          borderRadius: 12,
          paddingHorizontal: 16,
          height: 52, // POLISH: altura consistente com botões
          // POLISH: Focus halo
          ...(isFocused && {
            shadowColor: brand.primary[500],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 3,
            elevation: 0,
          }),
        }}
      >
        {/* Ícone envelope 18px */}
        <Ionicons
          name="mail-outline"
          size={18} // POLISH: 18px
          color={textColors.muted}
          style={{ marginRight: 12 }}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="seu@email.com"
          placeholderTextColor={textColors.muted} // POLISH: muted
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
            color: textColors.primary,
            fontWeight: "400",
            paddingVertical: 0,
          }}
        />
      </View>

      {/* Error */}
      {error && (
        <Text
          style={{
            fontSize: 12,
            color: semantic.error,
            marginTop: 6,
            marginLeft: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

// ===========================================
// COMPONENTE: CTAButton (POLISHED)
// Rosa + texto escuro, height 52, radius 12
// ===========================================
interface CTAButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: string;
}

function CTAButton({ onPress, loading, disabled, children }: CTAButtonProps) {
  const { brand, text: textColors } = useTheme();

  return (
    <Pressable
      onPress={() => {
        if (!disabled && !loading) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }
      }}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: brand.accent[500],
        borderRadius: 12, // POLISH: radius 12
        height: 52, // POLISH: altura 52
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : pressed ? 0.95 : 1,
        // POLISH: Shadow sutil
        shadowColor: brand.accent[500],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
      })}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColors.primary} />
      ) : (
        <Text
          style={{
            color: textColors.primary, // POLISH: texto escuro (melhor contraste em pastel)
            fontSize: 16,
            fontWeight: "700",
            fontFamily: "Manrope_700Bold",
          }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

// ===========================================
// COMPONENTE PRINCIPAL: LoginScreen
// ===========================================
export default function LoginScreen({ navigation }: Props) {
  void navigation;
  const insets = useSafeAreaInsets();
  const { surface, text: textColors } = useTheme();

  // Estados
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Validação simples de email
  const validateEmail = (value: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  // Handlers (sem auth real - apenas UI states)
  const handleApplePress = () => {
    setAppleLoading(true);
    setError(null);
    // Simulação: callback para auth real seria chamado aqui
    // onPressApple?.();
    setTimeout(() => {
      setAppleLoading(false);
      // Simular sucesso ou erro
    }, 2000);
  };

  const handleGooglePress = () => {
    setGoogleLoading(true);
    setError(null);
    // Simulação: callback para auth real seria chamado aqui
    // onPressGoogle?.();
    setTimeout(() => {
      setGoogleLoading(false);
      // Simular sucesso ou erro
    }, 2000);
  };

  const handleContinueEmail = () => {
    Keyboard.dismiss();

    if (!email) {
      setError("Digite seu email para continuar");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email inválido");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulação: callback para auth real seria chamado aqui
    // onContinueEmail?.(email);
    setTimeout(() => {
      setIsLoading(false);
      // Simular sucesso
      // onLoginSuccess?.();
    }, 2000);
  };

  // Responsividade: padding reduzido para telas < 360px
  const horizontalPadding = SCREEN_WIDTH < 360 ? 16 : 24;
  // Logo: 60x60 base, 52x52 para compact (< 340px)
  const logoSize = SCREEN_WIDTH < 340 ? 52 : 60;

  return (
    <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: surface.base,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1, // POLISH: permite centralização
              justifyContent: "center", // POLISH: centraliza verticalmente
              paddingTop: Math.max(insets.top, 24),
              paddingBottom: Math.max(insets.bottom, 24),
              paddingHorizontal: horizontalPadding,
              maxWidth: 400, // Tablet: centralizado
              alignSelf: "center",
              width: "100%",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(100)}
              style={{
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Image
                source={LOGO_IMAGE}
                style={{
                  width: logoSize,
                  height: logoSize,
                  borderRadius: logoSize / 2,
                }}
                resizeMode="cover"
                accessibilityLabel="Logo Nossa Maternidade"
              />
            </Animated.View>

            {/* Header */}
            <Animated.View
              entering={FadeInDown.duration(500).delay(200)}
              style={{ alignItems: "center", marginBottom: 32 }} // POLISH: 40 → 32
            >
              <Text
                style={{
                  fontSize: 26, // POLISH: 24 → 26
                  fontWeight: "700",
                  color: textColors.primary,
                  marginBottom: 8,
                  fontFamily: "Manrope_700Bold",
                }}
              >
                Bem-vindo
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: textColors.secondary, // POLISH: já correto
                  textAlign: "center",
                }}
              >
                Faça login ou crie sua conta
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
                label="Email"
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
            <Animated.View entering={FadeInDown.duration(500).delay(600)} style={{ marginTop: 16 }}>
              <CTAButton
                onPress={handleContinueEmail}
                loading={isLoading}
                disabled={appleLoading || googleLoading}
              >
                Continuar
              </CTAButton>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInDown.duration(500).delay(700)} style={{ marginTop: 24 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: textColors.tertiary,
                  textAlign: "center",
                  lineHeight: 16,
                }}
              >
                Ao fazer login, você concorda com nossos{" "}
                <Text
                  style={{ color: textColors.link, textDecorationLine: "underline" }}
                  onPress={() => {
                    // Navigate to terms
                  }}
                >
                  Termos de Serviço
                </Text>
                {" | "}
                <Text
                  style={{ color: textColors.link, textDecorationLine: "underline" }}
                  onPress={() => {
                    // Navigate to privacy
                  }}
                >
                  Política de Privacidade
                </Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}
