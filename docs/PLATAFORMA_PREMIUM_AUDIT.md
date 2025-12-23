# AUDITORIA: Plataforma de Acolhimento Premium — Nossa Maternidade

**Data:** 23 de dezembro de 2025
**Versão:** 1.0.0
**Auditor:** Claude (Sonnet 4.5) via Tech Lead prompt
**Objetivo:** Avaliar estado atual do código vs roadmap "Plataforma Premium" (4 fases)

---

## SUMÁRIO EXECUTIVO

### ✅ BOA NOTÍCIA: Backend está 60% pronto!

O projeto tem **infraestrutura backend sólida** que não foi mencionada no briefing:

- ✅ **RevenueCat integration**: migrations completas (020_premium_subscriptions.sql)
- ✅ **Guardian Agent**: crisis detection + blocked phrases (Edge Function /ai)
- ✅ **LGPD parcial**: audit_logs, subscription_events, export-data/delete-account Edge Functions
- ✅ **Analytics**: migrations + dashboard (018, 010)
- ✅ **Push notifications**: infrastructure completa (009, 016, 017)
- ✅ **Content moderation**: migration 021

### ⚠️ MÁ NOTÍCIA: Client está 100% local (zero cloud sync)

- ❌ **ZERO cloud sync**: todos stores são AsyncStorage local-only
- ❌ **ZERO backup**: perder celular = perder TUDO (ciclo, habits, check-ins, chat)
- ❌ **ZERO remote config**: sem kill switch ou feature flags
- ❌ **ZERO entitlement gating**: backend sabe quem é PRO, client não usa essa info
- ❌ **ZERO RAG**: sem knowledge base proprietária (só Google Search via Gemini)

### 🎯 PRIORIDADE: Conectar client ao backend (sync + gating)

A maior lacuna é **client desconectado do backend**. Backend tem features premium, mas client não consulta nem respeita.

---

## MAPA DE MÓDULOS ATUAIS

### 1. STATE MANAGEMENT (Client)

**Tecnologia:** Zustand + persist (AsyncStorage)

| Store | Persisted | Dados | Cloud Sync |
|-------|-----------|-------|------------|
| `useAppStore` | ✅ | user, auth, onboarding, theme | ❌ LOCAL |
| `useCommunityStore` | ❌ | posts, groups (fresh sempre) | ❌ N/A |
| `useChatStore` | ✅ | conversations, messages, AI consent | ❌ LOCAL |
| `useCycleStore` | ✅ | lastPeriodStart, cycleLength, dailyLogs | ❌ LOCAL |
| `useAffirmationsStore` | ✅ | todayAffirmation, favorites | ❌ LOCAL |
| `useHabitsStore` | ✅ | 8 default habits, streaks, completion | ❌ LOCAL |
| `useCheckInStore` | ✅ | mood, energy, sleep (daily) | ❌ LOCAL |

**Achados críticos:**
- ❌ **Nenhum store faz sync com Supabase** (tudo AsyncStorage)
- ❌ **Comunidade não persiste posts** (indica que pode não ter backend real ainda? Ver migrations 002)
- ⚠️ **Import ruim:** `src/state/store.ts:18` usa `COLORS` de `design-system.ts` (DEPRECATED), deveria ser `Tokens`
- ✅ **AI consent tracking:** `hasAcceptedAITerms` (linha 82, 239) - bom para compliance

### 2. AI SERVICE (NathIA)

**Arquivo:** `src/api/ai-service.ts`

✅ **Funciona bem:**
- Chama Edge Function `/ai` com JWT (seguro, sem keys no client)
- Crisis detection client-side (keywords de suicídio, autoagressão, risco ao bebê)
- Provider routing: Gemini (default) → Claude (crisis/image) → OpenAI (fallback)
- Medical question detection → Gemini + Google Search grounding
- Image support (Claude Vision)
- Retry logic + timeout (fetch-utils)
- Structured error handling (AppError)

❌ **Gaps:**
- **NÃO usa `llmRouter.ts`** mencionado na missão (usa lógica própria)
- **Crisis detection é client-side:** deveria ser duplicado/fortalecido no server
- **ZERO rate limiting FREE vs PRO:** não checa entitlement antes de chamar Edge Function
- **ZERO RAG:** não usa knowledge base proprietária (só Google Search)

### 3. EDGE FUNCTION /ai (Backend)

**Arquivo:** `supabase/functions/ai/index.ts`

✅ **Production-ready:**
- Providers: Gemini 2.5 Flash (default) → Claude Sonnet 4.5 (fallback) → GPT-4o (emergency)
- JWT validation (authenticated users only)
- **Rate limiting:** Upstash Redis (20 req/min por usuário)
- **Circuit breakers:** protege contra cascade failures
- **Guardian Agent FORTE:**
  - `CRISIS_KEYWORDS` (linha 82-94): suicídio, autoagressão, risco ao bebê
  - `BLOCKED_PHRASES` (linha 100-122): diagnósticos, prescrições, dependência emocional, culpa
  - Reprocessamento se Gemini retornar frase bloqueada
- Google Search grounding (Gemini)
- Claude Vision (imagens)
- Structured logging + metrics
- Fallback chain robusto

❌ **Gaps:**
- **Rate limiting é FIXO 20 req/min:** não distingue FREE vs PRO (sem entitlement check)
- **ZERO RAG:** não usa pgvector, embeddings, retrieval (só Google Search)
- **BLOCKED_PHRASES pode precisar tuning:** "você precisa" pode bloquear frases legítimas ("você precisa de água" → bloqueado?)

### 4. BACKEND SUPABASE (Migrations)

**26 migrations encontradas:**

| Migration | Feature | Status | Notes |
|-----------|---------|--------|-------|
| 001 | profiles | ✅ | user_id, auth integration |
| 002 | community | ✅ | posts, groups, likes |
| 003 | cycle_tracking | ✅ | periods, ovulation, dailyLogs |
| 004 | habits_checkins | ✅ | 8 habits, daily check-ins |
| 005 | chat | ✅ | conversations, messages |
| 006 | affirmations | ✅ | daily affirmations, favorites |
| 007 | ai_context_view | ✅ | view para RAG? (não explorado) |
| 008 | audit_logs | ✅ | compliance (LGPD) |
| 009 | push_tokens | ✅ | expo push tokens |
| 010 | analytics | ✅ | events tracking |
| 016-017 | notification_triggers/cron | ✅ | automated notifications |
| 018 | analytics_dashboard | ✅ | dashboard views |
| 019 | webhooks_subscriptions | ✅ | webhook receivers |
| **020** | **premium_subscriptions** | ✅ | **RevenueCat integration completa!** |
| 021 | content_moderation | ✅ | moderation queue |
| 022-026 | fixes/improvements | ✅ | triggers, auth config |

#### **MIGRATION 020: Premium Subscriptions (CRÍTICO)**

**Schema detalhado:**

```sql
-- profiles table additions
ALTER TABLE profiles ADD COLUMN:
  - is_premium BOOLEAN DEFAULT FALSE
  - premium_until TIMESTAMPTZ
  - subscription_status subscription_status (enum: active/trialing/past_due/paused/canceled/expired)
  - revenuecat_subscriber_id TEXT
  - subscription_product_id TEXT
  - subscription_store TEXT (app_store/play_store/stripe/promotional)
  - subscription_expires_at TIMESTAMPTZ

-- transactions table (histórico completo)
CREATE TABLE transactions:
  - revenuecat_transaction_id, product_id
  - transaction_type (initial_purchase/renewal/cancellation/refund/trial_*)
  - price_usd, currency, store
  - subscription_period_start/end
  - webhook_payload JSONB (debug)

-- subscription_events table (audit trail)
CREATE TABLE subscription_events:
  - event_type, old_status, new_status
  - premium_until, source (webhook/manual/system)

-- webhook_transactions table (Edge Function receiver)
CREATE TABLE webhook_transactions:
  - source (revenuecat/stripe), event_type, event_id
  - payload JSONB
  - status (pending/processed/failed)
```

**Funções SQL prontas:**
- `activate_premium_subscription()` - ativa premium via webhook
- `renew_premium_subscription()` - renova assinatura
- `cancel_premium_subscription()` - cancela (mantém até expiração)
- `expire_premium_subscription()` - expira assinatura
- `pause_premium_subscription()` - pausa assinatura
- `mark_billing_issue()` - marca problema de cobrança
- `expire_overdue_subscriptions()` - **cron job diário** para expiração automática

**RLS:**
- ✅ Users can view own transactions/events
- ✅ Service role can manage (webhook)

### 5. EDGE FUNCTIONS (Backend)

| Function | Status | Purpose |
|----------|--------|---------|
| `/ai` | ✅ | NathIA chat (Gemini/Claude/OpenAI) |
| `/transcribe` | ✅ | Audio → text (Whisper?) |
| `/upload-image` | ✅ | Image upload + optimization |
| `/notifications` | ✅ | Push notification handling |
| `/delete-account` | ✅ | LGPD-compliant account deletion |
| `/export-data` | ✅ | LGPD data export (JSON) |
| `/analytics` | ✅ | Event tracking |
| `/elevenlabs-tts` | ✅ | Text → speech |
| `/moderate-content` | ✅ | Content moderation |
| `/webhook` | ✅ | RevenueCat webhook receiver |
| `_shared/circuit-breaker.ts` | ✅ | Shared utility |

---

## GAPS CRÍTICOS VS ROADMAP

### FASE 1: FOUNDATION & DATA

| Feature | Planejado | Status | Gap |
|---------|-----------|--------|-----|
| **Remote Config / Kill Switch** | P0 | ❌ NÃO EXISTE | **CRIAR:** tabela `app_config` + hook `useRemoteConfig()` + flags (ENABLE_AI_CHAT, FREE_AI_DAILY_LIMIT) |
| **Cloud Sync** | P0 | ❌ NÃO EXISTE | **CRIAR:** sync bidirecional para ciclo, humor, habits. Offline-first com merge. Migrations já existem! |
| **LGPD Export/Delete** | P0 | ✅ PARCIAL | Edge Functions existem. **FALTA:** UI em Settings (botões acessíveis + tratamento erro) |

**Estimativa Fase 1:** 40% pronto (LGPD backend OK, sync e config faltam)

### FASE 2: INTELLIGENCE

| Feature | Planejado | Status | Gap |
|---------|-----------|--------|-----|
| **Guardian Agent** | P0 | ✅ 70% PRONTO | Crisis detection forte (keywords + blocked phrases). **FALTA:** bloquear chat + exibir recursos (CVV 188), logging de eventos de segurança |
| **RAG "Nathalia"** | P1 | ❌ NÃO EXISTE | **CRIAR:** pgvector setup + embeddings pipeline + retrieval top-k + grounding no agente. Migration 007 (ai_context_view) pode ser prep? |

**Estimativa Fase 2:** 35% pronto (Guardian parcial, RAG zero)

### FASE 3: BUSINESS

| Feature | Planejado | Status | Gap |
|---------|-----------|--------|-----|
| **RevenueCat Backend** | P0 | ✅ 100% PRONTO | Migrations, functions, webhook receiver COMPLETOS |
| **Entitlement Gating (runtime)** | P0 | ❌ NÃO EXISTE | **CRIAR:** hook `usePremiumStatus()` que consulta `profiles.is_premium`. **APLICAR:** gates em IA (limite 5 msg/dia free), comunidade (post), exports |
| **Paywall Screen** | P1 | ❓ DESCONHECIDO | **VERIFICAR:** existe em `/screens`? Se sim, integrar RevenueCat SDK. Se não, **CRIAR** |
| **Rate Limiting FREE vs PRO** | P1 | ❌ NÃO EXISTE | Edge Function /ai tem limite fixo 20 req/min. **MODIFICAR:** checar `is_premium` e aplicar limites diferentes (free: 5/dia, PRO: ilimitado) |

**Estimativa Fase 3:** 25% pronto (backend completo, client zero)

### FASE 4: POLISH & LAUNCH

| Feature | Planejado | Status | Gap |
|---------|-----------|--------|-----|
| **A11Y Audit** | P1 | ❓ DESCONHECIDO | **VERIFICAR:** tokens tem contraste WCAG AAA? Touch targets >=44pt? |
| **E2E Tests (Maestro)** | P1 | ❌ NÃO EXISTE | **CRIAR:** flows: Onboarding → Paywall → Primeiro Log |
| **CI/CD** | P1 | ❓ DESCONHECIDO | **VERIFICAR:** existe GitHub Actions? Se não, **CRIAR:** lint/typecheck/tests em PR |

**Estimativa Fase 4:** 0% pronto (tudo pendente)

---

## SEQUÊNCIA DE PRs RECOMENDADA

### **PR-0: Preparação (Quick Wins Urgentes)**

**Escopo:** Fixes críticos que desbloqueiam o resto.

**Mudanças:**
1. `src/state/store.ts:18` - migrar `COLORS` → `Tokens` (compliance CLAUDE.md)
2. Criar `src/hooks/usePremiumStatus.ts` - helper que consulta `profiles.is_premium`
3. Verificar se Paywall screen existe (`src/screens/PaywallScreen.tsx`?)
4. Documentar achados desta auditoria em `README.md` (seção "Architecture")

**Riscos:** Baixo (só imports + helper read-only)
**Tempo:** 2h
**Impacto:** Libera trabalho nas outras PRs

---

### **FASE 1: FOUNDATION & DATA (4 PRs)**

#### **PR-1.1: Remote Config / Kill Switch**

**Escopo:** Criar infraestrutura de feature flags.

**Mudanças:**
1. **Migration:** `supabase/migrations/027_app_config.sql`
   ```sql
   CREATE TABLE app_config (
     key TEXT PRIMARY KEY,
     value JSONB NOT NULL,
     description TEXT,
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Flags iniciais
   INSERT INTO app_config (key, value, description) VALUES
     ('ENABLE_AI_CHAT', 'true', 'Enable/disable AI chat globally'),
     ('ENABLE_COMMUNITY_POST', 'true', 'Enable/disable community posting'),
     ('FREE_AI_DAILY_LIMIT', '5', 'Max AI messages per day for free users'),
     ('PREMIUM_AI_DAILY_LIMIT', '-1', 'Max AI messages for premium (-1 = unlimited)');

   -- RLS
   ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Anyone can read config" ON app_config FOR SELECT USING (true);
   CREATE POLICY "Service role can manage" ON app_config FOR ALL
     USING (auth.jwt()->>'role' = 'service_role');
   ```

2. **Hook:** `src/hooks/useRemoteConfig.ts`
   ```typescript
   export function useRemoteConfig() {
     const [config, setConfig] = useState<Record<string, unknown>>({});
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       // Fetch config on boot
       supabase.from('app_config').select('*').then(({ data }) => {
         const configMap = data.reduce((acc, { key, value }) => {
           acc[key] = value;
           return acc;
         }, {});
         setConfig(configMap);
         setIsLoading(false);
       });

       // Subscribe to changes (realtime)
       const subscription = supabase
         .channel('config_changes')
         .on('postgres_changes', { event: '*', schema: 'public', table: 'app_config' }, handleChange)
         .subscribe();

       return () => subscription.unsubscribe();
     }, []);

     return { config, isLoading, flags: {
       ENABLE_AI_CHAT: config.ENABLE_AI_CHAT === 'true',
       ENABLE_COMMUNITY_POST: config.ENABLE_COMMUNITY_POST === 'true',
       FREE_AI_DAILY_LIMIT: parseInt(config.FREE_AI_DAILY_LIMIT || '5'),
     }};
   }
   ```

3. **Integração:** `src/screens/AssistantScreen.tsx`
   - Se `!flags.ENABLE_AI_CHAT`, exibir:
     ```tsx
     <Text>O chat está temporariamente desabilitado. Tente novamente em instantes.</Text>
     ```

**Riscos:** Baixo (read-only no client)
**Dependências:** Nenhuma
**Tempo:** 6h
**DoD:** Toggle `ENABLE_AI_CHAT` no Supabase SQL editor e chat desabilita sem update de app

---

#### **PR-1.2: Cloud Sync - Ciclo**

**Escopo:** Sync bidirecional de `useCycleStore` com `cycle_tracking` table.

**Mudanças:**
1. **Service:** `src/services/sync/cycle-sync.ts`
   ```typescript
   export async function syncCycleData() {
     const local = useCycleStore.getState();
     const { data: remote } = await supabase
       .from('cycle_tracking')
       .select('*')
       .eq('user_id', user.id)
       .single();

     // Conflict resolution: server wins (by updated_at)
     if (!remote || local.updated_at > remote.updated_at) {
       // Push local → server
       await supabase.from('cycle_tracking').upsert({
         user_id: user.id,
         last_period_start: local.lastPeriodStart,
         cycle_length: local.cycleLength,
         period_length: local.periodLength,
         updated_at: new Date().toISOString()
       });
     } else {
       // Pull server → local
       useCycleStore.setState({
         lastPeriodStart: remote.last_period_start,
         cycleLength: remote.cycle_length,
         periodLength: remote.period_length
       });
     }
   }
   ```

2. **Hook:** `src/hooks/useSyncCycle.ts` - chama `syncCycleData()` on mount + on auth change
3. **Offline queue:** usar `@react-native-async-storage/async-storage` para queue de pending syncs

**Riscos:** Médio (conflict resolution pode perder dados se mal implementado)
**Dependências:** PR-0 (helper de auth)
**Tempo:** 12h
**DoD:** Trocar de celular, logar, ver dados de ciclo recuperados

---

#### **PR-1.3: Cloud Sync - Habits & Check-ins**

**Escopo:** Sync de `useHabitsStore` e `useCheckInStore`.

**Mudanças:** Similar a PR-1.2, mas para habits e check-ins (migrations 004 já existem).

**Riscos:** Médio
**Tempo:** 10h
**DoD:** Habits/check-ins recuperados após login

---

#### **PR-1.4: LGPD UI (Settings)**

**Escopo:** Botões "Exportar Dados" e "Deletar Conta" em Settings.

**Mudanças:**
1. `src/screens/SettingsScreen.tsx`:
   ```tsx
   <Button onPress={handleExportData}>Exportar Meus Dados</Button>
   <Button variant="destructive" onPress={handleDeleteAccount}>
     Deletar Conta Permanentemente
   </Button>
   ```

2. Handlers chamam Edge Functions `/export-data` e `/delete-account`
3. Loading states + error handling com `logger.error()`
4. Confirmação modal para delete (dupla confirmação)

**Riscos:** Baixo (Edge Functions já existem)
**Tempo:** 6h
**DoD:** Fluxos acessíveis em Settings, com logs e tratamento de erro

---

### **FASE 2: INTELLIGENCE (2 PRs)**

#### **PR-2.1: Guardian Agent - Bloqueio + Recursos**

**Escopo:** Fortalecer Guardian Agent com bloqueio de chat e exibição de recursos.

**Mudanças:**
1. **Client:** `src/api/ai-service.ts`
   - Se `detectCrisis(message)` retornar true:
     - NÃO chamar Edge Function
     - Retornar resposta fixa:
       ```typescript
       return {
         content: "Percebi que você está passando por um momento muito difícil. Por favor, busque ajuda profissional imediatamente:\n\n🆘 CVV (Centro de Valorização da Vida): 188\n📞 SAMU: 192\n🚨 Se houver risco imediato, vá ao hospital mais próximo.\n\nVocê não está sozinha. Há pessoas que podem ajudar.",
         provider: 'guardian',
         usage: { totalTokens: 0 },
         latency: 0
       };
       ```
   - Logar evento de segurança:
     ```typescript
     logger.error('Crisis detected - chat blocked', 'Guardian', {
       userId: user.id,
       messagePreview: message.slice(0, 50)
     });
     ```

2. **Edge Function:** `supabase/functions/ai/index.ts`
   - Adicionar logging de eventos de crise em tabela `audit_logs` (migration 008):
     ```typescript
     await supabase.from('audit_logs').insert({
       user_id: userId,
       event_type: 'crisis_detected',
       severity: 'critical',
       data: { keywords_matched: [...] }
     });
     ```

3. **UI:** Modal de crise em `AssistantScreen.tsx` (abrir quando guardian response detectada)

**Riscos:** Baixo
**Tempo:** 8h
**DoD:** Testes com 30 mensagens de crise, zero alucinação, sempre exibe CVV 188

---

#### **PR-2.2: RAG - Setup pgvector + Pipeline**

**Escopo:** Implementar base RAG com conteúdo proprietário Nathalia.

**Mudanças:**
1. **Supabase:** Habilitar extensão `pgvector` (se plano permite)
2. **Migration:** `028_rag_knowledge_base.sql`
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;

   CREATE TABLE knowledge_base (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     content TEXT NOT NULL,
     embedding vector(1536), -- OpenAI text-embedding-3-small
     source TEXT, -- 'nathalia_content', 'medical_faq'
     metadata JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE INDEX ON knowledge_base USING ivfflat (embedding vector_cosine_ops)
     WITH (lists = 100);
   ```

3. **Edge Function:** `supabase/functions/rag-embed/index.ts`
   - Recebe `content` → gera embedding via OpenAI → insere em `knowledge_base`

4. **Edge Function:** `supabase/functions/ai/index.ts` - retrieval
   ```typescript
   // Buscar top-3 chunks relevantes
   const { data: chunks } = await supabase.rpc('match_documents', {
     query_embedding: embedding,
     match_threshold: 0.7,
     match_count: 3
   });

   // Adicionar ao system prompt
   const systemPrompt = `Você é NathIA. Use estas fontes como base:
   ${chunks.map(c => c.content).join('\n\n')}

   Se a resposta estiver nas fontes, use. Se não, diga "não sei / vamos buscar juntas".`;
   ```

5. **Content ingestion:** Script `scripts/ingest-nathalia-content.ts` para popular base

**Riscos:** ALTO (pgvector pode não estar disponível no plano Supabase free, embeddings custam $$)
**Dependências:** Plano Supabase Pro ($25/mês) ou alternativa (Pinecone, Weaviate)
**Tempo:** 20h
**DoD:** 30 perguntas difíceis, zero alucinação, cita "base Nathalia" internamente

---

### **FASE 3: BUSINESS (3 PRs)**

#### **PR-3.1: Entitlement Hook + Gating**

**Escopo:** Hook `usePremiumStatus()` + gating em features.

**Mudanças:**
1. **Hook:** `src/hooks/usePremiumStatus.ts`
   ```typescript
   export function usePremiumStatus() {
     const user = useAppStore(s => s.user);
     const [isPremium, setIsPremium] = useState(false);
     const [premiumUntil, setPremiumUntil] = useState<Date | null>(null);

     useEffect(() => {
       if (!user?.id) return;

       supabase.from('profiles')
         .select('is_premium, premium_until')
         .eq('id', user.id)
         .single()
         .then(({ data }) => {
           setIsPremium(data?.is_premium || false);
           setPremiumUntil(data?.premium_until ? new Date(data.premium_until) : null);
         });

       // Subscribe to changes (realtime)
       const sub = supabase
         .channel(`premium_${user.id}`)
         .on('postgres_changes', {
           event: 'UPDATE',
           schema: 'public',
           table: 'profiles',
           filter: `id=eq.${user.id}`
         }, handleUpdate)
         .subscribe();

       return () => sub.unsubscribe();
     }, [user?.id]);

     return {
       isPremium,
       premiumUntil,
       isExpiringSoon: premiumUntil && differenceInDays(premiumUntil, new Date()) <= 7
     };
   }
   ```

2. **Gating - AI:** `src/api/ai-service.ts`
   ```typescript
   export async function getNathIAResponse(...) {
     const { isPremium } = usePremiumStatus();
     const { FREE_AI_DAILY_LIMIT } = useRemoteConfig().flags;

     if (!isPremium) {
       // Check daily usage
       const today = format(new Date(), 'yyyy-MM-DD');
       const count = await getAIUsageToday(userId, today);

       if (count >= FREE_AI_DAILY_LIMIT) {
         throw new AppError(
           'Daily limit reached',
           ErrorCode.RATE_LIMIT_EXCEEDED,
           `Você atingiu o limite de ${FREE_AI_DAILY_LIMIT} mensagens por dia. Assine Premium para ilimitado!`,
           undefined,
           { usage: count, limit: FREE_AI_DAILY_LIMIT }
         );
       }
     }

     // Continue...
   }
   ```

3. **Gating - Community:** `src/screens/CommunityScreen.tsx`
   - Botão "Nova Publicação" desabilitado se `!isPremium`
   - Tooltip: "Assine Premium para publicar na comunidade"

4. **Gating - Exports:** `src/screens/SettingsScreen.tsx`
   - "Exportar como PDF" → Premium only
   - JSON export continua free (LGPD)

**Riscos:** Médio (realtime subscription pode ter latency)
**Tempo:** 10h
**DoD:** Free user vê limites aplicados, PRO não vê travas

---

#### **PR-3.2: RevenueCat SDK + Paywall Screen**

**Escopo:** Configurar RevenueCat SDK e criar/integrar Paywall.

**Mudanças:**
1. **Config:** `app.config.js` - adicionar RevenueCat keys (se ainda não tem):
   ```javascript
   extra: {
     revenueCatIosKey: process.env.REVENUECAT_IOS_KEY,
     revenueCatAndroidKey: process.env.REVENUECAT_ANDROID_KEY
   }
   ```

2. **Init:** `App.tsx`
   ```typescript
   import Purchases from 'react-native-purchases';

   useEffect(() => {
     Purchases.configure({
       apiKey: Platform.OS === 'ios'
         ? Constants.expoConfig.extra.revenueCatIosKey
         : Constants.expoConfig.extra.revenueCatAndroidKey
     });
   }, []);
   ```

3. **Paywall:** `src/screens/PaywallScreen.tsx`
   - Buscar offerings: `Purchases.getOfferings()`
   - Exibir planos (mensal, anual com desconto)
   - Compra: `Purchases.purchasePackage(pkg)`
   - Restore: `Purchases.restorePurchases()`
   - Após compra bem-sucedida: webhook do RevenueCat atualiza `profiles.is_premium`

4. **Navegação:** Adicionar `PaywallScreen` ao stack
   - Abrir quando user tenta feature premium sem ser PRO

**Riscos:** ALTO (RevenueCat em Expo Go não funciona 100%, precisa build EAS)
**Dependências:** Produtos criados no App Store Connect + Play Console
**Tempo:** 16h
**DoD:** Compra sandbox funciona, `is_premium` atualiza no Supabase

---

#### **PR-3.3: Rate Limiting PRO (Edge Function)**

**Escopo:** Diferenciar limites FREE vs PRO em `/ai`.

**Mudanças:**
1. **Edge Function:** `supabase/functions/ai/index.ts`
   ```typescript
   // Buscar status premium
   const { data: profile } = await supabase
     .from('profiles')
     .select('is_premium, premium_until')
     .eq('id', userId)
     .single();

   const isPremium = profile?.is_premium && new Date(profile.premium_until) > new Date();

   // Rate limit diferenciado
   const limit = isPremium ? -1 : 20; // PRO ilimitado, FREE 20/min

   if (limit > 0) {
     const count = await redis.incr(`ai_requests:${userId}:${minuteKey}`);
     if (count > limit) {
       throw new Error(`Rate limit exceeded: ${limit} req/min`);
     }
   }
   ```

**Riscos:** Baixo
**Tempo:** 4h
**DoD:** FREE user limitado a 20 req/min, PRO sem limite (ou limite muito alto)

---

### **FASE 4: POLISH & LAUNCH (3 PRs)**

#### **PR-4.1: A11Y Audit + Fixes**

**Escopo:** Auditoria de acessibilidade e correções.

**Mudanças:**
1. **Audit:** Checklist manual por tela principal:
   - Contraste: pastéis do tema são WCAG AAA? (7:1 ratio)
   - Touch targets: >= 44pt? (iOS HIG)
   - Screen reader: labels claros?
   - Keyboard navigation: tab order lógico?

2. **Fixes:** Ajustar tokens e componentes conforme achados

**Riscos:** Baixo
**Tempo:** 12h
**DoD:** Checklist A11Y completo por tela

---

#### **PR-4.2: E2E Tests (Maestro)**

**Escopo:** Testes E2E dos fluxos críticos.

**Mudanças:**
1. **Setup:** Instalar Maestro, configurar workspace
2. **Flows:**
   - `onboarding.yaml`: Login → Onboarding 6 steps → NathIA onboarding 5 steps → Home
   - `paywall.yaml`: Home → Tentar feature premium → Paywall → Compra sandbox → Feature desbloqueada
   - `daily_log.yaml`: Home → Ciclo → Daily Log → Salvar → Ver histórico

**Riscos:** Médio (Maestro pode ter issues com Expo)
**Tempo:** 16h
**DoD:** 3 flows E2E passando em CI

---

#### **PR-4.3: CI/CD Pipeline**

**Escopo:** GitHub Actions para lint/typecheck/tests em PR.

**Mudanças:**
1. **Workflow:** `.github/workflows/pr-checks.yml`
   ```yaml
   name: PR Checks
   on: [pull_request]
   jobs:
     quality:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with: { node-version: 22 }
         - run: npm install
         - run: npm run typecheck
         - run: npm run lint
         - run: npm test
         - run: npm run check-build-ready
   ```

**Riscos:** Baixo
**Tempo:** 4h
**DoD:** Pipeline verde em PR

---

## ESTIMATIVA TOTAL

| Fase | PRs | Horas | Status Atual |
|------|-----|-------|--------------|
| **Preparação** | 1 | 2h | 0% |
| **Fase 1: Foundation** | 4 | 34h | 40% |
| **Fase 2: Intelligence** | 2 | 28h | 35% |
| **Fase 3: Business** | 3 | 30h | 25% |
| **Fase 4: Polish** | 3 | 32h | 0% |
| **TOTAL** | **13 PRs** | **126h** | **25%** |

**Timeline estimado:** 3-4 semanas (com 1 dev full-time)

---

## RISCOS IDENTIFICADOS

### 🔴 ALTO

1. **RAG (PR-2.2):** pgvector pode não estar no plano Supabase free → considerar Pinecone/Weaviate como alternativa ($$$)
2. **RevenueCat (PR-3.2):** Expo Go não suporta IAP → precisa build EAS para testar
3. **Sync (PR-1.2, PR-1.3):** Conflict resolution pode perder dados se mal implementado

### 🟡 MÉDIO

4. **Realtime subscriptions:** Latency pode afetar UX (usar polling como fallback?)
5. **Maestro E2E:** Pode ter issues com Expo/React Native

### 🟢 BAIXO

6. **Remote Config:** Read-only no client, baixo risco
7. **LGPD UI:** Edge Functions já existem, só falta UI
8. **CI/CD:** Standard workflow

---

## DECISÕES PENDENTES (PERGUNTAS PARA O PM/TECH LEAD)

1. **RAG:** Usar pgvector (requer plano pago) ou alternativa (Pinecone $70/mês)?
2. **Paywall:** Existe tela hoje? Se sim, onde?
3. **FREE AI Limit:** Confirmar 5 msg/dia? Ou 20 msg/dia?
4. **PRO AI Limit:** Ilimitado ou soft cap (ex: 1000/dia)?
5. **Sync Strategy:** Offline-first + merge ou server-always-wins?
6. **Maestro:** Vale investir 16h ou pular E2E por enquanto?

---

## PRÓXIMOS PASSOS IMEDIATOS

1. ✅ **DONE:** Auditoria completa (este documento)
2. **AGORA:** Validar decisões pendentes com PM
3. **HOJE:** Começar PR-0 (quick wins) → 2h
4. **AMANHÃ:** Começar Fase 1 (PR-1.1 Remote Config) → 6h
5. **Esta semana:** PRs 1.1, 1.2, 1.3 (Foundation) → 28h total

---

**FIM DA AUDITORIA**

_Este documento será atualizado conforme PRs são implementadas (seção "Implementado" abaixo)._

---

## IMPLEMENTADO

_(Atualizar conforme PRs mergeados)_

- [ ] PR-0: Preparação
- [ ] PR-1.1: Remote Config
- [ ] PR-1.2: Cloud Sync - Ciclo
- [ ] PR-1.3: Cloud Sync - Habits & Check-ins
- [ ] PR-1.4: LGPD UI
- [ ] PR-2.1: Guardian Agent - Bloqueio + Recursos
- [ ] PR-2.2: RAG Setup
- [ ] PR-3.1: Entitlement Gating
- [ ] PR-3.2: RevenueCat SDK + Paywall
- [ ] PR-3.3: Rate Limiting PRO
- [ ] PR-4.1: A11Y Audit
- [ ] PR-4.2: E2E Tests
- [ ] PR-4.3: CI/CD
