/**
 * Store Zustand para o onboarding "Jornada da Nath"
 * Gerencia estado local durante o fluxo de onboarding
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  OnboardingData,
  OnboardingStage,
  OnboardingConcern,
  EmotionalState,
  OnboardingScreen,
} from "../types/nath-journey-onboarding.types";
import { logger } from "../utils/logger";

interface NathJourneyOnboardingState {
  // Dados do onboarding
  data: OnboardingData;

  // Estado do fluxo
  currentScreen: OnboardingScreen;
  isComplete: boolean;

  // Actions - Data updates
  setStage: (stage: OnboardingStage) => void;
  setLastMenstruation: (date: string | null) => void;
  setDueDate: (date: string | null) => void;
  setBirthDate: (date: string | null) => void;
  setConcerns: (concerns: OnboardingConcern[]) => void;
  toggleConcern: (concern: OnboardingConcern) => void;
  setEmotionalState: (state: EmotionalState) => void;
  setDailyCheckIn: (enabled: boolean) => void;
  setCheckInTime: (time: string | null) => void;
  setSeasonName: (name: string | null) => void;

  // Actions - Flow control
  setCurrentScreen: (screen: OnboardingScreen) => void;
  nextScreen: () => void;
  prevScreen: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Computed
  canProceed: () => boolean;
  getProgress: () => number;
  needsExtraCare: () => boolean;
}

const SCREENS_ORDER: OnboardingScreen[] = [
  "OnboardingWelcome",
  "OnboardingStage",
  "OnboardingDate",
  "OnboardingConcerns",
  "OnboardingEmotionalState",
  "OnboardingCheckIn",
  "OnboardingSeason",
  "OnboardingSummary",
  "OnboardingPaywall",
];

const initialData: OnboardingData = {
  stage: null,
  lastMenstruation: null,
  dueDate: null,
  birthDate: null,
  concerns: [],
  emotionalState: null,
  dailyCheckIn: false,
  checkInTime: null,
  seasonName: null,
  completedAt: null,
  isFounder: false,
  needsExtraCare: false,
};

export const useNathJourneyOnboardingStore = create<NathJourneyOnboardingState>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentScreen: "OnboardingWelcome",
      isComplete: false,

      // Data updates
      setStage: (stage) =>
        set((state) => ({
          data: { ...state.data, stage },
        })),

      setLastMenstruation: (date) =>
        set((state) => ({
          data: { ...state.data, lastMenstruation: date },
        })),

      setDueDate: (date) =>
        set((state) => ({
          data: { ...state.data, dueDate: date },
        })),

      setBirthDate: (date) =>
        set((state) => ({
          data: { ...state.data, birthDate: date },
        })),

      setConcerns: (concerns) => {
        if (concerns.length > 3) {
          logger.warn("Tentativa de selecionar mais de 3 concerns", "OnboardingStore");
          return;
        }
        set((state) => ({
          data: { ...state.data, concerns },
        }));
      },

      toggleConcern: (concern) => {
        const { data } = get();
        const currentConcerns = data.concerns;
        const isSelected = currentConcerns.includes(concern);

        if (isSelected) {
          // Remove
          set((state) => ({
            data: {
              ...state.data,
              concerns: currentConcerns.filter((c) => c !== concern),
            },
          }));
        } else {
          // Add (max 3)
          if (currentConcerns.length >= 3) {
            logger.warn("Máximo de 3 concerns permitidos", "OnboardingStore");
            return;
          }
          set((state) => ({
            data: {
              ...state.data,
              concerns: [...currentConcerns, concern],
            },
          }));
        }
      },

      setEmotionalState: (state) => {
        const needsExtraCare =
          state === "MUITO_ANSIOSA" || state === "TRISTE_ESGOTADA";

        set((current) => ({
          data: {
            ...current.data,
            emotionalState: state,
            needsExtraCare,
          },
        }));
      },

      setDailyCheckIn: (enabled) =>
        set((state) => ({
          data: { ...state.data, dailyCheckIn: enabled },
        })),

      setCheckInTime: (time) =>
        set((state) => ({
          data: { ...state.data, checkInTime: time },
        })),

      setSeasonName: (name) => {
        if (name && name.length > 40) {
          logger.warn("Season name excede 40 caracteres", "OnboardingStore");
          return;
        }
        set((state) => ({
          data: { ...state.data, seasonName: name },
        }));
      },

      // Flow control
      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      nextScreen: () => {
        const { currentScreen } = get();
        const currentIndex = SCREENS_ORDER.indexOf(currentScreen);
        if (currentIndex < SCREENS_ORDER.length - 1) {
          const nextScreen = SCREENS_ORDER[currentIndex + 1];
          set({ currentScreen: nextScreen });
        }
      },

      prevScreen: () => {
        const { currentScreen } = get();
        const currentIndex = SCREENS_ORDER.indexOf(currentScreen);
        if (currentIndex > 0) {
          const prevScreen = SCREENS_ORDER[currentIndex - 1];
          set({ currentScreen: prevScreen });
        }
      },

      completeOnboarding: () => {
        set((state) => ({
          isComplete: true,
          data: {
            ...state.data,
            completedAt: new Date().toISOString(),
            // Verificar se é founder (completou em 06-08/jan/2026)
            isFounder: checkIfFounder(),
          },
        }));
      },

      resetOnboarding: () =>
        set({
          data: initialData,
          currentScreen: "OnboardingWelcome",
          isComplete: false,
        }),

      // Computed
      canProceed: () => {
        const { data, currentScreen } = get();

        switch (currentScreen) {
          case "OnboardingWelcome":
            return true; // Sempre pode avançar
          case "OnboardingStage":
            return data.stage !== null;
          case "OnboardingDate":
            // Validação depende do stage (implementar depois)
            return true;
          case "OnboardingConcerns":
            return data.concerns.length >= 1 && data.concerns.length <= 3;
          case "OnboardingEmotionalState":
            return data.emotionalState !== null;
          case "OnboardingCheckIn":
            return true; // Opcional
          case "OnboardingSeason":
            return data.seasonName !== null && data.seasonName.length > 0;
          case "OnboardingSummary":
            return true;
          case "OnboardingPaywall":
            return true;
          default:
            return false;
        }
      },

      getProgress: () => {
        const { currentScreen } = get();
        const currentIndex = SCREENS_ORDER.indexOf(currentScreen);
        // Progresso baseado em 7 telas principais (excluindo Welcome e Paywall)
        // Welcome = 0%, Paywall = 100%
        if (currentScreen === "OnboardingWelcome") return 0;
        if (currentScreen === "OnboardingPaywall") return 100;
        // 7 telas principais = 14% cada
        return Math.round(((currentIndex - 1) / 7) * 100);
      },

      needsExtraCare: () => {
        const { data } = get();
        return data.needsExtraCare;
      },
    }),
    {
      name: "nath-journey-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        data: state.data,
        currentScreen: state.currentScreen,
        isComplete: state.isComplete,
      }),
    }
  )
);

/**
 * Verifica se o usuário completou onboarding no período founder (06-08/jan/2026)
 */
function checkIfFounder(): boolean {
  const now = new Date();
  const founderStart = new Date("2026-01-06T00:00:00Z");
  const founderEnd = new Date("2026-01-08T23:59:59Z");

  return now >= founderStart && now <= founderEnd;
}

