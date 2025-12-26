# Sincronização de Ambientes - MacBook ↔ Windows PC

**Objetivo**: Manter configurações idênticas do Cursor/Claude Code entre dois computadores de desenvolvimento.

---

## 📍 Localizações de Configurações

### Configurações do Projeto (✅ Já sincronizadas via Git)

Estas configurações **já estão no repositório** e são sincronizadas automaticamente:

```
NossaMaternidade/
├── .vscode/
│   ├── settings.json          # Configurações do editor
│   ├── extensions.json        # Extensões recomendadas
│   └── launch.json            # Configurações de debug
├── .claude/
│   ├── mcp-config.json        # Servidores MCP
│   ├── settings.local.json    # Permissões do Claude Code
│   ├── agents/                # Agents customizados
│   ├── commands/              # Slash commands
│   └── hooks/                 # Git hooks
├── .cursorrules               # Regras do Cursor para IA
├── .cursorignore              # Arquivos ignorados pelo Cursor
├── CLAUDE.md                  # Instruções para Claude Code
└── tailwind.config.js         # Config do Tailwind/NativeWind
```

**✅ Ação necessária**: Apenas `git pull` no outro computador.

---

### Configurações Globais do Cursor (⚠️ Requerem sincronização manual)

Estas configurações são **específicas do usuário** e **não** estão no Git:

#### macOS
```
~/Library/Application Support/Cursor/User/
├── settings.json              # Configurações globais do Cursor
├── keybindings.json           # Atalhos de teclado
├── snippets/                  # Snippets customizados
└── globalStorage/             # Estado de extensões
```

#### Windows
```
%APPDATA%\Cursor\User\
├── settings.json              # Configurações globais do Cursor
├── keybindings.json           # Atalhos de teclado
├── snippets/                  # Snippets customizados
└── globalStorage/             # Estado de extensões
```

**⚠️ Ação necessária**: Exportar e sincronizar manualmente (veja scripts abaixo).

---

### Configurações do Claude Code (⚠️ Requerem sincronização manual)

#### macOS
```
~/.config/claude-code/
├── config.json                # Configurações globais do Claude
├── mcp-settings.json          # MCPs habilitados globalmente
└── .env                       # API keys (NUNCA sincronizar)
```

#### Windows
```
%USERPROFILE%\.config\claude-code\
├── config.json                # Configurações globais do Claude
├── mcp-settings.json          # MCPs habilitados globalmente
└── .env                       # API keys (NUNCA sincronizar)
```

**⚠️ Ação necessária**: Exportar e sincronizar manualmente (veja scripts abaixo).

---

## 🔧 Scripts de Sincronização

### 1. Script de Exportação (macOS)

**Localização**: `scripts/export-cursor-settings.sh`

```bash
#!/bin/bash
# Exporta configurações do Cursor/Claude Code do macOS

EXPORT_DIR="./cursor-settings-export"
mkdir -p "$EXPORT_DIR"

echo "📦 Exportando configurações do Cursor (macOS)..."

# 1. Configurações globais do Cursor
cp ~/Library/Application\ Support/Cursor/User/settings.json "$EXPORT_DIR/cursor-global-settings.json"
cp ~/Library/Application\ Support/Cursor/User/keybindings.json "$EXPORT_DIR/cursor-keybindings.json"

# 2. Snippets do Cursor
if [ -d ~/Library/Application\ Support/Cursor/User/snippets ]; then
  cp -r ~/Library/Application\ Support/Cursor/User/snippets "$EXPORT_DIR/"
fi

# 3. Lista de extensões instaladas
code --list-extensions > "$EXPORT_DIR/cursor-extensions.txt"

# 4. Configurações do Claude Code (sem .env)
if [ -d ~/.config/claude-code ]; then
  mkdir -p "$EXPORT_DIR/claude-code"
  [ -f ~/.config/claude-code/config.json ] && cp ~/.config/claude-code/config.json "$EXPORT_DIR/claude-code/"
  [ -f ~/.config/claude-code/mcp-settings.json ] && cp ~/.config/claude-code/mcp-settings.json "$EXPORT_DIR/claude-code/"
fi

# 5. Criar arquivo de metadados
cat > "$EXPORT_DIR/metadata.json" <<EOF
{
  "exportDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "platform": "macOS",
  "hostname": "$(hostname)",
  "cursorVersion": "$(code --version | head -n 1)",
  "projectPath": "$(pwd)"
}
EOF

echo "✅ Exportação concluída: $EXPORT_DIR/"
echo "📤 Transfira esta pasta para o Windows e execute import-cursor-settings.ps1"
```

---

### 2. Script de Importação (Windows PowerShell)

**Localização**: `scripts/import-cursor-settings.ps1`

```powershell
# Importa configurações do Cursor/Claude Code no Windows

param(
    [string]$ImportDir = ".\cursor-settings-export"
)

Write-Host "📥 Importando configurações do Cursor (Windows)..." -ForegroundColor Cyan

# 1. Configurações globais do Cursor
$CursorUserDir = "$env:APPDATA\Cursor\User"
if (-Not (Test-Path $CursorUserDir)) {
    New-Item -ItemType Directory -Path $CursorUserDir -Force
}

Copy-Item "$ImportDir\cursor-global-settings.json" "$CursorUserDir\settings.json" -Force
Copy-Item "$ImportDir\cursor-keybindings.json" "$CursorUserDir\keybindings.json" -Force

# 2. Snippets do Cursor
if (Test-Path "$ImportDir\snippets") {
    Copy-Item "$ImportDir\snippets" "$CursorUserDir\" -Recurse -Force
}

# 3. Instalar extensões
if (Test-Path "$ImportDir\cursor-extensions.txt") {
    Write-Host "📦 Instalando extensões..." -ForegroundColor Yellow
    Get-Content "$ImportDir\cursor-extensions.txt" | ForEach-Object {
        code --install-extension $_
    }
}

# 4. Configurações do Claude Code
$ClaudeCodeDir = "$env:USERPROFILE\.config\claude-code"
if (Test-Path "$ImportDir\claude-code") {
    if (-Not (Test-Path $ClaudeCodeDir)) {
        New-Item -ItemType Directory -Path $ClaudeCodeDir -Force
    }
    Copy-Item "$ImportDir\claude-code\*" "$ClaudeCodeDir\" -Force
}

# 5. Mostrar metadados
if (Test-Path "$ImportDir\metadata.json") {
    Write-Host "`n📋 Metadados da exportação:" -ForegroundColor Green
    Get-Content "$ImportDir\metadata.json" | ConvertFrom-Json | Format-List
}

Write-Host "`n✅ Importação concluída!" -ForegroundColor Green
Write-Host "🔄 Reinicie o Cursor para aplicar as mudanças" -ForegroundColor Yellow
```

---

### 3. Script de Verificação de Sincronização

**Localização**: `scripts/verify-sync.sh`

```bash
#!/bin/bash
# Verifica se as configurações estão sincronizadas

echo "🔍 Verificando sincronização de configurações..."

# Verificar arquivos do projeto (Git)
echo ""
echo "📁 Configurações do Projeto (via Git):"
files=(
  ".vscode/settings.json"
  ".vscode/extensions.json"
  ".claude/mcp-config.json"
  ".claude/settings.local.json"
  ".cursorrules"
  "CLAUDE.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (ausente)"
  fi
done

# Verificar extensões instaladas
echo ""
echo "🔌 Extensões Recomendadas:"
required_extensions=(
  "dbaeumer.vscode-eslint"
  "esbenp.prettier-vscode"
  "bradlc.vscode-tailwindcss"
  "eamodio.gitlens"
  "expo.vscode-expo-tools"
)

for ext in "${required_extensions[@]}"; do
  if code --list-extensions | grep -q "$ext"; then
    echo "  ✅ $ext"
  else
    echo "  ⚠️  $ext (não instalada)"
  fi
done

# Verificar MCP servers
echo ""
echo "🌐 MCP Servers Configurados:"
if [ -f ".claude/mcp-config.json" ]; then
  echo "  ✅ mcp-config.json existe"
  echo "  📋 Servidores:"
  grep -o '"[^"]*":' .claude/mcp-config.json | grep -v '"\$schema":' | grep -v '"mcpServers":' | head -10
else
  echo "  ❌ mcp-config.json não encontrado"
fi

echo ""
echo "✅ Verificação concluída!"
```

---

## 🔄 Workflow de Sincronização

### Primeira Configuração (MacBook → Windows)

1. **No MacBook**:
   ```bash
   cd ~/Documents/Lion/NossaMaternidade
   chmod +x scripts/export-cursor-settings.sh
   ./scripts/export-cursor-settings.sh
   ```

2. **Transferir**:
   - Compactar: `zip -r cursor-settings.zip cursor-settings-export/`
   - Enviar via Google Drive, Dropbox, ou pendrive para o PC Windows

3. **No Windows** (PowerShell como Administrador):
   ```powershell
   cd C:\Users\YourUser\Documents\NossaMaternidade
   Unblock-File .\scripts\import-cursor-settings.ps1
   .\scripts\import-cursor-settings.ps1
   ```

4. **Reiniciar o Cursor** no Windows

---

### Sincronização Contínua (Dia a Dia)

#### Opção A: Git (Recomendado para configs do projeto)

**Sempre que modificar `.vscode/`, `.claude/`, `.cursorrules`, etc:**

1. Commit e push:
   ```bash
   git add .vscode/ .claude/ .cursorrules CLAUDE.md
   git commit -m "chore: Update editor configs"
   git push
   ```

2. No outro computador:
   ```bash
   git pull
   ```

#### Opção B: Sincronização Manual (Para configs globais)

**Quando modificar configs globais do Cursor:**

1. No computador de origem:
   ```bash
   # macOS
   ./scripts/export-cursor-settings.sh
   ```

   ou

   ```powershell
   # Windows
   .\scripts\export-cursor-settings.ps1 -Export
   ```

2. Transferir pasta `cursor-settings-export/`

3. No computador de destino:
   ```bash
   # macOS
   ./scripts/import-cursor-settings.sh
   ```

   ou

   ```powershell
   # Windows
   .\scripts\import-cursor-settings.ps1
   ```

---

## 🔐 Segurança

### ⚠️ NUNCA Sincronize

- `.env` (contém API keys)
- `node_modules/`
- `.expo/`
- `ios/Pods/`
- Credenciais de autenticação
- Tokens de acesso

### ✅ Sempre Sincronize

- `.vscode/settings.json` (projeto)
- `.claude/mcp-config.json` (projeto)
- `.cursorrules` (projeto)
- `CLAUDE.md` (projeto)
- Extensões instaladas (lista)
- Snippets customizados
- Keybindings customizados

---

## 📋 Checklist de Sincronização

Ao trocar de computador pela primeira vez:

- [ ] Clonar repositório Git
- [ ] Executar `npm install` ou `bun install`
- [ ] Exportar configs do computador atual
- [ ] Importar configs no novo computador
- [ ] Instalar extensões recomendadas
- [ ] Verificar MCP servers configurados
- [ ] Executar `npm run verify-env` para validar variáveis de ambiente
- [ ] Testar `npm start` para garantir que o ambiente funciona

---

## 🛠️ Troubleshooting

### Problema: Extensões não instalam no Windows

**Solução**:
```powershell
# Instalar manualmente
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

### Problema: Scripts `.sh` não executam no Windows

**Solução**: Use Git Bash (não PowerShell/CMD):
```bash
# Git Bash
bash scripts/export-cursor-settings.sh
```

### Problema: Permissão negada no macOS

**Solução**:
```bash
chmod +x scripts/*.sh
```

### Problema: MCP servers não aparecem

**Solução**:
1. Verificar `.claude/mcp-config.json` existe
2. Reiniciar Cursor
3. Abrir Command Palette (`Cmd/Ctrl + Shift + P`) → "Claude Code: Reload MCP Servers"

---

## 📚 Referências

- `.vscode/settings.json` - Configurações do editor
- `.vscode/extensions.json` - Extensões recomendadas
- `.claude/mcp-config.json` - MCP servers
- `.cursorrules` - Regras do Cursor
- `CLAUDE.md` - Instruções para Claude Code
- `docs/CURSOR_CLAUDE_SETUP.md` - Setup completo do Cursor

---

**Última atualização**: 2025-12-26
**Plataformas suportadas**: macOS (M1/Intel), Windows 10/11
