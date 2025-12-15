import React from "react";
import { Pressable, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { buttonAccessibility } from "../../utils/accessibility";
import { useTheme } from "../../hooks/useTheme";

interface ButtonProps {
  /** Button text label */
  children: string;
  /** Press handler */
  onPress: () => void;
  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "soft";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Optional icon (Ionicons name) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Icon position relative to text */
  iconPosition?: "left" | "right";
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Custom color override (for primary/outline/ghost variants) */
  color?: string;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

/**
 * Design System Button Component
 *
 * Universal button component with dark mode support, variants, sizes,
 * loading states, icons, and haptic feedback.
 *
 * @example
 * ```tsx
 * <Button onPress={handleSave}>Save</Button>
 * <Button variant="outline" icon="heart" iconPosition="left">Favorite</Button>
 * <Button loading disabled>Saving...</Button>
 * ```
 */
export function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  color,
  accessibilityLabel,
}: ButtonProps) {
  const { colors } = useTheme();

  const handlePress = async () => {
    if (!disabled && !loading) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
    md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 15, iconSize: 18 },
    lg: { paddingVertical: 18, paddingHorizontal: 24, fontSize: 16, iconSize: 20 },
  };

  const variantStyles = {
    primary: {
      bg: color || colors.primary[500],
      text: colors.neutral[0],
      border: "transparent",
    },
    secondary: {
      bg: colors.neutral[600],
      text: colors.neutral[0],
      border: "transparent",
    },
    outline: {
      bg: "transparent",
      text: color || colors.primary[500],
      border: color || colors.primary[500],
    },
    ghost: {
      bg: "transparent",
      text: color || colors.primary[500],
      border: "transparent",
    },
    soft: {
      bg: colors.background.tertiary,
      text: color || colors.neutral[900],
      border: "transparent",
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];
  const opacity = disabled ? 0.5 : 1;

  const accessibilityProps = buttonAccessibility(
    accessibilityLabel || children,
    disabled ? "Botão desabilitado" : loading ? "Carregando..." : undefined,
    disabled || loading
  );

  return (
    <Pressable
      {...accessibilityProps}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: currentVariant.bg,
        borderWidth: currentVariant.border !== "transparent" ? 1.5 : 0,
        borderColor: currentVariant.border,
        borderRadius: 14,
        paddingVertical: currentSize.paddingVertical,
        paddingHorizontal: currentSize.paddingHorizontal,
        opacity: pressed ? 0.8 : opacity,
        width: fullWidth ? "100%" : "auto",
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={currentVariant.text} />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.text}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={{
              color: currentVariant.text,
              fontSize: currentSize.fontSize,
              fontWeight: "600",
            }}
          >
            {children}
          </Text>
          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={currentVariant.text}
              style={{ marginLeft: 8 }}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

/** Legacy export for backward compatibility */
export default Button;
