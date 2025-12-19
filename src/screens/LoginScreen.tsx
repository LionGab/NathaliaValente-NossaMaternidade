/**
 * Nossa Maternidade - LoginScreen
 * Design baseado no mockup screen.png
 * - Gradiente azul claro → branco
 * - Logo circular com ilustração
 * - Social login: Google, Facebook, Apple
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useAppStore } from "../state/store";
import * as Haptics from "expo-haptics";
import { signIn, signUp, getSession, resetPassword } from "../api/auth";
import {
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  isAppleSignInAvailable,
  type SocialProvider,
} from "../api/social-auth";
import {
  UserProfile,
  PregnancyStage,
  Interest,
  RootStackScreenProps,
} from "../types/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  COLORS,
  SPACING,
  RADIUS,
  SHADOWS,
} from "../theme/design-system";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Calcular valores responsivos
const getResponsiveValue = (baseValue: number, scale: number = 1) => {
  const scaleFactor = SCREEN_WIDTH / 375;
  return Math.round(baseValue * scaleFactor * scale);
};

type Props = RootStackScreenProps<"Login">;

// Logo ilustração (mãe com bebê em círculo)
const LOGO_IMAGE = require("../../assets/logo-01.png");

// Logo do Google
const GOOGLE_LOGO = require("../../assets/google-logo.jpg");

// Cores do mockup - Paleta Rosa & Azul
const MOCKUP_COLORS = {
  gradientTop: "#FFF0F5",    // Rosa lavanda suave (fundo)
  gradientBottom: "#FFFFFF", // Branco
  primary: "#FF6B9D",        // Rosa primário - botão Entrar
  primaryDark: "#E85A8A",    // Rosa escuro - pressed state
  primaryLight: "#FFB6C1",   // Rosa claro - elementos secundários
  text: "#2B3642",           // Texto escuro
  textMuted: "#8694A6",      // Texto secundário
  inputBg: "#FFFFFF",
  inputBorder: "#FFD5E5",    // Rosa pastel - borda dos inputs
  checkmark: "#FF6B9D",      // Rosa - ícones de validação
  link: "#4A90D9",           // Azul - link "Esqueceu a senha?"
  ctaAccent: "#F4258C",      // Rosa APENAS para CTA "Cadastre-se"
};

// Componente de Logo circular com imagem
const LogoCircle = () => {
  return (
    <Animated.View
      entering={FadeInUp.duration(700).springify()}
      style={{
        marginBottom: SPACING.xl,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Container com sombra sutil */}
      <View
        style={{
          shadowColor: MOCKUP_COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
          borderRadius: 85,
        }}
      >
        <Image
          source={LOGO_IMAGE}
          style={{
            width: 160,
            height: 160,
            borderRadius: 80,
          }}
          resizeMode="cover"
          accessibilityLabel="Logo Nossa Maternidade"
        />
      </View>
    </Animated.View>
  );
};

// Componente de Input personalizado - Production Ready
const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  autoCorrect,
  error,
  isValid,
  textContentType,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words";
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  autoCorrect?: boolean;
  error?: string;
  isValid?: boolean;
  textContentType?: "emailAddress" | "password" | "newPassword" | "name" | "none";
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error && value) return COLORS.semantic.error;
    if (isFocused) return MOCKUP_COLORS.primary;
    return MOCKUP_COLORS.inputBorder;
  };

  return (
    <View style={{ marginBottom: SPACING.lg }}>
      {/* Label */}
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: MOCKUP_COLORS.textMuted,
          marginBottom: SPACING.sm,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
        accessibilityElementsHidden={true}
      >
        {label}
      </Text>

      {/* Input Container */}
      <View
        style={{
          backgroundColor: MOCKUP_COLORS.inputBg,
          borderRadius: RADIUS.xl,
          borderWidth: 1,
          borderColor: getBorderColor(),
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          minHeight: 56,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: MOCKUP_COLORS.text,
            paddingVertical: SPACING.md,
          }}
          placeholder={placeholder}
          placeholderTextColor={MOCKUP_COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          textContentType={textContentType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={`Campo para digitar ${label.toLowerCase()}`}
        />

        {/* Password Toggle - 44pt tap target */}
        {showPasswordToggle && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onTogglePassword?.();
            }}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              marginRight: -SPACING.sm,
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            accessibilityHint={showPassword ? "Toque para ocultar a senha" : "Toque para mostrar a senha"}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={MOCKUP_COLORS.textMuted}
            />
          </Pressable>
        )}

        {/* Checkmark para válido */}
        {isValid && value && !error && (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: MOCKUP_COLORS.checkmark,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityLabel="Campo válido"
          >
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Error */}
      {error && value && (
        <Text
          style={{
            fontSize: 12,
            color: COLORS.semantic.error,
            marginTop: SPACING.xs,
            marginLeft: SPACING.sm,
          }}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

// Componente de Alert customizado
const CustomAlert = ({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: SPACING["2xl"],
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: RADIUS["2xl"],
            padding: SPACING["2xl"],
            width: "100%",
            maxWidth: 320,
            ...SHADOWS.xl,
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: MOCKUP_COLORS.gradientTop,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: SPACING.lg,
            }}
          >
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color={MOCKUP_COLORS.primary}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: MOCKUP_COLORS.text,
              textAlign: "center",
              marginBottom: SPACING.sm,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: MOCKUP_COLORS.textMuted,
              textAlign: "center",
              marginBottom: SPACING.xl,
              lineHeight: 22,
            }}
          >
            {message}
          </Text>
          <Pressable
            onPress={onClose}
            style={{
              backgroundColor: MOCKUP_COLORS.primary,
              borderRadius: RADIUS.lg,
              paddingVertical: SPACING.md,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              Entendi
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default function LoginScreen({ navigation }: Props) {
  void navigation;
  const insets = useSafeAreaInsets();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [appleSignInAvailable, setAppleSignInAvailable] = useState(true);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const [errors, setErrors] = useState({ email: "", password: "", name: "", confirmPassword: "" });
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const setUser = useAppStore((s) => s.setUser);

  // Verificar disponibilidade de biometric e Apple Sign In
  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricAvailable(compatible && enrolled);
      } catch {
        setBiometricAvailable(false);
      }
    };

    const checkAppleSignIn = async () => {
      const available = await isAppleSignInAvailable();
      setAppleSignInAvailable(available);
    };

    checkBiometric();
    checkAppleSignIn();
  }, []);

  // Validações
  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const validatePassword = (passwordValue: string): boolean => {
    return passwordValue.length >= 6;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setErrors((prev) => ({ ...prev, email: "Email inválido" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (text && !validatePassword(text)) {
      setErrors((prev) => ({ ...prev, password: "Mínimo 6 caracteres" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (text && text.length < 2) {
      setErrors((prev) => ({ ...prev, name: "Nome muito curto" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (text && text !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Senhas não coincidem" }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Biometric Login
  const handleBiometricLogin = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLoading(true);
        const { session, error } = await getSession();

        if (error || !session?.user) {
          setIsLoading(false);
          showAlert(
            "Sessão não encontrada",
            "Faça login com email e senha primeiro para ativar a biometria."
          );
          return;
        }

        const authUser = session.user;
        const userProfile: UserProfile = {
          id: authUser.id,
          name: authUser.user_metadata?.name || "Usuária",
          email: authUser.email || "",
          avatarUrl: authUser.user_metadata?.avatar_url || "",
          stage: (authUser.user_metadata?.stage as PregnancyStage) || "pregnant",
          dueDate: authUser.user_metadata?.dueDate,
          interests: (authUser.user_metadata?.interests as Interest[]) || [],
          createdAt: authUser.created_at || new Date().toISOString(),
          hasCompletedOnboarding: authUser.user_metadata?.hasCompletedOnboarding || false,
        };

        setUser(userProfile);
        setAuthenticated(true);
        setIsLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      showAlert("Erro", "Falha na autenticação biométrica");
    }
  };

  // Social Login - Integração real com Google, Apple e Facebook
  const handleSocialLogin = async (provider: SocialProvider) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Evitar múltiplos cliques
    if (socialLoading || isLoading) return;

    setSocialLoading(provider);

    try {
      let result;

      switch (provider) {
        case "google":
          result = await signInWithGoogle();
          break;
        case "apple":
          result = await signInWithApple();
          break;
        case "facebook":
          result = await signInWithFacebook();
          break;
      }

      if (result.success && result.user) {
        // Criar perfil do usuário
        const userProfile: UserProfile = {
          id: result.user.id,
          name: result.user.name || "Usuária",
          email: result.user.email,
          avatarUrl: result.user.avatarUrl || "",
          stage: "pregnant" as PregnancyStage,
          dueDate: undefined,
          interests: [] as Interest[],
          createdAt: new Date().toISOString(),
          hasCompletedOnboarding: false,
        };

        setUser(userProfile);
        setAuthenticated(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (result.error) {
        // Não mostrar alert se foi cancelamento do usuário
        if (result.error !== "Login cancelado") {
          const providerNames = {
            apple: "Apple",
            google: "Google",
            facebook: "Facebook",
          };
          showAlert(
            `Erro no login com ${providerNames[provider]}`,
            result.error
          );
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      showAlert("Erro", errorMessage);
    } finally {
      setSocialLoading(null);
    }
  };

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const showAlert = (title: string, message: string) => {
    setAlertConfig({ visible: true, title, message });
  };

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    buttonScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      buttonScale.value = withSpring(1, { damping: 15 });
    }, 100);

    if (!email || !password) {
      showAlert("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Email inválido", "Por favor, insira um email válido.");
      return;
    }

    if (!validatePassword(password)) {
      showAlert("Senha fraca", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (!isLogin) {
      if (!name || name.length < 2) {
        showAlert("Nome inválido", "Por favor, insira um nome válido.");
        return;
      }

      if (password !== confirmPassword) {
        showAlert("Senhas diferentes", "As senhas não coincidem.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { user: authUser, error } = await signIn(email, password);

        if (error || !authUser) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes("Invalid login credentials")) {
            showAlert("Email ou senha incorretos", "Verifique suas credenciais e tente novamente.");
          } else if (errorMessage.includes("Email not confirmed")) {
            showAlert("Email não confirmado", "Verifique sua caixa de entrada e confirme seu email.");
          } else {
            showAlert("Erro no login", errorMessage || "Tente novamente mais tarde.");
          }
          setIsLoading(false);
          return;
        }

        const userProfile: UserProfile = {
          id: authUser.id,
          name: authUser.user_metadata?.name || name || "Usuária",
          email: authUser.email || email,
          avatarUrl: authUser.user_metadata?.avatar_url || "",
          stage: (authUser.user_metadata?.stage as PregnancyStage) || "pregnant",
          dueDate: authUser.user_metadata?.dueDate,
          interests: (authUser.user_metadata?.interests as Interest[]) || [],
          createdAt: authUser.created_at || new Date().toISOString(),
          hasCompletedOnboarding: authUser.user_metadata?.hasCompletedOnboarding || false,
        };

        setUser(userProfile);
        setAuthenticated(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        const { user: authUser, error } = await signUp(email, password, name);

        if (error || !authUser) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes("already registered")) {
            showAlert("Email já cadastrado", "Este email já está em uso. Tente fazer login.");
          } else if (errorMessage.includes("Password should be")) {
            showAlert("Senha fraca", "A senha deve ter no mínimo 6 caracteres.");
          } else {
            showAlert("Erro no cadastro", errorMessage || "Tente novamente mais tarde.");
          }
          setIsLoading(false);
          return;
        }

        const userProfile: UserProfile = {
          id: authUser.id,
          name: name,
          email: authUser.email || email,
          avatarUrl: "",
          stage: "pregnant" as PregnancyStage,
          dueDate: undefined,
          interests: [] as Interest[],
          createdAt: authUser.created_at || new Date().toISOString(),
          hasCompletedOnboarding: false,
        };

        setUser(userProfile);
        setAuthenticated(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      showAlert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setErrors({ email: "", password: "", name: "", confirmPassword: "" });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Gradiente de fundo */}
        <LinearGradient
          colors={[MOCKUP_COLORS.gradientTop, MOCKUP_COLORS.gradientBottom]}
          style={{ flex: 1 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: insets.top + getResponsiveValue(40),
              paddingBottom: insets.bottom + getResponsiveValue(24),
              paddingHorizontal: getResponsiveValue(24),
              maxWidth: 500,
              alignSelf: "center",
              width: "100%",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <LogoCircle />

            {/* Título */}
            <Animated.View
              entering={FadeInUp.duration(600).delay(100).springify()}
              style={{ alignItems: "center", marginBottom: SPACING["3xl"] }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: MOCKUP_COLORS.text,
                  marginBottom: SPACING.sm,
                  fontFamily: "Manrope_700Bold",
                }}
              >
                Nossa Maternidade
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: MOCKUP_COLORS.textMuted,
                }}
              >
                {isLogin ? "Feliz em ter você de volta ✨" : "Sua jornada começa aqui 💜"}
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeInDown.duration(600).delay(200).springify()}
            >
              {/* Nome (apenas cadastro) */}
              {!isLogin && (
                <CustomInput
                  label="NOME"
                  placeholder="Como você se chama?"
                  value={name}
                  onChangeText={handleNameChange}
                  autoCapitalize="words"
                  textContentType="name"
                  error={errors.name || undefined}
                  isValid={name.length >= 2}
                />
              )}

              {/* Email - Production: textContentType para autofill */}
              <CustomInput
                label="E-MAIL"
                placeholder="seu@email.com"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                error={errors.email || undefined}
                isValid={email ? validateEmail(email) : false}
              />

              {/* Senha - Production: textContentType para autofill */}
              <CustomInput
                label="SENHA"
                placeholder="••••••••"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType={isLogin ? "password" : "newPassword"}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                error={errors.password || undefined}
                isValid={password ? validatePassword(password) : false}
              />

              {/* Confirmar Senha (apenas cadastro) */}
              {!isLogin && (
                <CustomInput
                  label="CONFIRMAR SENHA"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  textContentType="newPassword"
                  error={errors.confirmPassword || undefined}
                  isValid={confirmPassword ? confirmPassword === password : false}
                />
              )}

              {/* Esqueceu a senha - Link azul (não rosa) */}
              {isLogin && (
                <Pressable
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (!email || !validateEmail(email)) {
                      showAlert(
                        "Email necessário",
                        "Digite seu email acima para receber o link de recuperação."
                      );
                      return;
                    }
                    setIsLoading(true);
                    const { error } = await resetPassword(email);
                    setIsLoading(false);
                    if (error) {
                      showAlert("Erro", "Não foi possível enviar o email. Tente novamente.");
                    } else {
                      showAlert(
                        "Email enviado",
                        "Verifique sua caixa de entrada para redefinir sua senha."
                      );
                    }
                  }}
                  style={{
                    alignSelf: "flex-end",
                    marginTop: -SPACING.sm,
                    marginBottom: SPACING.xl,
                    minHeight: 44, // ACCESSIBILITY: 44pt tap target
                    justifyContent: "center",
                  }}
                  hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                  accessibilityRole="link"
                  accessibilityLabel="Esqueceu a senha"
                  accessibilityHint="Toque para receber email de recuperação de senha"
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: MOCKUP_COLORS.link,
                      fontWeight: "600",
                      textDecorationLine: "underline",
                    }}
                  >
                    Esqueceu a senha?
                  </Text>
                </Pressable>
              )}

              {/* Botão Principal - CTA com contraste WCAG AA */}
              <Animated.View style={[buttonAnimatedStyle, { marginTop: SPACING.lg }]}>
                <Pressable
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? MOCKUP_COLORS.primaryDark : MOCKUP_COLORS.primary,
                    borderRadius: RADIUS["2xl"],
                    height: 56,
                    minHeight: 56, // ACCESSIBILITY: 44pt+ tap target
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isLoading ? 0.7 : 1,
                  })}
                  accessibilityLabel={isLogin ? "Entrar na conta" : "Criar nova conta"}
                  accessibilityRole="button"
                  accessibilityHint={isLogin ? "Toque para fazer login" : "Toque para criar sua conta"}
                  accessibilityState={{ disabled: isLoading }}
                >
                  {isLoading ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons
                        name="sync-outline"
                        size={20}
                        color="#FFFFFF"
                        style={{ marginRight: SPACING.sm }}
                      />
                      <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
                        {isLogin ? "Entrando..." : "Criando..."}
                      </Text>
                    </View>
                  ) : (
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
                      {isLogin ? "Entrar" : "Criar minha conta"}
                    </Text>
                  )}
                </Pressable>
              </Animated.View>

              {/* Divisor */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: SPACING["2xl"],
                }}
              >
                <View style={{ flex: 1, height: 1, backgroundColor: MOCKUP_COLORS.inputBorder }} />
                <Text
                  style={{
                    paddingHorizontal: SPACING.lg,
                    color: MOCKUP_COLORS.textMuted,
                    fontSize: 14,
                  }}
                >
                  ou
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: MOCKUP_COLORS.inputBorder }} />
              </View>

              {/* Social Login - Design inspirado em Flo, Clue, Ovia */}
              {/* Botões completos com texto para melhor UX */}
              <View style={{ gap: SPACING.md, marginBottom: SPACING.xl }}>
                {/* Apple - Primeira opção no iOS (Apple HIG) */}
                {appleSignInAvailable && (
                  <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <Pressable
                      onPress={() => handleSocialLogin("apple")}
                      disabled={socialLoading !== null || isLoading}
                      style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: pressed ? "#1a1a1a" : "#000000",
                        borderRadius: RADIUS.xl,
                        height: 52,
                        gap: SPACING.sm,
                        opacity: socialLoading === "apple" ? 0.7 : 1,
                      })}
                      accessibilityLabel="Continuar com Apple"
                      accessibilityRole="button"
                    >
                      {socialLoading === "apple" ? (
                        <Ionicons name="sync-outline" size={20} color="#FFFFFF" />
                      ) : (
                        <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                      )}
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        {socialLoading === "apple" ? "Conectando..." : "Continuar com Apple"}
                      </Text>
                    </Pressable>
                  </Animated.View>
                )}

                {/* Google - Segunda opção, popular em Android */}
                <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                  <Pressable
                    onPress={() => handleSocialLogin("google")}
                    disabled={socialLoading !== null || isLoading}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: pressed ? "#f5f5f5" : "#FFFFFF",
                      borderRadius: RADIUS.xl,
                      height: 52,
                      gap: SPACING.sm,
                      borderWidth: 1,
                      borderColor: MOCKUP_COLORS.inputBorder,
                      opacity: socialLoading === "google" ? 0.7 : 1,
                    })}
                    accessibilityLabel="Continuar com Google"
                    accessibilityRole="button"
                  >
                    {socialLoading === "google" ? (
                      <Ionicons name="sync-outline" size={20} color={MOCKUP_COLORS.text} />
                    ) : (
                      <Image
                        source={GOOGLE_LOGO}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                      />
                    )}
                    <Text
                      style={{
                        color: MOCKUP_COLORS.text,
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {socialLoading === "google" ? "Conectando..." : "Continuar com Google"}
                    </Text>
                  </Pressable>
                </Animated.View>

                {/* Facebook - Terceira opção */}
                <Animated.View entering={FadeInDown.duration(400).delay(300)}>
                  <Pressable
                    onPress={() => handleSocialLogin("facebook")}
                    disabled={socialLoading !== null || isLoading}
                    style={({ pressed }) => ({
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: pressed ? "#3A7BC8" : "#4A90D9",
                      borderRadius: RADIUS.xl,
                      height: 52,
                      gap: SPACING.sm,
                      opacity: socialLoading === "facebook" ? 0.7 : 1,
                    })}
                    accessibilityLabel="Continuar com Facebook"
                    accessibilityRole="button"
                  >
                    {socialLoading === "facebook" ? (
                      <Ionicons name="sync-outline" size={20} color="#FFFFFF" />
                    ) : (
                      <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
                    )}
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {socialLoading === "facebook" ? "Conectando..." : "Continuar com Facebook"}
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>

              {/* Biometric Login */}
              {biometricAvailable && isLogin && (
                <Animated.View
                  entering={FadeIn.duration(400)}
                  style={{ marginBottom: SPACING.xl }}
                >
                  <Pressable
                    onPress={handleBiometricLogin}
                    disabled={isLoading}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingVertical: SPACING.md,
                      gap: SPACING.sm,
                    }}
                    accessibilityLabel="Login com biometria"
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name="finger-print"
                      size={20}
                      color={MOCKUP_COLORS.primary}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: MOCKUP_COLORS.primary,
                      }}
                    >
                      Usar biometria
                    </Text>
                  </Pressable>
                </Animated.View>
              )}

              {/* Alternar modo - Rosa APENAS aqui (CTA secundário) */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: SPACING.lg,
                  minHeight: 44, // ACCESSIBILITY: 44pt tap target
                }}
              >
                <Text style={{ color: MOCKUP_COLORS.textMuted, fontSize: 14 }}>
                  {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
                </Text>
                <Pressable
                  onPress={toggleMode}
                  hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={isLogin ? "Criar nova conta" : "Fazer login"}
                  accessibilityHint={isLogin ? "Toque para ir ao cadastro" : "Toque para ir ao login"}
                >
                  <Text
                    style={{
                      color: MOCKUP_COLORS.ctaAccent, // Rosa para CTA de ação
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {isLogin ? "Cadastre-se" : "Entre"}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </ScrollView>
        </LinearGradient>

        {/* Custom Alert */}
        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertConfig({ visible: false, title: "", message: "" })}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
