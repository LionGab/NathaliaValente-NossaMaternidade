/**
 * ChatEmptyState - Empty state do chat
 * Componente extraído do AssistantScreen para melhor organização
 */

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { COLORS, COLORS_DARK, SPACING } from "../../theme/design-system";
import { Avatar } from "../ui";

interface SuggestedPrompt {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: "nutrition-outline",
    title: "Alimentação",
    subtitle: "O que posso comer na gravidez?",
  },
  {
    icon: "fitness-outline",
    title: "Exercícios",
    subtitle: "Atividades seguras para gestantes",
  },
  {
    icon: "medical-outline",
    title: "Sintomas",
    subtitle: "Quando devo procurar um médico?",
  },
  {
    icon: "heart-outline",
    title: "Bem-estar",
    subtitle: "Dicas para aliviar enjoos",
  },
];

interface ChatEmptyStateProps {
  onSuggestedPrompt: (text: string) => void;
  screenWidth?: number;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  onSuggestedPrompt,
  screenWidth = 375,
}) => {
  const { isDark } = useTheme();
  const palette = isDark ? COLORS_DARK : COLORS;
  const primaryColor = palette.primary[500];
  const textPrimary = palette.text.primary;
  const textSecondary = palette.text.secondary;
  const bgSecondary = palette.background.secondary;
  const primaryLight = palette.primary[100];
  const border = palette.primary[200];

  // Valores responsivos
  const isTablet = screenWidth >= 768;
  const maxContentWidth = isTablet ? 600 : screenWidth - 48;
  const horizontalPadding = screenWidth < 375 ? 12 : 24;

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      style={[
        styles.container,
        {
          paddingHorizontal: horizontalPadding,
          maxWidth: maxContentWidth,
        },
      ]}
    >
      {/* Logo/Avatar */}
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
        <View style={styles.avatarContainer}>
          <Avatar size={72} isNathIA={true} />
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: textPrimary,
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        NathIA
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(300).duration(600).springify()}
        style={{ fontSize: 15, color: textSecondary, textAlign: "center", marginBottom: 24 }}
      >
        Sua assistente inteligente 24h
      </Animated.Text>

      {/* Welcome Message */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(600).springify()}
        style={{
          backgroundColor: primaryLight,
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
          width: "100%",
          flexDirection: "row",
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: bgSecondary,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name="sparkles" size={20} color={primaryColor} />
        </View>
        <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: textSecondary }}>
          Olá! Eu sou a NathIA. ✨ Estou aqui para tirar suas dúvidas, te acalmar e conversar sobre
          essa fase incrível. O que você gostaria de saber hoje?
        </Text>
      </Animated.View>

      {/* Suggested Prompts Grid */}
      <Animated.View
        entering={FadeInUp.delay(500).duration(600).springify()}
        style={styles.gridContainer}
      >
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(600 + index * 80).duration(400)}
            style={styles.gridItem}
          >
            <Pressable
              onPress={() => onSuggestedPrompt(prompt.subtitle)}
              style={{
                backgroundColor: bgSecondary,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: border,
                minHeight: 100,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  backgroundColor: primaryLight,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Ionicons name={prompt.icon} size={20} color={primaryColor} />
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: textPrimary, marginBottom: 4 }}
              >
                {prompt.title}
              </Text>
              <Text
                style={{ fontSize: 12, color: textSecondary, lineHeight: 16 }}
                numberOfLines={2}
              >
                {prompt.subtitle}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginHorizontal: -SPACING.xs,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.md,
  },
});
