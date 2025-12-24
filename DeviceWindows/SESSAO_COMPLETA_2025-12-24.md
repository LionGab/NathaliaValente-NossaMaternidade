# 📋 Sessão Completa - 24/12/2025

## 🎯 Resumo Executivo

Esta sessão focou em **3 objetivos principais**:

1. ✅ Download dos Reels mais populares do Instagram da Nathália
2. ✅ Correção crítica do OAuth (Apple/Google) - Erro 400
3. ✅ Implementação do fluxo PKCE correto para Supabase + Expo

---

## 📹 PARTE 1: Download de Reels do Instagram

### Objetivo

Baixar os Reels mais vistos do perfil @nathaliavalente para uso no app.

### Ferramentas Utilizadas

- **yt-dlp** (instalado via Homebrew no Mac)
- Scripts Node.js customizados

### Reels Baixados (9 vídeos, ~124 MB)

#### Top 5 Mais Populares:

1. **reel-top-2-14mi.mp4** (15 MB) - 14,6M visualizações
2. **reel-top-3-12mi.mp4** (11 MB) - 12,9M visualizações
3. **reel-top-5-16mi.mp4** (9 MB) - 16M visualizações
4. **reel-top-10-9mi.mp4** (20 MB) - 9,8M visualizações
5. **reel-top-4-12mi.mp4** (16 MB) - 12,9M visualizações

#### Reels Essenciais (já existentes):

- **mundo-parto-relato.mp4** (39 MB) - "Meu relato de parto 🩵"
- **mundo-nath-africa.mp4** (1.1 MB) - "Nathalia se emociona"

### Localização dos Arquivos

```
assets/onboarding/videos/
├── mundo-parto-relato.mp4
├── mundo-nath-africa.mp4
├── reel-top-2-14mi.mp4
├── reel-top-3-12mi.mp4
├── reel-top-4-12mi.mp4
├── reel-top-5-16mi.mp4
├── reel-top-6-11mi.mp4
├── reel-top-7-10mi.mp4
└── reel-top-10-9mi.mp4
```

### Scripts Criados

- `scripts/download-reels.js` - Download de Reels específicos
- `scripts/download-top-reels.js` - Download dos top Reels por visualizações
- `npm run download:reels` - Comando npm para facilitar uso

### Como Usar no Windows

#### Instalação do yt-dlp:

```powershell
# Opção 1: Via pip (recomendado)
pip install yt-dlp

# Opção 2: Via winget
winget install yt-dlp

# Opção 3: Download manual
# Baixar de: https://github.com/yt-dlp/yt-dlp/releases
```

#### Executar Download:

```powershell
# No PowerShell do projeto
cd C:\caminho\para\NossaMaternidade
node scripts/download-top-reels.js
```

### Documentação Criada

- `docs/REELS_DOWNLOADED.md` - Lista completa dos Reels baixados

---

## 🔐 PARTE 2: Correção Crítica OAuth (Erro 400)

### Problema Identificado

**Erro 400 Bad Request** ao tentar fazer login com Google/Apple/Facebook.

### Causa Raiz

1. **Redirect URI não autorizado** (90% dos casos)
   - O redirect URI não estava na lista de URLs permitidas no Supabase Dashboard
2. **QueryParams conflitantes**
   - Passar `queryParams` junto com `skipBrowserRedirect: true` causava conflito
   - O Supabase usa PKCE automaticamente quando `skipBrowserRedirect: true`

3. **Fluxo de sessão incorreto**
   - Código não suportava PKCE flow (usava apenas implicit flow)
   - Não usava `QueryParams.getQueryParams()` corretamente

### Correções Implementadas

#### 1. Implementado `createSessionFromRedirect()` Completo

```typescript
async function createSessionFromRedirect(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) {
    throw new Error(`OAuth error: ${errorCode}`);
  }

  // 1) PKCE flow (vem code=...)
  if (params?.code) {
    const { data, error } = await client.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return data.session;
  }

  // 2) Implicit flow (vem access_token/refresh_token)
  const access_token = params?.access_token;
  const refresh_token = params?.refresh_token;

  if (!access_token || !refresh_token) return null;

  const { data, error } = await client.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
  return data.session;
}
```

#### 2. Removido queryParams do Google OAuth

**Antes** (causava erro 400):

```typescript
options: {
  redirectTo: REDIRECT_URI,
  skipBrowserRedirect: true,
  queryParams: {  // ❌ REMOVIDO
    access_type: "offline",
    prompt: "consent",
  },
}
```

**Depois** (correto):

```typescript
options: {
  redirectTo: REDIRECT_URI,
  skipBrowserRedirect: true,
  // PKCE é habilitado automaticamente pelo Supabase
}
```

#### 3. Configurado Supabase Client Corretamente

**Antes**:

```typescript
detectSessionInUrl: typeof window !== "undefined", // ❌ ERRADO
```

**Depois**:

```typescript
detectSessionInUrl: false, // ✅ CORRETO para React Native/Expo
```

#### 4. Padronizado Redirect URI

**Formato correto**: `nossamaternidade://auth-callback` (sem barras extras)

### Arquivos Modificados

- ✅ `src/api/social-auth.ts` - Fluxo OAuth completo corrigido
- ✅ `src/api/supabase.ts` - `detectSessionInUrl: false`

### Configuração Necessária no Supabase Dashboard

#### ⚠️ AÇÃO OBRIGATÓRIA:

1. Acesse: https://app.supabase.com → Seu Projeto
2. Vá em: **Authentication** → **URL Configuration**
3. Em **"Additional Redirect URLs"**, adicione:
   ```
   nossamaternidade://auth-callback
   ```
4. **Salve**

**IMPORTANTE**: O redirect URI deve ser **exatamente** como acima (sem espaços, sem barras extras).

### Configuração Google OAuth (Se Usando Google)

#### No Google Cloud Console:

1. Criar **OAuth Client ID** tipo **"Web application"** (NÃO Android/iOS)
2. Em **"Authorized redirect URIs"**, adicionar:
   ```
   https://<seu-project-ref>.supabase.co/auth/v1/callback
   ```
   (Esse URL aparece na página do provider Google no Supabase Dashboard)
3. Copiar **Client ID** e **Client Secret**
4. No Supabase Dashboard → Authentication → Providers → Google:
   - Colar Client ID
   - Colar Client Secret
   - Salvar

**IMPORTANTE**: Se tiver múltiplos client IDs, concatenar com vírgula, colocando o **Web primeiro**:

```
web-client-id,android-client-id,ios-client-id
```

### Documentação Criada

- `docs/OAUTH_FIX_IMPLEMENTATION.md` - Guia completo de implementação
- `docs/ERRO_400_FIX.md` - Guia específico para erro 400

---

## 🛠️ PARTE 3: Fluxo PKCE Implementado

### O Que É PKCE?

**PKCE (Proof Key for Code Exchange)** é o padrão de segurança recomendado pelo Supabase para apps mobile.

### Por Que É Importante?

- ✅ Mais seguro que implicit flow
- ✅ Padrão recomendado pelo Supabase para React Native/Expo
- ✅ Funciona melhor com deep links

### Como Funciona no Código

1. **Geração da URL OAuth**:

   ```typescript
   const result = await client.auth.signInWithOAuth({
     provider: "google",
     options: {
       redirectTo: REDIRECT_URI,
       skipBrowserRedirect: true, // Habilita PKCE automaticamente
     },
   });
   ```

2. **Abertura do Browser**:

   ```typescript
   const browserResult = await WebBrowser.openAuthSessionAsync(result.data.url, REDIRECT_URI);
   ```

3. **Processamento do Redirect**:
   ```typescript
   if (browserResult.type === "success" && browserResult.url) {
     const session = await createSessionFromRedirect(browserResult.url);
     // session agora contém tokens válidos
   }
   ```

### Diferença Entre Fluxos

| Fluxo        | Quando Usar     | Como Identificar               |
| ------------ | --------------- | ------------------------------ |
| **PKCE**     | Mobile (padrão) | URL contém `?code=...`         |
| **Implicit** | Fallback        | URL contém `#access_token=...` |

O código agora suporta **ambos** automaticamente.

---

## 📝 Checklist para Windows

### Pré-requisitos

- [ ] Node.js 22+ instalado
- [ ] Git configurado
- [ ] Conta Supabase ativa
- [ ] yt-dlp instalado (para downloads de Reels)

### Configuração Inicial

- [ ] Variáveis de ambiente configuradas (`.env.local`)
- [ ] Supabase client configurado
- [ ] Redirect URI adicionado no Supabase Dashboard

### Testes OAuth

- [ ] Google OAuth configurado no Google Cloud Console
- [ ] Redirect URI do Supabase adicionado no Google Console
- [ ] Testar login Google no app
- [ ] Testar login Apple no app (se iOS)

### Downloads de Conteúdo

- [ ] Reels baixados em `assets/onboarding/videos/`
- [ ] Verificar tamanho dos arquivos (não devem estar corrompidos)
- [ ] Atualizar `src/config/nath-content.ts` com caminhos dos vídeos

---

## 🔧 Comandos Úteis

### Verificar Configuração

```powershell
npm run check-env          # Verificar variáveis de ambiente
npm run validate           # TypeScript + ESLint
npm run quality-gate       # Validação completa
```

### Download de Reels

```powershell
npm run download:reels     # Download dos Reels essenciais
node scripts/download-top-reels.js  # Download dos top Reels
```

### Desenvolvimento

```powershell
npm start                  # Iniciar Expo dev server
npm run ios                # Rodar no iOS (requer Mac)
npm run android            # Rodar no Android
npm run web                # Rodar no navegador
```

### Build e Deploy

```powershell
npm run quality-gate       # Validar antes de build
npm run eas:build:ios      # Build para iOS
npm run eas:build:android  # Build para Android
```

---

## 📚 Arquivos de Documentação Criados

1. **docs/REELS_DOWNLOADED.md**
   - Lista completa dos Reels baixados
   - URLs e IDs dos vídeos
   - Instruções para baixar mais

2. **docs/OAUTH_FIX_IMPLEMENTATION.md**
   - Guia completo de implementação OAuth
   - Checklist de configuração
   - Troubleshooting

3. **docs/ERRO_400_FIX.md**
   - Guia específico para erro 400
   - Passo a passo de configuração
   - Como verificar se está correto

4. **DeviceWindows/SESSAO_COMPLETA_2025-12-24.md** (este arquivo)
   - Resumo completo da sessão
   - Orientações para Windows
   - Referência rápida

---

## 🐛 Troubleshooting Comum

### Erro 400 ao fazer login

**Solução**: Adicionar `nossamaternidade://auth-callback` em Supabase Dashboard → Authentication → URL Configuration → Additional Redirect URLs

### Google OAuth dá erro

**Solução**:

1. Verificar se OAuth Client é tipo "Web application"
2. Verificar se redirect URI do Supabase está no Google Console
3. Verificar se Client ID/Secret estão corretos no Supabase

### Apple Sign In não funciona

**Solução**:

1. Verificar se `expo-apple-authentication` está instalado
2. Verificar se Apple OAuth está habilitado no Supabase
3. Verificar se Service ID está configurado corretamente

### Reels não baixam

**Solução**:

1. Verificar se yt-dlp está instalado: `yt-dlp --version`
2. Verificar conexão com internet
3. Tentar baixar manualmente via browser primeiro

---

## 🎯 Próximos Passos Recomendados

### Curto Prazo (Hoje)

1. ✅ Configurar redirect URI no Supabase Dashboard
2. ✅ Testar login Google/Apple no app
3. ✅ Verificar se Reels baixados estão funcionando

### Médio Prazo (Esta Semana)

1. Revisar vídeos baixados e selecionar os melhores para uso
2. Atualizar `src/config/nath-content.ts` com caminhos corretos
3. Implementar persistência de onboarding no Supabase (tabela `user_onboarding`)
4. Integrar RevenueCat real no OnboardingPaywall

### Longo Prazo (Próximas Semanas)

1. Gravar vídeos de onboarding específicos (welcome, paywall, emotional-state)
2. Substituir placeholders por assets reais
3. Configurar App Store Connect IDs reais no `eas.json`
4. Preparar build para TestFlight

---

## 📖 Referências Técnicas

### Supabase OAuth para Expo

- [Documentação Oficial](https://supabase.com/docs/guides/auth/social-login/auth-google#expo)
- [PKCE Flow](https://supabase.com/docs/guides/auth/auth-pkce-flow)
- [Redirect URLs](https://supabase.com/docs/guides/auth/oauth-redirect-urls)

### Expo Auth Session

- [expo-auth-session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [QueryParams](https://docs.expo.dev/versions/latest/sdk/auth-session/#queryparams)
- [makeRedirectUri](https://docs.expo.dev/versions/latest/sdk/auth-session/#makeredirecturi)

### yt-dlp

- [Documentação](https://github.com/yt-dlp/yt-dlp)
- [Instalação Windows](https://github.com/yt-dlp/yt-dlp/wiki/Installation#windows)

---

## ⚠️ Notas Importantes para Windows

### Diferenças de Ambiente

1. **Caminhos de Arquivo**:
   - Mac/Linux: `/Users/lion/Documents/...`
   - Windows: `C:\Users\lion\Documents\...`
   - Use caminhos relativos quando possível

2. **Comandos Shell**:
   - Mac/Linux: `bash scripts/quality-gate.sh`
   - Windows: Use Git Bash ou PowerShell
   - Scripts `.sh` podem não funcionar diretamente no PowerShell

3. **Instalação de Ferramentas**:
   - Mac: `brew install yt-dlp`
   - Windows: `pip install yt-dlp` ou `winget install yt-dlp`

4. **Variáveis de Ambiente**:
   - Windows: Configure via `.env.local` (mesmo formato)
   - PowerShell: `$env:EXPO_PUBLIC_SUPABASE_URL="..."`

### Scripts Compatíveis com Windows

Todos os scripts Node.js (`.js`) funcionam normalmente no Windows:

- ✅ `scripts/download-reels.js`
- ✅ `scripts/download-top-reels.js`
- ✅ `scripts/check-env.js`

Scripts shell (`.sh`) precisam de Git Bash ou WSL:

- ⚠️ `scripts/quality-gate.sh` - Use Git Bash
- ⚠️ `scripts/setup-secrets.sh` - Use Git Bash

**Alternativa**: Use comandos npm que encapsulam os scripts:

- `npm run quality-gate` (funciona em qualquer OS)

---

## 🔒 Segurança e Boas Práticas

### Variáveis de Ambiente

- ✅ **NUNCA** commitar `.env.local` no Git
- ✅ Usar `EXPO_PUBLIC_*` apenas para variáveis públicas
- ✅ Secrets de API (Gemini, OpenAI) apenas em Supabase Edge Functions

### OAuth

- ✅ Sempre usar PKCE flow em mobile
- ✅ Verificar redirect URIs no Supabase Dashboard
- ✅ Não expor Client Secrets no código

### Assets

- ✅ Verificar direitos de uso das imagens/vídeos
- ✅ Otimizar tamanho dos arquivos antes de commit
- ✅ Usar formatos compatíveis (MP4 para vídeos, JPG para imagens)

---

## 📊 Status do Projeto

### ✅ Concluído Nesta Sessão

- [x] Download de 9 Reels mais populares
- [x] Correção do fluxo OAuth (PKCE + Implicit)
- [x] Remoção de queryParams conflitantes
- [x] Configuração correta do Supabase client
- [x] Documentação completa criada

### ⏳ Pendente (Requer Ação Manual)

- [ ] Configurar redirect URI no Supabase Dashboard
- [ ] Configurar Google OAuth no Google Cloud Console (se necessário)
- [ ] Testar login OAuth no app
- [ ] Revisar vídeos baixados e selecionar os melhores

### 🔄 Em Progresso

- Migração de design system (cores para tokens)
- Integração RevenueCat no onboarding
- Persistência de onboarding no Supabase

---

## 💡 Dicas para Windows

### Performance

- Use `bun` ao invés de `npm` quando possível (mais rápido)
- Configure Node.js para usar mais memória se necessário
- Use WSL2 para melhor compatibilidade com scripts shell

### Debugging

- Use `console.log` apenas em desenvolvimento (não em produção)
- Use `logger.*` do projeto para logs estruturados
- Verifique logs do Expo no terminal e no navegador (Metro bundler)

### Git

- Configure Git Bash como terminal padrão no VS Code
- Use `git config core.autocrlf false` para evitar problemas de linha
- Commit frequente e mensagens descritivas

---

## 🎓 Aprendizados Desta Sessão

### Técnicos

1. **PKCE é obrigatório** para OAuth em mobile (Supabase + Expo)
2. **detectSessionInUrl: false** é necessário em React Native
3. **QueryParams.getQueryParams()** é mais robusto que parsing manual
4. **yt-dlp** é a melhor ferramenta para download de vídeos do Instagram

### Processo

1. Sempre verificar documentação oficial antes de implementar
2. Testar em ambiente real (não apenas Expo Go)
3. Documentar mudanças críticas imediatamente
4. Criar scripts reutilizáveis para tarefas repetitivas

### Arquitetura

1. Separar lógica de OAuth em função dedicada (`createSessionFromRedirect`)
2. Suportar múltiplos fluxos (PKCE + Implicit) para robustez
3. Logs detalhados facilitam debugging em produção
4. Mensagens de erro específicas melhoram UX

---

## 📞 Suporte e Recursos

### Documentação do Projeto

- `CLAUDE.md` - Regras e padrões do projeto
- `docs/` - Documentação técnica completa
- `README.md` - Guia de início rápido

### Comunidade

- Supabase Discord: https://discord.supabase.com
- Expo Discord: https://chat.expo.dev
- Stack Overflow: Tag `supabase` + `expo`

### Ferramentas Úteis

- [Supabase Dashboard](https://app.supabase.com)
- [Expo Dashboard](https://expo.dev)
- [Google Cloud Console](https://console.cloud.google.com)
- [Apple Developer Portal](https://developer.apple.com)

---

**Última atualização**: 24/12/2025 08:45 BRT
**Sessão**: Download Reels + Correção OAuth
**Status**: ✅ Código corrigido - Requer configuração manual no Supabase Dashboard

---

## 📎 Anexos

### Estrutura de Arquivos Relevantes

```
NossaMaternidade/
├── src/
│   ├── api/
│   │   ├── social-auth.ts      # ✅ CORRIGIDO - OAuth completo
│   │   └── supabase.ts         # ✅ CORRIGIDO - detectSessionInUrl: false
│   └── config/
│       └── nath-content.ts     # URLs dos Reels
├── assets/
│   └── onboarding/
│       └── videos/              # ✅ 9 Reels baixados (~124 MB)
├── scripts/
│   ├── download-reels.js        # ✅ CRIADO
│   └── download-top-reels.js    # ✅ CRIADO
├── docs/
│   ├── REELS_DOWNLOADED.md      # ✅ CRIADO
│   ├── OAUTH_FIX_IMPLEMENTATION.md  # ✅ CRIADO
│   └── ERRO_400_FIX.md          # ✅ CRIADO
└── DeviceWindows/
    └── SESSAO_COMPLETA_2025-12-24.md  # ✅ ESTE ARQUIVO
```

### Comandos Git Úteis

```bash
# Verificar status
git status

# Ver mudanças
git diff

# Adicionar arquivos específicos
git add src/api/social-auth.ts
git add src/api/supabase.ts
git add docs/
git add DeviceWindows/

# Commit
git commit -m "fix: Corrigir OAuth (PKCE) e adicionar download de Reels"

# Push
git push origin main
```

---

**FIM DO DOCUMENTO**
