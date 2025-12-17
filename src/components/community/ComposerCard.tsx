/**
 * ComposerCard - Card para criar novo post + tópicos
 *
 * Design: Inspirado no Instagram/Pinterest
 * - Card elevado para o composer
 * - Seção de tópicos separada visualmente
 * - Espaçamento generoso seguindo 8pt grid
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COMMUNITY_TOPICS } from "../../config/community";
import { useTheme } from "../../hooks/useTheme";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../theme/design-system";

interface ComposerCardProps {
  onPress: () => void;
}

export const ComposerCard: React.FC<ComposerCardProps> = React.memo(({ onPress }) => {
  const { colors, isDark, brand } = useTheme();

  const textSecondary = isDark ? colors.neutral[400] : COLORS.text.secondary;
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const cardBg = isDark ? COLORS.neutral[800] : COLORS.neutral[0];
  const borderColor = isDark ? COLORS.neutral[700] : COLORS.neutral[100];

  const handleTopicPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getTopicColors = (isAccent: boolean) => {
    const color = isAccent
      ? isDark ? brand.accent[300] : brand.accent[500]
      : isDark ? colors.primary[300] : colors.primary[500];

    const bg = isAccent
      ? isDark ? `${brand.accent[500]}15` : brand.accent[50]
      : isDark ? `${colors.primary[500]}15` : colors.primary[50];

    const border = isAccent
      ? isDark ? brand.accent[700] : brand.accent[200]
      : isDark ? colors.primary[700] : colors.primary[200];

    return { color, bg, border };
  };

  return (
    <View style={styles.container}>
      {/* === CARD DO COMPOSER === */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.composerCard,
          {
            backgroundColor: cardBg,
            borderColor,
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.995 : 1 }],
          },
        ]}
      >
        {/* Input Row */}
        <View style={styles.inputRow}>
          <View style={[styles.avatar, { backgroundColor: isDark ? colors.primary[900] : COLORS.primary[100] }]}>
            <Ionicons name="person" size={22} color={colors.primary[500]} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.placeholder, { color: textSecondary }]}>
              No que você está pensando?
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={onPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: isDark ? `${colors.primary[500]}20` : colors.primary[50] }]}>
              <Ionicons name="image" size={18} color={colors.primary[500]} />
            </View>
            <Text style={[styles.actionText, { color: colors.primary[600] }]}>Foto</Text>
          </Pressable>

          <View style={[styles.actionSeparator, { backgroundColor: borderColor }]} />

          <Pressable
            style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={onPress}
          >
            <View style={[styles.actionIcon, { backgroundColor: isDark ? `${brand.accent[500]}20` : brand.accent[50] }]}>
              <Ionicons name="videocam" size={18} color={brand.accent[500]} />
            </View>
            <Text style={[styles.actionText, { color: brand.accent[600] }]}>Vídeo</Text>
          </Pressable>
        </View>
      </Pressable>

      {/* === SEÇÃO DE TÓPICOS === */}
      <View style={styles.topicsWrapper}>
        <View style={[
          styles.topicsCard,
          {
            backgroundColor: cardBg,
            borderColor,
          },
        ]}>
          <View style={styles.topicsHeader}>
            <Ionicons
              name="chatbubbles-outline"
              size={18}
              color={colors.primary[500]}
              style={styles.topicsIcon}
            />
            <Text style={[styles.topicsTitle, { color: textMain }]}>
              Sobre o que você quer falar?
            </Text>
          </View>

          <View style={styles.topicsGrid}>
            {COMMUNITY_TOPICS.map((topic) => {
              const { color, bg, border } = getTopicColors(topic.accent);

              return (
                <Pressable
                  key={topic.label}
                  onPress={handleTopicPress}
                  style={({ pressed }) => [
                    styles.topicChip,
                    {
                      backgroundColor: bg,
                      borderColor: border,
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    },
                  ]}
                >
                  <Ionicons name={topic.icon} size={14} color={color} />
                  <Text style={[styles.topicText, { color }]}>{topic.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
});

ComposerCard.displayName = "ComposerCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING["3xl"], // 32pt - mais espaço antes dos posts
  },

  // === COMPOSER CARD ===
  composerCard: {
    borderRadius: RADIUS["2xl"],
    padding: SPACING.xl, // 20pt padding interno
    borderWidth: 1,
    ...SHADOWS.md,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    marginLeft: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: "Manrope_500Medium",
  },
  divider: {
    height: 1,
    marginVertical: SPACING.lg, // 16pt acima e abaixo
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xl,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  actionSeparator: {
    width: 1,
    height: 24,
  },

  // === TÓPICOS CARD ===
  topicsWrapper: {
    marginTop: SPACING.xl, // 20pt entre cards
  },
  topicsCard: {
    borderRadius: RADIUS["2xl"],
    padding: SPACING.xl,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  topicsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  topicsIcon: {
    marginRight: SPACING.sm,
  },
  topicsTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm, // 8pt entre chips
  },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md, // 12pt horizontal
    paddingVertical: SPACING.sm,   // 8pt vertical
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: SPACING.xs, // 4pt entre ícone e texto
  },
  topicText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
});
