/**
 * HabitsScreen - Meus Cuidados do Dia
 *
 * Design: Fitness gentil, sem cobrança
 * - 1 cuidado já é suficiente
 * - 0 cuidados NÃO gera culpa
 * - Sem porcentagem, sem streak visual
 * - Microtextos de validação após cada toggle
 */

import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useHabitsStore, Habit } from "../state/store";
import * as Haptics from "expo-haptics";
import { useTheme } from "../hooks/useTheme";
import { IconName } from "../types/icons";
import { COLORS, SPACING, RADIUS } from "../theme/design-system";

// Microtextos de validação após marcar cada cuidado
const FEEDBACK_MESSAGES: Record<string, string> = {
  "1": "Seu corpo agradece cada gole.",
  "2": "Você merece essa energia.",
  "3": "Pausa também é cuidado.",
  "4": "Vitamina D pro seu humor.",
  "5": "Conexão também é saúde.",
  "6": "Seu corpo respondeu.",
  "7": "Esse momento é real.",
  "8": "Você não precisa dar conta sozinha.",
};

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const habits = useHabitsStore((s) => s.habits);
  const toggleHabit = useHabitsStore((s) => s.toggleHabit);

  const today = new Date().toISOString().split("T")[0];
  const completedCount = habits.filter((h) => h.completed).length;

  // Estado para microtexto de feedback
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const handleToggleHabit = useCallback(
    async (habit: Habit) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleHabit(habit.id, today);

      // Mostrar feedback apenas ao marcar (não ao desmarcar)
      if (!habit.completed) {
        setLastFeedback(FEEDBACK_MESSAGES[habit.id] || "Cuidado registrado.");
        // Limpar após 3 segundos
        setTimeout(() => setLastFeedback(null), 3000);
      }
    },
    [toggleHabit, today]
  );

  // Cores do tema
  const textPrimary = isDark ? colors.neutral[100] : colors.neutral[800];
  const textSecondary = isDark ? colors.neutral[400] : colors.neutral[500];
  const bgCard = isDark ? colors.neutral[800] : colors.background.card;
  const borderColor = isDark ? colors.neutral[700] : colors.neutral[200];

  const renderHabitCard = (habit: Habit, index: number) => {
    return (
      <Animated.View
        key={habit.id}
        entering={FadeInUp.delay(100 + index * 50).duration(500).springify()}
      >
        <Pressable
          onPress={() => handleToggleHabit(habit)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: habit.completed }}
          accessibilityLabel={`${habit.title}. ${habit.description}`}
          accessibilityHint={habit.completed ? "Toque para desmarcar" : "Toque para marcar como feito"}
          style={({ pressed }) => ({
            marginBottom: SPACING.md,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View
            style={{
              backgroundColor: habit.completed
                ? isDark
                  ? `${habit.color}25`
                  : `${habit.color}12`
                : bgCard,
              borderRadius: RADIUS.xl,
              borderWidth: 1.5,
              borderColor: habit.completed ? habit.color : borderColor,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: SPACING.lg,
              }}
            >
              {/* Icon Container */}
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: RADIUS.lg,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: SPACING.md,
                  backgroundColor: habit.completed ? habit.color : `${habit.color}15`,
                }}
              >
                <Ionicons
                  name={habit.icon as IconName}
                  size={24}
                  color={habit.completed ? colors.neutral[0] : habit.color}
                />
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    fontFamily: "Manrope_600SemiBold",
                    color: habit.completed ? textPrimary : textPrimary,
                    marginBottom: 2,
                  }}
                >
                  {habit.title}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: textSecondary,
                    lineHeight: 18,
                  }}
                >
                  {habit.description}
                </Text>
              </View>

              {/* Checkbox - 44pt min tap target (iOS HIG) */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: habit.completed ? habit.color : "transparent",
                  borderWidth: 2,
                  borderColor: habit.completed ? habit.color : colors.neutral[300],
                }}
              >
                {habit.completed && (
                  <Ionicons name="checkmark" size={22} color={colors.neutral[0]} />
                )}
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top }}>
          <View
            style={{
              paddingHorizontal: SPACING.xl,
              paddingTop: SPACING.lg,
              paddingBottom: SPACING.lg,
              backgroundColor: isDark ? colors.neutral[900] : COLORS.primary[50],
            }}
          >
            <Animated.View entering={FadeInDown.duration(600).springify()}>
              {/* Title */}
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: textSecondary,
                  marginBottom: 4,
                }}
              >
                Pequenos gestos que te sustentam hoje.
              </Text>
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "700",
                  fontFamily: "Manrope_700Bold",
                  color: textPrimary,
                }}
              >
                Meus Cuidados do Dia
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Feedback Message (após toggle) */}
        {lastFeedback && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              marginHorizontal: SPACING.xl,
              marginTop: SPACING.md,
              marginBottom: SPACING.sm,
              backgroundColor: isDark ? COLORS.primary[900] : COLORS.primary[50],
              borderRadius: RADIUS.lg,
              padding: SPACING.md,
              borderWidth: 1,
              borderColor: isDark ? COLORS.primary[700] : COLORS.primary[100],
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: isDark ? COLORS.primary[200] : COLORS.primary[700],
                textAlign: "center",
                fontFamily: "Manrope_500Medium",
              }}
            >
              {lastFeedback}
            </Text>
          </Animated.View>
        )}

        {/* Validation Message */}
        <Animated.View
          entering={FadeIn.delay(200).duration(500)}
          style={{
            marginHorizontal: SPACING.xl,
            marginTop: SPACING.md,
            marginBottom: SPACING.lg,
          }}
        >
          <View
            style={{
              backgroundColor: bgCard,
              borderRadius: RADIUS.xl,
              padding: SPACING.lg,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 20, marginRight: SPACING.sm }}>
                {completedCount === 0 ? "🌙" : completedCount >= habits.length ? "🌟" : "💫"}
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: textSecondary,
                  lineHeight: 20,
                  fontFamily: "Manrope_500Medium",
                }}
              >
                {completedCount === 0
                  ? "Tudo bem. Amanhã é outro dia. Você continua aqui."
                  : completedCount >= habits.length
                  ? "Você cuidou de você hoje. Isso é lindo."
                  : "Um cuidado já é movimento. Você está presente."}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Habits List (flat, no categories) */}
        <View style={{ paddingHorizontal: SPACING.xl }}>
          {habits.map((habit, index) => renderHabitCard(habit, index))}
        </View>

        {/* Fixed Footer Quote */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600).springify()}
          style={{
            marginHorizontal: SPACING.xl,
            marginTop: SPACING.xl,
          }}
        >
          <View
            style={{
              backgroundColor: isDark ? colors.neutral[800] : COLORS.primary[50],
              borderRadius: RADIUS.xl,
              padding: SPACING.xl,
              alignItems: "center",
              borderWidth: 1,
              borderColor: isDark ? colors.neutral[700] : COLORS.primary[100],
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: SPACING.sm }}>💕</Text>
            <Text
              style={{
                fontSize: 15,
                color: textSecondary,
                textAlign: "center",
                lineHeight: 22,
                fontFamily: "Manrope_500Medium",
              }}
            >
              Cuidar de você não precisa ser perfeito.{"\n"}Precisa ser possível.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
