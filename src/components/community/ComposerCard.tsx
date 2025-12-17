/**
 * ComposerCard - Card unificado para criar novo post
 *
 * Design: Facebook/Instagram style
 * - Card único com todas as seções
 * - Avatar + prompt + ações + tópicos integrados
 * - Visual limpo e profissional
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

  // Theme colors
  const cardBg = isDark ? colors.neutral[800] : COLORS.neutral[0];
  const borderColor = isDark ? colors.neutral[700] : COLORS.neutral[200];
  const textPrimary = isDark ? colors.neutral[100] : colors.neutral[900];
  const textSecondary = isDark ? colors.neutral[400] : COLORS.text.secondary;
  const avatarBg = isDark ? colors.primary[900] : COLORS.primary[100];

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getTopicStyle = (isAccent: boolean) => {
    const color = isAccent
      ? isDark ? brand.accent[400] : brand.accent[600]
      : isDark ? colors.primary[400] : colors.primary[600];

    const bg = isAccent
      ? isDark ? `${brand.accent[500]}15` : `${brand.accent[500]}08`
      : isDark ? `${colors.primary[500]}15` : `${colors.primary[500]}08`;

    const borderClr = isAccent
      ? isDark ? brand.accent[700] : brand.accent[200]
      : isDark ? colors.primary[700] : colors.primary[200];

    return { color, bg, borderClr };
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor,
            opacity: pressed ? 0.97 : 1,
            transform: [{ scale: pressed ? 0.995 : 1 }],
          },
        ]}
      >
        {/* === SEÇÃO 1: Input Row === */}
        <View style={styles.inputSection}>
          <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
            <Ionicons name="person" size={20} color={colors.primary[500]} />
          </View>
          <Text style={[styles.inputText, { color: textSecondary }]}>
            No que você está pensando?
          </Text>
        </View>

        {/* === SEÇÃO 2: Ações (Foto/Vídeo) === */}
        <View style={[styles.actionsSection, { borderTopColor: borderColor }]}>
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="image-outline" size={22} color={colors.primary[500]} />
            <Text style={[styles.actionLabel, { color: colors.primary[600] }]}>Foto</Text>
          </Pressable>

          <View style={[styles.actionDivider, { backgroundColor: borderColor }]} />

          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              styles.actionBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="videocam-outline" size={22} color={brand.accent[500]} />
            <Text style={[styles.actionLabel, { color: brand.accent[600] }]}>Vídeo</Text>
          </Pressable>
        </View>

        {/* === SEÇÃO 3: Tópicos === */}
        <View style={[styles.topicsSection, { borderTopColor: borderColor }]}>
          <View style={styles.topicsHeader}>
            <Ionicons
              name="chatbubbles-outline"
              size={16}
              color={textSecondary}
            />
            <Text style={[styles.topicsLabel, { color: textPrimary }]}>
              Sobre o que você quer falar?
            </Text>
          </View>

          <View style={styles.topicsGrid}>
            {COMMUNITY_TOPICS.map((topic) => {
              const { color, bg, borderClr } = getTopicStyle(topic.accent);

              return (
                <Pressable
                  key={topic.label}
                  onPress={handlePress}
                  style={({ pressed }) => [
                    styles.topicChip,
                    {
                      backgroundColor: bg,
                      borderColor: borderClr,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
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
      </Pressable>
    </View>
  );
});

ComposerCard.displayName = "ComposerCard";

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING["2xl"], // 24pt antes da seção de posts
  },

  card: {
    borderRadius: RADIUS.xl, // 16pt
    borderWidth: 1,
    ...SHADOWS.sm,
    overflow: "hidden",
  },

  // === INPUT SECTION ===
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
  },

  // === ACTIONS SECTION ===
  actionsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    paddingVertical: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  actionDivider: {
    width: 1,
    height: 20,
  },

  // === TOPICS SECTION ===
  topicsSection: {
    borderTopWidth: 1,
    padding: SPACING.lg,
  },
  topicsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  topicsLabel: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  topicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
  },
  topicChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: SPACING.xs,
  },
  topicText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
});
