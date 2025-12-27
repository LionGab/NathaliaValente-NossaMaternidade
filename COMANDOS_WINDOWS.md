# 🖥️ Comandos para Executar no Windows PC

**IMPORTANTE**: Execute tudo no **Git Bash** (não PowerShell ou CMD).

---

## 1️⃣ Setup Inicial (Primeira Vez)

```bash
# 1. Abrir Git Bash e navegar para o projeto
cd C:\Users\SeuUsuario\Documents\NossaMaternidade

# 2. Atualizar código do Git
git pull

# 3. Instalar dependências
npm install

# 4. Sincronizar TUDO de uma vez
npm run sync:all
```

**O que `npm run sync:all` faz:**

- ✅ Instala extensões recomendadas do Cursor
- ✅ Importa configurações do Claude Code
- ✅ Ajusta paths dos MCPs para Windows

---

## 2️⃣ Configurar Settings Sync no Cursor

**No Cursor (não no terminal):**

1. Abrir Cursor
2. `Ctrl + Shift + P`
3. Digitar: `Settings Sync: Turn On...`
4. Escolher **"Sign in with GitHub"**
5. **Usar a MESMA conta GitHub** do MacBook
6. Marcar **TUDO** para sincronizar:
   - ✅ Settings
   - ✅ Keyboard Shortcuts
   - ✅ Extensões
   - ✅ Snippets
   - ✅ UI State

**Reiniciar o Cursor completamente** após isso.

---

## 3️⃣ Verificar se Está Tudo Ok

```bash
# Verificar sincronização
npm run sync:verify

# Testar projeto
npm start
```

---

## 4️⃣ Uso Diário (Quando Trocar de PC)

**Sempre que você sentar para trabalhar no Windows:**

```bash
cd C:\Users\SeuUsuario\Documents\NossaMaternidade
git pull
npm start
```

**Só isso!** O Settings Sync sincroniza o resto automaticamente.

---

## 📋 Checklist Rápido

- [ ] Git for Windows instalado (com Git Bash)
- [ ] Cursor instalado
- [ ] Projeto clonado (`git clone` ou já existe)
- [ ] `npm install` executado
- [ ] `npm run sync:all` executado
- [ ] Settings Sync habilitado no Cursor (mesmo GitHub)
- [ ] Cursor reiniciado
- [ ] `npm run sync:verify` passou
- [ ] `npm start` funcionando

---

## 🐛 Se Algo Não Funcionar

```bash
# Verificar sincronização
npm run sync:verify

# Reinstalar extensões
npm run sync:install-extensions

# Reimportar configs do Claude
npm run sync:import-claude

# Ajustar paths dos MCPs
npm run sync:fix-mcp-paths

# Fazer tudo de novo
npm run sync:all
```

---

**Guia completo**: `docs/MIGRACAO_MACBOOK_PARA_WINDOWS.md`
**Guia rápido**: `docs/GUIA_RAPIDO_MIGRACAO_WINDOWS.md`
