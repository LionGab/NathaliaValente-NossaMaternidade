/**
 * NathiaAdviceCard - Card da NathIA personalizado pelo check-in
 *
 * SECUNDÁRIO na hierarquia da Home
 * - Se não fez check-in: "Como você está hoje? Vamos começar por aí."
 * - Se fez: mensagem baseada no mood + CTA "Conversar com NathIA"
 */

import React, { useMemo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";
import { useCheckInStore } from "../../state/store";
import { COLORS, SPACING, RADIUS, SHADOWS } from "../../theme/design-system";

interface NathiaAdviceCardProps {
  onPressChat: () => void;
}

// Dicas baseadas no mood (não prescritivas)
const MOOD_TIPS: Record<number, string> = {
  5: "Dias bons merecem ser lembrados. Que tal registrar uma gratidão?",
  4: "O amor nos sustenta. Lembre-se de quem te faz sentir assim.",
  3: "Descanso também é produtividade. Permita-se pausar.",
  2: "Dias difíceis passam. Você não precisa resolver tudo agora.",
  1: "Uma respiração profunda pode ajudar. Estou aqui se precisar.",
};

export const NathiaAdviceCard: React.FC<NathiaAdviceCardProps> = ({
  onPressChat,
}) => {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);

  // Store
  const getTodayCheckIn = useCheckInStore((s) => s.getTodayCheckIn);
  const todayCheckIn = getTodayCheckIn();
  const hasMoodToday = todayCheckIn?.mood !== null && todayCheckIn?.mood !== undefined;

  // Determinar conteúdo do card
  const { message, ctaAction } = useMemo(() => {
    if (!hasMoodToday) {
      return {
        message: "Como você está hoje? Vamos começar por aí.",
        ctaAction: onPressChat,
      };
    }

    const tip = MOOD_TIPS[todayCheckIn?.mood ?? 3] ?? MOOD_TIPS[3];
    return {
      message: tip,
      ctaAction: onPressChat,
    };
  }, [hasMoodToday, todayCheckIn?.mood, onPressChat]);

  // Handlers
  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ctaAction();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Cores do tema
  const cardBg = isDark ? "rgba(59, 130, 246, 0.12)" : "#EFF6FF";
  const borderColor = isDark ? "rgba(59, 130, 246, 0.25)" : "rgba(59, 130, 246, 0.15)";
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[600];
  const iconBg = isDark ? "rgba(59, 130, 246, 0.2)" : colors.legacyAccent.sky + "33";
  const accentColor = isDark ? colors.legacyAccent.sky : COLORS.semantic.info;

  return (
    <Animated.View entering={FadeInUp.delay(100).duration(500)} style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel="Conselho da NathIA"
        accessibilityRole="button"
        accessibilityHint="Toque para conversar com NathIA"
        style={[
          styles.container,
          {
            backgroundColor: cardBg,
            borderColor,
          },
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name="sparkles" size={22} color={accentColor} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: textMain }]}>NathIA</Text>
          <Text style={[styles.message, { color: textMuted }]} numberOfLines={2}>
            {message}
          </Text>
        </View>

        {/* CTA Button */}
        <View style={[styles.ctaButton, { backgroundColor: accentColor }]}>
          <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  ctaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NathiaAdviceCard;
