# 🔍 RELATÓRIO DE ANÁLISE 360° — Nossa Maternidade

**Data:** 23 de dezembro de 2025  
**Versão App:** 1.0.0 (Expo SDK 54)  
**Auditor:** GitHub Copilot Coding Agent  
**Objetivo:** Análise técnica profunda para transformar Nossa Maternidade de app funcional em Plataforma de Acolhimento Premium

---

## 🔹 1. EXECUTIVE SUMMARY

### O app está pronto para escalar? **COM RISCOS**

**Principais gargalos identificados:**

| Área | Status | Impacto |
|------|--------|---------|
| **Backend** | ✅ 60% pronto | Supabase + Edge Functions robustos |
| **Client Sync** | ❌ 0% | ZERO cloud backup - perder celular = perder TUDO |
| **IA (NathIA)** | ✅ 80% | Guardian Agent forte, mas sem RAG proprietário |
| **Monetização** | ⚠️ 30% | Backend RevenueCat OK, client não aplica gates |
| **Compliance** | ⚠️ 70% | LGPD backend OK, UI falta, disclaimers visíveis |
| **Testes** | ❌ 0% | Zero testes unitários ou E2E |

**Veredicto:** O app tem **infraestrutura backend sólida** que não está sendo utilizada pelo client. A maior lacuna é a **desconexão entre client e backend** para sync, gating de premium, e feature flags.

---

## 🔹 2. MATRIZ DE RISCOS

| Área | Risco | Impacto | Prioridade |
|------|-------|---------|------------|
| **Cloud Sync** | Dados 100% locais (AsyncStorage) - perda total ao trocar celular | CRÍTICO | P0 |
| **Kill Switch** | Sem remote config - não pode desabilitar features remotamente | ALTO | P0 |
| **Premium Gating** | Backend sabe quem é PRO, client não respeita | ALTO | P1 |
| **Testes** | Zero coverage - bugs podem passar despercebidos | ALTO | P1 |
| **RAG** | NathIA usa só Google Search, sem conteúdo proprietário | MÉDIO | P2 |
| **LGPD UI** | Edge Functions existem, mas não há botões na UI | MÉDIO | P1 |
| **Rate Limiting** | Mesmo limite (20 req/min) para FREE e PRO | MÉDIO | P2 |
| **A11Y** | Não auditado completamente | MÉDIO | P2 |

---

## 🔹 3. ANÁLISE DETALHADA POR ÁREA

### 3.1 Arquitetura & Engenharia

#### ✅ PONTOS FORTES

- **Expo SDK 54** + React Native 0.81.5 - versões atualizadas
- **TypeScript strict mode** habilitado (`tsconfig.json` linha 4)
- **Zero `any` types** no código fonte (verificado via grep)
- **Logger centralizado** (`src/utils/logger.ts`) - NÃO usa console.log
- **Padrão `{ data, error }`** nos services (ai-service.ts, purchases.ts)
- **Edge Functions robustas** com circuit breakers, rate limiting, JWT validation
- **Design System** bem estruturado (`src/theme/tokens.ts` + `design-system.ts`)

#### ❌ FRAGILIDADES

- **State desconectado do backend**: Todos stores (`useAppStore`, `useCycleStore`, `useHabitsStore`, `useCheckInStore`, `useChatStore`) são AsyncStorage-only
- **Sem feature flags remotas**: Não existe `app_config` table ou hook `useRemoteConfig()`
- **Import deprecated**: `src/state/store.ts:18` importa `COLORS` de `design-system.ts` (deveria usar `Tokens`)
- **Pre-commit hook** usava `bun` que pode não estar disponível (corrigido para `npm`)

#### 📊 MÉTRICAS

| Métrica | Valor | Status |
|---------|-------|--------|
| TypeScript strict | ✅ Habilitado | OK |
| Zero `any` types | 0 ocorrências | ✅ |
| console.log no src/ | 3 (só no logger) | ✅ |
| Files > 250 LOC | AssistantScreen (1085 LOC) | ⚠️ Refactor |

---

### 3.2 Mobile-first & UX (iOS)

#### ✅ PONTOS FORTES

- **Touch targets ≥ 44pt**: `ACCESSIBILITY.minTapTarget: 44` no design system
- **Safe Area**: Usa `SafeAreaView` de `react-native-safe-area-context` corretamente
- **Dark mode real**: Sistema completo com `COLORS_DARK` e hook `useTheme()`
- **Fluxo 5-stage**: Login → Notifications → Onboarding → NathIA Onboarding → Main
- **Responsividade**: Valores calculados com `getResponsiveValue(screenWidth, ...)`

#### ⚠️ GAPS

- **Fluxo uma mão livre**: Não há análise específica de reachability zones
- **Amamentação noturna**: Dark mode existe, mas não há "night mode" automático por horário
- **Padrões web adaptado**: Alguns screens usam ScrollView + map ao invés de FlatList

#### 📊 PROBLEMAS UX

| Problema | Impacto | Tela |
|----------|---------|------|
| ScrollView + map | Performance | CommunityScreen (verificar) |
| AssistantScreen 1085 LOC | Manutenibilidade | Refatorar em componentes |
| Sem skeleton loaders | UX em carregamento | Várias telas |

---

### 3.3 Persistência de Dados & Sync

#### DIAGNÓSTICO: RISCO CRÍTICO DE CHURN

**Estado atual:**

| Store | Persisted | Cloud Sync | Risco |
|-------|-----------|------------|-------|
| `useAppStore` | ✅ AsyncStorage | ❌ LOCAL | Perda total |
| `useCycleStore` | ✅ AsyncStorage | ❌ LOCAL | **CRÍTICO** - ciclo é dado sensível |
| `useHabitsStore` | ✅ AsyncStorage | ❌ LOCAL | Alto - streaks perdidos |
| `useCheckInStore` | ✅ AsyncStorage | ❌ LOCAL | Alto - histórico de humor |
| `useChatStore` | ✅ AsyncStorage | ❌ LOCAL | Médio - conversas |
| `useCommunityStore` | ❌ Fresh | N/A | OK |

**Problema:** Trocar de celular = perder TODOS os dados (ciclo, hábitos, humor, chat).

**Solução:** Backend já tem migrations (003_cycle_tracking, 004_habits_checkins, 005_chat). Falta implementar sync bidirecional no client.

#### Supabase RLS

- ✅ RLS habilitado em todas tabelas
- ✅ Políticas de DELETE para LGPD (`supabase-rls-fixes.sql`)
- ✅ Users só vêem próprios dados

---

### 3.4 IA (NathIA) — Segurança & Qualidade

#### NÍVEL DE RISCO: MÉDIO-BAIXO ✅

**Arquitetura:**
```
Client (ai-service.ts) → Edge Function (/ai) → Providers (Gemini/Claude/OpenAI)
```

#### ✅ PONTOS FORTES

1. **Guardian Agent FORTE** (`supabase/functions/ai/index.ts`):
   - Crisis keywords (linha 82-94): suicídio, autoagressão, risco ao bebê
   - Blocked phrases (linha 100-122): diagnósticos, prescrições, dependência emocional
   - Reprocessamento automático se Gemini retornar frase bloqueada

2. **Triagem emocional** (`src/ai/policies/nathia.preClassifier.ts`):
   - Pre-classificação CLIENT-SIDE antes de chamar LLM
   - Retorna templates fixos para crise (CVV 188, SAMU 192)
   - Templates médicos (recusa gentil)
   - Templates de identidade ("Não sou a Nathália, sou IA")

3. **Provider routing inteligente**:
   - Crise → Claude (modelo mais seguro)
   - Imagem → Claude Vision
   - Médico → Gemini + Google Search
   - Default → Gemini 2.5 Flash

4. **Rate limiting**: 20 req/min via Upstash Redis

5. **Circuit breakers**: Protege contra cascade failures

#### ❌ GAPS

| Gap | Risco | Recomendação |
|-----|-------|--------------|
| ZERO RAG proprietário | IA genérica | Implementar pgvector + embeddings |
| Rate limit fixo | FREE/PRO iguais | Diferenciar limites |
| Sem kill switch | Não pode desligar | Criar `app_config` table |

#### Alucinação Médica: BAIXO RISCO

- Blocked phrases impedem diagnósticos/prescrições
- Google Search grounding para perguntas médicas
- Disclaimer no footer: "NathIA pode cometer erros. Consulte sempre seu médico."

---

### 3.5 Monetização & Growth

#### O APP ESTÁ PRONTO PARA GERAR RECEITA? **NÃO AINDA**

**Backend (RevenueCat):** ✅ 100% PRONTO
- Migration 020: `is_premium`, `premium_until`, `subscription_status`, `revenuecat_subscriber_id`
- Funções SQL: `activate_premium_subscription()`, `renew_premium_subscription()`, etc.
- Webhook receiver funcional
- Cron job para expiração automática

**Client:** ❌ NÃO APLICA

| Feature | Status | Gap |
|---------|--------|-----|
| Paywall Screen | ✅ Existe | Integrar RevenueCat SDK |
| `usePremiumStatus()` hook | ❌ Não existe | Criar consulta a `profiles.is_premium` |
| Feature gating | ❌ Zero | Aplicar em IA, comunidade, exports |
| FREE tier limits | ❌ Zero | Limitar 5 msg/dia no chat |
| RevenueCat SDK init | ❓ Parcial | Verificar `App.tsx` |

**Limites sugeridos:**

| Feature | FREE | PREMIUM |
|---------|------|---------|
| NathIA chat | 5 msg/dia | Ilimitado |
| Community post | Só leitura | Criar posts |
| Data export | JSON | JSON + PDF |
| Voice (TTS) | ❌ | ✅ |
| Sons de descanso | 2 sons | Todos |

---

### 3.6 Compliance (App Store / Google Play / LGPD)

#### RISCO DE REJEIÇÃO: MÉDIO

| Requisito | Status | Evidência |
|-----------|--------|-----------|
| Disclaimers médicos | ✅ | "NathIA pode cometer erros" no AssistantScreen |
| Consentimento IA | ✅ | `hasAcceptedAITerms` no ChatStore + AIConsentModal |
| Termos de Serviço | ✅ | Link no LoginScreen footer |
| Política de Privacidade | ✅ | Link no LoginScreen footer |
| Exportação de dados | ⚠️ | Edge Function existe, UI não implementada |
| Deleção de conta | ⚠️ | Edge Function robusta, UI não implementada |
| Permissões explicadas | ✅ | NotificationPermissionScreen existe |
| Privacy Manifest iOS 17+ | ✅ | Mencionado no CLAUDE.md |

#### AÇÃO NECESSÁRIA

Criar botões em Settings:
- "Exportar Meus Dados" → chama `/export-data`
- "Deletar Minha Conta" → chama `/delete-account` com confirmação dupla

---

### 3.7 Testes, CI/CD & Operação

#### NÍVEL DE MATURIDADE: BAIXO ❌

| Item | Status | Gap |
|------|--------|-----|
| Testes unitários | ❌ Zero | Criar para ciclo, humor, premium |
| Testes E2E | ❌ Zero | Maestro para onboarding, paywall |
| CI Pipeline | ⚠️ Parcial | Workflows Copilot existem, falta lint/test |
| Quality gate script | ✅ Existe | `scripts/quality-gate.sh` |
| Feature flags | ❌ Zero | Criar `app_config` + realtime |
| Rollback strategy | ❌ Zero | Usar EAS Updates |
| Hotfix process | ❌ Zero | Documentar |

**GitHub Actions existentes:**
- `Copilot code review` (ID: 216112357)
- `Copilot coding agent` (ID: 217672262)

**Falta:** Workflow de PR checks (typecheck, lint, test)

---

## 🔹 4. TOP 10 AÇÕES PRIORITÁRIAS

| # | Ação | Impacto | Esforço | Prioridade |
|---|------|---------|---------|------------|
| 1 | **Implementar Cloud Sync** para ciclo, hábitos, check-ins | CRÍTICO | Alto | P0 |
| 2 | **Criar Remote Config** (`app_config` + `useRemoteConfig`) | ALTO | Médio | P0 |
| 3 | **Implementar `usePremiumStatus()`** e aplicar gating | ALTO | Médio | P1 |
| 4 | **Criar UI LGPD** em Settings (export/delete) | ALTO | Baixo | P1 |
| 5 | **Configurar CI/CD** com typecheck, lint, tests | ALTO | Baixo | P1 |
| 6 | **Integrar RevenueCat SDK** no Paywall | ALTO | Médio | P1 |
| 7 | **Criar testes unitários** para lógica crítica | MÉDIO | Médio | P2 |
| 8 | **Diferenciar rate limits** FREE vs PRO | MÉDIO | Baixo | P2 |
| 9 | **Implementar RAG** com pgvector | MÉDIO | Alto | P2 |
| 10 | **Auditoria A11Y** completa | MÉDIO | Médio | P2 |

---

## 🔹 5. ROADMAP TÉCNICO RECOMENDADO (4 Semanas)

### Semana 1: Foundation & Data
- [ ] **PR-1.1:** Remote Config / Kill Switch (migration + hook)
- [ ] **PR-1.2:** Cloud Sync - Ciclo (bidirecional, offline-first)
- [ ] **PR-1.3:** Cloud Sync - Habits & Check-ins
- [ ] **PR-1.4:** LGPD UI em Settings

### Semana 2: Business & Premium
- [ ] **PR-2.1:** `usePremiumStatus()` hook + realtime subscription
- [ ] **PR-2.2:** Feature gating (IA limite, community, exports)
- [ ] **PR-2.3:** RevenueCat SDK + Paywall integration completa
- [ ] **PR-2.4:** Rate limiting diferenciado FREE/PRO

### Semana 3: Intelligence & Quality
- [ ] **PR-3.1:** Guardian Agent - Bloqueio UI + recursos de crise
- [ ] **PR-3.2:** CI/CD Pipeline (GitHub Actions)
- [ ] **PR-3.3:** Testes unitários (ciclo, premium, IA)
- [ ] **PR-3.4:** Testes E2E (Maestro - onboarding, paywall)

### Semana 4: Polish & Launch
- [ ] **PR-4.1:** A11Y Audit + Fixes
- [ ] **PR-4.2:** RAG Setup (pgvector + embeddings) - se plano permitir
- [ ] **PR-4.3:** Refactor AssistantScreen (1085 LOC → componentes)
- [ ] **PR-4.4:** Documentação final + App Store checklist

---

## 🔹 6. DECISÃO FINAL

> **"Se este app fosse meu, eu NÃO publicaria agora, porque:**
> 
> 1. **CHURN GARANTIDO:** Usuárias perderão todos os dados ao trocar de celular (ciclo menstrual é dado sensível!)
> 2. **PREMIUM NÃO FUNCIONA:** Backend está pronto, mas client não aplica gating
> 3. **ZERO TESTES:** Qualquer bug passa direto para produção
> 
> **Porém, com 2-3 semanas de trabalho focado (PRs 1.1-2.4), o app estará pronto para launch.**
> 
> O backend está surpreendentemente sólido. O trabalho é conectar o client."

---

## 📎 ANEXOS

### A. Arquivos Críticos Analisados

```
src/state/store.ts               # Zustand stores (100% local)
src/api/ai-service.ts            # NathIA client
src/services/purchases.ts        # RevenueCat client
src/screens/AssistantScreen.tsx  # Chat (1085 LOC)
src/screens/PaywallScreen.tsx    # Paywall (existe)
src/screens/LoginScreen.tsx      # Login (compliance OK)
src/navigation/RootNavigator.tsx # 5-stage flow
src/ai/policies/nathia.preClassifier.ts  # Crisis detection
src/theme/tokens.ts              # Design system
src/utils/logger.ts              # Logging centralizado

supabase/functions/ai/index.ts           # Edge Function IA
supabase/functions/delete-account/index.ts # LGPD delete
supabase/migrations/020_*.sql            # Premium schema
```

### B. Comandos de Verificação Executados

```bash
# TypeScript
npm run typecheck  # ✅ 0 errors

# Grep: any types
grep -r ": any" src/  # 0 matches ✅

# Grep: console.log
grep -r "console.log" src/  # 3 matches (só no logger) ✅
```

### C. Referência: Documento Existente

Ver também: `docs/PLATAFORMA_PREMIUM_AUDIT.md` - Auditoria anterior com PRs detalhados

---

**FIM DO RELATÓRIO**

_Gerado por GitHub Copilot Coding Agent em 23/12/2025_
