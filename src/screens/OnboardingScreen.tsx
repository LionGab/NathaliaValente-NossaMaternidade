/**
 * Nossa Maternidade - Onboarding Principal
 * Coleta dados essenciais: nome, fase, DPP/idade do bebê, interesses
 * Design premium com animações fluidas
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppStore } from "../state/store";
import { logger } from "../utils/logger";
import {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
} from "../theme/design-system";
import { PregnancyStage, Interest } from "../types/navigation";

// Font constants
const FONTS = {
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semiBold: "DMSans_600SemiBold",
  bold: "DMSans_700Bold",
  serif: "DMSerifDisplay_400Regular",
};

// Steps do onboarding
type OnboardingStep = "welcome" | "theme" | "name" | "stage" | "date" | "interests" | "complete";

const STEPS_ORDER: OnboardingStep[] = ["welcome", "theme", "name", "stage", "date", "interests", "complete"];

// Tipo para seleção de tema
type ThemeOption = "light" | "dark" | "system";

// Opções de fase
const STAGE_OPTIONS: { id: PregnancyStage; emoji: string; label: string; description: string }[] = [
  {
    id: "trying",
    emoji: "🌱",
    label: "Tentante",
    description: "Estou tentando engravidar",
  },
  {
    id: "pregnant",
    emoji: "🤰",
    label: "Gestante",
    description: "Estou grávida",
  },
  {
    id: "postpartum",
    emoji: "👶",
    label: "Mãe",
    description: "Já sou mãe",
  },
];

// Opções de interesses
const INTEREST_OPTIONS: { id: Interest; emoji: string; label: string }[] = [
  { id: "nutrition", emoji: "🥗", label: "Alimentação" },
  { id: "exercise", emoji: "🧘", label: "Exercícios" },
  { id: "mental_health", emoji: "🧠", label: "Saúde Mental" },
  { id: "baby_care", emoji: "👶", label: "Cuidados com Bebê" },
  { id: "breastfeeding", emoji: "🤱", label: "Amamentação" },
  { id: "sleep", emoji: "😴", label: "Sono" },
  { id: "relationships", emoji: "💑", label: "Relacionamentos" },
  { id: "career", emoji: "💼", label: "Carreira" },
];

// Componente de botão de opção reutilizável
const OptionButton = ({
  selected,
  onPress,
  emoji,
  label,
  description,
}: {
  selected: boolean;
  onPress: () => void;
  emoji: string;
  label: string;
  description?: string;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.96, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: selected ? COLORS.primary[50] : COLORS.neutral[0],
          borderRadius: RADIUS.lg,
          padding: SPACING.lg,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? COLORS.primary[500] : COLORS.neutral[200],
          marginBottom: SPACING.sm,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 28, marginRight: SPACING.md }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: TYPOGRAPHY.sizes.lg,
              fontFamily: FONTS.semiBold,
              color: selected ? COLORS.primary[700] : COLORS.neutral[800],
            }}
          >
            {label}
          </Text>
          {description && (
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.sm,
                color: COLORS.neutral[500],
                marginTop: 2,
              }}
            >
              {description}
            </Text>
          )}
        </View>
        {selected && (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.primary[500]} />
        )}
      </Pressable>
    </Animated.View>
  );
};

// Componente de chip para interesses (multi-select)
const InterestChip = ({
  selected,
  onPress,
  emoji,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  emoji: string;
  label: string;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onPress();
  };

  return (
    <Animated.View style={[animatedStyle, { width: "48%", marginBottom: SPACING.sm }]}>
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: selected ? COLORS.primary[50] : COLORS.neutral[0],
          borderRadius: RADIUS.lg,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.md,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? COLORS.primary[500] : COLORS.neutral[200],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 20, marginRight: SPACING.xs }}>{emoji}</Text>
        <Text
          style={{
            fontSize: TYPOGRAPHY.sizes.sm,
            fontFamily: selected ? FONTS.semiBold : FONTS.medium,
            color: selected ? COLORS.primary[700] : COLORS.neutral[700],
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();

  // Store
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const updateOnboardingDraft = useAppStore((s) => s.updateOnboardingDraft);
  const updateUser = useAppStore((s) => s.updateUser);
  const onboardingDraft = useAppStore((s) => s.onboardingDraft);
  const setTheme = useAppStore((s) => s.setTheme);
  const currentTheme = useAppStore((s) => s.theme);

  // Local state
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(currentTheme || "light");
  const [name, setName] = useState(onboardingDraft.name || "");
  const [stage, setStage] = useState<PregnancyStage | null>(onboardingDraft.stage);
  const [dueDate, setDueDate] = useState<Date | null>(
    onboardingDraft.dueDate ? new Date(onboardingDraft.dueDate) : null
  );
  const [babyBirthDate, setBabyBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [interests, setInterests] = useState<Interest[]>(onboardingDraft.interests || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Progress
  const currentIndex = STEPS_ORDER.indexOf(currentStep);
  const progress = (currentIndex / (STEPS_ORDER.length - 1)) * 100;

  // Navigation
  const goNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < STEPS_ORDER.length) {
      // Skip date step if trying
      if (STEPS_ORDER[nextIndex] === "date" && stage === "trying") {
        setCurrentStep(STEPS_ORDER[nextIndex + 1]);
      } else {
        setCurrentStep(STEPS_ORDER[nextIndex]);
      }
    }
  }, [currentIndex, stage]);

  const goBack = useCallback(() => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      // Skip date step if trying
      if (STEPS_ORDER[prevIndex] === "date" && stage === "trying") {
        setCurrentStep(STEPS_ORDER[prevIndex - 1]);
      } else {
        setCurrentStep(STEPS_ORDER[prevIndex]);
      }
    }
  }, [currentIndex, stage]);

  // Toggle interest
  const toggleInterest = (interest: Interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Save to store draft
      updateOnboardingDraft({
        name,
        stage,
        dueDate: dueDate?.toISOString() || null,
        interests,
      });

      // Update user in store
      updateUser({
        name,
        stage: stage || "pregnant",
        dueDate: stage === "pregnant" ? dueDate?.toISOString() : undefined,
        babyBirthDate: stage === "postpartum" ? babyBirthDate?.toISOString() : undefined,
        interests,
        hasCompletedOnboarding: true,
      });

      // Mark onboarding complete
      setOnboardingComplete(true);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logger.info("Onboarding completed", "Onboarding", { name, stage, interests });
    } catch (error) {
      logger.error("Onboarding error", "Onboarding", error as Error);
      // Still mark as complete to avoid blocking user
      setOnboardingComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Date picker handler
  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      if (stage === "pregnant") {
        setDueDate(selectedDate);
      } else {
        setBabyBirthDate(selectedDate);
      }
    }
  };

  // Handle theme selection (apply immediately like Instagram/WhatsApp)
  const handleThemeSelect = (theme: ThemeOption) => {
    setSelectedTheme(theme);
    setTheme(theme); // Apply immediately for visual feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Can proceed?
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case "welcome":
        return true;
      case "theme":
        return selectedTheme !== null;
      case "name":
        return name.trim().length >= 2;
      case "stage":
        return stage !== null;
      case "date":
        return stage === "pregnant" ? dueDate !== null : babyBirthDate !== null;
      case "interests":
        return interests.length >= 1;
      case "complete":
        return true;
      default:
        return false;
    }
  }, [currentStep, name, stage, dueDate, babyBirthDate, interests, selectedTheme]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <Animated.View entering={FadeIn.duration(500)} style={{ flex: 1, justifyContent: "center" }}>
            <View style={{ alignItems: "center", marginBottom: SPACING.xl }}>
              <Image
                source={require("../../assets/nathalia-avatar.jpg")}
                style={{ width: 120, height: 120, borderRadius: 60, marginBottom: SPACING.lg }}
                resizeMode="cover"
              />
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: FONTS.serif,
                  color: COLORS.primary[600],
                  textAlign: "center",
                  marginBottom: SPACING.sm,
                }}
              >
                Bem-vinda ao{"\n"}Nossa Maternidade
              </Text>
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.lg,
                  fontFamily: FONTS.regular,
                  color: COLORS.neutral[600],
                  textAlign: "center",
                  paddingHorizontal: SPACING.lg,
                }}
              >
                Sou a Nathalia Valente e vou te acompanhar nessa jornada incrível
              </Text>
            </View>

            <Animated.View entering={FadeInUp.delay(300)}>
              <View style={{ backgroundColor: COLORS.primary[50], borderRadius: RADIUS.lg, padding: SPACING.lg, marginHorizontal: SPACING.md }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.sm }}>
                  <Ionicons name="heart" size={20} color={COLORS.primary[500]} />
                  <Text style={{ marginLeft: SPACING.sm, fontFamily: FONTS.semiBold, color: COLORS.primary[700] }}>
                    O que você encontra aqui:
                  </Text>
                </View>
                <Text style={{ color: COLORS.neutral[700], lineHeight: 22, fontFamily: FONTS.regular }}>
                  • Acompanhamento personalizado da gestação{"\n"}
                  • NathIA: sua assistente de IA 24/7{"\n"}
                  • Comunidade de mães para trocar experiências{"\n"}
                  • Hábitos e afirmações para seu bem-estar
                </Text>
              </View>
            </Animated.View>
          </Animated.View>
        );

      case "theme":
        return (
          <Animated.View entering={SlideInRight.duration(400)} exiting={SlideOutLeft.duration(300)}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: FONTS.serif,
                color: COLORS.primary[700],
                textAlign: "center",
                marginBottom: SPACING.sm,
              }}
            >
              Escolha sua aparência
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.md,
                color: COLORS.neutral[500],
                textAlign: "center",
                marginBottom: SPACING.xl,
                fontFamily: FONTS.regular,
              }}
            >
              Você pode alterar depois nas configurações
            </Text>

            {/* Theme Preview Cards - Inspired by Instagram/WhatsApp */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: SPACING.lg }}>
              {/* Light Theme Preview */}
              <Pressable
                onPress={() => handleThemeSelect("light")}
                style={{
                  flex: 1,
                  marginRight: SPACING.sm,
                  borderRadius: RADIUS.lg,
                  borderWidth: selectedTheme === "light" ? 3 : 1,
                  borderColor: selectedTheme === "light" ? COLORS.primary[500] : COLORS.neutral[200],
                  overflow: "hidden",
                }}
              >
                {/* Mini Preview */}
                <View style={{ backgroundColor: "#F8FAFC", padding: SPACING.md, height: 120 }}>
                  <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, padding: 8, marginBottom: 6 }}>
                    <View style={{ backgroundColor: "#E2E8F0", height: 8, width: "70%", borderRadius: 4 }} />
                  </View>
                  <View style={{ backgroundColor: "#FFFFFF", borderRadius: 8, padding: 8 }}>
                    <View style={{ backgroundColor: "#E2E8F0", height: 8, width: "50%", borderRadius: 4 }} />
                  </View>
                </View>
                <View style={{ backgroundColor: COLORS.neutral[0], padding: SPACING.md, alignItems: "center" }}>
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>☀️</Text>
                  <Text style={{ fontFamily: FONTS.semiBold, color: COLORS.neutral[800] }}>Claro</Text>
                </View>
                {selectedTheme === "light" && (
                  <View style={{ position: "absolute", top: 8, right: 8 }}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary[500]} />
                  </View>
                )}
              </Pressable>

              {/* Dark Theme Preview */}
              <Pressable
                onPress={() => handleThemeSelect("dark")}
                style={{
                  flex: 1,
                  marginLeft: SPACING.sm,
                  borderRadius: RADIUS.lg,
                  borderWidth: selectedTheme === "dark" ? 3 : 1,
                  borderColor: selectedTheme === "dark" ? COLORS.primary[500] : COLORS.neutral[200],
                  overflow: "hidden",
                }}
              >
                {/* Mini Preview */}
                <View style={{ backgroundColor: "#1E293B", padding: SPACING.md, height: 120 }}>
                  <View style={{ backgroundColor: "#334155", borderRadius: 8, padding: 8, marginBottom: 6 }}>
                    <View style={{ backgroundColor: "#475569", height: 8, width: "70%", borderRadius: 4 }} />
                  </View>
                  <View style={{ backgroundColor: "#334155", borderRadius: 8, padding: 8 }}>
                    <View style={{ backgroundColor: "#475569", height: 8, width: "50%", borderRadius: 4 }} />
                  </View>
                </View>
                <View style={{ backgroundColor: "#0F172A", padding: SPACING.md, alignItems: "center" }}>
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>🌙</Text>
                  <Text style={{ fontFamily: FONTS.semiBold, color: "#F1F5F9" }}>Escuro</Text>
                </View>
                {selectedTheme === "dark" && (
                  <View style={{ position: "absolute", top: 8, right: 8 }}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary[500]} />
                  </View>
                )}
              </Pressable>
            </View>

            {/* System Option */}
            <Pressable
              onPress={() => handleThemeSelect("system")}
              style={{
                backgroundColor: selectedTheme === "system" ? COLORS.primary[50] : COLORS.neutral[0],
                borderRadius: RADIUS.lg,
                padding: SPACING.lg,
                borderWidth: selectedTheme === "system" ? 2 : 1,
                borderColor: selectedTheme === "system" ? COLORS.primary[500] : COLORS.neutral[200],
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 28, marginRight: SPACING.md }}>📱</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.lg,
                    fontFamily: FONTS.semiBold,
                    color: selectedTheme === "system" ? COLORS.primary[700] : COLORS.neutral[800],
                  }}
                >
                  Automático
                </Text>
                <Text
                  style={{
                    fontSize: TYPOGRAPHY.sizes.sm,
                    color: COLORS.neutral[500],
                    marginTop: 2,
                  }}
                >
                  Segue as configurações do seu dispositivo
                </Text>
              </View>
              {selectedTheme === "system" && (
                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary[500]} />
              )}
            </Pressable>
          </Animated.View>
        );

      case "name":
        return (
          <Animated.View entering={SlideInRight.duration(400)} exiting={SlideOutLeft.duration(300)}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: FONTS.serif,
                color: COLORS.primary[700],
                textAlign: "center",
                marginBottom: SPACING.sm,
              }}
            >
              Como posso te chamar?
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.md,
                color: COLORS.neutral[500],
                textAlign: "center",
                marginBottom: SPACING.xl,
                fontFamily: FONTS.regular,
              }}
            >
              Seu nome ajuda a personalizar sua experiência
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
              placeholderTextColor={COLORS.neutral[400]}
              autoFocus
              style={{
                backgroundColor: COLORS.neutral[0],
                borderRadius: RADIUS.lg,
                padding: SPACING.lg,
                fontSize: TYPOGRAPHY.sizes.lg,
                fontFamily: FONTS.medium,
                color: COLORS.neutral[800],
                borderWidth: 1,
                borderColor: COLORS.neutral[200],
                textAlign: "center",
              }}
            />
          </Animated.View>
        );

      case "stage":
        return (
          <Animated.View entering={SlideInRight.duration(400)} exiting={SlideOutLeft.duration(300)}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: FONTS.serif,
                color: COLORS.primary[700],
                textAlign: "center",
                marginBottom: SPACING.sm,
              }}
            >
              Em qual fase você está?
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.md,
                color: COLORS.neutral[500],
                textAlign: "center",
                marginBottom: SPACING.xl,
                fontFamily: FONTS.regular,
              }}
            >
              Isso nos ajuda a personalizar o conteúdo
            </Text>

            {STAGE_OPTIONS.map((option, index) => (
              <Animated.View key={option.id} entering={FadeInDown.delay(100 * index)}>
                <OptionButton
                  selected={stage === option.id}
                  onPress={() => setStage(option.id)}
                  emoji={option.emoji}
                  label={option.label}
                  description={option.description}
                />
              </Animated.View>
            ))}
          </Animated.View>
        );

      case "date":
        return (
          <Animated.View entering={SlideInRight.duration(400)} exiting={SlideOutLeft.duration(300)}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: FONTS.serif,
                color: COLORS.primary[700],
                textAlign: "center",
                marginBottom: SPACING.sm,
              }}
            >
              {stage === "pregnant" ? "Qual a data prevista do parto?" : "Quando seu bebê nasceu?"}
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.md,
                color: COLORS.neutral[500],
                textAlign: "center",
                marginBottom: SPACING.xl,
                fontFamily: FONTS.regular,
              }}
            >
              {stage === "pregnant"
                ? "A DPP ajuda a acompanhar sua gestação semana a semana"
                : "Isso nos ajuda a personalizar o conteúdo para a idade do seu bebê"}
            </Text>

            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                backgroundColor: COLORS.neutral[0],
                borderRadius: RADIUS.lg,
                padding: SPACING.lg,
                borderWidth: 1,
                borderColor: COLORS.neutral[200],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="calendar" size={24} color={COLORS.primary[500]} style={{ marginRight: SPACING.sm }} />
              <Text
                style={{
                  fontSize: TYPOGRAPHY.sizes.lg,
                  fontFamily: FONTS.medium,
                  color: (stage === "pregnant" ? dueDate : babyBirthDate) ? COLORS.neutral[800] : COLORS.neutral[400],
                }}
              >
                {(stage === "pregnant" ? dueDate : babyBirthDate)
                  ? (stage === "pregnant" ? dueDate : babyBirthDate)!.toLocaleDateString("pt-BR")
                  : "Selecionar data"}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={(stage === "pregnant" ? dueDate : babyBirthDate) || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={stage === "pregnant" ? new Date() : new Date(2020, 0, 1)}
                maximumDate={stage === "pregnant" ? new Date(Date.now() + 280 * 24 * 60 * 60 * 1000) : new Date()}
              />
            )}
          </Animated.View>
        );

      case "interests":
        return (
          <Animated.View entering={SlideInRight.duration(400)} exiting={SlideOutLeft.duration(300)}>
            <Text
              style={{
                fontSize: 24,
                fontFamily: FONTS.serif,
                color: COLORS.primary[700],
                textAlign: "center",
                marginBottom: SPACING.sm,
              }}
            >
              O que te interessa?
            </Text>
            <Text
              style={{
                fontSize: TYPOGRAPHY.sizes.md,
                color: COLORS.neutral[500],
                textAlign: "center",
                marginBottom: SPACING.xl,
                fontFamily: FONTS.regular,
              }}
            >
              Selecione pelo menos 1 tema (pode escolher vários!)
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {INTEREST_OPTIONS.map((option, index) => (
                <Animated.View key={option.id} entering={FadeInDown.delay(50 * index)} style={{ width: "48%" }}>
                  <InterestChip
                    selected={interests.includes(option.id)}
                    onPress={() => toggleInterest(option.id)}
                    emoji={option.emoji}
                    label={option.label}
                  />
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        );

      case "complete":
        return (
          <Animated.View entering={FadeIn.duration(500)} style={{ flex: 1, justifyContent: "center" }}>
            <View style={{ alignItems: "center" }}>
              <Animated.View
                entering={FadeInDown.delay(100)}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: COLORS.semantic.success + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: SPACING.xl,
                }}
              >
                <Ionicons name="checkmark" size={50} color={COLORS.semantic.success} />
              </Animated.View>

              <Animated.Text
                entering={FadeInDown.delay(200)}
                style={{
                  fontSize: 24,
                  fontFamily: FONTS.serif,
                  color: COLORS.primary[700],
                  textAlign: "center",
                  marginBottom: SPACING.sm,
                }}
              >
                Tudo pronto, {name}!
              </Animated.Text>

              <Animated.Text
                entering={FadeInDown.delay(300)}
                style={{
                  fontSize: TYPOGRAPHY.sizes.md,
                  color: COLORS.neutral[600],
                  textAlign: "center",
                  paddingHorizontal: SPACING.lg,
                  marginBottom: SPACING.xl,
                  fontFamily: FONTS.regular,
                }}
              >
                Sua jornada personalizada está pronta. Vamos começar?
              </Animated.Text>

              <Animated.View
                entering={FadeInDown.delay(400)}
                style={{
                  backgroundColor: COLORS.primary[50],
                  borderRadius: RADIUS.lg,
                  padding: SPACING.lg,
                  width: "100%",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.xs }}>
                  <Text style={{ fontSize: 20, marginRight: SPACING.sm }}>
                    {stage === "trying" ? "🌱" : stage === "pregnant" ? "🤰" : "👶"}
                  </Text>
                  <Text style={{ fontFamily: FONTS.semiBold, color: COLORS.primary[700] }}>
                    {stage === "trying" ? "Tentante" : stage === "pregnant" ? "Gestante" : "Mãe"}
                  </Text>
                </View>
                {(stage === "pregnant" && dueDate) && (
                  <Text style={{ color: COLORS.neutral[600], marginBottom: SPACING.xs, fontFamily: FONTS.regular }}>
                    DPP: {dueDate.toLocaleDateString("pt-BR")}
                  </Text>
                )}
                {(stage === "postpartum" && babyBirthDate) && (
                  <Text style={{ color: COLORS.neutral[600], marginBottom: SPACING.xs, fontFamily: FONTS.regular }}>
                    Nascimento: {babyBirthDate.toLocaleDateString("pt-BR")}
                  </Text>
                )}
                <Text style={{ color: COLORS.neutral[500], fontSize: TYPOGRAPHY.sizes.sm, fontFamily: FONTS.regular }}>
                  Interesses: {interests.map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label).join(", ")}
                </Text>
              </Animated.View>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.neutral[0]]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View
            style={{
              paddingTop: insets.top + SPACING.sm,
              paddingHorizontal: SPACING.lg,
              paddingBottom: SPACING.md,
            }}
          >
            {/* Progress bar */}
            <View
              style={{
                height: 4,
                backgroundColor: COLORS.neutral[200],
                borderRadius: 2,
                marginBottom: SPACING.md,
              }}
            >
              <Animated.View
                style={{
                  height: 4,
                  backgroundColor: COLORS.primary[500],
                  borderRadius: 2,
                  width: `${progress}%`,
                }}
              />
            </View>

            {/* Back button */}
            {currentIndex > 0 && (
              <Pressable
                onPress={goBack}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: SPACING.xs,
                }}
              >
                <Ionicons name="chevron-back" size={24} color={COLORS.neutral[600]} />
                <Text style={{ color: COLORS.neutral[600], marginLeft: SPACING.xs, fontFamily: FONTS.regular }}>
                  Voltar
                </Text>
              </Pressable>
            )}
          </View>

          {/* Content */}
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: SPACING.lg,
              paddingBottom: SPACING.xl,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {renderStepContent()}
          </ScrollView>

          {/* Footer Button */}
          <View
            style={{
              paddingHorizontal: SPACING.lg,
              paddingBottom: insets.bottom + SPACING.md,
              paddingTop: SPACING.md,
            }}
          >
            <Pressable
              onPress={currentStep === "complete" ? completeOnboarding : goNext}
              disabled={!canProceed() || isSubmitting}
              style={{
                backgroundColor: canProceed() ? COLORS.primary[500] : COLORS.neutral[300],
                borderRadius: RADIUS.full,
                paddingVertical: SPACING.md,
                alignItems: "center",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <Text
                style={{
                  color: COLORS.neutral[0],
                  fontSize: TYPOGRAPHY.sizes.lg,
                  fontFamily: FONTS.semiBold,
                }}
              >
                {isSubmitting
                  ? "Salvando..."
                  : currentStep === "complete"
                  ? "Começar minha jornada"
                  : currentStep === "welcome"
                  ? "Vamos começar"
                  : "Continuar"}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
