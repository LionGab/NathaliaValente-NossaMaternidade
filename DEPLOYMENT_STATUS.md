# 📱 Status de Deploy - Nossa Maternidade

**Última atualização:** 21 de dezembro de 2025  
**Versão do App:** 1.0.0  
**Plataformas:** iOS (App Store) e Android (Google Play Store)

---

## 📊 Resumo Executivo

| Categoria | iOS (App Store) | Android (Google Play) | Detalhes |
|-----------|-----------------|----------------------|----------|
| **Configuração Técnica** | ✅ 100% | ✅ 100% | Bundle IDs, SDKs, permissões |
| **Build Configuration** | ✅ Pronto | ✅ Pronto | EAS profiles configurados |
| **Qualidade de Código** | ✅ 100% | ✅ 100% | 0 erros TS, 0 erros lint |
| **Assets (Ícones/Splash)** | ✅ Completo | ✅ Completo | 26 arquivos em assets/ |
| **Screenshots** | ⏳ Pendente | ⏳ Pendente | 9-12 screenshots necessários |
| **Funcionalidades Core** | ✅ 100% | ✅ 100% | 25 telas implementadas |
| **Backend/APIs** | ✅ 100% | ✅ 100% | 11 Edge Functions |
| **Acessibilidade** | ✅ 85% | ✅ 85% | 56 labels, 40 roles |
| **Metadata da Loja** | ⏳ Pendente | ⏳ Pendente | Requer contas nas lojas |
| **Conformidade Legal** | ⚠️ 50% | ⚠️ 50% | URLs definidas, páginas pendentes |
| **Testes em Dispositivo** | ⏳ Pendente | ⏳ Pendente | Requer dispositivos físicos |
| **Segurança** | ⚠️ 90% | ⚠️ 90% | 2 vulnerabilidades moderadas |
| **Build de Produção** | ⏳ Não iniciado | ⏳ Não iniciado | Aguardando secrets |
| **Submissão** | ⏳ Não iniciado | ⏳ Não iniciado | Aguardando builds |

**Status Geral:** 🟡 **Em Preparação** (~70% completo)

---

## 📈 Métricas do Projeto

### Tamanho do Codebase
| Métrica | Valor |
|---------|-------|
| **Total de linhas de código** | ~36,700 |
| **Arquivos TypeScript (.ts)** | 60 |
| **Arquivos TSX (.tsx)** | 68 |
| **Total de componentes** | 128 |
| **Telas (screens)** | 25 |
| **Hooks customizados** | 16 |
| **Edge Functions (Supabase)** | 11 |

### Qualidade de Código (21 Dez 2025)
| Check | Status | Resultado |
|-------|--------|-----------|
| TypeScript (`npm run typecheck`) | ✅ PASSOU | 0 erros |
| ESLint (`npm run lint`) | ✅ PASSOU | 0 erros |
| console.log restantes | ⚠️ 5 ocorrências | Em arquivos de debug |
| Vulnerabilidades (npm audit) | ⚠️ 2 moderadas | markdown-it dependency |

---

## 🏗️ Arquitetura e Funcionalidades

### Fluxo de Navegação (5 Estágios)
```
1. LoginScreen (Email, Google, Apple, Facebook)
   ↓
2. NotificationPermissionScreen
   ↓
3. OnboardingScreen (nome, fase da vida, interesses)
   ↓
4. NathIAOnboardingScreen (personalização IA - 5 passos)
   ↓
5. MainTabs (5 abas) + 15 telas modais
```

### Telas Implementadas (25 total)

#### Autenticação e Onboarding (4)
| Tela | Status | Funcionalidades |
|------|--------|-----------------|
| LoginScreen | ✅ Completo | Email/senha, Google, Apple, Facebook, biometria |
| NotificationPermissionScreen | ✅ Completo | Solicitação de permissão push |
| OnboardingScreen | ✅ Completo | 6 passos: welcome, nome, fase, data, interesses, complete |
| NathIAOnboardingScreen | ✅ Completo | 5 passos: personalização IA |

#### Main Tabs (5)
| Tab | Tela | Status | Funcionalidades |
|-----|------|--------|-----------------|
| Home | HomeScreen | ✅ Completo | Dashboard, cards de acesso rápido |
| Ciclo | CycleTrackerScreen | ✅ Completo | Calendário menstrual, previsões |
| NathIA | AssistantScreen | ✅ Completo | Chat IA, histórico, voice input |
| Comunidade | CommunityScreen | ✅ Completo | Feed posts, busca, likes |
| Meus Cuidados | MyCareScreen | ✅ Completo | Hub de bem-estar |

#### Telas Modais/Feature (16)
| Tela | Status | Funcionalidades |
|------|--------|-----------------|
| PostDetailScreen | ✅ Completo | Visualização de post |
| NewPostScreen | ✅ Completo | Criar publicação |
| DailyLogScreen | ✅ Completo | Check-in diário (humor, energia, sono) |
| AffirmationsScreen | ✅ Completo | Afirmações diárias estilo Calm |
| HabitsScreen | ✅ Completo | 8 hábitos de bem-estar |
| HabitsEnhancedScreen | ✅ Completo | Versão premium dos hábitos |
| ProfileScreen | ✅ Completo | Configurações de perfil |
| LegalScreen | ✅ Completo | Termos e políticas |
| NotificationPreferencesScreen | ✅ Completo | Configurar notificações |
| BreathingExerciseScreen | ✅ Completo | Exercícios de respiração guiada |
| RestSoundsScreen | ✅ Completo | Sons relaxantes |
| MaeValenteProgressScreen | ✅ Completo | Progresso na comunidade |
| MundoDaNathScreen | ✅ Completo | Conteúdo curado |
| PaywallScreen | ✅ Completo | Tela de assinatura premium |
| ComingSoonScreen | ✅ Completo | Placeholder para features futuras |

### Funcionalidades Core

#### ✅ NathIA - Assistente de IA
- Chat com histórico persistente (Zustand + AsyncStorage)
- Suporte a múltiplas conversas
- Quick chips para perguntas rápidas
- Voice input (gravação e transcrição)
- Envio de imagens para análise
- Detecção de perguntas médicas + disclaimer
- Modal de consentimento IA (LGPD)
- Sidebar com histórico agrupado por data
- Suporte dark mode

#### ✅ Comunidade Mães Valente
- Feed tipo Instagram
- Criar posts com texto/imagem
- Sistema de likes
- Busca de posts
- Composer card para criar posts
- Moderação de conteúdo (Edge Function)

#### ✅ Rastreador de Ciclo
- Calendário visual de 6 semanas
- Marcação de período, ovulação, janela fértil
- Cálculo baseado em ciclo configurável
- Card de fase atual com cor dinâmica
- Previsão de próxima menstruação

#### ✅ Sistema de Hábitos
- 8 hábitos de bem-estar pré-configurados
- Categorias: self-care, health, mindfulness, connection, growth
- Streak tracking
- Completude semanal
- Feedback háptico

#### ✅ Check-in Diário
- 8 opções de humor com emojis
- Slider de intensidade (0-100%)
- Energia e sono
- Notas pessoais
- Persistência local

#### ✅ Afirmações Diárias
- 15 afirmações em português
- 5 temas de gradientes (Oceano, Ametista, Floresta, Terra, Cosmos)
- Sistema de favoritos
- Compartilhamento nativo

#### ✅ Sistema de Autenticação
- Email/senha (Supabase Auth)
- Google OAuth
- Apple Sign-In
- Facebook Login
- Biometria (Face ID / Touch ID)
- Recuperação de senha

#### ✅ Sistema Premium (RevenueCat)
- Integração completa RevenueCat
- Planos: mensal e anual
- Restore purchases
- Premium gate em features
- Expo Go fallback (dynamic import)

---

## ✅ Etapas Concluídas

### 1. Configuração Técnica (100%)

- [x] **Bundle IDs configurados:**
  - iOS: `com.nossamaternidade.app`
  - Android: `com.nossamaternidade.app`
  
- [x] **`app.json` e `app.config.js` configurados:**
  - Versão: 1.0.0
  - Build Number (iOS): 1
  - Version Code (Android): 1
  - Target SDK Android: 35 (Android 14+)
  - Min SDK Android: 24 (Android 7.0 - 95%+ cobertura)
  
- [x] **Privacy Manifest iOS 17+ configurado:**
  - NSPrivacyAccessedAPIType: UserDefaults (CA92.1)
  - Compliance com App Tracking Transparency
  
- [x] **Permissões configuradas:**
  - Câmera, Microfone, Galeria de Fotos
  - Localização, Notificações Push
  - Acesso à Internet

- [x] **EAS Build (`eas.json`) configurado:**
  - Perfil `development` para desenvolvimento
  - Perfil `preview` para testes internos
  - Perfil `staging` para homologação
  - Perfil `production` para produção
  - Auto-increment de versões habilitado

### 2. Assets Visuais (80%)

- [x] **App Icon:** `assets/icon.png` (1024×1024px)
- [x] **Splash Screen:** `assets/splash.png`
- [x] **Adaptive Icon Android:** `assets/adaptive-icon.png`
- [x] **Notification Icon:** `assets/notification-icon.png`
- [ ] **Screenshots iOS** (pendente)
- [ ] **Screenshots Android** (pendente)
- [ ] **Feature Graphic Android** (pendente - 1024×500px)

### 3. Código e Qualidade (100%)

- [x] **TypeScript:** 0 erros (`npm run typecheck`) ✅
- [x] **ESLint:** 0 erros (`npm run lint`) ✅
- [x] **Error Boundary global implementado** (`src/components/ErrorBoundary.tsx`)
- [x] **Screen Error Boundary** (`src/components/ScreenErrorBoundary.tsx`)
- [x] **Logger centralizado** (`src/utils/logger.ts` - substitui console.log)
- [x] **Acessibilidade:** 56 accessibilityLabel, 40 accessibilityRole
- [x] **Touch targets:** Mínimo 44pt (Apple HIG compliance)
- [x] **Dark mode:** Completo com hook `useTheme()`
- [x] **Offline Banner:** Componente para modo offline
- [x] **Toast Provider:** Sistema de notificações in-app
- [x] **Loading States:** Componentes de loading (LoadingDots, LoadingState, SkeletonLoader)

### 4. Backend e Infraestrutura (100%)

- [x] **Supabase configurado:**
  - Autenticação (Email, Apple, Google, Facebook)
  - Database com Row Level Security (RLS)
  - Storage para imagens
  
- [x] **Edge Functions deployadas (11 funções):**
  | Função | Descrição | Status |
  |--------|-----------|--------|
  | `ai` | Respostas da NathIA | ✅ Ativo |
  | `analytics` | Tracking de eventos | ✅ Ativo |
  | `delete-account` | LGPD - direito ao esquecimento | ✅ Ativo |
  | `elevenlabs-tts` | Text-to-speech | ✅ Ativo |
  | `export-data` | LGPD - exportação de dados | ✅ Ativo |
  | `moderate-content` | Moderação de posts | ✅ Ativo |
  | `notifications` | Push notifications | ✅ Ativo |
  | `transcribe` | Transcrição de áudio | ✅ Ativo |
  | `upload-image` | Upload para storage | ✅ Ativo |
  | `webhook` | Webhooks externos | ✅ Ativo |
  | `_shared` | Código compartilhado | ✅ Ativo |
  
- [x] **APIs de IA integradas:**
  - OpenAI (GPT-4o, GPT-4o-transcribe)
  - Grok (xAI - grok-3-beta)
  - ElevenLabs (TTS)
  - Imgur (upload de imagens)

### 5. Hooks e Estado (100%)

- [x] **16 hooks customizados implementados:**
  | Hook | Função |
  |------|--------|
  | `useAdmin` | Verificação de admin |
  | `useApiWithRetry` | Retry automático |
  | `useAsyncState` | Estado assíncrono |
  | `useChatHandlers` | Lógica do chat NathIA |
  | `useCommunity` | Lógica da comunidade |
  | `useDeepLinking` | Deep links |
  | `useHealthInsights` | Insights de saúde |
  | `useImageUpload` | Upload de imagens |
  | `useNetworkStatus` | Status de conexão |
  | `useNotifications` | Push notifications |
  | `useOptimizedSelector` | Seletores otimizados |
  | `useSpacing` | Sistema de espaçamento |
  | `useTheme` | Dark/Light mode |
  | `useToast` | Notificações toast |
  | `useVoice` | Voice features |
  | `useVoiceRecording` | Gravação de áudio |

- [x] **6 Zustand Stores (todos persistidos):**
  | Store | Dados |
  |-------|-------|
  | `useAppStore` | User profile, auth, onboarding |
  | `useChatStore` | Conversas e histórico |
  | `useCommunityStore` | Posts e grupos |
  | `useCycleStore` | Ciclo menstrual |
  | `useAffirmationsStore` | Afirmações favoritas |
  | `useHabitsStore` | Hábitos e streaks |

### 6. Componentes UI (100%)

- [x] **Design System completo** (`src/theme/design-system.ts`)
- [x] **Componentes reutilizáveis:**
  - Avatar, Button, Card, Input, Text
  - FAB, RowCard, ScreenHeader, SectionHeader
  - LoadingDots, LoadingState, SkeletonLoader
  - Toast, OfflineBanner, ErrorBoundary
- [x] **Componentes de Chat:**
  - AIConsentModal, ChatEmptyState, ChatHistorySidebar
  - MessageBubble, VoiceMessagePlayer
- [x] **Componentes de Comunidade:**
  - PostCard, ComposerCard, NewPostModal

### 7. Documentação de Deploy (100%)

- [x] `DEPLOY_STORES.md` - Guia completo
- [x] `docs/PASSO_A_PASSO_DEPLOY.md` - Tutorial detalhado
- [x] `docs/DEPLOYMENT_CHECKLIST.md` - Checklist completo
- [x] `docs/QUICK_START_DEPLOY.md` - Guia rápido
- [x] `docs/SECRETS_SETUP.md` - Configuração de secrets

---

## ⏳ Etapas Pendentes

### 1. Contas nas Lojas (Bloqueante)

| Conta | Custo | Status | Ação Necessária |
|-------|-------|--------|-----------------|
| Apple Developer | $99/ano | ⏳ Pendente | Criar em [developer.apple.com](https://developer.apple.com) |
| Google Play Console | $25 único | ⏳ Pendente | Criar em [play.google.com/console](https://play.google.com/console) |
| EAS Account | Gratuito | ✅ Configurado | `eas whoami` para verificar |

### 2. Secrets no EAS (Bloqueante para Build)

```bash
# Secrets obrigatórios a configurar:
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_GROK_API_KEY --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_ENABLE_AI_FEATURES --value "true"
```

**Verificar:** `eas secret:list`

### 3. Screenshots (Bloqueante para Submissão)

#### iOS (App Store Connect)
| Tamanho | Dispositivo | Quantidade | Status |
|---------|-------------|------------|--------|
| 1290×2796px | iPhone 6.7" | Mínimo 3 | ⏳ Pendente |
| 1284×2778px | iPhone 6.5" | Mínimo 3 | ⏳ Pendente |
| 1242×2208px | iPhone 5.5" | Mínimo 3 | ⏳ Pendente |

#### Android (Google Play Console)
| Tamanho | Tipo | Quantidade | Status |
|---------|------|------------|--------|
| 1080×1920px | Phone | Mínimo 2 | ⏳ Pendente |
| 1024×500px | Feature Graphic | 1 | ⏳ Pendente |

**Telas sugeridas para screenshots:**
1. Onboarding/Welcome
2. Home/Feed principal
3. Chat com NathIA
4. Comunidade Mães Valente
5. Hábitos/Tracking

### 4. Configuração das Lojas (Bloqueante)

#### App Store Connect
- [ ] Criar app no App Store Connect
- [ ] Preencher metadata (nome, descrição, keywords)
- [ ] Configurar classificação etária (17+ recomendado)
- [ ] Adicionar screenshots
- [ ] Configurar preço (Gratuito)
- [ ] URL da Privacy Policy
- [ ] URL de Suporte

#### Google Play Console
- [ ] Criar app no Play Console
- [ ] Preencher listagem da loja
- [ ] Adicionar Feature Graphic
- [ ] Adicionar screenshots
- [ ] Preencher Data Safety
- [ ] Configurar classificação de conteúdo (IARC)
- [ ] URL da Privacy Policy

### 5. Conformidade Legal (Parcialmente Bloqueante)

| Item | Status | Ação |
|------|--------|------|
| Privacy Policy | ⚠️ URL definida, página pendente | Hospedar em nossamaternidade.com.br/privacy |
| Terms of Service | ⚠️ URL definida, página pendente | Hospedar em nossamaternidade.com.br/terms |
| AI Disclaimer | ⚠️ URL definida, página pendente | Hospedar em nossamaternidade.com.br/ai-disclaimer |
| LGPD - Consentimento | ✅ Implementado | Modal de consentimento IA |
| LGPD - Direito ao esquecimento | ✅ Implementado | Edge Function `delete-account` |
| LGPD - Exportação de dados | ✅ Implementado | Edge Function `export-data` |
| Disclaimer Médico | ✅ Implementado no app | Visível em respostas da IA |

### 6. Segurança e Vulnerabilidades

| Item | Status | Detalhes |
|------|--------|----------|
| npm audit | ⚠️ 2 moderadas | `markdown-it` via `react-native-markdown-display` |
| Secrets em código | ✅ OK | Nenhum secret hardcoded |
| RLS (Row Level Security) | ✅ Configurado | Proteção a nível de banco |
| API Keys | ✅ Via env vars | Não expostas no código |

**Vulnerabilidades encontradas:**
```
markdown-it < 12.3.2 - Uncontrolled Resource Consumption (Moderate)
└── react-native-markdown-display (no fix available)
```
> **Recomendação:** Monitorar atualizações ou considerar alternativa ao `react-native-markdown-display`

### 7. Testes em Dispositivos

| Teste | iOS | Android | Status |
|-------|-----|---------|--------|
| App abre sem crash | ⏳ | ⏳ | Pendente |
| Login (email/senha) | ⏳ | ⏳ | Pendente |
| Login social (Google/Apple) | ⏳ | ⏳ | Pendente |
| Onboarding completo | ⏳ | ⏳ | Pendente |
| Chat com NathIA | ⏳ | ⏳ | Pendente |
| Voice recording | ⏳ | ⏳ | Pendente |
| Comunidade (criar/like posts) | ⏳ | ⏳ | Pendente |
| Hábitos (completar/streak) | ⏳ | ⏳ | Pendente |
| Check-in diário | ⏳ | ⏳ | Pendente |
| Afirmações | ⏳ | ⏳ | Pendente |
| Dark mode | ⏳ | ⏳ | Pendente |
| Notificações push | ⏳ | ⏳ | Pendente |
| Permissões (câmera, mic) | ⏳ | ⏳ | Pendente |
| VoiceOver/TalkBack | ⏳ | ⏳ | Pendente |
| Modo offline | ⏳ | ⏳ | Pendente |
| Performance (< 3s startup) | ⏳ | ⏳ | Pendente |

---

## 📅 Timeline Estimada

| Fase | Duração | Datas Estimadas |
|------|---------|-----------------|
| **Fase 1:** Contas e Secrets | 1-2 dias | 21-22 Dez 2025 |
| **Fase 2:** Screenshots e Assets | 1-2 dias | 23-24 Dez 2025 |
| **Fase 3:** Configuração das Lojas | 1 dia | 26 Dez 2025 |
| **Fase 4:** Build de Preview | 1 dia | 27 Dez 2025 |
| **Fase 5:** Testes em Dispositivos | 2-3 dias | 28-30 Dez 2025 |
| **Fase 6:** Build de Produção | 1 dia | 31 Dez 2025 |
| **Fase 7:** Submissão | 1 dia | 1 Jan 2026 |
| **Fase 8:** Review das Lojas | 1-7 dias | 2-8 Jan 2026 |

**Previsão de Publicação:** 🎯 **Segunda semana de Janeiro de 2026**

> **Nota:** O período de festas (Natal/Ano Novo) pode afetar tempos de review das lojas.

---

## ⚠️ Desafios Potenciais

### 1. Review da App Store (Alto Risco)
- **Classificação 17+:** Apps de saúde materna podem exigir justificativas
- **AI Disclaimer:** Apple pode solicitar disclaimers adicionais sobre IA
- **Privacy:** Coleta de dados de saúde requer compliance rigoroso
- **Mitigation:** Disclaimers claros, Privacy Policy detalhada

### 2. Data Safety do Google Play (Médio Risco)
- **Dados de Saúde:** Categorização especial no Data Safety
- **Compartilhamento de dados:** Transparência sobre APIs externas
- **Mitigation:** Preencher Data Safety com precisão

### 3. Hospedagem de Documentos Legais (Bloqueante)
- **URLs definidas mas páginas não hospedadas:**
  - nossamaternidade.com.br/privacy
  - nossamaternidade.com.br/terms
  - nossamaternidade.com.br/ai-disclaimer
- **Mitigation:** Hospedar antes da submissão

### 4. Custos de APIs em Produção
- **OpenAI/Grok:** Custos podem escalar com uso
- **Mitigation:** Implementar rate limiting, caching

### 5. Período de Festas
- **Impacto:** Times de review reduzidos durante festas
- **Mitigation:** Submeter antes de 23/Dez ou após 2/Jan

---

## 🔧 Comandos Rápidos

### Validação Pré-Build
```bash
npm run typecheck    # Verificar TypeScript
npm run lint         # Verificar ESLint
npm run check-build-ready  # Verificar prontidão
```

### Build de Preview (Teste)
```bash
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

### Build de Produção
```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Submissão
```bash
eas submit --platform ios
eas submit --platform android
```

---

## 📚 Documentação Relacionada

| Documento | Descrição |
|-----------|-----------|
| [DEPLOY_STORES.md](./DEPLOY_STORES.md) | Guia de referência |
| [docs/PASSO_A_PASSO_DEPLOY.md](./docs/PASSO_A_PASSO_DEPLOY.md) | Tutorial completo |
| [docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md) | Checklist |
| [docs/SECRETS_SETUP.md](./docs/SECRETS_SETUP.md) | Configuração de secrets |
| [eas.json](./eas.json) | Configuração EAS Build |

---

## 🧪 Validação Técnica (21 Dez 2025)

### Resultado dos Checks
```bash
$ npm run typecheck
> tsc --noEmit
✅ PASSOU - 0 erros

$ npm run lint
> npx expo lint
✅ PASSOU - 0 erros

$ npm audit
⚠️ 2 vulnerabilidades moderadas (markdown-it)
```

### Estrutura de Arquivos Verificada
```
✅ App.tsx - Entry point
✅ src/navigation/RootNavigator.tsx - 5 estágios de auth
✅ src/navigation/MainTabNavigator.tsx - 5 tabs
✅ src/screens/ - 25 telas
✅ src/components/ - UI components
✅ src/hooks/ - 16 hooks
✅ src/state/store.ts - Zustand stores
✅ src/api/ - 7 serviços de API
✅ src/services/ - Notifications, Purchases
✅ src/theme/design-system.ts - Design tokens
✅ supabase/functions/ - 11 edge functions
✅ assets/ - 26 arquivos de assets
✅ eas.json - Build configuration
✅ app.json - Expo configuration
✅ app.config.js - Dynamic config
```

---

## 📞 Próximos Passos Imediatos

### Prioridade Alta (Bloqueantes)
1. **Criar conta Apple Developer** ($99/ano) - [developer.apple.com](https://developer.apple.com)
2. **Criar conta Google Play Console** ($25 único) - [play.google.com/console](https://play.google.com/console)
3. **Configurar secrets no EAS** (`eas secret:create`)
4. **Hospedar Privacy Policy e Terms of Service**

### Prioridade Média
5. **Criar screenshots das 5 principais telas**
6. **Executar build de preview para testes**
7. **Testar em dispositivos físicos (iOS e Android)**

### Prioridade Baixa
8. **Monitorar/resolver vulnerabilidade markdown-it**
9. **Configurar crash reporting (Sentry)**
10. **Configurar analytics (se aplicável)**

---

## 📊 Conclusão

O app **Nossa Maternidade** está **~70% pronto** para submissão às lojas. 

**Pontos fortes:**
- ✅ Código 100% limpo (0 erros TS/lint)
- ✅ 25 telas totalmente implementadas
- ✅ 11 Edge Functions deployadas
- ✅ Design System completo
- ✅ Acessibilidade implementada (56 labels, 40 roles)
- ✅ Dark mode funcional
- ✅ LGPD compliance (delete-account, export-data)

**Bloqueadores principais:**
- ⏳ Contas nas lojas não criadas
- ⏳ Secrets não configurados no EAS
- ⏳ Screenshots não criados
- ⏳ Páginas legais não hospedadas

**Estimativa realista:** Com esforço focado, o app pode estar nas lojas em **2-3 semanas** após a criação das contas e configuração dos secrets.

---

**Responsável:** Nathalia Valente  
**Última atualização:** 21 de dezembro de 2025  
**Versão do documento:** 2.0
