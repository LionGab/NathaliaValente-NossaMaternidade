import React from "react";
import { View, ViewProps, Pressable } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/useTheme";

interface CardProps extends ViewProps {
  /** Visual variant */
  variant?: "default" | "elevated" | "outlined" | "soft";
  /** Custom background color override */
  color?: string;
  /** Internal padding */
  padding?: "none" | "sm" | "md" | "lg";
  /** Border radius */
  radius?: "sm" | "md" | "lg" | "xl";
  /** Press handler (makes card interactive) */
  onPress?: () => void;
  /** Animate on mount */
  animated?: boolean;
  /** Animation delay in ms */
  animationDelay?: number;
  /** Card content */
  children: React.ReactNode;
}

const PADDING_MAP = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
};

const RADIUS_MAP = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

/**
 * Design System Card Component
 *
 * Container component with variants, shadows, borders, and dark mode support.
 * Can be interactive (with onPress) and animated.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg">
 *   <Text>Card content</Text>
 * </Card>
 *
 * <Card variant="outlined" onPress={handlePress}>
 *   <Text>Clickable card</Text>
 * </Card>
 *
 * <Card animated animationDelay={200}>
 *   <Text>Animated entry</Text>
 * </Card>
 * ```
 */
export function Card({
  variant = "default",
  color,
  padding = "md",
  radius = "lg",
  onPress,
  animated = false,
  animationDelay = 0,
  children,
  style,
  ...props
}: CardProps) {
  const { colors } = useTheme();

  const baseStyle = {
    backgroundColor: color || colors.background.card,
    borderRadius: RADIUS_MAP[radius],
    padding: PADDING_MAP[padding],
  };

  const variantStyle = {
    default: {},
    elevated: {
      shadowColor: colors.neutral[900],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.neutral[200],
    },
    soft: {
      backgroundColor: color || colors.background.tertiary,
    },
  };

  const combinedStyle = [baseStyle, variantStyle[variant], style];

  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const content = (
    <View style={combinedStyle} {...props}>
      {children}
    </View>
  );

  if (animated) {
    const animatedContent = (
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(500).springify()}
        style={combinedStyle}
        {...props}
      >
        {children}
      </Animated.View>
    );

    if (onPress) {
      return (
        <Pressable onPress={handlePress} style={{ opacity: 1 }}>
          {animatedContent}
        </Pressable>
      );
    }
    return animatedContent;
  }

  if (onPress) {
    return (
      <Pressable onPress={handlePress} style={{ opacity: 1 }}>
        {content}
      </Pressable>
    );
  }

  return content;
}

/** Legacy export for backward compatibility */
export default Card;
