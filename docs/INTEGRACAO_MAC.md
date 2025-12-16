# 🍎 Integração Mac ao Workspace - Guia Rápido

## 🎯 Escolha o Método

### Opção 1: Git (Recomendado) ⭐

Use se você tem repositório Git configurado.

### Opção 2: Pasta Compartilhada

Use se Windows e Mac acessam a mesma pasta (Dropbox, OneDrive, rede).

### Opção 3: Transferência Manual

Use se não tem Git nem pasta compartilhada.

---

## 🚀 Opção 1: Git (Recomendado)

### No Windows (antes de sair):

```bash
# 1. Commitar mudanças
git add .
git commit -m "chore: preparar para integração Mac"

# 2. Push para remoto
git push origin main
```

### No Mac:

```bash
# 1. Clonar repositório
git clone <URL_DO_REPOSITORIO>
cd NossaMaternidade

# 2. Setup automático
bun run setup-dev

# 3. Configurar variáveis de ambiente
cp env.template .env
# Edite .env com suas credenciais

# 4. Iniciar
bun run start
# ou para iOS
bun run ios
```

---

## 📁 Opção 2: Pasta Compartilhada

Se Windows e Mac estão na mesma pasta (Dropbox, OneDrive, etc.):

### No Mac (primeira vez):

```bash
# 1. Navegar para pasta compartilhada
cd /caminho/para/pasta/compartilhada/NossaMaternidade

# 2. Remover node_modules (binários podem ser incompatíveis)
rm -rf node_modules

# 3. Instalar dependências
bun install

# 4. Limpar cache
bun run clean

# 5. Configurar variáveis
cp env.template .env
# Edite .env

# 6. Iniciar
bun run ios
```

### Ao trocar de máquina:

**Do Windows para Mac:**

```bash
# No Mac
cd /caminho/compartilhado/NossaMaternidade
bun run clean
bun run ios
```

**Do Mac para Windows:**

```bash
# No Windows
cd C:\caminho\compartilhado\NossaMaternidade
bun run clean
bun run start
```

⚠️ **Importante:** Sempre limpe cache ao trocar de máquina (`bun run clean`)

---

## 📦 Opção 3: Transferência Manual

### No Windows:

```powershell
# Criar ZIP excluindo node_modules e caches
Compress-Archive -Path . -DestinationPath ../NossaMaternidade.zip -Exclude node_modules,.expo,dist,build,*.log
```

Ou manualmente:

- Exclua: `node_modules/`, `.expo/`, `dist/`, `build/`, `*.log`
- Compacte o resto

### Transferir via:

- USB/HD externo
- Cloud (Google Drive, Dropbox, iCloud)
- AirDrop (se na mesma rede)

### No Mac:

```bash
# 1. Extrair
unzip NossaMaternidade.zip
cd NossaMaternidade

# 2. Setup
bun run setup-dev

# 3. Configurar .env
cp env.template .env
# Edite .env

# 4. Iniciar
bun run ios
```

---

## ✅ Checklist Pós-Integração (Mac)

### 1. Instalar Ferramentas (se necessário)

```bash
# Homebrew (se não tiver)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js e Bun
brew install node bun

# Xcode Command Line Tools (para iOS)
xcode-select --install

# CocoaPods (para iOS)
sudo gem install cocoapods
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp env.template .env

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

### 5. Configurar Workspace do Cursor ⭐

**IMPORTANTE:** O workspace do Cursor já está configurado no projeto. Você só precisa abrir a pasta no Cursor.

#### Abrir Workspace no Cursor

```bash
# Opção 1: Via terminal (após configurar CLI)
cd NossaMaternidade
cursor .

# Opção 2: Via interface do Cursor
# File > Open Folder... > Selecione a pasta NossaMaternidade
```

#### Verificar Configurações do Workspace

O projeto já inclui:

- ✅ **`.vscode/settings.json`** - Configurações otimizadas para MacBook M1 8GB RAM
  - TypeScript Server: 4GB de memória
  - File Watcher: Exclui node_modules, .expo, dist, build
  - Editor: Minimap desabilitado, smooth scrolling off
  - HTTP/2 desabilitado (melhor para VPN/Proxy)

- ✅ **`.cursorrules`** - Regras do projeto
  - TypeScript strict mode
  - Padrões de código
  - Design System
  - Otimizações para M1 8GB RAM

#### Configurar CLI do Cursor (Opcional)

```bash
# Configurar CLI do Cursor
bash scripts/setup-cursor-cli.sh

# Ou manualmente
echo 'export PATH="$PATH:/Applications/Cursor.app/Contents/Resources/app/bin"' >> ~/.zshrc
source ~/.zshrc

# Verificar
cursor --version
```

#### Verificar se Workspace Está Configurado

```bash
# Verificar arquivos de configuração
ls -la .vscode/settings.json .cursorrules

# Executar script de verificação
bash scripts/check-cursor-config.sh
```

**Nota:** As configurações do workspace são aplicadas automaticamente quando você abre a pasta no Cursor. Não é necessário configurar nada manualmente - apenas abra a pasta!

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

# Quality gate (antes de PRs)
bun run quality-gate
```

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

### Erro: "Permission denied" (scripts)

```bash
# Dar permissão de execução aos scripts
chmod +x scripts/*.sh
```

### Problemas de Line Endings (CRLF vs LF)

```bash
# Configurar Git para gerenciar automaticamente
git config core.autocrlf input
```

---

## 📝 Arquivos Importantes

✅ **Sempre transferir:**

- `src/` - Todo código fonte
- `package.json` - Dependências
- `tsconfig.json` - Config TypeScript
- `app.json` / `app.config.js` - Config Expo
- `eas.json` - Config EAS Build
- `.gitignore` - Ignorados do Git
- `scripts/` - Scripts do projeto
- `env.template` - Template de variáveis

❌ **NÃO transferir (serão recriados):**

- `node_modules/` - Instalar com `bun install`
- `.expo/` - Cache do Expo
- `dist/` / `build/` - Builds
- `ios/` / `android/` - Serão gerados se necessário
- `*.log` - Logs
- `.env` - Criar a partir do template

---

## 🚀 Próximos Passos

1. ✅ Verificar se tudo funciona: `bun run validate`
2. ✅ Testar no iOS Simulator: `bun run ios`
3. ✅ Configurar EAS Build (se necessário): `npx eas build:configure`
4. ✅ Continuar desenvolvimento normalmente

---

## 💡 Dicas

1. **Sempre limpe cache** ao trocar de máquina (`bun run clean`)
2. **Reinstale dependências** se houver problemas (`bun install`)
3. **Use Git** para backup mesmo com pasta compartilhada
4. **Evite editar simultaneamente** - pode causar conflitos
5. **Configure Cursor** para melhor experiência no Mac (veja `docs/CURSOR_MACBOOK_M1_SETUP.md`)

---

## 🎯 Configuração do Workspace do Cursor

### O que já está configurado?

O projeto já inclui todas as configurações do workspace:

1. **`.vscode/settings.json`** - Configurações do editor
   - Otimizações para MacBook M1 8GB RAM
   - TypeScript Server com 4GB de memória
   - File Watcher otimizado
   - Format on Save, Auto Fix

2. **`.cursorrules`** - Regras do projeto
   - TypeScript strict mode
   - Padrões de código
   - Design System
   - Otimizações para M1

### Como usar no Mac?

**Simplesmente abra a pasta no Cursor:**

```bash
# Via terminal (após configurar CLI)
cd NossaMaternidade
cursor .

# Ou via interface
# File > Open Folder... > NossaMaternidade
```

As configurações são aplicadas automaticamente! ✅

### Verificar Configurações

```bash
# Verificar arquivos
ls -la .vscode/settings.json .cursorrules

# Verificar configurações aplicadas
bash scripts/check-cursor-config.sh
```

### Sincronizar Configurações

Se você trabalha em Windows e Mac:

- ✅ **`.vscode/settings.json`** - Já está no Git, sincroniza automaticamente
- ✅ **`.cursorrules`** - Já está no Git, sincroniza automaticamente
- ⚠️ **Extensões** - Instale manualmente no Mac (ou use Settings Sync do Cursor)

### Extensões Recomendadas

As extensões são pessoais, mas recomendadas:

- ESLint
- Prettier
- TypeScript (built-in)
- React Native Tools
- Expo Tools

Para sincronizar extensões entre máquinas, use **Settings Sync** do Cursor (Cmd + Shift + P → "Settings Sync: Turn On").

---

## 📚 Documentação Relacionada

- [`SYNC_WINDOWS_TO_MAC.md`](./SYNC_WINDOWS_TO_MAC.md) - Guia detalhado de transferência
- [`SYNC_PASTA_COMPARTILHADA.md`](./SYNC_PASTA_COMPARTILHADA.md) - Sincronização contínua
- [`CURSOR_MACBOOK_M1_SETUP.md`](./CURSOR_MACBOOK_M1_SETUP.md) - Configuração do Cursor no Mac
- [`CURSOR_MEMORY_OPTIMIZATION.md`](./CURSOR_MEMORY_OPTIMIZATION.md) - Otimizações de memória
- [`SECRETS_SETUP.md`](./SECRETS_SETUP.md) - Configuração de secrets e variáveis de ambiente
