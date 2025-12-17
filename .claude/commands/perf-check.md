# Performance Check

Verificar e otimizar performance do app.

## Checklist de Performance

### 1. Listas Virtualizadas
```bash
# Verificar uso de FlatList/FlashList vs ScrollView+map
grep -rn "ScrollView" src/ --include="*.tsx" | grep -v "import"
```

**Regra**: Sempre usar `FlatList` ou `FlashList` para listas com mais de 10 itens.

### 2. Memoização
Verificar componentes que podem se beneficiar de `React.memo`:
- Componentes de lista (renderItem)
- Componentes que recebem callbacks
- Componentes com props estáveis

### 3. useMemo e useCallback
```typescript
// Callbacks devem ser memoizados
const handlePress = useCallback(() => {
  // ...
}, [dependencies]);

// Cálculos pesados devem ser memoizados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### 4. Imagens
Verificar uso de `expo-image` em vez de `Image`:
```bash
grep -rn "from ['\"]react-native['\"]" src/ --include="*.tsx" | grep "Image"
```

**Regra**: Usar `expo-image` para melhor caching e performance.

### 5. Re-renders
Usar React DevTools Profiler para identificar:
- Componentes que re-renderizam demais
- Props que mudam referência desnecessariamente

## Verificações Automáticas

### Bundle Size
```bash
npx expo export --dump-sourcemap
du -sh dist/
```

### Verificar Imports Pesados
```bash
# Imports que podem aumentar bundle
grep -rn "import \* as" src/ --include="*.tsx"
```

### Animações 60fps
Verificar uso de Reanimated (UI thread) vs Animated (JS thread):
```bash
grep -rn "from ['\"]react-native['\"]" src/ --include="*.tsx" | grep "Animated"
```

**Regra**: Usar `react-native-reanimated` para animações smooth.

## Métricas Target

| Métrica | Target | Como Medir |
|---------|--------|------------|
| TTI (Time to Interactive) | < 3s | Expo DevTools |
| FPS | 60fps | React DevTools |
| Bundle Size | < 50MB | `expo export` |
| Memory Usage | < 200MB | Xcode/Android Studio |

## Ferramentas

- **React DevTools**: Profiler de componentes
- **Flipper**: Debug avançado (se configurado)
- **Expo DevTools**: Métricas gerais
- **Xcode Instruments**: iOS profiling
- **Android Studio Profiler**: Android profiling

## Arquivos Críticos para Performance

- `src/screens/*Screen.tsx` - Telas principais
- `src/components/ui/` - Componentes reutilizáveis
- `src/state/store.ts` - Zustand selectors
