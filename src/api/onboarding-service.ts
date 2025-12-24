/**
 * Onboarding Service - Stub
 * TODO: Implementar integração real com Supabase quando tabela user_onboarding existir
 */

import { logger } from "../utils/logger";
import {
  OnboardingConcern,
  OnboardingStage,
  EmotionalState,
} from "../types/nath-journey-onboarding.types";

export interface OnboardingData {
  stage: OnboardingStage;
  date?: string | null;
  concerns: OnboardingConcern[];
  emotionalState?: EmotionalState | null;
  dailyCheckIn?: boolean;
  checkInTime?: string | null;
  seasonName?: string | null;
  needsExtraCare?: boolean;
}

/**
 * Save onboarding data to backend
 * Currently a stub - will be implemented with Supabase
 */
export async function saveOnboardingData(
  _userId: string,
  data: OnboardingData
): Promise<{ success: boolean; error?: string }> {
  try {
    logger.info("Saving onboarding data (stub)", "OnboardingService", { data });

    // TODO: Implement actual Supabase save when table exists
    // For now, just log and return success

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to save onboarding data", "OnboardingService", new Error(errorMessage));
    return { success: false, error: errorMessage };
  }
}

/**
 * Get onboarding data from backend
 * Currently a stub
 */
export async function getOnboardingData(
  _userId: string
): Promise<{ data: OnboardingData | null; error?: string }> {
  try {
    logger.info("Getting onboarding data (stub)", "OnboardingService");

    // TODO: Implement actual Supabase fetch when table exists

    return { data: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Failed to get onboarding data", "OnboardingService", new Error(errorMessage));
    return { data: null, error: errorMessage };
  }
}
