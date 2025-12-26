# Configuração de Secrets EAS

Guia completo para configurar variáveis de ambiente (secrets) no Expo Application Services (EAS).

## Pré-requisitos

1. **EAS CLI instalado:**
```bash
npm install -g eas-cli
```

2. **Login autenticado:**
```bash
eas login
```

3. **Projeto EAS configurado:**
```bash
eas build:configure
```

## Secrets Obrigatórios

### 1. Supabase

```bash
# URL do projeto Supabase
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxxxx.supabase.co" --scope project

# Chave anônima (anon key)
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." --scope project

# URL das Edge Functions
eas env:create --name EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL --value "https://xxxxx.supabase.co/functions/v1" --scope project
```

**Onde encontrar:**
- Acesse https://app.supabase.com
- Selecione seu projeto
- Settings → API
- Copie: `URL` e `anon/public key`

## Secrets Opcionais (Recomendados)

### 2. Sentry (Error Tracking)

```bash
# DSN do Sentry
eas env:create --name EXPO_PUBLIC_SENTRY_DSN --value "https://xxxxx@sentry.io/xxxxx" --scope project

# Auth token (para sourcemaps)
eas env:create --name SENTRY_AUTH_TOKEN --value "sntrys_xxxxx" --scope project --sensitive
```

**Onde encontrar:**
- Acesse https://sentry.io
- Settings → Projects → Seu Projeto
- Client Keys (DSN)
- Settings → Account → API → Auth Tokens → Create New Token (scope: `project:releases`)

### 3. RevenueCat (In-App Purchases)

```bash
# iOS Key
eas env:create --name EXPO_PUBLIC_REVENUECAT_IOS_KEY --value "appl_xxxxx" --scope project

# Android Key
eas env:create --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY --value "goog_xxxxx" --scope project
```

**Onde encontrar:**
- Acesse https://app.revenuecat.com
- Project → Apps → Selecione seu app iOS/Android
- Configuration → API keys

## Validação

### Script Automático

```bash
node scripts/validate-secrets.js
```

### Listar Secrets Configurados

```bash
eas env:list
```

### Ver Valor de um Secret

```bash
eas env:get EXPO_PUBLIC_SUPABASE_URL
```

## Comandos Úteis

### Atualizar Secret Existente

```bash
eas env:update EXPO_PUBLIC_SUPABASE_URL --value "https://novo-valor.supabase.co"
```

### Deletar Secret

```bash
eas env:delete EXPO_PUBLIC_SUPABASE_URL
```

### Criar Secret Sensível (não exibir em logs)

```bash
eas env:create --name SECRET_KEY --value "xxxxx" --scope project --sensitive
```

## Ambientes (Development, Staging, Production)

### Criar Secret por Ambiente

```bash
# Development
eas env:create --name API_URL --value "http://localhost:3000" --scope project --environment development

# Staging
eas env:create --name API_URL --value "https://staging.api.com" --scope project --environment staging

# Production
eas env:create --name API_URL --value "https://api.com" --scope project --environment production
```

## Troubleshooting

### Erro: "Experience does not exist"

O projeto EAS ainda não foi criado. Execute:
```bash
eas build:configure
```

### Secrets não aparecem no build

1. Verifique se o secret está com scope `project`
2. Verifique se o nome começa com `EXPO_PUBLIC_` (para ser exposto ao cliente)
3. Secrets sem `EXPO_PUBLIC_` são apenas para builds nativos/Edge Functions

### Ver secrets no app.config.js

Os secrets são acessíveis via `process.env`:
```javascript
export default {
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL
  }
};
```

## Segurança

⚠️ **IMPORTANTE:**
- Nunca commite valores reais de secrets no git
- Use `--sensitive` para secrets críticos (tokens, passwords)
- Secrets com `EXPO_PUBLIC_` são expostos ao cliente (use apenas para chaves públicas)
- API keys privadas devem ficar em Edge Functions, não no cliente

## Referências

- [EAS Environment Variables](https://docs.expo.dev/build-reference/variables/)
- [EAS CLI Reference](https://docs.expo.dev/eas/cli/)

