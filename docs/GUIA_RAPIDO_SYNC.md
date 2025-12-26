# ⚡ Guia Rápido - Sincronização MacBook ↔ Windows

**Problema resolvido**: Ambiente do Cursor sempre idêntico nos dois computadores.

---

## 🚀 Setup Inicial (Fazer UMA VEZ)

### No MacBook (5 minutos)

```bash
# 1. Habilitar Settings Sync no Cursor
# Cmd + Shift + P → "Settings Sync: Turn On..."
# Logar com GitHub

# 2. Exportar configs do Claude Code
cd ~/Documents/Lion/NossaMaternidade
npm run sync:export-claude

# 3. Commitar e enviar pro Git
git add .claude-export/ package.json scripts/
git commit -m "chore: Add sync scripts and Claude settings"
git push
```

---

### No Windows PC (5 minutos)

```bash
# 1. Clonar repositório (se ainda não tiver)
git clone <url-do-repo>
cd NossaMaternidade

# 2. Instalar dependências
npm install

# 3. Habilitar Settings Sync no Cursor
# Ctrl + Shift + P → "Settings Sync: Turn On..."
# Logar com o MESMO GitHub do MacBook

# 4. Sincronizar tudo automaticamente
npm run sync:all

# 5. Reiniciar o Cursor
```

**Pronto!** 🎉 Agora os dois ambientes estão 100% sincronizados.

---

## 🔄 Uso Diário (30 segundos)

### Quando Trocar de Computador

**Sempre que você sentar para trabalhar:**

```bash
git pull
npm start
```

**Só isso!** ✨

O Settings Sync do Cursor sincroniza automaticamente:
- ✅ Configurações globais
- ✅ Extensões instaladas
- ✅ Atalhos de teclado
- ✅ Snippets customizados

O Git sincroniza automaticamente:
- ✅ Configurações do projeto (`.vscode/`, `.claude/`)
- ✅ Scripts NPM
- ✅ Código

---

## 🛠️ Comandos Úteis

```bash
# Verificar se está tudo sincronizado
npm run sync:verify

# Instalar extensões faltantes
npm run sync:install-extensions

# Importar configs do Claude Code (se mudou algo)
npm run sync:import-claude

# Ajustar paths do MCP (se mudou de OS)
npm run sync:fix-mcp-paths

# Fazer tudo de uma vez
npm run sync:all
```

---

## 🎯 O Que Cada Script Faz

| Comando | O Que Faz | Quando Usar |
|---------|-----------|-------------|
| `sync:verify` | Verifica se está tudo ok | Sempre que tiver dúvida |
| `sync:install-extensions` | Instala extensões recomendadas | Primeira vez ou se faltou alguma |
| `sync:export-claude` | Exporta configs do Claude | No MacBook, quando mudar configs |
| `sync:import-claude` | Importa configs do Claude | No Windows, após `git pull` |
| `sync:fix-mcp-paths` | Ajusta paths do MCP | Após trocar de OS |
| `sync:all` | Faz tudo automaticamente | Setup inicial no Windows |

---

## 🚨 Troubleshooting

### "Settings Sync não sincroniza"

1. Verificar se está logado com o mesmo GitHub em ambos PCs
2. Abrir: `Cmd/Ctrl + Shift + P` → "Settings Sync: Show Log"
3. Forçar sync: `Cmd/Ctrl + Shift + P` → "Settings Sync: Sync Now"

---

### "Extensões não instalam"

```bash
# Instalar manualmente
npm run sync:install-extensions

# Se continuar com erro, instalar uma por uma
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

---

### "MCP servers não aparecem"

```bash
npm run sync:fix-mcp-paths

# Depois recarregar no Cursor:
# Cmd/Ctrl + Shift + P → "Claude Code: Reload MCP Servers"
```

---

### "Ainda dá problema"

```bash
# Nuclear option: sincronizar TUDO do zero
npm run sync:all
# Reiniciar Cursor
```

---

## 📋 Checklist de Setup (Primeira Vez)

### MacBook
- [ ] Settings Sync habilitado (GitHub)
- [ ] `npm run sync:export-claude` executado
- [ ] Commit e push feito

### Windows
- [ ] Repositório clonado
- [ ] Settings Sync habilitado (mesmo GitHub)
- [ ] `npm install` executado
- [ ] `npm run sync:all` executado
- [ ] Cursor reiniciado

---

## 💡 Dicas

1. **Sempre `git pull` antes de começar a trabalhar** - evita conflitos
2. **Settings Sync é automático** - não precisa fazer nada manualmente
3. **Só rodar `sync:all` na primeira vez** - depois é tudo automático
4. **Se mudar configs do Claude no MacBook** - rodar `npm run sync:export-claude` e fazer commit

---

## 📚 Documentação Completa

- `docs/SINCRONIZACAO_DEFINITIVA.md` - Documentação detalhada
- `docs/SINCRONIZACAO_AMBIENTES.md` - Localizações de arquivos

---

**Última atualização**: 2025-12-26
**Testado em**: macOS Sequoia (M1), Windows 11
