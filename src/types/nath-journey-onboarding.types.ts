/**
 * Types para o onboarding "Jornada da Nath"
 * Onboarding narrativo em 8 telas com fotos/vídeos reais da Nathália Valente
 */

export type OnboardingStage =
  | "TENTANTE"
  | "GRAVIDA_T1"
  | "GRAVIDA_T2"
  | "GRAVIDA_T3"
  | "PUERPERIO_0_40D"
  | "MAE_RECENTE_ATE_1ANO";

export type OnboardingConcern =
  | "ANSIEDADE_MEDO"
  | "FALTA_INFORMACAO"
  | "SINTOMAS_FISICOS"
  | "MUDANCAS_CORPO"
  | "RELACIONAMENTO"
  | "TRABALHO_MATERNIDADE"
  | "SOLIDAO"
  | "FINANCAS";

export type EmotionalState =
  | "BEM_EQUILIBRADA"
  | "UM_POUCO_ANSIOSA"
  | "MUITO_ANSIOSA"
  | "TRISTE_ESGOTADA"
  | "PREFIRO_NAO_RESPONDER";

export interface OnboardingData {
  // Tela 1
  stage: OnboardingStage | null;

  // Tela 2 (branching)
  lastMenstruation: string | null; // ISO date (tentante)
  dueDate: string | null; // ISO date (grávida)
  birthDate: string | null; // ISO date (mãe)

  // Tela 3
  concerns: OnboardingConcern[]; // max 3

  // Tela 4
  emotionalState: EmotionalState | null;

  // Tela 5
  dailyCheckIn: boolean;
  checkInTime: string | null; // HH:MM

  // Tela 6 (ritual)
  seasonName: string | null; // max 40 chars

  // Metadata
  completedAt: string | null; // ISO datetime
  isFounder: boolean; // badge se completou em D1
  needsExtraCare: boolean; // flag para emotional state crítico
}

export interface StageCardData {
  stage: OnboardingStage;
  image: number | { uri: string }; // require() asset ou URI
  title: string;
  quote: string;
  icon: string;
}

export interface ConcernCardData {
  concern: OnboardingConcern;
  image: number | { uri: string }; // require() asset ou URI
  emoji: string;
  title: string;
  quote: string;
}

export interface EmotionalStateOptionData {
  state: EmotionalState;
  image: number | { uri: string } | null; // require() asset, URI ou null
  emoji: string;
  title: string;
  response: string;
}

export type OnboardingScreen =
  | "OnboardingWelcome"
  | "OnboardingStage"
  | "OnboardingDate"
  | "OnboardingConcerns"
  | "OnboardingEmotionalState"
  | "OnboardingCheckIn"
  | "OnboardingSeason"
  | "OnboardingSummary"
  | "OnboardingPaywall";

