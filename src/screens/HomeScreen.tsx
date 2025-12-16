/**
 * HomeScreen - Redesign com UX Emocional + Hierarquia Clara
 *
 * Hierarquia:
 * 1. HEADER (reduzido) - Saudação + avatar
 * 2. PRIMÁRIO: Check-in Emocional (1 toque)
 * 3. SECUNDÁRIO: Card NathIA (personalizado)
 * 4. SECUNDÁRIO: Pertencimento (discreto)
 * 5. TERCIÁRIO: Barra de Acesso Rápido
 */

import React, { useMemo, useCallback } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, Image, Dimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppStore } from "../state/store";
import { MainTabScreenProps } from "../types/navigation";
import { useTheme } from "../hooks/useTheme";
import { SPACING, SHADOWS } from "../theme/design-system";

// Componentes da Home
import {
  EmotionalCheckInPrimary,
  NathiaAdviceCard,
  QuickActionsBar,
  BelongingCard,
} from "../components/home";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Responsividade
const getResponsiveValue = (baseValue: number, scale: number = 1) => {
  const scaleFactor = SCREEN_WIDTH / 375;
  return Math.round(baseValue * scaleFactor * scale);
};

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Valores responsivos
  const horizontalPadding = getResponsiveValue(20, 1);
  const gap = getResponsiveValue(16, 1);

  // User data
  const userName = useAppStore((s) => s.user?.name);
  const userStage = useAppStore((s) => s.user?.stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const babyBirthDate = useAppStore((s) => s.user?.babyBirthDate);
  const userAvatar = useAppStore((s) => s.user?.avatarUrl);

  // Refresh state
  const [refreshing, setRefreshing] = React.useState(false);

  // Greeting
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  // Pregnancy info
  const getPregnancyInfo = useMemo(() => {
    if (userStage === "pregnant" && dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor((280 - diffDays) / 7);

      if (diffDays > 0) {
        return `${weeks}ª Semana`;
      }
      return "Parto chegando!";
    } else if (userStage === "postpartum" && babyBirthDate) {
      const today = new Date();
      const birth = new Date(babyBirthDate);
      const diffTime = today.getTime() - birth.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias de vida`;
    }
    return null;
  }, [userStage, dueDate, babyBirthDate]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simular refresh
    await new Promise((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  // Navigation handlers
  const handleAvatarPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Profile");
  }, [navigation]);

  const handleNathiaChat = useCallback(() => {
    navigation.navigate("Assistant");
  }, [navigation]);

  const handleCommunity = useCallback(() => {
    navigation.navigate("Community");
  }, [navigation]);

  const handleQuickNavigation = useCallback((route: string) => {
    // Mapear rotas para navegação
    const routeMap: Record<string, () => void> = {
      Habits: () => navigation.navigate("Habits"),
      DailyLog: () => navigation.navigate("DailyLog", {}),
      Community: () => navigation.navigate("Community"),
      MyCare: () => navigation.navigate("MyCare"),
    };

    const navigateAction = routeMap[route];
    if (navigateAction) {
      navigateAction();
    }
  }, [navigation]);

  // Cores do tema
  const bg = colors.background.primary;
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1, width: "100%" }}>
        {/* HEADER (reduzido) */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          style={{
            paddingHorizontal: horizontalPadding,
            paddingTop: SPACING.md,
            paddingBottom: SPACING.md,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, paddingRight: SPACING.md }}>
            <Text
              style={{
                color: textMain,
                fontSize: getResponsiveValue(24, 1),
                fontWeight: "800",
                letterSpacing: -0.3,
              }}
            >
              {getGreeting()}, {userName || "Mamãe"}
            </Text>
            {getPregnancyInfo && (
              <Text
                style={{
                  color: textMuted,
                  fontSize: getResponsiveValue(14, 1),
                  fontWeight: "600",
                  marginTop: 2,
                }}
              >
                {getPregnancyInfo}
              </Text>
            )}
          </View>

          {/* Avatar */}
          <Pressable
            onPress={handleAvatarPress}
            accessibilityLabel="Ir para perfil"
            accessibilityRole="button"
          >
            <View
              style={{
                height: getResponsiveValue(44, 1),
                width: getResponsiveValue(44, 1),
                borderRadius: 999,
                borderWidth: 2,
                borderColor: isDark ? colors.neutral[700] : colors.neutral[200],
                overflow: "hidden",
                ...SHADOWS.sm,
              }}
            >
              {userAvatar ? (
                <Image
                  source={{ uri: userAvatar }}
                  style={{ height: "100%", width: "100%" }}
                />
              ) : (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: colors.primary[500],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person" size={22} color="#fff" />
                </View>
              )}
            </View>
          </Pressable>
        </Animated.View>

        {/* CONTENT */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingBottom: getResponsiveValue(24) + getResponsiveValue(100) + insets.bottom,
            gap: gap,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary[500]}
            />
          }
        >
          {/* 1. PRIMÁRIO: Check-in Emocional (1 toque) */}
          <Animated.View entering={FadeInUp.delay(50).duration(500).springify()}>
            <EmotionalCheckInPrimary />
          </Animated.View>

          {/* 2. SECUNDÁRIO: Card NathIA */}
          <NathiaAdviceCard onPressChat={handleNathiaChat} />

          {/* 3. SECUNDÁRIO: Pertencimento (discreto) */}
          <BelongingCard onPress={handleCommunity} />

          {/* 4. TERCIÁRIO: Barra de Acesso Rápido */}
          <QuickActionsBar onNavigate={handleQuickNavigation} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
