import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";

interface InputProps extends Omit<TextInputProps, "style"> {
  /** Input label */
  label?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Error message (shows error state) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Leading icon (Ionicons name) */
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  /** Trailing icon (Ionicons name) */
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  /** Trailing icon press handler (for password toggle, clear, etc.) */
  onTrailingIconPress?: () => void;
  /** Full width input */
  fullWidth?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Design System Input Component
 *
 * Text input with label, error states, icons, and dark mode support.
 *
 * @example
 * ```tsx
 * <Input label="Email" placeholder="seu@email.com" leadingIcon="mail" />
 * <Input label="Senha" secureTextEntry trailingIcon="eye" />
 * <Input error="Campo obrigatório" value={value} onChangeText={setValue} />
 * ```
 */
export function Input({
  label,
  helperText,
  error,
  success = false,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
  fullWidth = true,
  disabled = false,
  ...textInputProps
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Determine state colors
  const getBorderColor = () => {
    if (error) return colors.semantic.error;
    if (success) return colors.semantic.success;
    if (isFocused) return colors.primary[500];
    return colors.neutral[200];
  };

  const getTextColor = () => {
    if (error) return colors.semantic.error;
    if (success) return colors.semantic.success;
    return colors.neutral[500];
  };

  return (
    <View style={{ width: fullWidth ? "100%" : "auto" }}>
      {/* Label */}
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: colors.neutral[700],
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: disabled ? colors.neutral[50] : colors.background.card,
          borderWidth: 1.5,
          borderColor: getBorderColor(),
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        {/* Leading Icon */}
        {leadingIcon && (
          <Ionicons
            name={leadingIcon}
            size={20}
            color={colors.neutral[400]}
            style={{ marginRight: 10 }}
          />
        )}

        {/* Text Input */}
        <TextInput
          {...textInputProps}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontSize: 15,
            color: disabled ? colors.neutral[400] : colors.neutral[700],
            fontWeight: "400",
          }}
          placeholderTextColor={colors.neutral[400]}
        />

        {/* Trailing Icon */}
        {trailingIcon && (
          <Pressable
            onPress={onTrailingIconPress}
            disabled={!onTrailingIconPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={trailingIcon}
              size={20}
              color={colors.neutral[400]}
              style={{ marginLeft: 10 }}
            />
          </Pressable>
        )}
      </View>

      {/* Helper Text / Error */}
      {(helperText || error) && (
        <Text
          style={{
            fontSize: 13,
            color: getTextColor(),
            marginTop: 6,
            marginLeft: 4,
          }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

/** Legacy export for backward compatibility */
export default Input;
