# Guia de Criação de Assets para Stores

Guia prático para criar screenshots e assets necessários para App Store e Google Play.

## Assets Necessários

### iOS (App Store)

| Asset | Tamanho | Quantidade | Formato |
|-------|---------|------------|---------|
| Screenshots 6.7" | 1290×2796px | Mín. 3, Máx. 10 | PNG/JPG |
| Screenshots 6.5" | 1284×2778px | Mín. 3, Máx. 10 | PNG/JPG |
| App Icon | 1024×1024px | 1 | PNG (sem alpha) |

### Android (Google Play)

| Asset | Tamanho | Quantidade | Formato |
|-------|---------|------------|---------|
| Screenshots Phone | 1080×1920px | Mín. 2, Máx. 8 | PNG/JPG |
| Feature Graphic | 1024×500px | 1 | PNG/JPG |
| App Icon | 512×512px | 1 | PNG |

## Método 1: Captura Manual (Recomendado)

### iOS

1. **Rodar app no simulador:**
```bash
npm run ios
```

2. **Selecionar dispositivo correto:**
   - iPhone 15 Pro Max (6.7")
   - iPhone 14 Pro Max (6.5")

3. **Capturar screenshots:**
   - Mac: `Cmd + S` no simulador
   - Salvo em: `~/Desktop/`

4. **Telas principais para capturar:**
   - Home screen (com saudação personalizada)
   - Ciclo tracker (com calendário)
   - NathIA chat (conversa exemplo)
   - Community (feed de posts)
   - Meus Cuidados (card de bem-estar)

### Android

1. **Rodar app no emulador:**
```bash
npm run android
```

2. **Selecionar dispositivo correto:**
   - Pixel 6 (1080×1920)

3. **Capturar screenshots:**
   - Ferramenta no emulador (câmera icon)
   - Salvo em: Device Explorer → `/sdcard/Pictures/Screenshots/`

## Método 2: Ferramentas Automáticas

### Expo Screenshot Tool (Em breve)

```bash
# Ainda não disponível no SDK 54
# npx expo-screenshots generate
```

### Fastlane Snapshot (iOS)

```bash
# Requer setup adicional
fastlane snapshot
```

## Criar Feature Graphic (Android)

### Opção 1: Canva (Recomendado)

1. Acesse https://canva.com
2. Criar design personalizado: 1024×500px
3. Template sugerido:
   - Background: Gradiente azul/rosa (brand colors)
   - Logo centralizado
   - Texto: "Nossa Maternidade - Sua jornada, seu apoio"
   - Elementos: Ilustração de mãe/bebê

### Opção 2: Figma

Template pronto: `assets/feature-graphic-template.fig` (se existir)

## Checklist de Qualidade

### Screenshots

- [ ] Mostram funcionalidades principais
- [ ] Texto legível (fontes grandes)
- [ ] Cores consistentes com brand (azul/rosa)
- [ ] Sem informações sensíveis
- [ ] Alta resolução (sem blur)
- [ ] Ordem lógica (onboarding → features → social)

### Feature Graphic

- [ ] Logo visível e centralizado
- [ ] Cores da marca (azul pastel + rosa)
- [ ] Texto curto e impactante
- [ ] Alta resolução (1024×500px)
- [ ] Formato PNG ou JPG

## Organização de Arquivos

```
assets/
├── store/
│   ├── ios/
│   │   ├── 6.7/
│   │   │   ├── 01-home.png
│   │   │   ├── 02-cycle.png
│   │   │   ├── 03-nathia.png
│   │   │   ├── 04-community.png
│   │   │   └── 05-mycare.png
│   │   └── 6.5/
│   │       └── (mesmas screenshots)
│   └── android/
│       ├── screenshots/
│       │   ├── 01-home.png
│       │   ├── 02-cycle.png
│       │   └── ...
│       └── feature-graphic.png
```

## Upload para as Lojas

### App Store Connect

1. Acesse https://appstoreconnect.apple.com
2. App → App Store → Screenshots
3. Arrastar e soltar screenshots
4. Adicionar legendas (opcional)

### Google Play Console

1. Acesse https://play.google.com/console
2. App → Store presence → Main store listing
3. Screenshots → Upload
4. Feature graphic → Upload

## Dicas

1. **Consistência:** Use mesmas telas em iOS e Android
2. **Ordem:** Siga fluxo do usuário (onboarding → features)
3. **Texto:** Adicione legendas curtas em cada screenshot
4. **Preview:** Teste visualização em devices reais antes de submeter
5. **Localização:** Se suportar PT-BR, screenshots em português

## Ferramentas Úteis

- **Figma:** https://figma.com (design)
- **Canva:** https://canva.com (feature graphic)
- **App Mockup:** https://app-mockup.com (templates)
- **Screenshot Frames:** https://screenshotframes.com (adicionar device frames)

## Recursos Adicionais

- [App Store Screenshot Guidelines](https://developer.apple.com/app-store/product-page/)
- [Google Play Asset Guidelines](https://support.google.com/googleplay/android-developer/answer/9866151)

---

**Próximos Passos:**

1. Rodar app e capturar 5 screenshots principais
2. Criar feature graphic no Canva (1024×500px)
3. Organizar em `assets/store/`
4. Upload no App Store Connect + Google Play Console
