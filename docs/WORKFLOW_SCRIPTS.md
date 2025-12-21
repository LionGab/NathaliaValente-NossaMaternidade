# Workflow de Desenvolvimento - Scripts NPM

Guia de referência rápida para desenvolvimento, builds e deploy do Nossa Maternidade.

---

## 1. DESENVOLVIMENTO LOCAL (Windows)

### Android Local (desenvolvimento diário)

```bash
npm run dev:android
```

**O que faz:**
- Limpa cache Metro (`start:clear`)
- Inicia servidor Expo
- Roda app no emulador/dispositivo Android

**Quando usar:**
- Desenvolvimento diário no Windows
- Iteração rápida (hot reload funciona)
- Testar mudanças JS/TS

**Tempo:** 30-60s (primeira vez), 10s (reload)

---

### iOS Local (BLOQUEADO no Windows)

```bash
npm run dev:ios
```

**O que faz:**
- Mostra mensagem: "iOS local não suportado no Windows"
- Sugere usar `npm run build:dev:ios` (EAS Build)

**Quando usar:**
- Nunca no Windows (só macOS)
- Use `build:dev:ios` para iOS development build

---

## 2. EAS BUILDS (Nuvem)

### Development Builds (dev client)

| Comando | Plataforma | Quando Usar |
|---------|------------|-------------|
| `npm run build:dev` | iOS + Android | Build dev client para ambos (raro) |
| `npm run build:dev:ios` | iOS only | **Workflow Windows**: Build iOS dev toda semana |
| `npm run build:dev:android` | Android only | Android dev (se preferir nuvem ao invés de local) |

**Características:**
- Profile: `development`
- Dev client: habilitado
- Distribution: internal
- iOS: simulator + device
- Android: APK debug
- Tempo: 15-25 min

**Quando rodar:**
1. Após atualizar lib nativa (worklets, reanimated, expo-camera, etc.)
2. Após mexer em `app.json` plugins
3. Após mudanças em permissões/deep links
4. 1x por semana (manutenção)

---

### Preview Builds (internal testing)

| Comando | Plataforma | Quando Usar |
|---------|------------|-------------|
| `npm run build:preview` | iOS + Android | Preview para testers internos (ambos) |
| `npm run build:preview:ios` | iOS only | Preview iOS (adhoc) |
| `npm run build:preview:android` | Android only | Preview Android (APK) |

**Características:**
- Profile: `preview`
- Distribution: internal
- iOS: adhoc provisioning
- Android: APK
- Tempo: 15-25 min

**Quando usar:**
- Testar com stakeholders internos
- QA antes de staging
- Demos para cliente

---

### Staging Builds (pre-production)

| Comando | Plataforma | Quando Usar |
|---------|------------|-------------|
| `npm run build:staging` | iOS + Android | Staging final antes de prod |
| `npm run build:staging:ios` | iOS only | Staging iOS |
| `npm run build:staging:android` | Android only | Staging Android |

**Características:**
- Profile: `staging`
- Distribution: internal
- iOS: adhoc
- Android: APK
- Analytics: habilitado
- Tempo: 15-25 min

**Quando usar:**
- Testes finais antes de loja
- Validação com beta testers
- Smoke tests em prod-like environment

---

### Production Builds (loja)

| Comando | Plataforma | Quando Usar |
|---------|------------|-------------|
| `npm run build:prod` | iOS + Android | Build production (SEM submit automático) |
| `npm run build:prod:ios` | iOS only | Build iOS production |
| `npm run build:prod:android` | Android only | Build Android production |

**Características:**
- **RODA QUALITY GATE ANTES** (typecheck + lint + build check)
- Profile: `production`
- iOS: universal provisioning, buildNumber auto-increment
- Android: app-bundle (AAB), versionCode auto-increment
- **NÃO submete automaticamente** (segurança: revisar antes)
- Tempo: 20-30 min

**Quando usar:**
- Build para App Store + Google Play (revisar antes de submit)
- Hotfixes críticos
- Versões oficiais (1.0.0, 1.1.0, etc.)

**IMPORTANTE:**
- Sempre commit antes (requireCommit: true no eas.json)
- Quality gate valida código antes de buildar
- Após build, **revisar** e então rodar `submit:prod` manualmente
- Para workflow automático completo, use `release:prod` (build + submit sequencial)

---

## 3. SUBMIT (Enviar para Lojas)

### Production Submit (loja pública)

| Comando | Plataforma | Quando Usar |
|---------|------------|-------------|
| `submit:prod` | iOS + Android | Submit último build production (ambos) |
| `submit:prod:ios` | iOS only | Submit iOS (--latest = último build) |
| `submit:prod:android` | Android only | Submit Android (--latest) |

**O que faz:**
- Pega o **último** build production da plataforma (`--latest`)
- Envia para App Store Connect (iOS) ou Google Play Console (Android)
- iOS: track production, SKU configurado
- Android: track production, releaseStatus completed

**Quando usar:**
- Após rodar `build:prod:ios` ou `build:prod:android` (se não usou --auto-submit)
- Re-submit após rejection (fix metadata, não código)
- Manual override (caso `build:prod` falhe no submit)

---

### Staging Submit (internal track)

```bash
npm run submit:staging
```

**O que faz:**
- Envia último build staging para track internal (draft)
- iOS: track internal
- Android: track internal (draft)

**Quando usar:**
- Distribuir staging para testers via TestFlight/Internal Testing
- Validar integração com store (metadata, screenshots)

---

### Beta Submit (beta track)

```bash
npm run submit:beta
```

**O que faz:**
- Envia para beta testers públicos/privados
- iOS: TestFlight external testing
- Android: closed/open beta track (completed)

**Quando usar:**
- Beta público antes de release
- Feedback de early adopters
- A/B testing de features

---

## 4. RELEASE COMPLETO (Build + Submit)

### Production Release (workflow automático)

| Comando | Plataforma | Quando Usar |
|---------|------------|-------------|
| `release:prod` | iOS + Android | **Build + Submit automático** (workflow completo) |
| `release:prod:ios` | iOS only | Build + Submit iOS sequencial |
| `release:prod:android` | Android only | Build + Submit Android sequencial |

**O que faz:**
1. Roda `build:prod` (quality gate + build)
2. Aguarda build completar
3. Roda `submit:prod` (submit para lojas)

**Quando usar:**
- Release urgente (hotfix crítico)
- Workflow "one-click" para releases mensais
- Quando confia no build (já testou staging)

**CUIDADO:**
- **NÃO cancela se build der erro** (submit falha)
- Recomendado: rodar `build:prod` primeiro, revisar, e então `submit:prod`
- Use `release:prod` apenas se tiver certeza absoluta

**Tempo total:**
- Build: 20-30 min
- Submit: 2-5 min
- **Total:** 25-35 min

---

## 5. REBUILD NATIVO vs JS-ONLY RELOAD ⚠️

**CRÍTICO:** Entender a diferença evita frustração com Worklets/Reanimated.

### Rebuild Nativo (NECESSÁRIO para libs nativas)

**Comandos:**
```bash
# Android local (rebuild nativo automático)
npx expo run:android

# iOS via EAS (rebuild nativo na nuvem)
npm run build:dev:ios
```

**Quando usar:**
- ✅ Atualizou `react-native-worklets-core`, `react-native-reanimated`, `expo-*`
- ✅ Mudou `app.json` plugins (ex.: `expo-build-properties`)
- ✅ Adicionou/removeu permissões nativas (câmera, localização, etc.)
- ✅ Erro: "Mismatch between JavaScript part and native part of Worklets"

**Tempo:**
- Android local: 2-5 min (primeira vez), 30s (rebuild)
- iOS EAS: 15-25 min

---

### JS-Only Reload (NÃO resolve Worklets)

**Comandos:**
```bash
# Expo dev server (Metro bundler)
npm run start
npm run start:clear

# Ou dev:android (inicia server + abre emulador, mas NÃO rebuilda nativo)
npm run dev:android  # ⚠️ Só resolve se chamar internamente run:android
```

**Quando usar:**
- ✅ Mudou telas/componentes JS/TS
- ✅ Mudou estilos/Tailwind
- ✅ Fix de bugs (pura lógica JS)
- ✅ Mudou copy/textos/traduções

**Tempo:**
- Hot reload: 1-5s
- Fast refresh: 5-10s

---

### ⚠️ IMPORTANTE: Worklets Error

Se você vê:
```
ERROR [Worklets] Mismatch between JavaScript part and native part (0.7.1 vs 0.5.1)
```

**Solução:**
```bash
# Android (Windows)
npx expo run:android  # ← Rebuild nativo local

# iOS (Windows)
npm run build:dev:ios  # ← Rebuild nativo EAS (15-25 min)
```

**NÃO funciona:**
```bash
npm run start:clear  # ❌ Só limpa cache JS, não rebuilda nativo
expo start           # ❌ Só Metro bundler, não rebuilda nativo
```

---

## 6. UTILITÁRIOS

### Listar Builds

```bash
npm run build:list
```

**O que faz:**
- Lista últimos 20 builds EAS (todos os perfis)
- Mostra status, plataforma, perfil, data

---

### Cancelar Build Ativo

```bash
npm run build:cancel
```

**O que faz:**
- Cancela build em andamento (economiza créditos EAS)

**Quando usar:**
- Build errado iniciado (profile/platform incorreto)
- Erro detectado após start (quer fazer fix antes)

---

## 5. WORKFLOW COMPLETO (Exemplo)

### Desenvolvimento Diário (Windows)

```bash
# 1. Desenvolver features (JS/TS/UI)
npm run dev:android  # Rodar Android local

# 2. Testar no emulador
# ... fazer mudanças, hot reload funciona ...

# 3. Antes de commit
npm run quality-gate  # Valida typecheck + lint + build

# 4. Commit
git add .
git commit -m "feat: adiciona tela de perfil"
git push
```

---

### Build iOS Dev (1x por semana ou após lib nativa)

```bash
# 1. Verificar mudanças nativas
git log --oneline | grep -E "(build|native|pod|gradle|expo)"

# 2. Se houver mudanças nativas:
npm run build:dev:ios

# 3. Aguardar build (15-25 min)
# 4. Instalar no iPhone via link EAS
# 5. Testar features no device real
```

---

### Release para Lojas (Production) - Workflow Seguro

```bash
# 1. Finalizar features
git checkout main
git pull

# 2. Atualizar versão (app.json)
# "version": "1.2.0"

# 3. Commit versão
git add app.json
git commit -m "chore: bump version to 1.2.0"
git push

# 4. Build production (SEM submit)
npm run build:prod
# Roda quality-gate → build iOS + Android (20-30 min)

# 5. Acompanhar progresso
npm run build:list

# 6. REVISAR builds
# - Baixar e testar no device
# - Verificar metadata nas lojas
# - Confirmar versões corretas

# 7. Submit para lojas (após aprovação interna)
npm run submit:prod
# Envia iOS + Android para lojas (2-5 min)

# 8. Após aprovação das lojas (1-7 dias)
# App disponível na App Store + Google Play
```

---

### Release Automático (workflow one-click) ⚠️

**CUIDADO:** Só use se tiver certeza absoluta (já testou staging).

```bash
# Build + Submit sequencial (sem revisão manual)
npm run release:prod
# Roda build:prod → aguarda → submit:prod

# Tempo total: 25-35 min
# Risco: se build der erro, submit falha (mas não cancela automaticamente)
```

**Recomendação:**
- Use `build:prod` → revisar → `submit:prod` (workflow seguro)
- Use `release:prod` apenas para hotfixes urgentes com alta confiança

---

## 7. TROUBLESHOOTING

### Erro: "Mismatch between JavaScript part and native part of Worklets"

**Causa:** Build nativo iOS desatualizado (Worklets 0.5.1) vs código JS novo (0.7.1)

**Solução:**
```bash
# Windows → rebuild via EAS
npm run build:dev:ios

# Ou Android local
npm run clean
npm install
npm run dev:android
```

---

### Erro: "requireCommit: true - Git status is dirty"

**Causa:** Mudanças não commitadas no git (eas.json força commit antes de build)

**Solução:**
```bash
git status
git add .
git commit -m "fix: ..."
git push

# Agora buildar
npm run build:prod
```

---

### Erro: "Platform not supported on Windows"

**Causa:** Tentou rodar `npm run dev:ios` no Windows

**Solução:**
```bash
# Usar EAS Build iOS ao invés de local
npm run build:dev:ios

# Ou usar Android local
npm run dev:android
```

---

## 8. REGRAS DE REBUILD

### Quando rebuild é OBRIGATÓRIO:

- ✅ Atualizou lib nativa (reanimated, worklets, expo-*, react-native-*)
- ✅ Mudou `app.json` / `app.config.js` plugins
- ✅ Adicionou/removeu permissões (câmera, localização, etc.)
- ✅ Mudou deep links / URL schemes
- ✅ Mudou bundle identifier / package name
- ✅ Atualizou Expo SDK (54.0.x → 55.0.x)

### Quando rebuild NÃO é necessário (só reload):

- ❌ Mudou telas/componentes (JS/TS)
- ❌ Mudou estilos/design
- ❌ Mudou copy/textos
- ❌ Mudou lógica de negócio (pura JS)
- ❌ Fix de bugs (se não envolve native)

**Estratégia:** Agrupe mudanças nativas em "lotes" (1x por semana) para não buildar toda hora.

---

## 9. CHEAT SHEET

| Tarefa | Comando | Onde Rodar |
|--------|---------|------------|
| Dev diário Android | `npm run dev:android` | Windows |
| Build iOS dev | `npm run build:dev:ios` | Windows (nuvem) |
| Testar staging | `npm run build:staging` | Windows |
| Release lojas | `npm run build:prod` | Windows |
| Submit manual | `npm run submit:prod:ios` | Windows |
| Listar builds | `npm run build:list` | Windows |
| Cancelar build | `npm run build:cancel` | Windows |

---

## 10. TEMPO ESTIMADO

| Operação | Tempo |
|----------|-------|
| `dev:android` (primeira vez) | 30-60s |
| `dev:android` (reload) | 5-10s |
| `build:dev:ios` (EAS) | 15-25 min |
| `build:prod` (ambos) | 25-35 min |
| `submit:prod:ios` | 2-5 min |
| Quality gate | 30s-1 min |

---

## 11. CUSTOS EAS

Expo Free Tier: **30 builds/mês grátis**

| Profile | Builds Típicos/Mês | Custo |
|---------|---------------------|-------|
| development | 4-8 (1-2x/semana) | Grátis |
| staging | 2-4 (pré-release) | Grátis |
| production | 2-4 (releases) | Grátis |
| **TOTAL** | **8-16** | **$0** |

Se ultrapassar 30 builds/mês: considerar Expo Production plan ($99/mês).

---

**Última atualização:** 2025-12-21
**Versão:** 1.0.0
**Autor:** Claude Code (Nossa Maternidade workflow)
