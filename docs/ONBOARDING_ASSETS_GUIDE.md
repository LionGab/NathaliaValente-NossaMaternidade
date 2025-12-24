# Guia de Assets para Onboarding "Jornada da Nath"

## 📸 Imagens Necessárias

### Vídeos (3 arquivos)
- `assets/onboarding/videos/welcome.mp4` - 15 segundos
  - **Conteúdo**: Nath falando "Oi, eu sou a Nath! Há 3 meses eu tive o Thales..."
  - **Formato**: MP4, resolução mínima 1080p
  
- `assets/onboarding/videos/emotional-state.mp4` - 10 segundos
  - **Conteúdo**: Nath falando sobre ansiedade/tristeza pós-parto
  - **Formato**: MP4, resolução mínima 1080p
  
- `assets/onboarding/videos/paywall.mp4` - 15 segundos
  - **Conteúdo**: Nath explicando preço e 7 dias grátis
  - **Formato**: MP4, resolução mínima 1080p

### Fotos de Estágio (6 arquivos)
- `assets/onboarding/stage-tentante.jpg`
  - **Sugestão**: Foto da Nath durante fase de tentante (antes da gravidez)
  - **Resolução**: Mínimo 800x600px
  
- `assets/onboarding/stage-gravida-t1.jpg`
  - **Sugestão**: Nath grávida no primeiro trimestre
  - **Resolução**: Mínimo 800x600px
  
- `assets/onboarding/stage-gravida-t2.jpg`
  - **Sugestão**: Nath grávida no segundo trimestre (barriga crescendo)
  - **Resolução**: Mínimo 800x600px
  
- `assets/onboarding/stage-gravida-t3.jpg`
  - **Sugestão**: Nath grávida no terceiro trimestre (reta final)
  - **Resolução**: Mínimo 800x600px
  
- `assets/onboarding/stage-puerperio.jpg`
  - **Sugestão**: Nath com Thales recém-nascido (primeiros 40 dias)
  - **Resolução**: Mínimo 800x600px
  
- `assets/onboarding/stage-mae-recente.jpg`
  - **Sugestão**: Nath com Thales (até 1 ano)
  - **Resolução**: Mínimo 800x600px

### Fotos de Preocupações (8 arquivos)
- `assets/onboarding/concern-ansiedade.jpg` - Nath expressando ansiedade/medo
- `assets/onboarding/concern-informacao.jpg` - Nath pesquisando/estudando
- `assets/onboarding/concern-sintomas.jpg` - Nath com sintomas físicos (enjoo, etc)
- `assets/onboarding/concern-corpo.jpg` - Nath mostrando mudanças no corpo
- `assets/onboarding/concern-relacionamento.jpg` - Nath com parceiro/família
- `assets/onboarding/concern-trabalho.jpg` - Nath trabalhando/equilibrando maternidade
- `assets/onboarding/concern-solidao.jpg` - Nath sozinha/momento de solidão
- `assets/onboarding/concern-financas.jpg` - Nath preocupada com finanças/enxoval

### Fotos de Estado Emocional (4 arquivos)
- `assets/onboarding/emotional-bem.jpg` - Nath bem/equilibrada
- `assets/onboarding/emotional-ansiosa-leve.jpg` - Nath um pouco ansiosa
- `assets/onboarding/emotional-ansiosa-grave.jpg` - Nath muito ansiosa
- `assets/onboarding/emotional-triste.jpg` - Nath triste/esgotada

### Foto para Check-in
- `assets/onboarding/checkin-nath-thales.jpg` - Nath checando celular com Thales no colo

### Foto para ShareableCard
- `assets/onboarding/nath-profile-small.jpg` - Foto pequena da Nath (60x60px) para o card de temporada

## 🔍 Como Obter do Instagram

### Opção 1: Download Manual
1. Acesse https://www.instagram.com/nathaliavalente/
2. Navegue pelos posts e stories highlights
3. Baixe as imagens/vídeos que melhor representam cada etapa
4. Organize por categoria conforme lista acima

### Opção 2: Ferramentas de Download
- **Desktop**: Use extensões como "Downloader for Instagram"
- **Online**: Sites como instadp.com, downloadgram.com
- **Mobile**: Apps como "InstaSave" ou "Repost for Instagram"

### Opção 3: Solicitar à Nathália
- Pedir acesso direto às fotos/vídeos em alta resolução
- Melhor qualidade e controle sobre quais usar

## 📝 Checklist de Qualidade

Para cada imagem/vídeo:
- [ ] Resolução adequada (mínimo 800x600px para fotos)
- [ ] Boa iluminação e qualidade visual
- [ ] Representa fielmente a etapa/preocupação/estado emocional
- [ ] Nathália está visível e reconhecível
- [ ] Formato correto (JPG para fotos, MP4 para vídeos)
- [ ] Tamanho otimizado (comprimir se necessário)

## 🔄 Como Integrar no Código

Após adicionar os assets na pasta `assets/onboarding/`, atualize:

### 1. Arquivo de Configuração
`src/config/nath-journey-onboarding-data.ts`

Substitua os placeholders:

```typescript
// ANTES
const PLACEHOLDER_IMAGE = {
  uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
};

// DEPOIS
export const STAGE_CARDS: StageCardData[] = [
  {
    stage: "TENTANTE",
    image: require("../../assets/onboarding/stage-tentante.jpg"),
    // ...
  },
  // ...
];
```

### 2. Vídeos nas Telas
`src/screens/onboarding/OnboardingWelcome.tsx`

```typescript
// ANTES
const WELCOME_VIDEO = {
  uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
};

// DEPOIS
const WELCOME_VIDEO = require("../../../assets/onboarding/videos/welcome.mp4");
```

### 3. Otimização (Opcional)
- Use `expo-image` para cache automático
- Comprima vídeos com `ffmpeg` se necessário
- Use WebP para fotos (melhor compressão)

## 🎨 Diretrizes de Uso

### Fotos de Estágio
- Deve mostrar claramente a fase da jornada
- Nathália deve estar no centro da imagem
- Contexto relevante (barriga, bebê, etc)

### Fotos de Preocupações
- Expressão facial/clima que transmita a preocupação
- Pode ser mais artística/emocional
- Não precisa ser literal (ex: "trabalho" pode ser Nath no escritório)

### Fotos de Estado Emocional
- **Bem**: Sorriso, energia positiva
- **Ansiosa leve**: Expressão preocupada mas controlada
- **Ansiosa grave**: Expressão de angústia/medo
- **Triste**: Expressão de cansaço/tristeza

## 📦 Estrutura de Pastas Final

```
assets/
└── onboarding/
    ├── videos/
    │   ├── welcome.mp4
    │   ├── emotional-state.mp4
    │   └── paywall.mp4
    └── images/
        ├── stage-tentante.jpg
        ├── stage-gravida-t1.jpg
        ├── stage-gravida-t2.jpg
        ├── stage-gravida-t3.jpg
        ├── stage-puerperio.jpg
        ├── stage-mae-recente.jpg
        ├── concern-ansiedade.jpg
        ├── concern-informacao.jpg
        ├── concern-sintomas.jpg
        ├── concern-corpo.jpg
        ├── concern-relacionamento.jpg
        ├── concern-trabalho.jpg
        ├── concern-solidao.jpg
        ├── concern-financas.jpg
        ├── emotional-bem.jpg
        ├── emotional-ansiosa-leve.jpg
        ├── emotional-ansiosa-grave.jpg
        ├── emotional-triste.jpg
        ├── checkin-nath-thales.jpg
        └── nath-profile-small.jpg
```

## ⚠️ Direitos Autorais

- Certifique-se de ter permissão da Nathália para usar as imagens
- Respeite direitos de imagem de terceiros que possam aparecer
- Considere contratos/licenças se necessário

## 🚀 Próximos Passos

1. **Coletar assets** do Instagram/perfil da Nathália
2. **Organizar** por categoria conforme este guia
3. **Otimizar** tamanho/formato se necessário
4. **Substituir placeholders** no código
5. **Testar** visualmente em diferentes dispositivos
6. **Ajustar** se necessário (crop, filtros, etc)

---

**Nota**: Este guia serve como referência. Adapte conforme as imagens/vídeos disponíveis do perfil da Nathália.

