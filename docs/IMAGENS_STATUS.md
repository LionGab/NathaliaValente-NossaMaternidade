# 📸 Status das Imagens do Onboarding

## ⚠️ Situação Atual

O Instagram bloqueia downloads automáticos de imagens sem autenticação. As URLs das imagens também contêm tokens que expiram rapidamente, tornando difícil o download direto.

## ✅ O que foi feito

1. **Navegação no Instagram** ✅
   - Acessei o perfil @nathaliavalente
   - Identifiquei posts relevantes para cada etapa do onboarding
   - Criei mapeamento detalhado em `docs/ONBOARDING_ASSETS_MAPPING.md`

2. **Screenshots capturados** ✅
   - `post-paris-thales-full.png` - Post "Chegamos em Paris"
   - `post-thales-aviao-full.png` - Post "1ª vez do Thales em um avião"
   - Screenshots salvos em `.playwright-mcp/`

3. **Foto de perfil** ✅
   - URL extraída: `https://instagram.fcgb9-1.fna.fbcdn.net/v/t51.2885-19/536776283_18285181189283165_359396494595178301_n.jpg`
   - Tentativa de download (pode ter expirado)

## 📋 Próximos Passos Recomendados

### Opção 1: Download Manual (Recomendado)

1. Acesse cada URL listada em `docs/ONBOARDING_ASSETS_MAPPING.md`
2. Faça login no Instagram
3. Clique com botão direito na imagem > "Salvar imagem como"
4. Salve em `assets/onboarding/images/` com o nome correto

### Opção 2: Usar Screenshots como Placeholder

Os screenshots capturados podem ser usados temporariamente enquanto as imagens reais são obtidas:

```bash
# Copiar screenshots para assets
cp .playwright-mcp/post-paris-thales-full.png assets/onboarding/images/stage-puerperio.jpg
cp .playwright-mcp/post-thales-aviao-full.png assets/onboarding/images/stage-mae-recente.jpg
```

### Opção 3: Solicitar Assets Diretamente

Solicitar à Nathália Valente ou equipe:

- Fotos em alta resolução de cada estágio
- Vídeos editados para o onboarding
- Assets organizados por categoria

## 📁 Estrutura de Arquivos Esperada

```
assets/onboarding/
├── images/
│   ├── stage-tentante.jpg
│   ├── stage-gravida-t1.jpg
│   ├── stage-gravida-t2.jpg
│   ├── stage-gravida-t3.jpg
│   ├── stage-puerperio.jpg
│   ├── stage-mae-recente.jpg
│   ├── concern-*.jpg (8 imagens)
│   └── nath-profile-small.jpg
└── videos/
    ├── welcome.mp4
    ├── emotional-state.mp4
    └── paywall.mp4
```

## 🔗 URLs dos Posts Identificados

Ver `docs/ONBOARDING_ASSETS_MAPPING.md` para lista completa com:

- URLs específicas dos posts
- Descrição de cada imagem
- Sugestão de nome de arquivo
- Categoria de uso

## 💡 Nota Técnica

O código atual está preparado para usar placeholders temporários (URLs do Unsplash). Quando as imagens reais estiverem disponíveis, basta substituir as referências em:

- `src/config/nath-journey-onboarding-data.ts`
- `src/screens/onboarding/OnboardingSummary.tsx`

Os tipos TypeScript já suportam tanto `require()` quanto `{ uri: string }`.
