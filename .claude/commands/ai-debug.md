# AI Debug - NathIA

Debug da NathIA (Edge Function de AI) e respostas do assistente.

## Verificar Logs da Edge Function

```bash
supabase functions logs ai --project-ref <PROJECT_REF>
```

Ou em tempo real:
```bash
supabase functions logs ai --project-ref <PROJECT_REF> --follow
```

## Testar Edge Function Localmente

```bash
node test-ai-function.js
```

## Verificar Rate Limits

Consultar tabela de requests (se existir):
```sql
SELECT
  user_id,
  COUNT(*) as total_requests,
  MAX(created_at) as last_request
FROM ai_requests
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_id
ORDER BY total_requests DESC;
```

## Verificar API Keys

```bash
supabase secrets list --project-ref <PROJECT_REF>
```

Para definir/atualizar:
```bash
supabase secrets set OPENAI_API_KEY=<key> --project-ref <PROJECT_REF>
supabase secrets set ANTHROPIC_API_KEY=<key> --project-ref <PROJECT_REF>
```

## Erros Comuns

### 429 - Rate Limit Exceeded
- Verificar limite de requests por usuário
- Verificar quota da API (OpenAI/Anthropic)

### 500 - Internal Server Error
- Verificar logs: `supabase functions logs ai`
- Verificar se secrets estão configurados
- Verificar formato da request

### Timeout
- Edge Functions têm limite de 60s
- Verificar se prompt é muito longo
- Verificar se modelo está disponível

## Arquivos Relevantes

- `supabase/functions/ai/index.ts` - Edge Function principal
- `src/api/chat-service.ts` - Client-side service
- `src/config/nathia.ts` - Configuração da NathIA
- `src/screens/AssistantScreen.tsx` - UI do chat

## Fallback Chain

A NathIA usa fallback automático:
1. Claude (Anthropic) - Principal
2. Gemini (Google) - Fallback 1
3. GPT-4 (OpenAI) - Fallback 2
4. Grok (xAI) - Fallback 3

Se todos falharem, verificar conectividade e API keys.
