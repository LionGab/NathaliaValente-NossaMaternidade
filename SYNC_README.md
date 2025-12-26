# 🔄 Sincronização MacBook ↔ Windows - RESUMO

**Leia isso PRIMEIRO**: Guia de 2 minutos para sincronizar perfeitamente seus dois ambientes.

---

## ⚡ Quick Start

### 1️⃣ No MacBook (Agora)

```bash
# 1. Habilitar Settings Sync no Cursor
# Cmd + Shift + P → "Settings Sync: Turn On..." → Login com GitHub

# 2. Exportar configs e commitar
npm run sync:export-claude
git add .
git commit -m "chore: Add sync system for MacBook ↔ Windows"
git push
```

---

### 2️⃣ No Windows PC (Quando Chegar em Casa)

```bash
# 1. Puxar mudanças
git pull

# 2. Habilitar Settings Sync no Cursor
# Ctrl + Shift + P → "Settings Sync: Turn On..." → Login com o MESMO GitHub

# 3. Sincronizar tudo
npm run sync:all

# 4. Reiniciar Cursor
```

**Pronto!** 🎉

---

## 📋 Comandos Diários

```bash
# Ao sentar para trabalhar (qualquer PC)
git pull
npm start

# Verificar se está tudo ok
npm run sync:verify
```

---

## 🛠️ Comandos Disponíveis

| Comando | Uso |
|---------|-----|
| `npm run sync:verify` | Verifica se está tudo sincronizado |
| `npm run sync:install-extensions` | Instala extensões recomendadas |
| `npm run sync:export-claude` | Exporta configs do Claude (MacBook) |
| `npm run sync:import-claude` | Importa configs do Claude (Windows) |
| `npm run sync:fix-mcp-paths` | Ajusta paths do MCP |
| `npm run sync:all` | Faz tudo de uma vez |

---

## 📚 Documentação Completa

- **`docs/GUIA_RAPIDO_SYNC.md`** ← COMECE AQUI (5 min de leitura)
- `docs/SINCRONIZACAO_DEFINITIVA.md` (Referência completa)
- `docs/SINCRONIZACAO_AMBIENTES.md` (Detalhes técnicos)

---

## ✅ O Que Sincroniza Automaticamente

### Via Settings Sync (Cursor built-in) - AUTOMÁTICO
- ✅ Configurações globais do Cursor
- ✅ Extensões instaladas
- ✅ Atalhos de teclado
- ✅ Snippets customizados

### Via Git - AUTOMÁTICO
- ✅ Configurações do projeto (`.vscode/`, `.claude/`)
- ✅ Código e dependências
- ✅ Scripts NPM

### Via NPM Scripts - MANUAL (primeira vez)
- ⚠️ Configurações do Claude Code (rodar `sync:export-claude` → `sync:import-claude`)

---

## 🎯 Por Que Isso Resolve o Problema

**Antes** (com git pull apenas):
- ❌ Extensões diferentes em cada PC
- ❌ Atalhos de teclado desconfigurados
- ❌ Configurações do Claude Code não sincronizavam
- ❌ MCP servers com paths errados

**Agora** (com Settings Sync + scripts):
- ✅ Extensões sincronizam automaticamente
- ✅ Atalhos sempre iguais
- ✅ Claude Code configurado identicamente
- ✅ MCP paths ajustados automaticamente

---

## 🚨 Troubleshooting Rápido

### Settings Sync não funciona
```bash
# Cmd/Ctrl + Shift + P → "Settings Sync: Sync Now"
```

### Extensões faltando
```bash
npm run sync:install-extensions
```

### MCP servers não aparecem
```bash
npm run sync:fix-mcp-paths
# Depois: Cmd/Ctrl + Shift + P → "Claude Code: Reload MCP Servers"
```

---

**Última atualização**: 2025-12-26
**Testado em**: macOS Sequoia (M1), Windows 11
