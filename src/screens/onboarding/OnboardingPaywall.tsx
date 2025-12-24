/**
 * Tela 8: OnboardingPaywall
 * Paywall específico para onboarding com RevenueCat
 * Banner especial se needsExtraCare = true
 */

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBar } from "../../components/onboarding/ProgressBar";
import { VideoPlayer } from "../../components/onboarding/VideoPlayer";
import { useNathJourneyOnboardingStore } from "../../state/nath-journey-onboarding-store";
import { usePremiumStore } from "../../state/premium-store";
import { useTheme } from "../../hooks/useTheme";
import { Tokens } from "../../theme/tokens";
import { RootStackScreenProps } from "../../types/navigation";
import { logger } from "../../utils/logger";
import { saveOnboardingData } from "../../api/onboarding-service";

type Props = RootStackScreenProps<"OnboardingPaywall">;

// Placeholder: vídeo será substituído por asset real depois
const PAYWALL_VIDEO = {
  uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
};

export default function OnboardingPaywall({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { onboardingData } = route.params;
  const { completeOnboarding, needsExtraCare } = useNathJourneyOnboardingStore();
  const isPurchasing = usePremiumStore((s) => s.isPurchasing);

  const [isSaving, setIsSaving] = useState(false);
  const needsExtraCareFlag = needsExtraCare();

  const handleStartTrial = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Se needsExtraCare, pular paywall e dar 7 dias grátis
      if (needsExtraCareFlag) {
        logger.info("Skipping paywall for extra care user", "OnboardingPaywall");
        await handleComplete();
        return;
      }

      // TODO: Implementar integração real com RevenueCat
      // Por enquanto, completar onboarding diretamente
      logger.info("Trial flow - completing onboarding", "OnboardingPaywall");
      await handleComplete();
    } catch (error) {
      logger.error("Error starting trial", "OnboardingPaywall", error instanceof Error ? error : new Error(String(error)));
      // Continuar mesmo se falhar
      await handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      setIsSaving(true);

      // Salvar onboarding data no Supabase (stub por enquanto)
      await saveOnboardingData("user-id-placeholder", {
        stage: onboardingData.stage as import("../../types/nath-journey-onboarding.types").OnboardingStage,
        date: onboardingData.date,
        concerns: onboardingData.concerns as import("../../types/nath-journey-onboarding.types").OnboardingConcern[],
        emotionalState: onboardingData.emotionalState as import("../../types/nath-journey-onboarding.types").EmotionalState | undefined,
        dailyCheckIn: onboardingData.dailyCheckIn,
        checkInTime: onboardingData.checkInTime,
        seasonName: onboardingData.seasonName,
        needsExtraCare: onboardingData.needsExtraCare,
      });

      // Marcar onboarding como completo
      completeOnboarding();

      logger.info("Onboarding completed", "OnboardingPaywall");

      // Navegar para Home
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error) {
      logger.error(
        "Error completing onboarding",
        "OnboardingPaywall",
        error instanceof Error ? error : new Error(String(error))
      );
      // Continuar mesmo se falhar
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTerms = () => {
    Linking.openURL("https://nossamaternidade.app/termos");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface.base,
          paddingTop: insets.top,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <ProgressBar currentStep={8} totalSteps={8} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(300)}>
          {/* Banner Extra Care */}
          {needsExtraCareFlag && (
            <View
              style={[
                styles.extraCareBanner,
                {
                  backgroundColor: theme.semantic.infoLight,
                  borderColor: theme.semantic.info,
                },
              ]}
            >
              <Text style={styles.extraCareEmoji}>💜</Text>
              <Text
                style={[
                  styles.extraCareText,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                Seus primeiros 7 dias são por minha conta. Primeiro, cuida de você.
              </Text>
            </View>
          )}

          {/* Video */}
          <View style={styles.videoContainer}>
            <VideoPlayer
              videoSource={PAYWALL_VIDEO}
              autoPlay
              loop={false}
              muted={false}
              showControls={true}
            />
          </View>

          {/* Texto explicativo */}
          <Text
            style={[
              styles.title,
              {
                color: theme.text.primary,
              },
            ]}
          >
            Olha, eu queria fazer esse app de graça pra TODAS.
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            Mas preciso pagar a equipe, servidor... 7 DIAS GRÁTIS pra você testar tudo. Depois,
            R$ 34,90/mês - menos que um lanche no shopping. E parte do lucro vai pro projeto Zuzu
            em Angola.
          </Text>

          {/* Card Plano */}
          <View
            style={[
              styles.planCard,
              {
                backgroundColor: theme.surface.card,
                borderColor: theme.colors.border.subtle,
              },
            ]}
          >
            <View style={styles.planHeader}>
              <Text
                style={[
                  styles.planTitle,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                7 DIAS GRÁTIS
              </Text>
              <Text
                style={[
                  styles.planSubtitle,
                  {
                    color: theme.text.secondary,
                  },
                ]}
              >
                Depois R$ 34,90/mês
              </Text>
            </View>

            <View style={styles.benefitsContainer}>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Conversa ilimitada com NathIA
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Tracker personalizado
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Conteúdo exclusivo da Nath
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Comunidade &quot;Mães da Nath&quot;
              </Text>
              <Text
                style={[
                  styles.benefit,
                  {
                    color: theme.text.primary,
                  },
                ]}
              >
                ✓ Grupo VIP (se baixou no D1)
              </Text>
            </View>

            <Text
              style={[
                styles.planNote,
                {
                  color: theme.text.tertiary,
                },
              ]}
            >
              Cancele quando quiser
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Tokens.spacing.lg,
          },
        ]}
      >
        <Pressable
          onPress={handleStartTrial}
          disabled={isSaving || isPurchasing}
          style={[
            styles.primaryButton,
            (isSaving || isPurchasing) && styles.primaryButtonDisabled,
          ]}
          accessibilityLabel="Começar 7 dias grátis"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={Tokens.gradients.accent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            {isSaving || isPurchasing ? (
              <ActivityIndicator color={Tokens.neutral[0]} />
            ) : (
              <Text style={styles.primaryButtonText}>Começar 7 dias grátis</Text>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={handleComplete}
          style={styles.secondaryButton}
          accessibilityLabel="Já sou assinante"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.secondaryButtonText,
              {
                color: theme.text.secondary,
              },
            ]}
          >
            Já sou assinante
          </Text>
        </Pressable>

        <Pressable onPress={handleTerms} style={styles.termsButton}>
          <Text
            style={[
              styles.termsText,
              {
                color: theme.text.tertiary,
              },
            ]}
          >
            Termos de uso
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing["4xl"],
  },
  extraCareBanner: {
    padding: Tokens.spacing.lg,
    borderRadius: Tokens.radius.lg,
    borderWidth: 2,
    marginBottom: Tokens.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.md,
  },
  extraCareEmoji: {
    fontSize: 32,
  },
  extraCareText: {
    flex: 1,
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    lineHeight: Tokens.typography.bodyMedium.lineHeight * 1.3,
  },
  videoContainer: {
    width: "100%",
    height: 200,
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    marginBottom: Tokens.spacing["2xl"],
  },
  title: {
    fontSize: Tokens.typography.headlineLarge.fontSize,
    fontWeight: Tokens.typography.headlineLarge.fontWeight,
    lineHeight: Tokens.typography.headlineLarge.lineHeight,
    marginBottom: Tokens.spacing.md,
  },
  subtitle: {
    fontSize: Tokens.typography.bodyLarge.fontSize,
    lineHeight: Tokens.typography.bodyLarge.lineHeight * 1.5,
    marginBottom: Tokens.spacing["2xl"],
  },
  planCard: {
    padding: Tokens.spacing["2xl"],
    borderRadius: Tokens.radius["2xl"],
    borderWidth: 2,
    ...Tokens.shadows.md,
  },
  planHeader: {
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
  },
  planTitle: {
    fontSize: Tokens.typography.headlineMedium.fontSize,
    fontWeight: Tokens.typography.headlineMedium.fontWeight,
    marginBottom: Tokens.spacing.xs,
  },
  planSubtitle: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
  },
  benefitsContainer: {
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing.lg,
  },
  benefit: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    lineHeight: Tokens.typography.bodyMedium.lineHeight * 1.5,
  },
  planNote: {
    fontSize: Tokens.typography.caption.fontSize,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    paddingHorizontal: Tokens.spacing["2xl"],
    paddingTop: Tokens.spacing.lg,
    gap: Tokens.spacing.md,
  },
  primaryButton: {
    borderRadius: Tokens.radius.lg,
    overflow: "hidden",
    ...Tokens.shadows.lg,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonGradient: {
    paddingVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing["2xl"],
    alignItems: "center",
    justifyContent: "center",
    minHeight: Tokens.accessibility.minTapTarget,
  },
  primaryButtonText: {
    color: Tokens.neutral[0],
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
  },
  secondaryButton: {
    paddingVertical: Tokens.spacing.md,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: Tokens.typography.bodyMedium.fontSize,
    fontWeight: Tokens.typography.labelMedium.fontWeight,
  },
  termsButton: {
    paddingVertical: Tokens.spacing.sm,
    alignItems: "center",
  },
  termsText: {
    fontSize: Tokens.typography.caption.fontSize,
    textDecorationLine: "underline",
  },
});

