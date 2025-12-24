/**
 * Dados mockados para o onboarding "Jornada da Nath"
 * Placeholders de imagens até assets reais estarem disponíveis
 */

import {
  ConcernCardData,
  EmotionalStateOptionData,
  StageCardData,
} from "../types/nath-journey-onboarding.types";

// Placeholder: usar imagens reais depois
// Por enquanto, usar uma imagem placeholder genérica
// TODO: Substituir por assets reais da Nath em assets/onboarding/
// Por enquanto, usar uma URI temporária ou criar assets placeholder
const PLACEHOLDER_IMAGE = {
  uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
};

export const STAGE_CARDS: StageCardData[] = [
  {
    stage: "TENTANTE",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/stage-tentante.jpg')
    title: "Tentando engravidar",
    quote: "Lembro da ansiedade de cada ciclo",
    icon: "🤞",
  },
  {
    stage: "GRAVIDA_T1",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/stage-gravida-t1.jpg')
    title: "Grávida - Primeiros meses",
    quote: "Os enjoos eram reais demais",
    icon: "🌱",
  },
  {
    stage: "GRAVIDA_T2",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/stage-gravida-t2.jpg')
    title: "Grávida - Barriga crescendo",
    quote: "Melhor fase! Senti ele mexer pela 1ª vez",
    icon: "🌸",
  },
  {
    stage: "GRAVIDA_T3",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/stage-gravida-t3.jpg')
    title: "Grávida - Reta final",
    quote: "Ansiosa, com medo, mas empolgada",
    icon: "🎈",
  },
  {
    stage: "PUERPERIO_0_40D",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/stage-puerperio.jpg')
    title: "Acabei de ter meu bebê",
    quote: "Primeiros 40 dias: caos lindo",
    icon: "👶",
  },
  {
    stage: "MAE_RECENTE_ATE_1ANO",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/stage-mae-recente.jpg')
    title: "Mãe recente (até 1 ano)",
    quote: "Aprendendo a cada dia",
    icon: "💕",
  },
];

export const CONCERN_CARDS: ConcernCardData[] = [
  {
    concern: "ANSIEDADE_MEDO",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-ansiedade.jpg')
    emoji: "😰",
    title: "Ansiedade e medo",
    quote: "Eu tinha pavor do parto. Chorei MUITO.",
  },
  {
    concern: "FALTA_INFORMACAO",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-informacao.jpg')
    emoji: "❓",
    title: "Falta de informação",
    quote: "Toda hora no Google: 'é normal?'",
  },
  {
    concern: "SINTOMAS_FISICOS",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-sintomas.jpg')
    emoji: "🤢",
    title: "Sintomas físicos",
    quote: "Enjoo 24/7. Perdi 5kg no 1º trimestre.",
  },
  {
    concern: "MUDANCAS_CORPO",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-corpo.jpg')
    emoji: "🤰",
    title: "Mudanças no corpo",
    quote: "Estranhei MUITO meu novo corpo.",
  },
  {
    concern: "RELACIONAMENTO",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-relacionamento.jpg')
    emoji: "💔",
    title: "Relacionamento",
    quote: "A gente brigou MUITO na gestação.",
  },
  {
    concern: "TRABALHO_MATERNIDADE",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-trabalho.jpg')
    emoji: "💼",
    title: "Trabalho e maternidade",
    quote: "Como vou fazer tudo?",
  },
  {
    concern: "SOLIDAO",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-solidao.jpg')
    emoji: "😔",
    title: "Solidão",
    quote: "Às vezes me sentia muito só.",
  },
  {
    concern: "FINANCAS",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/concern-financas.jpg')
    emoji: "💰",
    title: "Grana",
    quote: "Enxoval é CARO. Fiquei assustada.",
  },
];

export const EMOTIONAL_STATE_OPTIONS: EmotionalStateOptionData[] = [
  {
    state: "BEM_EQUILIBRADA",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/emotional-bem.jpg')
    emoji: "☀️",
    title: "Bem, equilibrada",
    response: "Que sorte! Aproveita esse momento",
  },
  {
    state: "UM_POUCO_ANSIOSA",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/emotional-ansiosa-leve.jpg')
    emoji: "🌤️",
    title: "Um pouco ansiosa",
    response: "Eu tbm. Vou te passar umas dicas",
  },
  {
    state: "MUITO_ANSIOSA",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/emotional-ansiosa-grave.jpg')
    emoji: "⛈️",
    title: "Muito ansiosa",
    response: "Te entendo DEMAIS. Vamos com calma",
  },
  {
    state: "TRISTE_ESGOTADA",
    image: PLACEHOLDER_IMAGE, // Substituir por require('@/assets/onboarding/emotional-triste.jpg')
    emoji: "🌧️",
    title: "Triste/esgotada",
    response: "Não está sozinha. Tem ajuda, viu?",
  },
  {
    state: "PREFIRO_NAO_RESPONDER",
    image: null, // Sem foto
    emoji: "🤐",
    title: "Prefiro não falar agora",
    response: "Tudo bem. Quando quiser, eu tô aqui",
  },
];

export const SEASON_PRESETS = [
  "Temporada: Eu por mim mesma",
  "Temporada: Saindo do automático",
  "Temporada: Fim da promessa vazia",
  "Temporada: Minha jornada real",
];
