# Build Android

Trigger Android build com quality gate completo.

## Passos Automáticos

1. **Quality Gate**: Executar todas as validações
   ```bash
   bun run quality-gate
   ```

2. **Verificar Keystore**:
   ```bash
   npx eas credentials --platform android
   ```

3. **Iniciar Build**:
   ```bash
   npx eas build --platform android --profile preview
   ```

   Para produção:
   ```bash
   npx eas build --platform android --profile production
   ```

4. **Monitorar Status**: Acompanhar build e reportar URL do APK/AAB

## Pré-requisitos

- EAS CLI autenticado (`npx eas login`)
- Keystore configurado (EAS gerencia automaticamente)
- `app.config.js` com package correto

## Profiles Disponíveis

- `development`: Build de desenvolvimento
- `preview`: APK para testes internos
- `production`: AAB para Google Play

## Output

- **Preview**: Gera APK instalável diretamente
- **Production**: Gera AAB para upload na Play Store

## Troubleshooting

Se o build falhar:
1. Verificar logs: `npx eas build:list`
2. Verificar keystore: `npx eas credentials --platform android`
3. Limpar cache: `npx expo prebuild --clean`
