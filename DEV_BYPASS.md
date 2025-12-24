# DEV BYPASS - TESTE RÁPIDO DAS TELAS

## Como ativar o bypass de login

1. Parar o servidor Expo (Ctrl+C)
2. Abrir arquivo: `src/navigation/RootNavigator.tsx`
3. Procurar linha ~83: `const shouldShowLogin = !isAuthenticated;`
4. Substituir por: `const shouldShowLogin = false; // DEV BYPASS`
5. Salvar arquivo
6. Reiniciar servidor: `npm start`
7. Recarregar app (R no terminal ou shake device)

## O que acontece

- ✅ Pula login automaticamente
- ✅ Pula onboarding
- ✅ Vai direto para MainTabs (5 telas principais)
- ⚠️ Alguns dados podem estar vazios (user=null)

## Para voltar ao normal

1. Reverter linha 83 para: `const shouldShowLogin = !isAuthenticated;`
2. Reiniciar servidor

## Warnings ignoráveis para teste

- ❌ Worklets mismatch → Não afeta UI básica
- ❌ Push notifications → Só funciona em Dev Build
- ❌ SafeAreaView → Falso positivo de dependência

## Alternativa: Setar manualmente no Async Storage

```javascript
// No console do navegador (F12), colar:
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.setItem('app-storage', JSON.stringify({
  state: {
    isAuthenticated: true,
    isOnboardingComplete: true,
    user: {
      id: 'test-user',
      name: 'Teste',
      email: 'teste@test.com'
    }
  }
}));
// Depois recarregar página
```
