/**
 * StageCard - Card premium para seleção de estágio da jornada
 * Design: Foto com overlay gradiente + título + frase da Nath
 * Otimizado: Pressable nativo (sem crash), imagem ajustada (center focus)
 */

import React, { memo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { StageCardData } from "../../types/nath-journey-onboarding.types";

interface StageCardProps {
  data: StageCardData;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

function StageCardComponent({ data, isSelected, onPress }: StageCardProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedSelectionStyle = useAnimatedStyle(() => ({
    borderColor: isSelected ? Tokens.brand.accent[300] : theme.colors.border.subtle,
    borderWidth: withSpring(isSelected ? 2 : 1, { damping: 20 }),
  }));

  const checkmarkScale = useSharedValue(isSelected ? 1 : 0);
  React.useEffect(() => {
    checkmarkScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 12,
      stiffness: 200,
    });
  }, [isSelected, checkmarkScale]);

  const animatedCheckmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkScale.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
    >
      <AnimatedView style={[styles.card, animatedCardStyle, animatedSelectionStyle]}>
        <View style={styles.imageContainer}>
          <Image
            source={data.image}
            style={styles.image}
            contentFit="cover"
            contentPosition="center" // Melhor para rostos/pessoas
            transition={200} // Suave ao carregar
            placeholder={data.image} // Blurhash seria ideal, mas placeholder ajuda
            accessible
            accessibilityLabel={`${data.title}. ${data.quote}`}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]} // Overlay um pouco mais forte para legibilidade
            style={styles.imageOverlay}
          />

          <Animated.View style={[styles.checkmarkContainer, animatedCheckmarkStyle]}>
            <LinearGradient
              colors={[Tokens.brand.accent[300], Tokens.brand.accent[400]]}
              style={styles.checkmark}
            >
              <Ionicons name="checkmark" size={16} color={Tokens.neutral[0]} />
            </LinearGradient>
          </Animated.View>

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{data.icon}</Text>
          </View>
        </View>

        <View style={[styles.content, { backgroundColor: theme.surface.card }]}>
          <Text
            style={[styles.title, { color: theme.text.primary }]}
            numberOfLines={1}
            adjustsFontSizeToFit // Evita corte de texto
          >
            {data.title}
          </Text>
          <Text style={[styles.quote, { color: theme.text.secondary }]} numberOfLines={2}>
            {'"'}
            {data.quote}
            {'"'}
          </Text>
        </View>

        {isSelected && (
          <View style={styles.glowEffect} pointerEvents="none">
            <LinearGradient
              colors={[`${Tokens.brand.accent[200]}20`, "transparent"]}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </AnimatedView>
    </Pressable>
  );
}

export const StageCard = memo(StageCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Tokens.radius.xl,
    overflow: "hidden",
    flex: 1,
    height: 220, // Altura fixa garante consistência no grid
    ...Tokens.shadows.sm,
    backgroundColor: Tokens.neutral[0],
  },
  imageContainer: {
    height: 140, // Mais espaço para a imagem
    width: "100%",
    position: "relative",
    backgroundColor: Tokens.neutral[100],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  iconContainer: {
    position: "absolute",
    bottom: Tokens.spacing.xs,
    left: Tokens.spacing.xs,
    backgroundColor: "rgba(255,255,255,0.95)",
    width: 28,
    height: 28,
    borderRadius: Tokens.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  icon: {
    fontSize: 16,
  },
  checkmarkContainer: {
    position: "absolute",
    top: Tokens.spacing.xs,
    right: Tokens.spacing.xs,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: Tokens.radius.full,
    justifyContent: "center",
    alignItems: "center",
    ...Tokens.shadows.sm,
  },
  content: {
    flex: 1,
    padding: Tokens.spacing.sm,
    justifyContent: "center",
    gap: 2,
  },
  title: {
    fontSize: Tokens.typography.labelMedium.fontSize,
    fontWeight: "700",
    lineHeight: Tokens.typography.labelMedium.lineHeight,
  },
  quote: {
    fontSize: Tokens.typography.caption.fontSize,
    fontStyle: "italic",
    lineHeight: Tokens.typography.caption.lineHeight,
  },
  glowEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Tokens.radius.xl,
  },
});
