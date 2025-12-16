# Como Transferir/Sincronizar Projeto do Windows para Mac

> 📁 **Pasta Compartilhada?** Se Windows e Mac estão na mesma pasta (rede compartilhada, Dropbox, etc.), veja `SYNC_PASTA_COMPARTILHADA.md` para guia específico.

## 🚀 Método 1: Git (Recomendado - Mais Seguro)

### No Windows (antes de sair):

```bash
# 1. Commitar todas as mudanças
git add .
git commit -m "refactor: otimizar Chat - extrair componentes e melhorar performance"

# 2. Push para o repositório remoto
git push origin main
# ou
git push origin sua-branch
```

### No Mac:

```bash
# 1. Clonar o repositório
git clone <URL_DO_SEU_REPOSITORIO>
cd NossaMaternidade

# 2. Instalar dependências
bun install
# ou
npm install

# 3. Configurar variáveis de ambiente (se necessário)
cp .env.template .env
# Edite o .env com suas credenciais

# 4. Iniciar o projeto
bun run start
# ou
bun run ios  # Para build iOS local
```

---

## 📦 Método 2: Transferência Manual (Sem Git)

### No Windows:

1. **Criar arquivo ZIP excluindo node_modules e caches:**

```powershell
# No PowerShell do Windows
Compress-Archive -Path . -DestinationPath ../NossaMaternidade.zip -Exclude node_modules,.expo,dist,build,*.log
```

Ou manualmente:

- Exclua: `node_modules/`, `.expo/`, `dist/`, `build/`, `*.log`
- Compacte o resto do projeto

2. **Transferir via:**
   - USB/HD externo
   - Cloud (Google Drive, Dropbox, iCloud)
   - AirDrop (se Mac e Windows na mesma rede)
   - SSH/SCP (se Mac acessível)

### No Mac:

```bash
# 1. Extrair o arquivo
unzip NossaMaternidade.zip
cd NossaMaternidade

# 2. Instalar dependências
bun install

# 3. Limpar cache
bun run clean

# 4. Iniciar
bun run start
```

---

## 🔄 Método 3: Sincronização Contínua (rsync/SSH)

Se você tem acesso SSH ao Mac:

```bash
# No Windows (com Git Bash ou WSL)
rsync -avz --exclude 'node_modules' --exclude '.expo' --exclude 'dist' \
  ./ user@mac-ip:/path/to/NossaMaternidade/
```

---

## ✅ Checklist Pós-Transferência (Mac)

### 1. Instalar Ferramentas Necessárias

```bash
# Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js e Bun
brew install node bun

# Xcode (para iOS)
xcode-select --install

# CocoaPods (para iOS)
sudo gem install cocoapods
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.template .env

# Editar com suas credenciais
nano .env
# ou
code .env
```

### 3. Instalar Dependências

```bash
# Instalar pacotes
bun install

# iOS: Instalar pods (se necessário)
cd ios && pod install && cd ..
```

### 4. Verificar Configuração

```bash
# TypeScript
bun run typecheck

# Lint
bun run lint

# Testar build iOS
bun run ios
```

---

## 🎯 Comandos Úteis no Mac

```bash
# Iniciar servidor Expo
bun run start

# Build iOS (local - requer Xcode)
bun run ios

# Build iOS (cloud - EAS)
bun run eas:build:ios

# Limpar cache
bun run clean

# Verificar se tudo está OK
bun run validate
```

---

## ⚠️ Arquivos Importantes para Transferir

✅ **Sempre transferir:**

- `src/` - Todo código fonte
- `package.json` - Dependências
- `tsconfig.json` - Config TypeScript
- `app.json` / `app.config.js` - Config Expo
- `eas.json` - Config EAS Build
- `.gitignore` - Ignorados do Git
- `scripts/` - Scripts do projeto
- `.env.template` - Template de variáveis

❌ **NÃO transferir (serão recriados):**

- `node_modules/` - Instalar com `bun install`
- `.expo/` - Cache do Expo
- `dist/` / `build/` - Builds
- `ios/` / `android/` - Serão gerados se necessário
- `*.log` - Logs

---

## 🔧 Solução de Problemas

### Erro: "Command not found: bun"

```bash
# Instalar Bun
curl -fsSL https://bun.sh/install | bash
```

### Erro: "Xcode must be fully installed"

```bash
# Instalar Xcode Command Line Tools
xcode-select --install

# Se já instalado, configurar path
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

### Erro: "CocoaPods not found"

```bash
sudo gem install cocoapods
cd ios && pod install && cd ..
```

### Erro: "Permission denied"

```bash
# Dar permissão de execução aos scripts
chmod +x scripts/*.sh
```

---

## 📝 Notas Importantes

1. **Git é a melhor opção** - Mantém histórico, permite rollback, facilita colaboração
2. **Variáveis de ambiente** - Não commitar `.env`, apenas `.env.template`
3. **Secrets** - Nunca commitar chaves API, tokens, senhas
4. **Cache** - Sempre limpar cache após transferência (`bun run clean`)
5. **Dependências nativas** - iOS pode precisar de `pod install` após transferência

---

## 🚀 Próximos Passos Após Transferência

1. ✅ Verificar se tudo funciona: `bun run validate`
2. ✅ Testar no iOS Simulator: `bun run ios`
3. ✅ Configurar EAS Build (se necessário): `npx eas build:configure`
4. ✅ Continuar desenvolvimento normalmente
