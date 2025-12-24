/**
 * ProgressBar - Barra de progresso animada para onboarding
 * Mostra progresso de 0-100% com animação spring
 */

import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";

interface ProgressBarProps {
  currentStep: number; // 0-7
  totalSteps?: number;
  showText?: boolean;
}

export function ProgressBar({
  currentStep,
  totalSteps = 7,
  showText = true,
}: ProgressBarProps) {
  const theme = useTheme();
  const progress = useSharedValue(0);

  // Calcular porcentagem
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  // Animar progresso
  useEffect(() => {
    progress.value = withSpring(percentage / 100, {
      damping: 20,
      stiffness: 90,
    });
  }, [percentage, progress]);

  // Estilo animado da barra
  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <View style={styles.container}>
      {showText && (
        <Text
          style={[
            styles.text,
            { color: theme.text.secondary },
          ]}
        >
          {currentStep} de {totalSteps}
        </Text>
      )}
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        <Animated.View style={animatedBarStyle}>
          <LinearGradient
            colors={Tokens.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Tokens.spacing.xs,
  },
  text: {
    fontSize: Tokens.typography.caption.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
    textAlign: "center",
  },
  track: {
    height: 4,
    borderRadius: Tokens.radius.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Tokens.radius.full,
  },
});

