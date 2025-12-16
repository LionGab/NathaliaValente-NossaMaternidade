/**
 * EmotionalCheckInPrimary - Check-in de 1 toque
 *
 * PRIMÁRIO na hierarquia da Home
 * - 4 opções grandes: Bem, Cansada, Indisposta, Amada
 * - 1 toque = check-in completo
 * - Feedback imediato com mensagem acolhedora
 * - Animação suave (FadeIn)
 */

import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";
import { useCheckInStore } from "../../state/store";
import { COLORS, SPACING, RADIUS, SHADOWS, ACCESSIBILITY } from "../../theme/design-system";

// Tipos de mood
type MoodType = "bem" | "cansada" | "indisposta" | "amada";

interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  activeColor: string;
  message: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "bem",
    label: "Bem",
    emoji: "😊",
    icon: "sunny",
    color: "#FFD89B",
    activeColor: "#FFE5B8",
    message: "Que bom te ver assim. Aproveita esse respiro. 💛",
  },
  {
    id: "cansada",
    label: "Cansada",
    emoji: "😴",
    icon: "cloud",
    color: COLORS.feeling.cansada,
    activeColor: "#D4E9FD",
    message: "Você está fazendo o seu melhor. Isso já é suficiente. ❤️",
  },
  {
    id: "indisposta",
    label: "Indisposta",
    emoji: "😔",
    icon: "rainy",
    color: COLORS.feeling.indisposta,
    activeColor: "#EDE9FE",
    message: "Vamos com calma. Um passo pequeno já conta. 🌿",
  },
  {
    id: "amada",
    label: "Amada",
    emoji: "❤️",
    icon: "heart",
    color: COLORS.primary[400],
    activeColor: COLORS.primary[300],
    message: "Que lindo. Guarda esse sentimento com você. ✨",
  },
];

// Componente do botão de mood
const MoodButton: React.FC<{
  option: MoodOption;
  isSelected: boolean;
  onPress: () => void;
  isDark: boolean;
}> = React.memo(({ option, isSelected, onPress, isDark }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundColor = isSelected ? option.activeColor : isDark ? COLORS.neutral[800] : COLORS.neutral[100];
  const borderColor = isSelected ? option.color : "transparent";

  return (
    <Animated.View style={[styles.moodButtonWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={`${option.label} - ${isSelected ? "selecionado" : "não selecionado"}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        style={[
          styles.moodButton,
          {
            backgroundColor,
            borderColor,
            borderWidth: isSelected ? 2.5 : 1,
          },
        ]}
      >
        <Text style={styles.moodEmoji}>{option.emoji}</Text>
        <Text
          style={[
            styles.moodLabel,
            { color: isDark ? COLORS.neutral[100] : COLORS.neutral[900] },
          ]}
        >
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

MoodButton.displayName = "MoodButton";

// Componente principal
export const EmotionalCheckInPrimary: React.FC = () => {
  const { colors, isDark } = useTheme();

  // Store
  const setTodayMood = useCheckInStore((s) => s.setTodayMood);
  const getTodayCheckIn = useCheckInStore((s) => s.getTodayCheckIn);

  // Estado local para mood selecionado e feedback
  const [selectedMood, setSelectedMood] = React.useState<MoodType | null>(null);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  // Verificar check-in existente ao montar
  React.useEffect(() => {
    const todayCheckIn = getTodayCheckIn();
    if (todayCheckIn?.mood) {
      // Mapear valor numérico para mood
      const moodMap: Record<number, MoodType> = {
        5: "bem",
        4: "amada",
        3: "cansada",
        2: "indisposta",
        1: "indisposta",
      };
      const existingMood = moodMap[todayCheckIn.mood];
      if (existingMood) {
        setSelectedMood(existingMood);
        const option = MOOD_OPTIONS.find((o) => o.id === existingMood);
        if (option) {
          setFeedbackMessage(option.message);
        }
      }
    }
  }, [getTodayCheckIn]);

  // Handler de seleção
  const handleMoodSelect = useCallback(async (mood: MoodType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSelectedMood(mood);

    // Mapear mood para valor numérico
    const moodValueMap: Record<MoodType, number> = {
      bem: 5,
      amada: 4,
      cansada: 3,
      indisposta: 2,
    };

    setTodayMood(moodValueMap[mood]);

    // Mostrar feedback
    const option = MOOD_OPTIONS.find((o) => o.id === mood);
    if (option) {
      setFeedbackMessage(option.message);
    }
  }, [setTodayMood]);

  // Cores do tema
  const cardBg = isDark ? colors.background.secondary : "#FFFFFF";
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
        },
        SHADOWS.md,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textMain }]}>
          Como você está agora?
        </Text>
      </View>

      {/* Mood Buttons Grid */}
      <View style={styles.moodGrid}>
        {MOOD_OPTIONS.map((option) => (
          <MoodButton
            key={option.id}
            option={option}
            isSelected={selectedMood === option.id}
            onPress={() => handleMoodSelect(option.id)}
            isDark={isDark}
          />
        ))}
      </View>

      {/* Feedback Message */}
      {feedbackMessage && (
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[
            styles.feedbackContainer,
            {
              backgroundColor: isDark ? colors.neutral[800] : COLORS.primary[50],
            },
          ]}
        >
          <Text style={[styles.feedbackText, { color: textMuted }]}>
            {feedbackMessage}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS["2xl"],
    padding: SPACING.lg,
    borderWidth: 1,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  moodGrid: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  moodButtonWrapper: {
    flex: 1,
  },
  moodButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    minHeight: ACCESSIBILITY.minTapTarget + 36, // 80pt visual
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: "700",
  },
  feedbackContainer: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default EmotionalCheckInPrimary;
