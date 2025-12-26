/**
 * HomeScreen - Premium Design for 40M Followers
 *
 * Hierarquia Ultra-Eficaz:
 * 1. HEADER - Saudação personalizada + Avatar + Streak
 * 2. HERO - Card premium com foto Nathalia + CTA NathIA
 * 3. PROGRESS - Anel de progresso dos hábitos do dia
 * 4. CHECK-IN - Emocional em 1 toque
 * 5. DISCOVERY - Mundo da Nath + Comunidade (cards premium)
 *
 * Princípios:
 * - Impacto visual imediato (hero grande)
 * - Gamificação visível (streak, progress)
 * - CTAs claros e conversivos
 * - Design premium (gradientes, sombras, animações)
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo } from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { useTheme } from "../hooks/useTheme";
import { useAppStore, useHabitsStore, useCheckInStore } from "../state/store";
import { brand, neutral, shadows, spacing, radius } from "../theme/tokens";
import { MainTabScreenProps } from "../types/navigation";

// Componentes da Home
import { EmotionalCheckInPrimary } from "../components/home";
import { Avatar, AVATAR_SIZES, StreakBadge, PressableScale } from "../components/ui";
import { staggeredFadeUp } from "../utils/animations";

// Hero image da Nathalia - usando imagem local
const NATHALIA_HERO_IMAGE = require("../../assets/onboarding/images/stage-gravida-t2.jpg");

// Progress Ring Component
const ProgressRing: React.FC<{
  progress: number;
  size: number;
  strokeWidth: number;
  isDark: boolean;
}> = React.memo(({ progress, size, strokeWidth, isDark }) => {
  const radius_inner = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius_inner;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
      <Defs>
        <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={brand.accent[400]} />
          <Stop offset="100%" stopColor={brand.accent[500]} />
        </SvgGradient>
      </Defs>
      {/* Background circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius_inner}
        stroke={isDark ? neutral[700] : neutral[200]}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Progress circle */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius_inner}
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </Svg>
  );
});

ProgressRing.displayName = "ProgressRing";

// Premium Feature Card - com PressableScale
const FeatureCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  title: string;
  subtitle: string;
  badge?: string;
  onPress: () => void;
  isDark: boolean;
  index?: number;
}> = React.memo(
  ({ icon, iconBgColor, iconColor, title, subtitle, badge, onPress, isDark, index = 0 }) => {
    const cardBg = isDark ? brand.primary[900] : neutral[0];
    const borderColor = isDark ? brand.primary[700] : neutral[100];
    const textMain = isDark ? neutral[100] : neutral[900];
    const textMuted = isDark ? neutral[400] : neutral[500];

    return (
      <Animated.View entering={staggeredFadeUp(index, 80)}>
        <PressableScale onPress={onPress} spring="snappy">
          <View
            accessibilityLabel={title}
            accessibilityRole="button"
            style={[
              styles.featureCard,
              {
                backgroundColor: cardBg,
                borderColor,
                ...shadows.md,
              },
            ]}
          >
            {/* Icon */}
            <View style={[styles.featureIconContainer, { backgroundColor: iconBgColor }]}>
              <Ionicons name={icon} size={22} color={iconColor} />
            </View>

            {/* Content */}
            <View style={styles.featureContent}>
              <View style={styles.featureTitleRow}>
                <Text style={[styles.featureTitle, { color: textMain }]}>{title}</Text>
                {badge && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: isDark ? brand.accent[500] : brand.accent[100] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: isDark ? neutral[900] : brand.accent[700] },
                      ]}
                    >
                      {badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.featureSubtitle, { color: textMuted }]} numberOfLines={2}>
                {subtitle}
              </Text>
            </View>

            {/* Arrow */}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? neutral[500] : neutral[400]}
            />
          </View>
        </PressableScale>
      </Animated.View>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

// Animated ScrollView for parallax
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function HomeScreen({ navigation }: MainTabScreenProps<"Home">): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  // Parallax scroll value
  const scrollY = useSharedValue(0);
  const ctaGlow = useSharedValue(0);

  // Scroll handler for parallax effect
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Hero parallax animation
  const heroParallaxStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, 200],
      [-30, 0, 50],
      "clamp"
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0, 100],
      [1.1, 1, 0.95],
      "clamp"
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  // CTA glow animation - loop infinito otimizado
  React.useEffect(() => {
    // Usa withRepeat ao invés de setInterval para melhor performance
    ctaGlow.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
          withTiming(0.3, { duration: 1500, easing: Easing.bezier(0.4, 0, 0.2, 1) })
        ),
        -1, // Loop infinito
        false // Não reverter
      )
    );
  }, [ctaGlow]);

  const ctaGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(ctaGlow.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(ctaGlow.value, [0, 1], [8, 20]),
  }));

  // User data
  const userName = useAppStore((s) => s.user?.name);
  const userStage = useAppStore((s) => s.user?.stage);
  const dueDate = useAppStore((s) => s.user?.dueDate);
  const babyBirthDate = useAppStore((s) => s.user?.babyBirthDate);
  const userAvatar = useAppStore((s) => s.user?.avatarUrl);

  // Habits data for progress
  const habits = useHabitsStore((s) => s.habits);
  const completedHabits = useMemo(() => habits.filter((h) => h.completed).length, [habits]);
  const totalHabits = habits.length;
  const habitsProgress = totalHabits > 0 ? completedHabits / totalHabits : 0;

  // Check-in streak
  const checkInStreak = useCheckInStore((s) => s.streak);
  const todayMood = useCheckInStore((s) => s.getTodayCheckIn()?.mood);

  // Refresh state
  const [refreshing, setRefreshing] = React.useState(false);

  // Greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  // Pregnancy info
  const pregnancyInfo = useMemo((): string | null => {
    if (userStage === "pregnant" && dueDate) {
      const today = new Date();
      const due = new Date(dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor((280 - diffDays) / 7);
      if (diffDays > 0) return `${weeks}ª semana de gestação`;
      return "Parto chegando!";
    } else if (userStage === "postpartum" && babyBirthDate) {
      const today = new Date();
      const birth = new Date(babyBirthDate);
      const diffTime = today.getTime() - birth.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias de puerpério`;
    }
    return null;
  }, [userStage, dueDate, babyBirthDate]);

  // Motivational message based on time/context
  const motivationalMessage = useMemo(() => {
    const hour = new Date().getHours();
    if (todayMood) {
      return "Você já registrou como se sente. Isso é se cuidar.";
    }
    if (hour < 10) {
      return "Comece o dia com um momento só seu.";
    }
    if (hour < 14) {
      return "Você está indo bem. Cada passo conta.";
    }
    if (hour < 19) {
      return "A tarde também merece autocuidado.";
    }
    return "Descanse. Amanhã você recomeça.";
  }, [todayMood]);

  // Refresh handler
  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    setRefreshing(false);
  }, []);

  // Navigation handlers
  const handleAvatarPress = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("EditProfile");
  }, [navigation]);

  const handleNathiaChat = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Assistant");
  }, [navigation]);

  const handleCommunity = useCallback((): void => {
    navigation.navigate("Community");
  }, [navigation]);

  const handleMundoDaNath = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("MundoDaNath");
  }, [navigation]);

  const handleHabits = useCallback(async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Habits");
  }, [navigation]);

  // Theme colors
  const bg = isDark ? colors.background.primary : brand.primary[50];
  const textMain = isDark ? neutral[100] : neutral[900];
  const textMuted = isDark ? neutral[400] : neutral[500];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <AnimatedScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={brand.accent[500]}
            colors={Platform.OS === "android" ? [brand.accent[500]] : undefined}
          />
        }
      >
        {/* HEADER */}
        <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: textMain }]}>
              {greeting}, {userName || "Mamãe"}
            </Text>
            {pregnancyInfo && (
              <Text style={[styles.pregnancyInfo, { color: brand.accent[500] }]}>
                {pregnancyInfo}
              </Text>
            )}
          </View>

          {/* Avatar with streak badge */}
          <View style={styles.headerRight}>
            {/* Streak Badge - Animado */}
            {checkInStreak > 0 && (
              <StreakBadge days={checkInStreak} size="sm" />
            )}

            {/* Avatar */}
            <PressableScale onPress={handleAvatarPress} scale={0.95}>
              <View
                style={[
                  styles.avatarBorder,
                  {
                    borderColor: habitsProgress > 0 ? brand.accent[400] : neutral[200],
                    ...shadows.sm,
                  },
                ]}
              >
                <Avatar
                  size={AVATAR_SIZES.md}
                  source={userAvatar ? { uri: userAvatar } : null}
                  fallbackIcon="person"
                  fallbackBgColor={brand.primary[500]}
                  fallbackColor={neutral[0]}
                />
              </View>
            </PressableScale>
          </View>
        </Animated.View>

        {/* HERO CARD - Premium CTA */}
        <Animated.View entering={FadeInUp.delay(50).duration(600).springify()}>
          <Pressable
            onPress={handleNathiaChat}
            style={({ pressed }) => [
              styles.heroCard,
              {
                opacity: pressed ? 0.95 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
              },
            ]}
            accessibilityLabel="Conversar com NathIA"
            accessibilityRole="button"
          >
            {/* Background image - foto real da Nath com parallax */}
            <Animated.View style={[StyleSheet.absoluteFill, heroParallaxStyle]}>
              <Image
                source={NATHALIA_HERO_IMAGE}
                style={styles.heroImage}
                contentFit="cover"
                contentPosition="top"
                transition={300}
              />
            </Animated.View>

            {/* Gradient overlay */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
              locations={[0, 0.5, 1]}
              style={styles.heroGradient}
            />

            {/* Hero content */}
            <View style={styles.heroContent}>
              {/* Message */}
              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Oi, mamãe</Text>
                <Text style={styles.heroSubtitle}>{motivationalMessage}</Text>
              </View>

              {/* CTA Button com glow animado */}
              <Animated.View
                style={[
                  styles.heroCTA,
                  {
                    shadowColor: brand.accent[400],
                    shadowOffset: { width: 0, height: 4 },
                  },
                  ctaGlowStyle,
                ]}
              >
                <LinearGradient
                  colors={[brand.accent[400], brand.accent[500], brand.accent[600]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heroCTAGradient}
                >
                  <Ionicons name="sparkles" size={18} color={neutral[0]} />
                  <Text style={styles.heroCTAText}>Falar com a NathIA</Text>
                </LinearGradient>
              </Animated.View>
            </View>
          </Pressable>
        </Animated.View>

        {/* PROGRESS SECTION */}
        <Animated.View entering={FadeInUp.delay(100).duration(500).springify()}>
          <Pressable
            onPress={handleHabits}
            accessibilityLabel={`Progresso do dia: ${completedHabits} de ${totalHabits} hábitos`}
            accessibilityRole="button"
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isDark ? brand.primary[900] : neutral[0],
                borderColor: isDark ? brand.primary[700] : neutral[100],
                borderWidth: 1,
                borderRadius: 20,
                paddingVertical: 16,
                paddingHorizontal: 16,
                shadowColor: neutral[900],
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              {/* Progress Ring */}
              <View style={{ width: 56, height: 56, marginRight: 16, alignItems: "center", justifyContent: "center" }}>
                <ProgressRing
                  progress={habitsProgress}
                  size={56}
                  strokeWidth={5}
                  isDark={isDark}
                />
                <View style={{ position: "absolute", flexDirection: "row", alignItems: "baseline" }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", fontFamily: "Manrope_700Bold", color: textMain }}>
                    {completedHabits}
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: "500", fontFamily: "Manrope_500Medium", color: textMuted }}>
                    /{totalHabits}
                  </Text>
                </View>
              </View>

              {/* Progress Info */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", fontFamily: "Manrope_700Bold", color: textMain }}>
                  Seus cuidados de hoje
                </Text>
                <Text style={{ fontSize: 13, fontWeight: "500", fontFamily: "Manrope_500Medium", color: textMuted, marginTop: 2 }}>
                  {completedHabits === 0
                    ? "Comece quando se sentir pronta"
                    : completedHabits === totalHabits
                      ? "Parabéns! Completou todos"
                      : `Faltam ${totalHabits - completedHabits} para completar`}
                </Text>
              </View>

              {/* Chevron */}
              <Ionicons name="chevron-forward" size={20} color={textMuted} />
            </View>
          </Pressable>
        </Animated.View>

        {/* EMOTIONAL CHECK-IN */}
        <Animated.View
          entering={FadeInUp.delay(150).duration(500).springify()}
          style={[
            styles.sectionCard,
            {
              backgroundColor: isDark ? brand.primary[900] : neutral[0],
              borderColor: isDark ? brand.primary[700] : neutral[100],
              ...shadows.sm,
            },
          ]}
        >
          <EmotionalCheckInPrimary />
        </Animated.View>

        {/* DISCOVERY SECTION */}
        <View style={styles.discoverySection}>
          <Text style={[styles.sectionTitle, { color: textMain }]}>Explorar</Text>

          {/* Mundo da Nath */}
          <FeatureCard
            icon="heart"
            iconBgColor={isDark ? brand.accent[900] : brand.accent[50]}
            iconColor={brand.accent[500]}
            title="Mundo da Nath"
            subtitle="Conteúdos exclusivos da Nathalia para você"
            badge="NOVO"
            onPress={handleMundoDaNath}
            isDark={isDark}
            index={0}
          />

          {/* Comunidade */}
          <FeatureCard
            icon="people"
            iconBgColor={isDark ? brand.primary[800] : brand.primary[50]}
            iconColor={brand.primary[500]}
            title="Comunidade"
            subtitle="Conecte-se com outras mães na mesma jornada"
            onPress={handleCommunity}
            isDark={isDark}
            index={1}
          />
        </View>
      </AnimatedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing["2xl"],
    gap: spacing.lg,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.5,
  },
  pregnancyInfo: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    marginTop: 2,
  },
  avatarBorder: {
    borderRadius: 999,
    borderWidth: 2.5,
  },
  // Hero Card
  heroCard: {
    height: 200,
    borderRadius: radius["2xl"],
    overflow: "hidden",
    ...shadows.lg,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.xl,
    gap: spacing.md,
  },
  heroTextContainer: {
    gap: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    color: neutral[0],
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
  },
  heroCTA: {
    alignSelf: "flex-start",
    borderRadius: radius.full,
    overflow: "hidden",
  },
  heroCTAGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  heroCTAText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    color: neutral[0],
  },


  // Section Card
  sectionCard: {
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
  },

  // Discovery Section
  discoverySection: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },

  // Feature Card
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
    gap: 2,
  },
  featureTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
  featureSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Manrope_500Medium",
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
    letterSpacing: 0.5,
  },
});
