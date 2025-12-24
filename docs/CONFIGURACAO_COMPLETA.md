# Configuração Completa - Nossa Maternidade

Guia completo para configurar todos os aspectos necessários para desenvolvimento e produção.

**Última atualização**: Dezembro 2024

## 📋 Checklist de Configuração

- [ ] Variáveis de ambiente (.env.local)
- [ ] Supabase schemas + RLS policies aplicadas
- [ ] APIs: OpenAI/Claude configurado para NathIA
- [ ] Assets: Icon, splash screen verificados
- [ ] Scripts: Bash scripts verificados
- [ ] Certificados: iOS (Apple Developer) + Android (Keystore)

## 1. Variáveis de Ambiente (.env.local)

### Criar arquivo .env.local

```bash
# Copiar template
cp .env.example .env.local

# Editar com suas credenciais
nano .env.local  # ou use seu editor preferido
```

### Variáveis Obrigatórias

```bash
# Supabase (obrigatório)
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL=https://seu-projeto.supabase.co/functions/v1
```

**Onde obter:**
- Dashboard Supabase: `https://app.supabase.com/project/_/settings/api`

### Variáveis Recomendadas

```bash
# Para features principais funcionarem
EXPO_PUBLIC_ENABLE_AI_FEATURES=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
```

### Variáveis Opcionais

```bash
# Imgur (upload de imagens)
EXPO_PUBLIC_IMGUR_CLIENT_ID=seu-client-id

# ElevenLabs (voz da NathIA)
EXPO_PUBLIC_ELEVENLABS_API_KEY=sua-chave-aqui

# RevenueCat (Premium/IAP)
EXPO_PUBLIC_REVENUECAT_IOS_KEY=sua-chave-ios
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=sua-chave-android

# Sentry (error tracking)
EXPO_PUBLIC_SENTRY_DSN=sua-dsn-aqui
```

### Verificar Configuração

```bash
# Verificação detalhada
node scripts/check-env.js

# Ou verificação completa
bash scripts/verify-complete-setup.sh
```

**⚠️ IMPORTANTE**: 
- `.env.local` está no `.gitignore` (não será commitado)
- NUNCA commite arquivos `.env.local` com credenciais reais
- Para produção, use EAS Secrets (veja seção 6)

## 2. Supabase Schemas + RLS Policies

### Aplicar Migrations

```bash
# Via CLI (recomendado)
supabase db push

# Ou via Dashboard
# Supabase Dashboard > Database > Migrations > Apply
```

### Verificar RLS Policies

```bash
# Listar todas as políticas
supabase db diff --schema public

# Verificar políticas específicas
psql $DATABASE_URL -c "SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';"
```

### Migrations Disponíveis

O projeto possui 26 migrations em `supabase/migrations/`:

- `001_profiles.sql` - Perfis de usuárias
- `002_community.sql` - Comunidade (posts, comments, likes)
- `003_cycle_tracking.sql` - Rastreamento de ciclo
- `004_habits_checkins.sql` - Hábitos e check-ins
- `005_chat.sql` - Chat com NathIA
- `006_affirmations.sql` - Afirmações
- `007_ai_context_view.sql` - Views para contexto de IA
- `008_audit_logs.sql` - Logs de auditoria
- `009_push_tokens.sql` - Tokens de push notifications
- `010_analytics.sql` - Analytics
- `016_notification_triggers.sql` - Triggers de notificações
- `017_notification_cron.sql` - Cron jobs de notificações
- `018_analytics_dashboard.sql` - Dashboard de analytics
- `019_webhooks_subscriptions.sql` - Webhooks
- `020_premium_subscriptions.sql` - Assinaturas premium
- `021_content_moderation.sql` - Moderação de conteúdo
- E mais...

### Verificar Status

```bash
# Verificar migrations aplicadas
supabase migration list

# Verificar RLS habilitado
supabase db diff
```

## 3. APIs: OpenAI/Claude para NathIA

### ⚠️ SEGURANÇA CRÍTICA

**API keys de IA NUNCA devem estar no cliente!**

- ✅ Correto: Keys em Supabase Edge Functions secrets
- ❌ Errado: Keys em `.env.local` com `EXPO_PUBLIC_*`

### Configurar Secrets no Supabase

```bash
# Via CLI (recomendado)
supabase secrets set GEMINI_API_KEY=sua-chave-gemini
supabase secrets set OPENAI_API_KEY=sua-chave-openai
supabase secrets set ANTHROPIC_API_KEY=sua-chave-anthropic

# Verificar secrets configurados
supabase secrets list
```

**Via Dashboard:**
1. Acesse: `https://app.supabase.com/project/_/settings/functions`
2. Vá em "Edge Functions" > "Secrets"
3. Adicione cada secret:
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`

### Fallback Chain da NathIA

A Edge Function `/ai` usa fallback automático:

1. **Gemini 2.5 Flash** (principal) - Rápido e econômico
2. **GPT-4o** (fallback 1) - Alta qualidade
3. **Claude 3.5 Sonnet** (fallback 2) - Raciocínio complexo
4. **Grok** (fallback 3) - Alternativa

### Verificar Edge Function

```bash
# Ver logs da Edge Function
supabase functions logs ai --project-ref <SEU_PROJECT_REF>

# Testar localmente
supabase functions serve ai
```

### Documentação

- [docs/IMPLEMENTACAO_CLAUDE_GEMINI.md](docs/IMPLEMENTACAO_CLAUDE_GEMINI.md)
- [docs/SECRETS_SETUP.md](docs/SECRETS_SETUP.md)
- [SECURITY.md](SECURITY.md)

## 4. Assets: Icon, Splash Screen

### Assets Obrigatórios

Todos os assets devem estar em `assets/`:

- ✅ `icon.png` (1024x1024px) - Icon principal
- ✅ `splash.png` (2732x2732px) - Splash screen
- ✅ `adaptive-icon.png` (1024x1024px) - Android adaptive icon
- ✅ `notification-icon.png` (96x96px) - Notificação Android
- ✅ `favicon.png` (48x48px) - Web favicon

### Verificar Assets

```bash
# Verificar existência
ls -la assets/*.png

# Verificar dimensões (requer ImageMagick)
identify assets/icon.png
identify assets/splash.png
```

### Gerar Assets

Se precisar gerar assets:

```bash
# Usar Expo Asset Generator (se disponível)
npx expo-asset-generator

# Ou criar manualmente seguindo especificações:
# - iOS: 1024x1024px (sem transparência)
# - Android: 1024x1024px (adaptive icon)
# - Splash: 2732x2732px (iOS), 2732x2732px (Android)
```

## 5. Scripts: Verificar Existência

### Scripts Essenciais

Todos os scripts devem estar em `scripts/` e serem executáveis:

```bash
# Tornar todos executáveis
chmod +x scripts/*.sh

# Verificar scripts essenciais
ls -la scripts/
```

### Scripts Disponíveis

- `setup-mcps-mac.sh` - Configurar MCPs no Cursor
- `verify-setup.sh` - Verificação básica
- `verify-complete-setup.sh` - Verificação completa (este guia)
- `quality-gate.sh` - Quality gate antes de PR
- `check-build-ready.sh` - Verificar prontidão para build
- `setup-secrets.sh` - Guia de configuração de secrets
- `check-env.js` - Verificar variáveis de ambiente

### Executar Verificação

```bash
# Verificação completa
bash scripts/verify-complete-setup.sh
```

## 6. Certificados: iOS + Android

### iOS: Apple Developer

#### Pré-requisitos

1. Conta Apple Developer (paga)
2. App ID criado no App Store Connect
3. Certificados de desenvolvimento/produção

#### Configurar eas.json

Edite `eas.json` e configure:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleTeamId": "SEU_TEAM_ID",
        "ascAppId": "SEU_APP_STORE_CONNECT_APP_ID"
      }
    }
  }
}
```

**Onde obter:**
- `appleTeamId`: Apple Developer Portal > Membership
- `ascAppId`: App Store Connect > App Information

#### EAS Build

```bash
# Build para iOS
eas build --platform ios --profile production

# EAS gerencia certificados automaticamente
```

### Android: Google Play

#### Pré-requisitos

1. Conta Google Play Console
2. App criado no Google Play Console
3. Service Account JSON (para upload automático)

#### Configurar Service Account

1. Google Cloud Console > IAM & Admin > Service Accounts
2. Criar service account com permissões Google Play
3. Baixar JSON key
4. Salvar como `google-play-service-account.json` (não commitar!)

#### Configurar eas.json

O `eas.json` já está configurado para usar:
```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json"
      }
    }
  }
}
```

#### EAS Build

```bash
# Build para Android
eas build --platform android --profile production

# EAS gerencia keystore automaticamente
```

### Verificar Certificados

```bash
# Verificar configuração EAS
eas build:configure

# Listar builds
eas build:list
```

### Documentação

- [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)
- [docs/STORE_READY_CHECKLIST.md](docs/STORE_READY_CHECKLIST.md)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

## 🔍 Verificação Completa

Execute o script de verificação completa:

```bash
bash scripts/verify-complete-setup.sh
```

Este script verifica todos os itens acima e fornece feedback detalhado.

## 📚 Documentação Relacionada

- [docs/SETUP_COMPLETO.md](docs/SETUP_COMPLETO.md) - Setup inicial
- [docs/SECRETS_SETUP.md](docs/SECRETS_SETUP.md) - Configuração de secrets
- [SECURITY.md](SECURITY.md) - Políticas de segurança
- [docs/RLS_AUDIT_REPORT.md](docs/RLS_AUDIT_REPORT.md) - Auditoria RLS
- [SUPABASE_SCHEMA.md](SUPABASE_SCHEMA.md) - Schema do banco

## 🆘 Troubleshooting

### Variáveis de ambiente não funcionam

```bash
# Limpar cache do Expo
npx expo start --clear

# Verificar se variáveis estão sendo lidas
node scripts/check-env.js
```

### Migrations não aplicam

```bash
# Reset local (cuidado!)
supabase db reset

# Ou aplicar manualmente via Dashboard
```

### Secrets não funcionam na Edge Function

```bash
# Verificar secrets
supabase secrets list

# Ver logs da função
supabase functions logs ai --project-ref <PROJECT_REF>
```

### Certificados iOS/Android com erro

```bash
# Reconfigurar EAS
eas build:configure

# Verificar credenciais
eas credentials
```

## ✅ Próximos Passos

Após completar todas as configurações:

1. **Desenvolvimento**: `bun run start`
2. **Quality Gate**: `bun run quality-gate`
3. **Build**: `eas build --platform all --profile production`
4. **Deploy**: Seguir [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)

