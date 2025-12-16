# 🔄 Sincronização - Windows e Mac na Mesma Pasta

## 📁 Cenário: Pasta Compartilhada/Network Drive

Se Windows e Mac estão acessando a mesma pasta (via rede compartilhada, Dropbox, OneDrive, etc.), você pode trabalhar diretamente sem precisar de Git para sincronização.

---

## ✅ Vantagens

- ✅ Mudanças aparecem instantaneamente em ambos
- ✅ Não precisa fazer commit/push/pull
- ✅ Um único `node_modules` (se compartilhado)
- ✅ Desenvolvimento mais rápido

---

## ⚠️ Cuidados Importantes

### 1. node_modules Compartilhado

**Problema:** Windows e Mac podem ter binários diferentes para algumas dependências.

**Solução:**

```bash
# No Mac (primeira vez ou após mudanças no Windows)
cd /caminho/para/pasta/compartilhada/NossaMaternidade
rm -rf node_modules
bun install
```

### 2. Arquivos de Cache

**Problema:** Cache do Expo pode causar problemas entre sistemas.

**Solução:**

```bash
# Limpar cache quando trocar de máquina
bun run clean
bun run start:clear
```

### 3. Permissões de Arquivo

**Problema:** Permissões podem diferir entre Windows e Mac.

**Solução:**

```bash
# No Mac, dar permissão de execução aos scripts
chmod +x scripts/*.sh
```

### 4. Line Endings (CRLF vs LF)

**Problema:** Windows usa CRLF, Mac usa LF.

**Solução:** Configure Git para gerenciar automaticamente:

```bash
# No Mac (ou Windows)
git config core.autocrlf true
```

---

## 🚀 Fluxo de Trabalho

### Trabalhando no Windows:

```bash
# 1. Abrir pasta compartilhada
cd C:\caminho\para\pasta\compartilhada\NossaMaternidade

# 2. Iniciar servidor
bun run start

# 3. Fazer mudanças normalmente
# Arquivos são salvos diretamente na pasta compartilhada
```

### Trabalhando no Mac:

```bash
# 1. Abrir pasta compartilhada
cd /caminho/para/pasta/compartilhada/NossaMaternidade

# 2. Verificar se node_modules está atualizado
# Se necessário:
bun install

# 3. Limpar cache (recomendado ao trocar de máquina)
bun run clean

# 4. Iniciar servidor
bun run start
# OU rodar direto no simulador iOS
bun run ios
```

---

## 🔧 Configurações Recomendadas

### 1. Git Config (Line Endings)

```bash
# No Mac
git config core.autocrlf input

# No Windows
git config core.autocrlf true
```

### 2. .gitignore (já configurado)

O `.gitignore` já exclui:

- `node_modules/` (não commitar)
- `.expo/` (cache local)
- `dist/`, `build/` (builds)

### 3. Scripts Cross-Platform

Os scripts já estão preparados:

- `clean-cache.js` - Funciona em Windows e Mac
- `clean-cache.ps1` - Versão PowerShell (Windows)

---

## 📝 Checklist ao Trocar de Máquina

### Do Windows para Mac:

- [ ] Fechar servidor Expo no Windows (`Ctrl+C`)
- [ ] No Mac: `cd` para pasta compartilhada
- [ ] No Mac: `bun install` (se houver novas dependências)
- [ ] No Mac: `bun run clean` (limpar cache)
- [ ] No Mac: `bun run start` ou `bun run ios`

### Do Mac para Windows:

- [ ] Fechar servidor Expo no Mac (`Ctrl+C`)
- [ ] No Windows: `cd` para pasta compartilhada
- [ ] No Windows: `bun install` (se necessário)
- [ ] No Windows: `bun run clean`
- [ ] No Windows: `bun run start`

---

## 🎯 Comandos Úteis

```bash
# Verificar se está na pasta certa
pwd  # Mac
cd   # Windows

# Limpar tudo e reinstalar
bun run clean:all

# Iniciar com cache limpo
bun run start:clear

# Verificar mudanças não commitadas
git status
```

---

## 💡 Dicas

1. **Sempre limpe cache** ao trocar de máquina (`bun run clean`)
2. **Reinstale dependências** se houver problemas (`bun install`)
3. **Use Git** para backup mesmo com pasta compartilhada
4. **Evite editar simultaneamente** - pode causar conflitos

---

## 🔄 Sincronização com Git (Opcional)

Mesmo com pasta compartilhada, é bom usar Git para:

- Backup
- Histórico de mudanças
- Colaboração com equipe

```bash
# Commitar mudanças periodicamente
git add .
git commit -m "feat: nova feature"
git push origin main
```

---

## ⚡ Workflow Rápido

**Windows:**

```bash
cd C:\caminho\compartilhado\NossaMaternidade
bun run start
```

**Mac:**

```bash
cd /caminho/compartilhado/NossaMaternidade
bun run clean
bun run ios
```

Pronto! Ambos trabalham na mesma pasta. 🎉
