# 🚀 SETUP RÁPIDO PARA TESTAR TODAS AS TELAS

## ⚠️ PROBLEMA ATUAL

Você está vendo erros ao tentar testar o app:
- ❌ **Worklets mismatch** (0.7.1 vs 0.5.1) - Expo Go tem versão antiga
- ❌ **Login travado** - Não consegue passar da tela de login
- ⚠️ **Push notifications warning** - Normal no Expo Go SDK 53+

## ✅ SOLUÇÃO RÁPIDA (5 minutos)

### OPÇÃO A: Bypass de Login Manual (RECOMENDADO)

**1. Abrir arquivo:**
```
src/navigation/RootNavigator.tsx
```

**2. Adicionar import no topo (após as outras importações, linha ~16):**
```typescript
import { isDevBypassActive, DEV_CONFIG } from "../config/dev-bypass";
```

**3. Modificar linha ~83 (procurar `const shouldShowLogin`):**

**ANTES:**
```typescript
const shouldShowLogin = !isAuthenticated;
```

**DEPOIS:**
```typescript
const shouldShowLogin = isDevBypassActive() ? false : !isAuthenticated;
```

**4. Modificar linhas ~84-90 (adicionar bypass em cada condição):**

**ANTES:**
```typescript
const shouldShowNotificationPermission = isAuthenticated && !notificationSetupDone;
const shouldShowOnboarding =
  isAuthenticated && notificationSetupDone && !isOnboardingComplete;
const shouldShowNathIAOnboarding =
  isAuthenticated && notificationSetupDone && isOnboardingComplete && !isNathIAOnboardingComplete;
const shouldShowMainApp =
  isAuthenticated && notificationSetupDone && isOnboardingComplete && isNathIAOnboardingComplete;
```

**DEPOIS:**
```typescript
const shouldShowNotificationPermission = isDevBypassActive()
  ? false
  : (isAuthenticated && !notificationSetupDone);

const shouldShowOnboarding = isDevBypassActive()
  ? false
  : (isAuthenticated && notificationSetupDone && !isOnboardingComplete);

const shouldShowNathIAOnboarding = isDevBypassActive()
  ? false
  : (isAuthenticated && notificationSetupDone && isOnboardingComplete && !isNathIAOnboardingComplete);

const shouldShowMainApp = isDevBypassActive()
  ? true
  : (isAuthenticated && notificationSetupDone && isOnboardingComplete && isNathIAOnboardingComplete);
```

**5. Salvar arquivo**

**6. Reiniciar servidor Expo:**
```bash
# Parar servidor (Ctrl+C se estiver rodando)
npm start
# Ou com cache limpo
npm start -- --clear
```

**7. Recarregar app no navegador:**
- Apertar **R** no terminal Expo
- Ou **Ctrl+R** no navegador
- Ou **Shake device** + "Reload"

---

### OPÇÃO B: Edição Direta no AsyncStorage (Navegador Web)

Se estiver testando no navegador (http://localhost:8081):

**1. Abrir DevTools (F12)**

**2. Ir para Console**

**3. Colar e executar:**
```javascript
localStorage.setItem('app-storage', JSON.stringify({
  state: {
    isAuthenticated: true,
    isOnboardingComplete: true,
    user: {
      id: 'dev-test-001',
      name: 'Teste Dev',
      email: 'teste@test.com',
      pregnancyStage: 'pregnant',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      interests: ['exercise', 'nutrition'],
      createdAt: new Date().toISOString()
    }
  },
  version: 0
}));

localStorage.setItem('nathia-onboarding-storage', JSON.stringify({
  state: {
    isComplete: true,
    currentStep: 5
  },
  version: 0
}));

// Recarregar página
window.location.reload();
```

**4. Página recarrega e vai direto para MainTabs!**

---

## 🎯 O QUE VOCÊ VERÁ

Após aplicar qualquer uma das opções:

### ✅ **5 TELAS PRINCIPAIS (Bottom Tabs)**

1. **🏠 HOME** - Dashboard com resumo
2. **📅 CICLO** - Calendário menstrual
3. **🤖 NATHIA** - Chat com IA
4. **👥 COMUNIDADE** - Feed de posts
5. **💝 MEUS CUIDADOS** - Hábitos e check-ins

### ✅ **MODAIS DISPONÍVEIS**

- Daily Log (sintomas/humor)
- Nova Publicação
- Detalhes do Post
- Afirmações
- Perfil/Settings
- Respiração Guiada
- Sons Relaxantes
- Progresso "Mãe Valente"

---

## ⚠️ IGNORAR ESTES WARNINGS (São Normais)

```
❌ WorkletsError: Mismatch (0.7.1 vs 0.5.1)
   → Normal no Expo Go - não afeta UI básica
   → Só resolve com Development Build

❌ SafeAreaView deprecated
   → Falso positivo - código já usa biblioteca correta
   → Ignore

❌ expo-notifications not supported in Expo Go
   → Normal no SDK 53+ - push só funciona em Dev Build
   → Ignore para teste
```

---

## 🔄 VOLTAR AO NORMAL (Desabilitar Bypass)

### Se usou OPÇÃO A (código):

**1. Editar:** `src/config/dev-bypass.ts`

**2. Mudar linha 19:**
```typescript
ENABLE_DEV_BYPASS: false,  // Mudou de true para false
```

**3. Salvar e reiniciar**

### Se usou OPÇÃO B (localStorage):

**1. Console do navegador (F12):**
```javascript
localStorage.clear();
window.location.reload();
```

---

## 🧪 CHECKLIST DE TESTE

Após bypass ativo:

- [ ] **Home** - Ver resumo, afirmação do dia
- [ ] **Ciclo** - Adicionar período menstrual
- [ ] **Ciclo** - Daily Log (sintomas)
- [ ] **NathIA** - Enviar mensagem (⚠️ pode falhar se secrets não configurados)
- [ ] **Comunidade** - Ver posts (mock data)
- [ ] **Comunidade** - Criar novo post
- [ ] **Meus Cuidados** - Daily check-in
- [ ] **Meus Cuidados** - Marcar hábitos
- [ ] Navegar entre tabs
- [ ] Abrir modais
- [ ] Settings → Ver perfil

---

## 💡 DICAS

- **NathIA pode não responder:** Precisa configurar secrets no Supabase (ver STORE_READY_CHECKLIST.md Fase 1)
- **Alguns dados vazios:** Normal sem login real - use mock data
- **Performance:** Web é mais lento que app nativo
- **Hot reload:** Funciona! Edite código e veja mudanças instantâneas

---

## 🆘 SE NADA FUNCIONAR

**Plan B - Limpar TUDO e recomeçar:**

```bash
# 1. Parar servidor (Ctrl+C)

# 2. Limpar caches
npm run clean
rm -rf node_modules
npm install

# 3. Reiniciar
npm start -- --clear

# 4. No navegador (F12 → Application → Local Storage → Clear All)

# 5. Aplicar bypass novamente (Opção A ou B acima)
```

---

**Arquivo criado em:** `QUICK_TEST_SETUP.md`
**Para dúvidas:** Ver também `DEV_BYPASS.md`
