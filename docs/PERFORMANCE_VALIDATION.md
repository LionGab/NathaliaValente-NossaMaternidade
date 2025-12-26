# Performance Validation Guide

> Guia para validar as otimizações de performance aplicadas em 25/12/2025

## Ferramentas Disponíveis no Projeto

| Ferramenta | Status | Uso |
|------------|--------|-----|
| **expo-dev-client** | Instalado | React DevTools, Flipper |
| **Sentry** | Configurado (20% sampling) | Performance monitoring em prod |
| **React DevTools** | Via Expo | Profiler de re-renders |
| **Xcode Instruments** | Nativo iOS | CPU, Memory, FPS |
| **Android Studio Profiler** | Nativo Android | CPU, Memory, FPS |

---

## Otimizações Aplicadas

### 1. AssistantScreen - MessageBubble Extraction

**Problema:** MessageBubble definido dentro do componente, recriado a cada render.

**Solução:** Componente extraído para `src/components/chat/MessageBubble.tsx` com:
- `React.memo` com custom comparison
- Props estáveis via `useMemo`

**Como Validar:**
```bash
# 1. Abrir React DevTools Profiler
# 2. Navegar para NathIA (AssistantScreen)
# 3. Digitar no input (trigger re-renders)
# 4. Verificar que MessageBubble NÃO re-renderiza durante digitação
```

**Métrica Esperada:**
| Cenário | Antes | Depois |
|---------|-------|--------|
| Re-renders durante digitação | MessageBubble re-renderiza | MessageBubble estável |
| FPS durante scroll | ~45-50 | ~58-60 |

---

### 2. HabitsScreen - Memoized HabitCard

**Problema:** renderHabitCard inline recriava componente a cada render.

**Solução:** `HabitCard` extraído com:
- `React.memo` + custom comparison (id, completed, isDark)
- `StyleSheet.create` em vez de inline styles
- `useCallback` para handlers

**Como Validar:**
```bash
# 1. Abrir React DevTools Profiler
# 2. Navegar para Meus Cuidados (HabitsScreen)
# 3. Marcar/desmarcar um hábito
# 4. Verificar que APENAS o HabitCard tocado re-renderiza
```

**Métrica Esperada:**
| Cenário | Antes | Depois |
|---------|-------|--------|
| Toggle de 1 hábito | 8 HabitCards re-renderizam | 1 HabitCard re-renderiza |
| Tempo de render | ~15ms | ~3ms |

---

### 3. useCommunity - Dependency Loop Fix

**Problema:** `loadPosts` dependia de `posts.length`, causando potencial loop.

**Solução:**
- `useRef` para acessar `posts` sem triggerar re-render
- `hasLoadedRef` para garantir single initial load

**Como Validar:**
```bash
# 1. Abrir console de logs (Metro bundler)
# 2. Navegar para Comunidade
# 3. Verificar que "Carregando posts" aparece APENAS 1 vez
# 4. Não deve haver chamadas repetidas à API
```

**Métrica Esperada:**
| Cenário | Antes | Depois |
|---------|-------|--------|
| Chamadas API ao montar | 1-3 (potencial loop) | Exatamente 1 |
| useEffect executions | Múltiplas | 1 |

---

### 4. MyCareScreen - expo-image

**Problema:** `Image` de react-native sem cache.

**Solução:** `expo-image` com:
- Cache automático
- `contentFit="cover"`
- `transition={200}` para loading suave

**Como Validar:**
```bash
# 1. Limpar cache do app (reinstalar)
# 2. Navegar para Meus Cuidados
# 3. Observar imagens carregando com transição suave
# 4. Voltar e retornar - imagens devem aparecer instantaneamente (cached)
```

**Métrica Esperada:**
| Cenário | Antes | Depois |
|---------|-------|--------|
| Primeiro load de imagem | ~200-500ms | ~200-500ms + fade |
| Load subsequente (cache) | ~200-500ms | ~10-20ms |
| Experiência visual | Pop-in abrupto | Fade-in suave |

---

### 5. RootNavigator - Lazy Loading

**Problema:** Todas as 15+ screens carregadas no bundle inicial.

**Solução:** `React.lazy` + `Suspense` para screens secundárias:
- AffirmationsScreen, BreathingExerciseScreen
- HabitsScreen, HabitsEnhancedScreen
- MaeValenteProgressScreen, MundoDaNathScreen
- Paywall, RestSoundsScreen, etc.

**Como Validar:**
```bash
# 1. Build de produção
npx expo export --platform ios

# 2. Verificar bundle size (antes vs depois - precisa de baseline)
# Ou usar Metro bundler logs para ver chunks carregados
```

**Métrica Esperada:**
| Cenário | Antes | Depois |
|---------|-------|--------|
| Bundle inicial | 100% screens | ~60-70% screens |
| TTI (Time to Interactive) | Baseline | -10-20% |
| Navegação para lazy screen | Instantâneo | ~50-100ms delay (fallback) |

---

## Instruções de Teste em Device Real

### iOS (Simulador ou Device)

```bash
# 1. Build de desenvolvimento
npm run ios

# 2. Abrir React DevTools
# No Metro bundler, pressione 'j' para abrir debugger
# Ou use: npx react-devtools

# 3. Para profiling nativo (Xcode Instruments)
# - Abrir Xcode > Open Developer Tool > Instruments
# - Escolher "Time Profiler" ou "Core Animation"
# - Attach ao processo do app
```

### Android (Emulador ou Device)

```bash
# 1. Build de desenvolvimento
npm run android

# 2. Abrir React DevTools
# No Metro bundler, pressione 'j' para abrir debugger

# 3. Para profiling nativo (Android Studio)
# - Android Studio > View > Tool Windows > Profiler
# - Attach ao processo do app
# - Monitorar CPU, Memory, Energy
```

---

## Checklist de Validação Manual

### AssistantScreen
- [ ] Abrir NathIA
- [ ] Digitar mensagem longa (10+ caracteres)
- [ ] Verificar FPS durante digitação (deve ser 60)
- [ ] Scroll pela lista de mensagens
- [ ] Verificar FPS durante scroll (deve ser 58-60)

### HabitsScreen
- [ ] Abrir Meus Cuidados
- [ ] Verificar animação de entrada suave
- [ ] Marcar 1 hábito
- [ ] Confirmar feedback tátil (haptic)
- [ ] Verificar que apenas 1 card animou

### CommunityScreen
- [ ] Abrir Comunidade
- [ ] Verificar que posts carregam 1 vez
- [ ] Pull-to-refresh
- [ ] Verificar que refresh funciona (sem loops)

### MyCareScreen
- [ ] Abrir Meus Cuidados
- [ ] Observar avatar de Nathalia carregando
- [ ] Verificar transição suave (fade-in)
- [ ] Sair e voltar - imagem deve ser instantânea

### Lazy Loading
- [ ] Cold start do app
- [ ] Navegar para Afirmações
- [ ] Verificar loading spinner breve (~50-100ms)
- [ ] Navegar para Paywall
- [ ] Verificar loading spinner breve

---

## Métricas de Produção (Sentry)

O Sentry está configurado com `tracesSampleRate: 0.2` (20% das transações).

Para verificar performance em produção:
1. Acesse https://sentry.io/
2. Vá para Performance > Transactions
3. Filtre por `transaction.op:navigation`
4. Compare métricas antes/depois do deploy

**Métricas a monitorar:**
- **LCP (Largest Contentful Paint)**: Tempo até maior elemento visível
- **FID (First Input Delay)**: Tempo até primeira interação
- **TTI (Time to Interactive)**: Tempo até app responsivo
- **Navigation duration**: Tempo de navegação entre telas

---

## Baseline vs Esperado (Resumo)

| Área | Baseline (Estimado) | Esperado | Melhoria |
|------|---------------------|----------|----------|
| **AssistantScreen FPS** | 45-50 | 58-60 | +20-30% |
| **HabitCard re-renders** | 8/toggle | 1/toggle | -87.5% |
| **useCommunity API calls** | 1-3 | 1 | -66% |
| **Image load (cached)** | 200-500ms | 10-20ms | -95% |
| **Bundle inicial** | 100% | ~70% | -30% |

---

## Como Reportar Resultados

Após validação, atualizar este documento com:

```markdown
## Resultados da Validação - [DATA]

### Device: [iPhone 14 / Pixel 7 / etc.]
### OS: [iOS 17.2 / Android 14]

| Teste | Resultado | Observações |
|-------|-----------|-------------|
| AssistantScreen FPS | ✅/❌ XX FPS | |
| HabitCard re-renders | ✅/❌ X re-renders | |
| useCommunity API calls | ✅/❌ X chamadas | |
| Image cache | ✅/❌ XXms | |
| Lazy loading | ✅/❌ XXms delay | |
```

---

## Rollback (Se Necessário)

Se alguma otimização causar problemas:

```bash
# Reverter commits específicos
git revert <commit-hash>

# Ou reverter arquivo específico
git checkout HEAD~1 -- src/screens/AssistantScreen.tsx
```

Arquivos modificados:
- `src/components/chat/MessageBubble.tsx` (NOVO)
- `src/screens/AssistantScreen.tsx`
- `src/screens/HabitsScreen.tsx`
- `src/hooks/useCommunity.ts`
- `src/screens/MyCareScreen.tsx`
- `src/navigation/RootNavigator.tsx`
