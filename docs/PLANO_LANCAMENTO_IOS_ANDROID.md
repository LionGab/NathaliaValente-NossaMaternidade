# Plano Estratégico de Lançamento - Nossa Maternidade

**Data:** 2025-12-25
**Status Atual:** 75% Pronto
**Meta:** App Store + Google Play em 7-10 dias

---

## Resumo Executivo

O app Nossa Maternidade possui fundação técnica sólida (SDK 54, React Native 0.81.5, Expo). Os bloqueadores são **documentação legal** e **assets de marketing**. Com execução focada, o lançamento é viável em 7-10 dias.

---

## FASE 1: Preparação Imediata (Dias 1-2)

### 1.1 Documentação Legal (BLOQUEADOR CRÍTICO)

**Sem isso, Apple e Google rejeitam automaticamente.**

| Documento | URL Final | Responsável | Prazo |
|-----------|-----------|-------------|-------|
| Política de Privacidade | nossamaternidade.com.br/privacidade | Nathalia/Advogado | D+1 |
| Termos de Uso | nossamaternidade.com.br/termos | Nathalia/Advogado | D+1 |
| Aviso sobre IA | nossamaternidade.com.br/ai-disclaimer | Nathalia | D+1 |
| Aviso Médico | nossamaternidade.com.br/aviso-medico | Nathalia | D+1 |

**Template sugerido para Aviso Médico:**
```
Este aplicativo não substitui consulta médica profissional.
As informações fornecidas pela NathIA são de caráter educativo.
Em caso de emergência, procure atendimento médico imediato.
```

**Ação:** Publicar no site Vercel/Netlify antes de submeter.

---

### 1.2 Contas de Desenvolvedor

| Plataforma | Status | Custo | Ação |
|------------|--------|-------|------|
| Apple Developer | ✅ Ativa | $99/ano | Verificar certificados |
| Google Play Console | ✅ Ativa | $25 único | Verificar conta |
| RevenueCat | ✅ Configurado | Free tier | Configurar dashboard |
| EAS (Expo) | ✅ Configurado | Free tier | Verificar projeto |

**Verificar:**
```bash
eas whoami
eas project:info
```

---

### 1.3 Configuração RevenueCat Dashboard

**Status:** Código pronto, dashboard pendente.

**Ações no RevenueCat (app.revenuecat.com):**

1. **Criar Entitlement:**
   - Identifier: `premium` (exatamente)
   - Description: "Acesso premium completo"

2. **Criar Offering:**
   - Identifier: `default` (exatamente)
   - Marcar como "Current"

3. **Adicionar Packages:**
   - `$rc_monthly` → `com.nossamaternidade.subscription.monthly`
   - `$rc_annual` → `com.nossamaternidade.subscription.annual`

4. **Vincular Products (após criar nas stores):**
   - iOS: Vincular via App Store Connect
   - Android: Vincular via Google Play Console

---

## FASE 2: Assets de Marketing (Dias 2-4)

### 2.1 Screenshots iOS (OBRIGATÓRIO)

**Tamanhos obrigatórios:**

| Dispositivo | Resolução | Quantidade |
|-------------|-----------|------------|
| iPhone 6.9" (15 Pro Max) | 1320 x 2868 | 4-8 |
| iPhone 6.7" (14 Pro Max) | 1290 x 2796 | 4-8 |
| iPhone 6.5" (11 Pro Max) | 1242 x 2688 | 4-8 |
| iPad Pro 13" | 2048 x 2732 | 4-8 |

**Telas sugeridas para screenshot:**
1. **Onboarding** - "Sua jornada começa aqui"
2. **NathIA Chat** - "Sua assistente 24/7"
3. **Ciclo** - "Acompanhe seu ciclo"
4. **Check-in Diário** - "Como você está hoje?"
5. **Comunidade** - "Conecte-se com outras mães"
6. **Premium** - "Desbloqueie recursos exclusivos"

**Ferramenta recomendada:** Figma + Screenshots.Pro ou App Mockup

---

### 2.2 Screenshots Android (OBRIGATÓRIO)

| Tipo | Resolução | Quantidade |
|------|-----------|------------|
| Phone | 1080 x 1920 | 4-8 |
| 7" Tablet | 1200 x 1920 | 2-4 |
| 10" Tablet | 1920 x 1200 | 2-4 |
| Feature Graphic | 1024 x 500 | 1 |

---

### 2.3 Ícones e Assets (JÁ PRONTOS ✅)

| Asset | Localização | Status |
|-------|-------------|--------|
| App Icon 1024x1024 | assets/icon.png | ✅ |
| Adaptive Icon | assets/adaptive-icon.png | ✅ |
| Splash Screen | assets/splash.png | ✅ |
| Notification Icon | assets/notification-icon.png | ✅ |

---

## FASE 3: Configuração nas Stores (Dias 3-5)

### 3.1 App Store Connect (iOS)

**URL:** appstoreconnect.apple.com

**Checklist:**

1. **Informações do App:**
   - [ ] Nome: Nossa Maternidade
   - [ ] Subtítulo: Sua companheira na maternidade
   - [ ] Categoria Principal: Saúde e Fitness
   - [ ] Categoria Secundária: Estilo de Vida
   - [ ] Classificação Etária: 12+ (conteúdo médico)

2. **Metadados:**
   - [ ] Descrição (4000 caracteres max)
   - [ ] Keywords (100 caracteres max)
   - [ ] URL de Suporte
   - [ ] URL de Privacidade
   - [ ] Copyright: © 2025 Nossa Maternidade

3. **Subscriptions (In-App Purchases):**
   - [ ] Criar Subscription Group: "Nossa Maternidade Premium"
   - [ ] Produto Mensal: `com.nossamaternidade.subscription.monthly` - R$ 19,90
   - [ ] Produto Anual: `com.nossamaternidade.subscription.annual` - R$ 79,90
   - [ ] Free Trial: 7 dias em ambos

4. **App Privacy:**
   - [ ] Dados coletados: Email, Nome, Dados de Saúde
   - [ ] Propósito: Funcionalidade do App
   - [ ] Não vendemos dados a terceiros

---

### 3.2 Google Play Console (Android)

**URL:** play.google.com/console

**Checklist:**

1. **Configuração do App:**
   - [ ] Nome: Nossa Maternidade
   - [ ] Descrição curta (80 caracteres)
   - [ ] Descrição completa (4000 caracteres)
   - [ ] Categoria: Saúde e Fitness
   - [ ] Tags: gravidez, maternidade, saúde feminina

2. **Classificação de Conteúdo (IARC):**
   - [ ] Preencher questionário
   - [ ] Resultado esperado: LIVRE ou 12+

3. **Data Safety Form:**
   - [ ] Dados coletados: Email, Nome, Dados de Saúde
   - [ ] Dados compartilhados: Nenhum
   - [ ] Práticas de segurança: Criptografia em trânsito

4. **Subscriptions:**
   - [ ] Base Plan Mensal: R$ 19,90
   - [ ] Base Plan Anual: R$ 79,90
   - [ ] Free Trial: 7 dias

5. **Testers:**
   - [ ] Adicionar 5+ emails para Internal Testing

---

## FASE 4: Build e Testes (Dias 5-7)

### 4.1 Quality Gate (OBRIGATÓRIO)

```bash
# Rodar antes de qualquer build
npm run quality-gate

# Resultado esperado:
# ✅ TypeScript check passed
# ✅ ESLint check passed
# ✅ Build readiness check passed
# ✅ No console.log found
```

---

### 4.2 Build de Produção

```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android

# Ambos simultaneamente
eas build --profile production --platform all
```

**Tempo estimado:** 20-40 minutos por plataforma

---

### 4.3 TestFlight (iOS Beta)

1. Upload do build:
```bash
eas submit --profile production --platform ios
```

2. App Store Connect:
   - [ ] Build aparece em "TestFlight"
   - [ ] Adicionar informações de teste
   - [ ] Adicionar testers externos (5+ pessoas)
   - [ ] Aguardar aprovação (24-48h para primeiro build)

3. Testar:
   - [ ] Login social (Google, Apple, Facebook)
   - [ ] Chat com NathIA
   - [ ] Compra de assinatura (Sandbox)
   - [ ] Restaurar compras
   - [ ] Push notifications

---

### 4.4 Internal Testing (Android Beta)

1. Upload do build:
```bash
eas submit --profile production --platform android
```

2. Google Play Console:
   - [ ] Build aparece em "Internal Testing"
   - [ ] Criar release
   - [ ] Adicionar testers (5+ emails)
   - [ ] Publicar para Internal Testing

3. Testar (mesmos itens do iOS)

---

## FASE 5: Submissão Final (Dias 7-10)

### 5.1 Checklist Pré-Submissão

**Técnico:**
- [ ] Quality gate passando 100%
- [ ] Build de produção gerado
- [ ] Testado no TestFlight (iOS)
- [ ] Testado no Internal Testing (Android)
- [ ] RevenueCat configurado e testado

**Legal:**
- [ ] Política de Privacidade publicada e acessível
- [ ] Termos de Uso publicados e acessíveis
- [ ] Aviso sobre IA publicado
- [ ] Aviso Médico visível no app

**Marketing:**
- [ ] Screenshots de todas as resoluções
- [ ] Descrição do app otimizada para ASO
- [ ] Keywords definidas
- [ ] Feature graphic (Android)

---

### 5.2 Submissão iOS

```bash
eas submit --profile production --platform ios --latest
```

**Ou via App Store Connect:**
1. Selecionar build do TestFlight
2. "Add for Review"
3. Preencher informações de review
4. Submeter

**Tempo de review:** 24h - 7 dias (média: 2-3 dias)

---

### 5.3 Submissão Android

```bash
eas submit --profile production --platform android --latest
```

**Ou via Google Play Console:**
1. Production → Create new release
2. Selecionar bundle do Internal Testing
3. Adicionar release notes
4. Review and rollout to Production

**Tempo de review:** 1-7 dias (média: 1-3 dias)

---

## FASE 6: Pós-Lançamento (Dia 10+)

### 6.1 Monitoramento

| Métrica | Ferramenta | Meta |
|---------|------------|------|
| Crash Rate | Sentry | < 1% |
| ANR Rate (Android) | Play Console | < 0.5% |
| Rating | Stores | > 4.5 estrelas |
| Retention D1 | Analytics | > 40% |
| Retention D7 | Analytics | > 20% |

---

### 6.2 Resposta a Reviews

- **Meta:** Responder em < 24h
- **Negativas:** Agradecer, pedir detalhes, oferecer suporte
- **Positivas:** Agradecer, pedir compartilhamento

---

### 6.3 Iterações Rápidas

**Prioridades pós-launch:**
1. Bugs críticos reportados
2. Melhorias de UX baseadas em feedback
3. Novas features do roadmap

---

## Cronograma Visual

```
Semana 1:
┌─────────────────────────────────────────────────────────┐
│ D1-D2: Docs legais + RevenueCat dashboard               │
│ D2-D4: Screenshots + Assets marketing                   │
│ D3-D5: Configurar App Store Connect + Play Console      │
│ D5-D7: Builds + TestFlight + Internal Testing           │
└─────────────────────────────────────────────────────────┘

Semana 2:
┌─────────────────────────────────────────────────────────┐
│ D7-D8: Testes finais + Correções                        │
│ D8-D9: Submissão iOS + Android                          │
│ D9-D10: Aguardar review (continuar testes)              │
│ D10+: LAUNCH! 🚀 + Monitoramento                        │
└─────────────────────────────────────────────────────────┘
```

---

## Comandos Essenciais

```bash
# Verificar ambiente
npm run check-env
npm run quality-gate

# Build
eas build --profile production --platform all

# Submit
eas submit --profile production --platform ios --latest
eas submit --profile production --platform android --latest

# Logs de produção
eas build:list
eas submit:list
```

---

## Contatos de Emergência

| Problema | Solução |
|----------|---------|
| Build falhando | Verificar logs: `eas build:view` |
| Rejeição Apple | Ler feedback, corrigir, resubmeter |
| Rejeição Google | Ler Policy Center, corrigir, resubmeter |
| RevenueCat não funciona | Verificar API keys no .env.local |
| Crash em produção | Sentry dashboard |

---

## Métricas de Sucesso (30 dias)

| Métrica | Meta Conservadora | Meta Otimista |
|---------|-------------------|---------------|
| Downloads | 1.000 | 5.000 |
| DAU | 200 | 1.000 |
| Conversão Premium | 2% | 5% |
| Rating | 4.0+ | 4.5+ |
| Crash-free | 98% | 99.5% |

---

**Autor:** Claude Code
**Última atualização:** 2025-12-25
**Versão do App:** 1.0.0
