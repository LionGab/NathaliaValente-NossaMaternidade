# OTA Update

Gerenciar atualizações Over-The-Air via Expo Updates.

## Criar Update

### Para Branch de Preview
```bash
npx eas update --branch preview --message "Descrição da atualização"
```

### Para Produção
```bash
npx eas update --branch production --message "Descrição da atualização"
```

## Listar Updates

```bash
npx eas update:list
```

Ver detalhes de um update específico:
```bash
npx eas update:view <UPDATE_ID>
```

## Rollback

Para reverter para versão anterior:
```bash
npx eas update:rollback --branch production
```

## Verificar Configuração

No `app.config.js`, verificar:
```javascript
updates: {
  enabled: true,
  url: "https://u.expo.dev/<PROJECT_ID>",
  fallbackToCacheTimeout: 0,
  checkAutomatically: "ON_LOAD",
}
```

## Branches de Update

- `preview`: Testadores internos
- `production`: Usuários finais

## Limitações

- Máximo 50MB por update
- Não pode mudar código nativo
- Não pode adicionar novas permissões
- Não pode mudar versão do SDK

## Boas Práticas

1. **Sempre testar em preview** antes de produção
2. **Mensagens descritivas** para rastrear mudanças
3. **Verificar bundle size** antes de publicar
4. **Manter rollback** preparado para emergências

## Verificar Bundle Size

```bash
npx expo export --dump-sourcemap
# Verificar tamanho dos arquivos em dist/
```

## Forçar Update no App

No código, para forçar verificação:
```typescript
import * as Updates from 'expo-updates';

await Updates.checkForUpdateAsync();
await Updates.fetchUpdateAsync();
await Updates.reloadAsync();
```
