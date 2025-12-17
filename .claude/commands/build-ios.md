# Build iOS

Trigger iOS build com quality gate completo.

## Passos Automáticos

1. **Quality Gate**: Executar todas as validações
   ```bash
   bun run quality-gate
   ```

2. **Verificar Credenciais EAS**:
   ```bash
   npx eas credentials --platform ios
   ```

3. **Iniciar Build**:
   ```bash
   npx eas build --platform ios --profile preview
   ```

   Para produção:
   ```bash
   npx eas build --platform ios --profile production
   ```

4. **Monitorar Status**: Acompanhar build e reportar URL

## Pré-requisitos

- EAS CLI autenticado (`npx eas login`)
- Apple Developer account vinculado
- Provisioning profiles configurados
- `app.config.js` com bundleIdentifier correto

## Profiles Disponíveis

- `development`: Build de desenvolvimento com Expo Go
- `preview`: Build interno para testes (Ad-hoc)
- `production`: Build para App Store

## Troubleshooting

Se o build falhar:
1. Verificar logs: `npx eas build:list`
2. Verificar credenciais: `npx eas credentials`
3. Limpar cache: `npx expo prebuild --clean`
