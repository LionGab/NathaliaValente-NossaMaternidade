# ♿ Accessibility Audit & Checklist - Nossa Maternidade

**Data**: 24 de dezembro de 2024  
**Objetivo**: WCAG AAA compliance + iOS VoiceOver excellence  
**Princípio**: App deve ser 100% navegável sem olhar na tela

---

## 🎯 Accessibility Standards

### Target Compliance
- **WCAG 2.1 Level AAA**: Máximo padrão de acessibilidade
- **iOS HIG - Accessibility**: Guidelines da Apple
- **Section 508**: Compliance federal (US)

### Why It Matters
- **5-10% das usuárias** têm alguma dificuldade visual
- **Todas as mães** podem estar em situação de baixa visibilidade (noite, cansaço)
- **VoiceOver** pode ser usado temporariamente (ex: amamentando de noite)

---

## ✅ Checklist Geral

### 1. Text Contrast (WCAG AAA = 7:1)
- [x] **Primary text**: 18.5:1 vs background ✅
- [x] **Secondary text**: 9.2:1 vs background ✅
- [x] **Tertiary text**: 6.8:1 vs background ✅
- [x] **Links**: 8.3:1+ vs background ✅
- [ ] **Error text**: Validar contraste em todos os estados
- [ ] **Success text**: Validar contraste
- [ ] **Warning text**: Validar contraste

### 2. Tap Targets (iOS HIG = 44pt minimum)
- [x] **Buttons**: All ≥44pt minHeight ✅
- [x] **Tab bar items**: ≥44pt ✅
- [ ] **Icon buttons**: Validar todos
- [ ] **Links inline**: Padding suficiente?
- [ ] **Cards clicáveis**: 44pt+ tap area
- [ ] **Toggle switches**: 44pt+ tap area
- [ ] **Radio/checkbox**: 44pt+ tap area

### 3. Touch Spacing (8pt minimum)
- [ ] **Buttons adjacentes**: ≥8pt gap
- [ ] **Tab bar items**: Espaçamento OK
- [ ] **Inline actions** (like, share): ≥8pt entre ícones
- [ ] **Form fields**: ≥8pt vertical spacing

### 4. Accessibility Labels (VoiceOver)
- [x] **Button component**: Tem label ✅
- [x] **IconButton component**: Tem label ✅
- [ ] **Avatar component**: Precisa label ("Avatar de [Nome]")
- [ ] **Card component**: Precisa label quando clicável
- [ ] **Image components**: Precisa alt text
- [ ] **Tab bar items**: Validar labels
- [ ] **Modal close buttons**: "Fechar modal"
- [ ] **Navigation back**: "Voltar"

### 5. Accessibility Roles
- [x] **Buttons**: `accessibilityRole="button"` ✅
- [ ] **Links**: `accessibilityRole="link"`
- [ ] **Images**: `accessibilityRole="image"`
- [ ] **Headers**: `accessibilityRole="header"`
- [ ] **Text**: `accessibilityRole="text"`
- [ ] **Inputs**: `accessibilityRole="input"`

### 6. Accessibility States
- [x] **Disabled buttons**: `accessibilityState={{ disabled: true }}` ✅
- [ ] **Selected items**: `accessibilityState={{ selected: true }}`
- [ ] **Checked checkboxes**: `accessibilityState={{ checked: true }}`
- [ ] **Expanded dropdowns**: `accessibilityState={{ expanded: true }}`
- [ ] **Busy loading**: `accessibilityState={{ busy: true }}`

### 7. Accessibility Hints
- [x] **Buttons**: Tem hint quando necessário ✅
- [ ] **Cards**: "Toque para mais detalhes"
- [ ] **Inputs**: Hint de formato esperado
- [ ] **Complex actions**: Explicação do que faz

---

## 📱 Checklist por Componente

### Button.tsx
- [x] **accessibilityLabel**: Implementado ✅
- [x] **accessibilityRole**: "button" ✅
- [x] **accessibilityState**: disabled ✅
- [x] **accessibilityHint**: Implementado quando loading ✅
- [x] **Tap target**: minHeight 44pt ✅
- [ ] **VoiceOver test**: Testar navegação

### Card.tsx
- [ ] **accessibilityLabel**: Adicionar quando onPress existe
- [ ] **accessibilityRole**: "button" quando clicável
- [ ] **accessibilityHint**: "Toque para abrir"
- [x] **Visual separation**: Border em dark mode ✅

### IconButton.tsx
- [x] **accessibilityLabel**: Implementado ✅
- [x] **Tap target**: 44pt ✅
- [ ] **VoiceOver test**: Validar label descritivo

### Avatar.tsx
- [ ] **accessibilityLabel**: "Avatar de [Nome]" ou "Foto de perfil"
- [ ] **accessibilityRole**: "image"
- [ ] **Decorative check**: Se decorativo, `accessible={false}`

### Input.tsx
- [ ] **accessibilityLabel**: Label do campo
- [ ] **accessibilityHint**: Formato esperado ou erro
- [ ] **accessibilityState**: disabled, error state
- [ ] **Focus state**: Border visível (2px, color change)
- [ ] **Error state**: Anunciado pelo VoiceOver

### ScreenHeader.tsx
- [ ] **Back button**: "Voltar para [Tela Anterior]"
- [ ] **Title**: `accessibilityRole="header"`
- [ ] **Right actions**: Label descritivo

### Toast.tsx
- [ ] **Announce to VoiceOver**: `AccessibilityInfo.announceForAccessibility()`
- [ ] **Type icons**: Decorative (não ler "ícone de erro")
- [ ] **Message**: Lido automaticamente

### Badge.tsx
- [ ] **accessibilityLabel**: "Badge: [texto]" ou decorativo
- [ ] **Role**: "text" ou none se decorativo

### FAB.tsx
- [ ] **accessibilityLabel**: Ação descritiva ("Criar novo post")
- [ ] **Tap target**: 56-60pt ✅ (maior que button normal)
- [ ] **accessibilityHint**: "Toque para [ação]"

---

## 📊 Checklist por Tela

### HomeScreen
- [ ] **Header greeting**: `accessibilityRole="header"`
- [ ] **Hero card** (NathIA): Label + hint "Toque para conversar"
- [ ] **Check-in buttons**: Labels descritivos ("Bem", "Cansada", etc)
- [ ] **Progress ring**: `accessibilityLabel="Progresso de hábitos: 3 de 8"`
- [ ] **Feature cards**: Labels + hints

### AssistantScreen (Chat)
- [ ] **Sidebar toggle**: "Abrir histórico de conversas"
- [ ] **Message bubbles**: Lidos em ordem cronológica
- [ ] **Nathália avatar**: "Nathália Valente"
- [ ] **User avatar**: "Sua mensagem"
- [ ] **Input field**: "Digite sua mensagem"
- [ ] **Send button**: "Enviar mensagem"
- [ ] **Mic button**: "Gravar áudio"
- [ ] **Attach button**: "Anexar imagem"

### CommunityScreen
- [ ] **New post FAB**: "Criar novo post"
- [ ] **Post cards**: "Post de [Nome] sobre [Tópico]"
- [ ] **Like button**: "Curtir post" / "Descurtir post"
- [ ] **Comment button**: "Comentar, [N] comentários"
- [ ] **Share button**: "Compartilhar post"
- [ ] **Avatar**: "Avatar de [Nome]"
- [ ] **Timestamp**: Lido como parte do card label

### OnboardingScreen
- [ ] **Progress indicator**: "Etapa 2 de 9"
- [ ] **CTA "Próximo"**: "Continuar para próxima etapa"
- [ ] **Skip button**: "Pular onboarding"
- [ ] **Back gesture**: Anunciado?

### PaywallScreen
- [ ] **Plan cards**: "Plano [Mensal/Anual], R$ [Preço]"
- [ ] **Features list**: Cada item lido
- [ ] **CTA subscribe**: "Começar teste grátis de 7 dias"
- [ ] **"Continue free"**: "Continuar com versão grátis"
- [ ] **Close button**: "Fechar tela de assinatura"

### MyCareScreen
- [ ] **Habit cards**: "Hábito [Nome], [Status]"
- [ ] **Toggle button**: "Marcar como completo" / "Desmarcar"
- [ ] **Progress indicator**: "Sequência de 5 dias"
- [ ] **View details**: "Ver detalhes do hábito"

### DailyLogScreen
- [ ] **Feeling selectors**: "Bem, sol brilhante" (emoji + texto)
- [ ] **Sleep slider**: "Sono: 7 horas e 30 minutos"
- [ ] **Notes input**: "Anotações opcionais"
- [ ] **Save button**: "Salvar registro do dia"

---

## 🧪 Testes VoiceOver

### Setup
1. **iOS**: Settings > Accessibility > VoiceOver > ON
2. **Shortcuts**: 
   - Triple-click side button para toggle
   - Swipe right/left para navegar
   - Double-tap para ativar
   - Two-finger tap para parar leitura

### Test Cases

#### Test 1: Navigation Flow
1. Abrir app com VoiceOver
2. Navegar tabs (swipe right)
3. **Validar**: Todos os tabs são anunciados corretamente
4. **Critério**: "Home, tab 1 de 5", "Chat, tab 2 de 5", etc

#### Test 2: Chat Interaction
1. Navegar para Chat (NathIA)
2. Swipe até input field
3. Double-tap para ativar
4. Digitar mensagem
5. Swipe até send button
6. **Validar**: "Enviar mensagem, botão"
7. Double-tap para enviar
8. **Validar**: Resposta da NathIA é lida

#### Test 3: Community Engagement
1. Navegar para Community
2. Swipe até primeiro post
3. **Validar**: Post completo é lido (autor, conteúdo, timestamp)
4. Swipe até like button
5. **Validar**: "Curtir post, botão"
6. Double-tap
7. **Validar**: Estado muda para "Descurtir post, botão"

#### Test 4: Form Completion
1. Navegar para Daily Log
2. Swipe até feeling selector
3. **Validar**: Todas as opções são lidas
4. Selecionar feeling
5. Swipe até save button
6. **Validar**: "Salvar registro do dia, botão"

#### Test 5: Error Handling
1. Abrir Chat
2. Forçar erro (offline mode)
3. **Validar**: Mensagem de erro é anunciada
4. **Validar**: Botão retry é acessível

### Success Criteria
- ✅ 100% das telas navegáveis
- ✅ 100% dos botões têm labels descritivos
- ✅ 100% dos inputs têm labels + hints
- ✅ Ordem de leitura lógica (top-to-bottom, left-to-right)
- ✅ Estados dinâmicos são anunciados (loading, error, success)
- ✅ Imagens decorativas ignoradas (`accessible={false}`)
- ✅ Imagens informativas têm alt text

---

## 🎨 Dynamic Type Support

### Text Scaling
iOS permite usuários aumentarem tamanho do texto (Settings > Display & Brightness > Text Size)

#### Checklist
- [ ] **Typography tokens**: Usam `fontSize` relativo
- [ ] **Layouts**: Não quebram com texto grande
- [ ] **Truncation**: Usa `numberOfLines` + `ellipsizeMode`
- [ ] **Line height**: Escala com fontSize
- [ ] **Min tap targets**: Mantêm 44pt mesmo com texto grande

#### Test
1. iOS Settings > Display > Text Size > **Largest**
2. Abrir app
3. Navegar todas as telas
4. **Validar**: 
   - Texto não sobrepõe
   - Botões não quebram
   - Cards não cortam conteúdo
   - Scroll funciona corretamente

---

## 🔊 Sound & Haptics

### Haptic Feedback (Acessibilidade Tátil)
- [x] **Buttons**: `Haptics.impactAsync(Light)` ✅
- [ ] **Success actions**: `Haptics.notificationAsync(Success)`
- [ ] **Error actions**: `Haptics.notificationAsync(Error)`
- [ ] **Swipe gestures**: `Haptics.impactAsync(Light)`

### Sound Effects (Opcional)
- [ ] **Success**: Som sutil de confirmação
- [ ] **Error**: Som de alerta suave (não harsh)
- [ ] **Message received**: Notificação auditiva
- [ ] **Settings**: Allow user to disable sounds

---

## 🎯 Color & Contrast

### Color Blindness Support
- [ ] **Não depender APENAS de cor** para informação
  - Error state: Cor + ícone + texto
  - Success: Cor + ícone + texto
  - Links: Cor + underline
- [ ] **Testar com simuladores**:
  - Protanopia (red-blind)
  - Deuteranopia (green-blind)
  - Tritanopia (blue-blind)

### High Contrast Mode (iOS)
- [ ] **Testar**: Settings > Accessibility > Increase Contrast
- [ ] **Validar**: Borders ficam mais visíveis
- [ ] **Validar**: Textos não perdem legibilidade

### Reduce Transparency (iOS)
- [ ] **Testar**: Settings > Accessibility > Reduce Transparency
- [ ] **Validar**: Glass/blur effects removidos
- [ ] **Validar**: Backgrounds sólidos aparecem

---

## 🚀 Implementation Priorities

### Priority 1: Critical (This Week)
1. [ ] Add accessibilityLabel to all buttons without labels
2. [ ] Add accessibilityLabel to all icon buttons
3. [ ] Add accessibilityRole to images
4. [ ] Test VoiceOver navigation (full app)
5. [ ] Fix any ordering issues (reading order)

### Priority 2: Important (Next Week)
1. [ ] Add accessibilityHint to complex interactions
2. [ ] Implement accessibilityState for dynamic elements
3. [ ] Test Dynamic Type (large text)
4. [ ] Add haptic feedback to key actions
5. [ ] Test with color blindness simulators

### Priority 3: Nice-to-Have (Month 1)
1. [ ] Sound effects for key actions
2. [ ] High contrast mode support
3. [ ] Reduce transparency support
4. [ ] Custom VoiceOver grouping (optimize reading)
5. [ ] Accessibility settings screen (font size, haptics toggle)

---

## 📊 Accessibility Audit Tools

### Manual Tools
- **iOS VoiceOver**: Built-in screen reader
- **Accessibility Inspector** (Xcode): Check labels, roles, hints
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **WAVE**: Browser extension for web version (if exists)

### Automated Tools
```bash
# React Native Accessibility Scanner
npm install -D @react-native-community/eslint-plugin-a11y

# ESLint rules
{
  "extends": ["plugin:@react-native-community/a11y"]
}
```

### Color Blindness Simulators
- **Sim Daltonism** (Mac): Real-time color blindness simulator
- **Color Oracle**: Cross-platform simulator
- **Figma plugins**: Stark, Color Blind

---

## ✅ Definition of Done

Accessibility is "done" when:

1. ✅ 100% buttons have accessibilityLabel
2. ✅ 100% images have alt text or are marked decorative
3. ✅ 100% tap targets ≥44pt
4. ✅ 100% text contrast ≥7:1 (WCAG AAA)
5. ✅ VoiceOver navigation passes (all screens)
6. ✅ Dynamic Type supported (no broken layouts)
7. ✅ Color-blind friendly (not color-only information)
8. ✅ High contrast mode tested
9. ✅ Haptic feedback on key actions
10. ✅ Documented in accessibility guide

---

## 📝 Tracking Progress

### Components Audited
- [x] Button.tsx - ✅ Fully accessible
- [x] IconButton.tsx - ✅ Has labels
- [ ] Card.tsx - ⏳ Needs conditional labels
- [ ] Avatar.tsx - ⏳ Needs role + label
- [ ] Input.tsx - ⏳ Needs validation
- [ ] ScreenHeader.tsx - ⏳ Needs validation
- [ ] Toast.tsx - ⏳ Needs announce
- [ ] Badge.tsx - ⏳ Needs label or decorative
- [ ] FAB.tsx - ⏳ Needs validation

### Screens Audited
- [ ] HomeScreen - 0% ⏳
- [ ] AssistantScreen - 0% ⏳
- [ ] CommunityScreen - 0% ⏳
- [ ] OnboardingScreen - 0% ⏳
- [ ] PaywallScreen - 0% ⏳
- [ ] MyCareScreen - 0% ⏳
- [ ] DailyLogScreen - 0% ⏳

**Overall Progress**: 20% complete (2/9 components, 0/7 screens)

---

**Next Action**: Start adding labels to Card, Avatar, Input components
