# Onboarding "Jornada da Nath" - Documentação

## 📋 Visão Geral

Onboarding narrativo em 8 telas com fotos/vídeos reais da influenciadora Nathália Valente. Implementado com React Native + Expo, TypeScript strict, e integração completa com Supabase e RevenueCat.

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── types/
│   └── nath-journey-onboarding.types.ts    # Types TypeScript
├── state/
│   └── nath-journey-onboarding-store.ts    # Store Zustand (persistido)
├── components/
│   └── onboarding/
│       ├── ProgressBar.tsx                 # Barra de progresso animada
│       ├── VideoPlayer.tsx                 # Player de vídeo (Expo AV)
│       ├── StageCard.tsx                   # Card de estágio
│       ├── ConcernCard.tsx                 # Card de preocupação
│       ├── ShareableCard.tsx               # Card compartilhável (temporada)
│       └── index.ts                        # Barrel exports
├── screens/
│   └── onboarding/
│       ├── OnboardingWelcome.tsx           # Tela 0: Vídeo de boas-vindas
│       ├── OnboardingStage.tsx             # Tela 1: Seleção de estágio (6 cards)
│       ├── OnboardingDate.tsx              # Tela 2: Date picker (branching)
│       ├── OnboardingConcerns.tsx          # Tela 3: Preocupações (multi-select até 3)
│       ├── OnboardingEmotionalState.tsx    # Tela 4: Estado emocional (CRÍTICA)
│       ├── OnboardingCheckIn.tsx           # Tela 5: Check-in diário
│       ├── OnboardingSeason.tsx            # Tela 6: Ritual de temporada
│       ├── OnboardingSummary.tsx          # Tela 7: Resumo personalizado
│       └── OnboardingPaywall.tsx           # Tela 8: Paywall + RevenueCat
├── config/
│   └── nath-journey-onboarding-data.ts     # Dados mockados (stages, concerns, etc.)
└── api/
    └── onboarding-service.ts              # Service para salvar no Supabase

supabase/
└── migrations/
    └── 028_nath_journey_onboarding.sql     # Migration da tabela user_onboarding
```

## 🎯 Fluxo de Telas

1. **OnboardingWelcome** → Vídeo 15seg da Nath + botão após 8s
2. **OnboardingStage** → 6 cards de estágio (TENTANTE, GRAVIDA_T1/T2/T3, PUERPERIO, MAE_RECENTE)
3. **OnboardingDate** → Date picker com branching logic baseado no stage
4. **OnboardingConcerns** → Grid 2 colunas, multi-select até 3 preocupações
5. **OnboardingEmotionalState** → Vídeo 10seg + 5 opções (define `needsExtraCare`)
6. **OnboardingCheckIn** → Toggle + time picker para check-in diário
7. **OnboardingSeason** → 4 presets + campo custom (máx 40 chars) + preview card
8. **OnboardingSummary** → Resumo personalizado com 5 cards informativos
9. **OnboardingPaywall** → Vídeo 15seg + RevenueCat integration + banner especial se `needsExtraCare`

## 🔑 Features Principais

### Branching Logic (Tela 2)

- **TENTANTE**: Pergunta última menstruação (validação: -180 dias a hoje)
- **GRAVIDA\_\***: Pergunta DPP (validação: -7 dias a +280 dias)
- **PUERPERIO/MAE_RECENTE**: Pergunta data de nascimento (validação específica por stage)

### Guardrails (Tela 4)

Se `emotionalState === "MUITO_ANSIOSA" || "TRISTE_ESGOTADA"`:

- Flag `needsExtraCare = true`
- Banner especial no paywall ("7 dias por minha conta")
- Tom da NathIA muda para ultra-empático
- Sugestão de CVV 188 no resumo

### Founder Badge

Usuárias que completarem onboarding entre **06-08/jan/2026** recebem `isFounder = true`.

## 💾 Database Schema

Tabela `user_onboarding` no Supabase com:

- Campos para todas as respostas das 8 telas
- Constraints de validação (max 3 concerns, validação de datas por stage)
- RLS policies (usuário só vê/edita próprio onboarding)
- Índices para performance

## 🔄 Integração com Navegação

O onboarding "Jornada da Nath" é **prioritário** sobre o onboarding legado:

```
Login → NotificationPermission → NathJourneyOnboarding → Onboarding (legacy) → NathIAOnboarding → MainApp
```

Controlado por `isNathJourneyOnboardingComplete` no store Zustand.

## 📦 Dependências Utilizadas

- `expo-av` - Player de vídeo
- `@react-native-community/datetimepicker` - Date/Time pickers
- `react-native-reanimated` - Animações
- `zustand` - State management (persistido com AsyncStorage)
- `@shopify/flash-list` - Listas performáticas
- `date-fns` - Manipulação de datas
- `expo-linear-gradient` - Gradientes
- `react-native-purchases` - RevenueCat SDK

## 🎨 Design System

Seguindo padrões do projeto:

- **Tokens**: `src/theme/tokens.ts` (Calm FemTech preset)
- **Cores**: Rosa/roxo gradient para CTAs, azul para estrutura
- **Tipografia**: Manrope (escala do design system)
- **Acessibilidade**: WCAG AAA, tap targets 44pt+

## 🚀 Próximos Passos

1. **Assets Reais**: Substituir placeholders por fotos/vídeos reais da Nath
   - Vídeos: `assets/onboarding/videos/welcome.mp4`, `emotional-state.mp4`, `paywall.mp4`
   - Fotos: `assets/onboarding/stage-*.jpg`, `concern-*.jpg`, `emotional-*.jpg`

2. **Analytics**: Adicionar eventos de tracking em cada tela
   - `onboarding_welcome_viewed`
   - `onboarding_stage_selected`
   - `onboarding_emotional_state_selected` (com flag `needs_extra_care`)
   - `onboarding_completed` (com `duration_seconds`, `is_founder`)

3. **Testes**: Criar testes unitários para:
   - Validação de datas por stage
   - Lógica de `needsExtraCare`
   - Store Zustand (actions, computed values)

4. **Otimizações**:
   - Lazy loading de vídeos
   - Cache de imagens
   - Otimização de re-renders com `React.memo`

## 📝 Notas Técnicas

- **Placeholders**: Imagens/vídeos usam URIs temporárias até assets reais estarem disponíveis
- **Validação**: Datas validadas client-side antes de salvar no Supabase
- **Error Handling**: Graceful degradation - onboarding continua mesmo se RevenueCat falhar
- **Offline**: Store Zustand persiste localmente, permite continuar offline

## 🔒 Segurança

- RLS habilitado na tabela `user_onboarding`
- Validação de dados client-side + server-side (constraints SQL)
- Dados sensíveis (emotional state) tratados com cuidado extra

## 📊 Métricas Importantes

- **Completion Rate**: Taxa de conclusão do onboarding
- **Drop-off Points**: Onde usuárias abandonam
- **Extra Care Users**: % de usuárias com `needsExtraCare = true`
- **Founder Badge**: Quantas usuárias receberam badge founder

---

**Status**: ✅ Implementação completa (100%)
**Data**: Janeiro 2025
**Autor**: Claude Code (com base no prompt do usuário)
