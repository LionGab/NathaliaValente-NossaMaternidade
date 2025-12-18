/**
 * Nossa Maternidade - RestSoundsScreen
 * Relaxation sounds categorized by nature, meditation, and sleep
 */

import React, { useState, useMemo } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  GRADIENTS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  OVERLAY,
} from "../theme/design-system";
import { useTheme } from "../hooks/useTheme";

type SoundCategory = "nature" | "meditation" | "sleep";

interface SoundItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  category: SoundCategory;
  audioUri?: string;
}

const SOUNDS: SoundItem[] = [
  // Nature Sounds
  {
    id: "rain",
    title: "Chuva Suave",
    subtitle: "Som relaxante de chuva",
    duration: "30 min",
    icon: "rainy",
    color: COLORS.primary[400],
    category: "nature",
  },
  {
    id: "ocean",
    title: "Ondas do Mar",
    subtitle: "Paz do oceano",
    duration: "45 min",
    icon: "water",
    color: COLORS.accent[500],
    category: "nature",
  },
  {
    id: "forest",
    title: "Floresta",
    subtitle: "Passaros e natureza",
    duration: "40 min",
    icon: "leaf",
    color: COLORS.semantic.success,
    category: "nature",
  },
  {
    id: "fire",
    title: "Lareira",
    subtitle: "Crepitar do fogo",
    duration: "60 min",
    icon: "flame",
    color: COLORS.semantic.warning,
    category: "nature",
  },

  // Meditation
  {
    id: "breathe",
    title: "Respiracao Guiada",
    subtitle: "Para maes",
    duration: "10 min",
    icon: "heart",
    color: COLORS.primary[500],
    category: "meditation",
  },
  {
    id: "body-scan",
    title: "Relaxamento Corporal",
    subtitle: "Meditacao guiada",
    duration: "15 min",
    icon: "body",
    color: COLORS.secondary[500],
    category: "meditation",
  },
  {
    id: "loving-kindness",
    title: "Amor Proprio",
    subtitle: "Meditacao de bondade",
    duration: "12 min",
    icon: "sparkles",
    color: COLORS.legacyAccent.coral,
    category: "meditation",
  },

  // Sleep
  {
    id: "lullaby",
    title: "Cancao de Ninar",
    subtitle: "Para voce e seu bebe",
    duration: "20 min",
    icon: "musical-notes",
    color: COLORS.secondary[500],
    category: "sleep",
  },
  {
    id: "sleep-story",
    title: "Historia para Dormir",
    subtitle: "Narracao tranquila",
    duration: "25 min",
    icon: "book",
    color: COLORS.primary[500],
    category: "sleep",
  },
  {
    id: "white-noise",
    title: "Ruido Branco",
    subtitle: "Som continuo suave",
    duration: "60 min",
    icon: "radio",
    color: COLORS.neutral[400],
    category: "sleep",
  },
];

/**
 * Cores semânticas para tela de descanso (dark theme by design)
 * Esta tela usa tema escuro intencionalmente para ajudar no relaxamento
 */
const getRestColors = (_isDark: boolean) => ({
  // Backgrounds - always dark for relaxation
  bgPrimary: GRADIENTS.rest.bgPrimary,
  bgSecondary: GRADIENTS.rest.bgSecondary,
  cardBg: OVERLAY.white.soft,
  cardBgActive: (color: string) => `${color}20`,
  // Text
  textPrimary: COLORS.text.inverse,
  textSecondary: COLORS.neutral[400],
  textMuted: OVERLAY.white.prominent,
  // UI elements
  iconBg: GRADIENTS.rest.iconBg,
  iconBgActive: (color: string) => color,
  border: OVERLAY.white.soft,
  borderActive: (color: string) => color,
  // Info card
  infoBg: OVERLAY.white.soft,
  infoIconBg: "rgba(192, 132, 252, 0.2)", // Purple theme for rest screen
  infoIcon: GRADIENTS.rest.infoIcon,
  // Tab
  tabBg: OVERLAY.white.soft,
  tabActive: OVERLAY.white.strong,
  // Tip - Purple theme for rest screen
  tipBg: "rgba(168, 85, 247, 0.1)",
  tipBorder: "rgba(168, 85, 247, 0.2)",
});

const CATEGORIES = [
  { id: "nature" as SoundCategory, name: "Natureza", icon: "leaf" as keyof typeof Ionicons.glyphMap },
  { id: "meditation" as SoundCategory, name: "Meditacao", icon: "heart" as keyof typeof Ionicons.glyphMap },
  { id: "sleep" as SoundCategory, name: "Sono", icon: "moon" as keyof typeof Ionicons.glyphMap },
];

export default function RestSoundsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const restColors = useMemo(() => getRestColors(isDark), [isDark]);
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>("nature");
  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const filteredSounds = SOUNDS.filter((s) => s.category === selectedCategory);

  const handleCategoryChange = (category: SoundCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handlePlaySound = async (soundId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Stop currently playing sound
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }

    if (playingSound === soundId) {
      // Stop if same sound
      setPlayingSound(null);
      return;
    }

    // In production, load and play the actual audio file
    // For now, just simulate playing
    setPlayingSound(soundId);
  };

  const handleClose = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: restColors.bgPrimary }}>
      {/* Header */}
      <LinearGradient
        colors={[restColors.bgPrimary, restColors.bgSecondary]}
        style={{
          paddingTop: insets.top + SPACING.lg,
          paddingBottom: SPACING.xl,
          paddingHorizontal: SPACING["2xl"],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: SPACING["2xl"],
          }}
        >
          <Pressable onPress={handleClose} style={{ padding: SPACING.sm }}>
            <Ionicons name="close" size={28} color={restColors.textPrimary} />
          </Pressable>
          <Text
            style={{
              color: restColors.textPrimary,
              fontSize: TYPOGRAPHY.titleMedium.fontSize,
              fontWeight: "700",
            }}
          >
            Descanso
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Info Card */}
        <View
          style={{
            backgroundColor: restColors.infoBg,
            borderRadius: RADIUS["2xl"],
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                backgroundColor: restColors.infoIconBg,
                borderRadius: RADIUS.full,
                padding: SPACING.sm,
                marginRight: SPACING.md,
              }}
            >
              <Ionicons name="moon" size={20} color={restColors.infoIcon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: restColors.textPrimary,
                  fontSize: TYPOGRAPHY.bodySmall.fontSize,
                  fontWeight: "600",
                }}
              >
                Sons para relaxar
              </Text>
              <Text
                style={{
                  color: restColors.textMuted,
                  fontSize: TYPOGRAPHY.labelSmall.fontSize,
                  marginTop: 2,
                }}
              >
                Encontre paz e tranquilidade
              </Text>
            </View>
          </View>
        </View>

        {/* Category Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: restColors.tabBg,
            borderRadius: RADIUS.full,
            padding: SPACING.xs,
          }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => handleCategoryChange(cat.id)}
              style={{ flex: 1 }}
            >
              <View
                style={{
                  paddingVertical: SPACING.sm + 2,
                  borderRadius: RADIUS.full,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    selectedCategory === cat.id
                      ? restColors.tabActive
                      : "transparent",
                }}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? restColors.textPrimary : restColors.textSecondary}
                />
                <Text
                  style={{
                    marginLeft: SPACING.sm,
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                    fontWeight: "600",
                    color: selectedCategory === cat.id ? restColors.textPrimary : restColors.textSecondary,
                  }}
                >
                  {cat.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      {/* Sounds List */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING["2xl"] }}
      >
        <View style={{ paddingHorizontal: SPACING["2xl"], paddingTop: SPACING.lg }}>
          {filteredSounds.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(index * 80).duration(500).springify()}
              style={{ marginBottom: SPACING.lg }}
            >
              <Pressable onPress={() => handlePlaySound(item.id)}>
                <View
                  style={{
                    backgroundColor:
                      playingSound === item.id
                        ? restColors.cardBgActive(item.color)
                        : restColors.cardBg,
                    borderRadius: RADIUS["2xl"],
                    padding: SPACING.xl,
                    borderWidth: 1,
                    borderColor:
                      playingSound === item.id
                        ? restColors.borderActive(item.color)
                        : restColors.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* Icon */}
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor:
                          playingSound === item.id ? restColors.iconBgActive(item.color) : restColors.iconBg,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SPACING.lg,
                      }}
                    >
                      {playingSound === item.id ? (
                        <Ionicons name="pause" size={28} color={restColors.textPrimary} />
                      ) : (
                        <Ionicons
                          name={item.icon}
                          size={28}
                          color={playingSound === item.id ? restColors.textPrimary : item.color}
                        />
                      )}
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: restColors.textPrimary,
                          fontSize: TYPOGRAPHY.bodyLarge.fontSize,
                          fontWeight: "700",
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: restColors.textSecondary,
                          fontSize: TYPOGRAPHY.bodySmall.fontSize,
                          marginBottom: SPACING.sm,
                        }}
                      >
                        {item.subtitle}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="time-outline" size={14} color={restColors.textSecondary} />
                        <Text
                          style={{
                            color: restColors.textSecondary,
                            fontSize: TYPOGRAPHY.labelSmall.fontSize,
                            marginLeft: 4,
                          }}
                        >
                          {item.duration}
                        </Text>
                      </View>
                    </View>

                    {/* Play Button */}
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor:
                          playingSound === item.id ? restColors.iconBgActive(item.color) : restColors.iconBg,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={playingSound === item.id ? "pause" : "play"}
                        size={22}
                        color={restColors.textPrimary}
                      />
                    </View>
                  </View>

                  {/* Playing Indicator */}
                  {playingSound === item.id && (
                    <Animated.View
                      entering={FadeInDown.duration(400)}
                      style={{
                        marginTop: SPACING.lg,
                        paddingTop: SPACING.lg,
                        borderTopWidth: 1,
                        borderTopColor: restColors.border,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            color: restColors.textMuted,
                            fontSize: TYPOGRAPHY.labelSmall.fontSize,
                          }}
                        >
                          Tocando...
                        </Text>
                        <View style={{ flexDirection: "row", gap: 3 }}>
                          {[1, 2, 3, 4].map((i) => (
                            <View
                              key={i}
                              style={{
                                width: 3,
                                height: 12 + Math.random() * 8,
                                backgroundColor: item.color,
                                borderRadius: 2,
                              }}
                            />
                          ))}
                        </View>
                      </View>
                    </Animated.View>
                  )}
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Tip */}
        <View style={{ paddingHorizontal: SPACING["2xl"], marginTop: SPACING.lg }}>
          <View
            style={{
              backgroundColor: restColors.tipBg,
              borderRadius: RADIUS["2xl"],
              padding: SPACING.xl,
              borderWidth: 1,
              borderColor: restColors.tipBorder,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text style={{ fontSize: 24, marginRight: SPACING.md }}>💡</Text>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: restColors.textPrimary,
                    fontWeight: "600",
                    marginBottom: SPACING.sm,
                  }}
                >
                  Dica
                </Text>
                <Text
                  style={{
                    color: restColors.textMuted,
                    fontSize: TYPOGRAPHY.bodySmall.fontSize,
                    lineHeight: 20,
                  }}
                >
                  Use fones de ouvido para uma experiencia mais imersiva. Sons da
                  natureza podem ajudar seu bebe a dormir melhor tambem.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
