/**
 * ComposerCard - Card para criar novo post + tópicos
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
      {/* Card principal */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral[0],
            borderColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.995 : 1 }],
          },
        ]}
      >
        <View style={styles.inputRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={COLORS.primary[500]} />
          </View>
          <Text style={[styles.placeholder, { color: textSecondary }]}>
            No que você está pensando?
          </Text>
        </View>

        <View
          style={[
            styles.separator,
            { backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100] },
          ]}
        />

        <View style={styles.actionsRow}>
          <View style={styles.action}>
            <Ionicons name="image" size={20} color={colors.primary[500]} />
            <Text style={[styles.actionText, { color: colors.primary[500] }]}>Foto</Text>
          </View>
          <View style={styles.action}>
            <Ionicons name="videocam" size={20} color={brand.accent[500]} />
            <Text style={[styles.actionText, { color: brand.accent[500] }]}>Vídeo</Text>
          </View>
        </View>
      </Pressable>

      {/* Tópicos - estilo original */}
      <View style={{ marginTop: SPACING.lg }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            fontFamily: "Manrope_600SemiBold",
            color: textMain,
            marginBottom: SPACING.md,
          }}
        >
          Sobre o que você quer falar?
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm }}>
          {COMMUNITY_TOPICS.map((topic) => {
            const { color, bg, border } = getTopicColors(topic.accent);

            return (
              <Pressable
                key={topic.label}
                onPress={handleTopicPress}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: bg,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.sm,
                  borderRadius: RADIUS.full,
                  borderWidth: 1,
                  borderColor: border,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                })}
              >
                <Ionicons
                  name={topic.icon}
                  size={14}
                  color={color}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    fontFamily: "Manrope_600SemiBold",
                    color,
                  }}
                >
                  {topic.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
});

ComposerCard.displayName = "ComposerCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
  },
  separator: {
    height: 1,
    marginVertical: SPACING.md,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
});
