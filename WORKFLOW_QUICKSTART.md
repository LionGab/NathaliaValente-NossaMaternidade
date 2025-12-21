# ⚡ Workflow Quick Start - Nossa Maternidade

Comandos essenciais para desenvolvimento diário.

---

## 📱 DESENVOLVIMENTO DIÁRIO (Windows)

### Android Local (use este 99% do tempo)

```bash
npm run dev:android
```

- Hot reload funciona
- Tempo: 30s primeira vez, 5s reload
- Emulador ou device real

---

## 🏗️ BUILDS (quando necessário)

### iOS Development (1x por semana OU após lib nativa)

```bash
npm run build:dev:ios
```

- Tempo: 15-25 min
- Instala no iPhone via link EAS
- Quando: mudou worklets/reanimated/expo-*/plugins

### Production (release loja)

```bash
# Build (SEM submit)
npm run build:prod

# Revisar builds

# Submit manual
npm run submit:prod

# OU one-click (build + submit automático) ⚠️
npm run release:prod  # Só se tiver certeza absoluta
```

- `build:prod`: quality-gate + build (20-30 min)
- `submit:prod`: envia para lojas (2-5 min)
- `release:prod`: build + submit sequencial (25-35 min)

---

## 📦 SUBMIT MANUAL (se necessário)

```bash
npm run submit:prod:ios      # App Store
npm run submit:prod:android  # Google Play
```

Só usar se `build:prod` não fez submit automático.

---

## 🛠️ UTILITÁRIOS

```bash
npm run build:list      # Ver builds recentes
npm run build:cancel    # Cancelar build ativo
npm run quality-gate    # Validar antes de commit
```

---

## 🔄 QUANDO FAZER REBUILD?

### ✅ Rebuild OBRIGATÓRIO:

- Atualizou lib nativa (worklets, reanimated, expo-*)
- Mudou `app.json` plugins
- Adicionou permissões (câmera, localização)
- Mudou deep links

### ❌ Rebuild NÃO necessário:

- Mudou telas/componentes JS/TS
- Mudou estilos/design
- Fix de bugs (puro JS)

**Estratégia:** Agrupe mudanças nativas 1x por semana.

---

## 🚨 TROUBLESHOOTING RÁPIDO

### Erro Worklets (0.7.1 vs 0.5.1)

**Causa:** Build nativo desatualizado (libs mudaram)

**Solução:**
```bash
# Android (Windows) - rebuild nativo local
npx expo run:android

# iOS (Windows) - rebuild nativo EAS (15-25 min)
npm run build:dev:ios
```

**NÃO funciona:**
```bash
npm run start:clear  # ❌ Só limpa cache JS
expo start           # ❌ Só Metro bundler
```

**Regra:** Mudou lib nativa → precisa rebuild nativo (`run:android` ou EAS Build)

### Git dirty (requireCommit)

```bash
git add .
git commit -m "fix: ..."
npm run build:prod
```

### iOS local no Windows

```bash
# NÃO TENTE - use EAS Build
npm run build:dev:ios
```

---

## 📊 CUSTOS

- **30 builds/mês grátis** (Expo Free Tier)
- Seu uso típico: **8-16 builds/mês** (dentro do free tier)

---

## 🔗 DOCUMENTAÇÃO COMPLETA

Ver `docs/WORKFLOW_SCRIPTS.md` para detalhes completos.

---

**TL;DR:**

- **Dev diário:** `npm run dev:android`
- **iOS semanal:** `npm run build:dev:ios`
- **Release seguro:** `npm run build:prod` → revisar → `npm run submit:prod`
- **Release rápido:** `npm run release:prod` (⚠️ só se confiante)
- **MacBook:** só para admin (App Store Connect, certificados)
