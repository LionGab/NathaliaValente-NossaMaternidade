# Verificação Webhook RevenueCat - Nossa Maternidade

**Data**: 24/12/2025 05:43  
**Status**: ⚠️ Parcialmente Configurado

---

## ✅ Status Atual

### 1. Secret Configurado no Supabase

- ✅ **Secret**: `REVENUECAT_WEBHOOK_SECRET` existe
- ✅ **Valor**: Configurado (32+ caracteres hexadecimais)
- ✅ **Validação**: O código espera Bearer token no formato `Bearer <secret>`

### 2. Código do Webhook

- ✅ **Arquivo**: `supabase/functions/webhook/index.ts` existe
- ✅ **Endpoint**: `/revenuecat` implementado
- ✅ **Autenticação**: Validação Bearer token implementada
- ✅ **Idempotência**: Sistema de prevenção de duplicatas implementado
- ✅ **Eventos**: Suporta todos os eventos RevenueCat

### 3. Deploy

- ✅ **Status**: Webhook **DEPLOYADO** com sucesso
- ✅ **URL**: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
- ✅ **Dashboard**: https://supabase.com/dashboard/project/lqahkqfpynypbmhtffyi/functions

### 4. Configuração no RevenueCat Dashboard

- ⚠️ **Status**: Pendente (aguardando deploy)

---

## 📋 Configuração Necessária

### Passo 1: Deploy do Webhook

```bash
cd /Users/lion/Documents/Lion/NossaMaternidade
supabase functions deploy webhook --project-ref lqahkqfpynypbmhtffyi
```

**Ou deploy de todas as funções:**

```bash
supabase functions deploy --project-ref lqahkqfpynypbmhtffyi
```

---

### Passo 2: Configurar no RevenueCat Dashboard

1. **Acesse**: https://app.revenuecat.com
2. **Navegue**: Project Settings → Integrations → Webhooks
3. **Clique**: "+ Add Webhook"

**Preencher:**

```
Webhook name: Nossa Maternidade Webhook
Webhook URL: https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
Authorization header value: 925768eedee5c9fb740587618da37a816100f21f4ca4eb47df327d624fbc6525
Environment: Production + Sandbox
App: All apps
Event type: All events
```

**⚠️ IMPORTANTE**:

- O campo "Authorization header value" deve conter **APENAS o valor do secret** (sem "Bearer")
- O RevenueCat automaticamente adiciona o prefixo "Bearer" ao enviar

---

### Passo 3: Testar Webhook

1. No RevenueCat Dashboard, após salvar o webhook, clique em **"Test"**
2. Verifique logs no Supabase:
   - Dashboard → Logs → Edge Functions → webhook
   - Deve aparecer: `✅ [WEBHOOK] RevenueCat event: TEST`

---

## 🔍 Verificação do Código

### Autenticação Esperada

O código em `supabase/functions/webhook/index.ts` espera:

```typescript
Authorization: Bearer<REVENUECAT_WEBHOOK_SECRET>;
```

O RevenueCat envia automaticamente no formato:

```
Authorization: Bearer <valor_do_campo>
```

**✅ Compatível**: O código remove o prefixo "Bearer" antes de comparar.

---

### Endpoint Esperado

**URL Completa**:

```
https://lqahkqfpynypbmhtffyi.supabase.co/functions/v1/webhook/revenuecat
```

**Rota no código**: `/revenuecat` (linha 664)

**✅ Compatível**: A URL está correta.

---

## 📊 Eventos Suportados

O webhook processa os seguintes eventos RevenueCat:

- ✅ `INITIAL_PURCHASE` - Primeira compra
- ✅ `RENEWAL` - Renovação de assinatura
- ✅ `CANCELLATION` - Cancelamento
- ✅ `UNCANCELLATION` - Reativação
- ✅ `EXPIRATION` - Expiração
- ✅ `BILLING_ISSUE` - Problema de cobrança
- ✅ `PRODUCT_CHANGE` - Mudança de produto
- ✅ `SUBSCRIPTION_PAUSED` - Assinatura pausada

---

## 🚨 Problemas Conhecidos

### 1. Webhook Não Deployado

**Status**: ✅ **RESOLVIDO**  
**Solução**: ✅ Deploy executado com sucesso

### 2. Secret Não Configurado no RevenueCat

**Status**: ⚠️ Pendente  
**Solução**: Preencher campo "Authorization header value" com o secret

---

## ✅ Checklist Final

- [x] Webhook deployado (`supabase functions deploy webhook`) ✅ **CONCLUÍDO**
- [ ] Webhook configurado no RevenueCat Dashboard
- [ ] Authorization header value preenchido corretamente
- [ ] Teste enviado do RevenueCat
- [ ] Logs verificados no Supabase
- [ ] Evento de teste processado com sucesso

---

## 📝 Próximos Passos

1. **Deploy do webhook** (5 min)
2. **Configurar no RevenueCat Dashboard** (2 min)
3. **Testar webhook** (1 min)
4. **Verificar logs** (1 min)

**Tempo Total**: ~10 minutos

---

## 🔗 Referências

- **Código**: `supabase/functions/webhook/index.ts`
- **Documentação**: `docs/PREMIUM_IAP_SETUP.md`
- **RevenueCat Docs**: https://www.revenuecat.com/docs/webhooks
- **Supabase Functions**: https://supabase.com/docs/guides/functions
