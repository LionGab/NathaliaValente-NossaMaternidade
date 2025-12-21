# 🔐 Configuração OAuth - Supabase (Google, Apple, Facebook)

**Projeto:** NossaMaternidade  
**Project ID:** `lqahkqfpynypbmhtffyi`  
**URL:** https://lqahkqfpynypbmhtffyi.supabase.co

## 📋 Status Atual

**⚠️ Providers OAuth precisam ser configurados no Supabase Dashboard**

Os providers (Google, Apple, Facebook) estão **desabilitados** por padrão e precisam ser configurados manualmente no Supabase Dashboard.

## 🚀 Como Configurar

### 1. Acessar Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto: **NossaMaternidade**
3. Vá em: **Authentication** → **Providers**

### 2. Configurar Google OAuth

#### 2.1 Criar Credenciais no Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto ou selecione existente
3. Vá em **APIs & Services** → **Credentials**
4. Clique em **Create Credentials** → **OAuth client ID**
5. Configure:
   - **Application type:** Web application
   - **Name:** Nossa Maternidade
   - **Authorized redirect URIs:**
     ```
     https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
     ```
6. Copie **Client ID** e **Client Secret**

#### 2.2 Configurar no Supabase

1. No Supabase Dashboard → **Authentication** → **Providers**
2. Encontre **Google** e clique para editar
3. **Enable Google provider:** ✅ Ativar
4. Cole:
   - **Client ID (for OAuth):** (cole o Client ID do Google)
   - **Client Secret (for OAuth):** (cole o Client Secret do Google)
5. Clique em **Save**

### 3. Configurar Apple OAuth

#### 3.1 Criar Service ID no Apple Developer

1. Acesse: https://developer.apple.com/account
2. Vá em **Certificates, Identifiers & Profiles**
3. Clique em **Identifiers** → **+** (criar novo)
4. Selecione **Services IDs** → **Continue**
5. Configure:
   - **Description:** Nossa Maternidade
   - **Identifier:** `com.nossamaternidade.app.service` (ou similar)
6. Marque **Sign in with Apple** → **Configure**
7. Configure:
   - **Primary App ID:** Selecione seu App ID
   - **Website URLs:**
     - **Domains:** `lqahkqfpynypbmhtffyi.supabase.co`
     - **Return URLs:**
       ```
       https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
       ```
8. Salve e copie o **Service ID**

#### 3.2 Criar Key no Apple Developer

1. Vá em **Keys** → **+** (criar nova)
2. Configure:
   - **Key Name:** Nossa Maternidade OAuth
   - **Enable:** Sign in with Apple
3. Baixe o arquivo `.p8` (você só pode baixar uma vez!)
4. Anote o **Key ID**

#### 3.3 Configurar no Supabase

1. No Supabase Dashboard → **Authentication** → **Providers**
2. Encontre **Apple** e clique para editar
3. **Enable Apple provider:** ✅ Ativar
4. Cole:
   - **Services ID:** (cole o Service ID criado)
   - **Secret Key:** (cole o conteúdo do arquivo .p8)
   - **Key ID:** (cole o Key ID)
   - **Team ID:** (encontre em Membership no Apple Developer)
5. Clique em **Save**

### 4. Configurar Facebook OAuth

#### 4.1 Criar App no Facebook Developers

1. Acesse: https://developers.facebook.com
2. Vá em **My Apps** → **Create App**
3. Selecione **Consumer** → **Next**
4. Configure:
   - **App Name:** Nossa Maternidade
   - **App Contact Email:** (seu email)
5. Vá em **Settings** → **Basic**
6. Adicione **App Domains:**
   ```
   lqahkqfpynypbmhtffyi.supabase.co
   ```
7. Em **Settings** → **Basic**, adicione **Website**:
   - **Site URL:** `https://lqahkqfpynypbmhtffyi.supabase.co`
8. Vá em **Products** → **Facebook Login** → **Settings**
9. Adicione **Valid OAuth Redirect URIs:**
   ```
   https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
   ```
10. Copie **App ID** e **App Secret**

#### 4.2 Configurar no Supabase

1. No Supabase Dashboard → **Authentication** → **Providers**
2. Encontre **Facebook** e clique para editar
3. **Enable Facebook provider:** ✅ Ativar
4. Cole:
   - **Client ID (for OAuth):** (cole o App ID do Facebook)
   - **Client Secret (for OAuth):** (cole o App Secret do Facebook)
5. Clique em **Save**

## ✅ Verificar Configuração

Após configurar cada provider:

1. No Supabase Dashboard → **Authentication** → **Providers**
2. Verifique se o provider está **Enabled** (verde)
3. Teste no app:
   - Web: Deve redirecionar para o provider
   - Mobile: Deve abrir browser/app do provider

## 🔧 URLs de Redirect Necessárias

Todos os providers precisam ter estas URLs configuradas:

### Google Cloud Console
```
https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
```

### Apple Developer
```
https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
```

### Facebook Developers
```
https://lqahkqfpynypbmhtffyi.supabase.co/auth/v1/callback
```

## 🐛 Troubleshooting

### Erro: "Provider is not enabled"

**Solução:** Verifique se o provider está habilitado no Supabase Dashboard.

### Erro: "Invalid redirect URI"

**Solução:** Verifique se a URL de redirect está configurada corretamente nos providers (Google/Apple/Facebook).

### Erro: "Invalid client credentials"

**Solução:** Verifique se Client ID e Client Secret estão corretos no Supabase Dashboard.

### OAuth funciona no mobile mas não no web

**Solução:** Verifique se as URLs de redirect incluem o domínio do Supabase corretamente.

## 📝 Notas

- **Google:** Mais fácil de configurar, recomendado para começar
- **Apple:** Requer Apple Developer Account ($99/ano)
- **Facebook:** Requer verificação do app (pode levar alguns dias)

## 🔗 Links Úteis

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Apple OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Facebook OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-facebook)

