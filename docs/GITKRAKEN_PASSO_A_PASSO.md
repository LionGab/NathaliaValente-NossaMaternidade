# 🦑 GitKraken Pro - Passo a Passo Completo

## ✅ Você tem GitKraken Pro!

Agora você pode usar repositórios privados ilimitados. Vamos configurar tudo do zero.

---

## 📦 Passo 1: Instalação

### Windows

1. Baixar: https://www.gitkraken.com/download
2. Executar instalador
3. Seguir wizard de instalação
4. Abrir GitKraken

### Mac

```bash
# Opção 1: Download direto
# https://www.gitkraken.com/download

# Opção 2: Homebrew
brew install --cask gitkraken
```

---

## 🔐 Passo 2: Login e Ativação

1. **Abrir GitKraken**
2. **Criar conta ou fazer login**
   - Se já tem conta: fazer login
   - Se não tem: criar conta com email usado na compra
3. **Ativar Pro**
   - GitKraken detecta automaticamente se você pagou
   - Ou: Preferences > Account > Activate Pro
4. **Verificar status**
   - Deve aparecer "Pro" no canto superior direito

---

## 🔗 Passo 3: Conectar com GitHub/GitLab

### Conectar GitHub

1. **Preferences** (Ctrl/Cmd + ,)
2. **Authentication** (lado esquerdo)
3. **GitHub** → **Connect to GitHub**
4. **Autorizar** no navegador
5. ✅ Conectado!

### Conectar GitLab (se usar)

1. **Preferences** → **Authentication**
2. **GitLab** → **Connect to GitLab**
3. **Autorizar**
4. ✅ Conectado!

---

## 📂 Passo 4: Abrir Repositório Nossa Maternidade

### Se o repositório já existe no GitHub/GitLab

1. **File** → **Clone Repo**
2. **Escolher** GitHub ou GitLab
3. **Selecionar** repositório `NossaMaternidade`
4. **Escolher pasta** de destino (ex: `~/Documents/NossaMaternidade`)
5. **Clone**
6. ✅ Repositório clonado e aberto!

### Se o repositório está local (Windows)

1. **File** → **Open Repo**
2. **Navegar** até `C:\home\NossaMaternidade`
3. **Selecionar** pasta
4. **Open**
5. ✅ Repositório aberto!

### Se precisa criar repositório novo

1. **File** → **Init Repo**
2. **Escolher** pasta do projeto
3. **Initialize**
4. **Depois:** conectar com remoto (GitHub/GitLab)

---

## 🎯 Passo 5: Configuração Inicial do Git

### Verificar configuração

1. **Preferences** → **Git**
2. **Verificar:**
   - User Name: Seu nome
   - Email: seu@email.com

### Se não estiver configurado

```bash
# No terminal do GitKraken (View > Terminal)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## 🚀 Passo 6: Primeiro Commit (se necessário)

### Se o repositório está vazio

1. **Ver painel "Uncommitted Changes"** (lado esquerdo)
2. **Arrastar arquivos** para "Staging Area"
3. **Digitar mensagem:** `feat: projeto inicial Nossa Maternidade`
4. **Clicar em "Commit"** (ou Ctrl/Cmd + K)
5. ✅ Primeiro commit feito!

### Se já tem commits

- GitKraken mostra timeline com todos os commits
- Navegue pelo histórico visualmente

---

## 📤 Passo 7: Push para Remoto (se necessário)

### Se o repositório é novo e não tem remoto

1. **View** → **Show Left Panel** (se não estiver visível)
2. **Clicar em "Remote"** no topo
3. **Add Remote**
4. **Nome:** `origin`
5. **URL:** `https://github.com/seu-usuario/NossaMaternidade.git`
   - Ou: `git@github.com:seu-usuario/NossaMaternidade.git` (SSH)
6. **Save**
7. **Botão "Push"** (ou Ctrl/Cmd + Shift + P)
8. ✅ Push feito!

### Se já tem remoto configurado

1. **Botão "Push"** no topo
2. **Selecionar branch** (geralmente `main` ou `master`)
3. **Push**
4. ✅ Sincronizado!

---

## 🔄 Passo 8: Workflow Diário

### Trabalhando no Windows

1. **Abrir GitKraken**
   - File → Open Repo → NossaMaternidade

2. **Abrir Cursor**
   - Trabalhar normalmente no código

3. **Fazer mudanças**
   - GitKraken detecta automaticamente
   - Painel "Uncommitted Changes" mostra arquivos modificados

4. **Commit**
   - Arrastar arquivos para "Staging Area"
   - Digitar mensagem: `feat: adicionar nova funcionalidade`
   - Commit (Ctrl/Cmd + K)

5. **Push**
   - Botão Push (Ctrl/Cmd + Shift + P)
   - Ou: arrastar branch para remoto

### Continuando no Mac

1. **Abrir GitKraken no Mac**
   - File → Open Repo → NossaMaternidade

2. **Pull**
   - Botão Pull (Ctrl/Cmd + Shift + L)
   - Sincronizar com remoto

3. **Ver mudanças**
   - Timeline mostra commits do Windows
   - Branches visíveis

4. **Continuar trabalho**
   - Fazer commits normalmente
   - Push quando terminar

---

## 🌿 Passo 9: Criar e Gerenciar Branches

### Criar nova branch

1. **Clicar em "Branch"** no topo
2. **Digitar nome:** `feature/nova-tela`
3. **Enter**
4. ✅ Branch criada e ativada!

### Trocar de branch

1. **Clicar em "Branch"** no topo
2. **Selecionar branch** desejada
3. ✅ Trocado!

### Fazer merge

1. **Arrastar branch** que quer mergear
2. **Soltar** na branch de destino (ex: `main`)
3. **Confirmar merge**
4. ✅ Merge feito!

---

## 🔀 Passo 10: Resolver Conflitos

### Quando há conflitos

1. GitKraken mostra **arquivos com conflito** em vermelho
2. **Clicar no arquivo**
3. **Abrir editor de conflitos**
4. **Escolher versão:**
   - Use Left (sua versão)
   - Use Right (versão do remoto)
   - Ou edite manualmente
5. **Salvar**
6. **Marcar como resolvido**
7. **Commit** o merge
8. ✅ Conflito resolvido!

---

## 💾 Passo 11: Stash (Guardar Mudanças Temporárias)

### Quando usar

- Precisa trocar de branch mas tem mudanças não commitadas
- Quer testar algo sem perder trabalho atual

### Como fazer

1. **Ver mudanças não commitadas**
2. **Botão "Stash"** (ou Ctrl/Cmd + Shift + S)
3. **Digitar nome:** `trabalho-em-progresso`
4. **Stash**
5. ✅ Mudanças guardadas!

### Recuperar stash

1. **Ver stashes** no painel esquerdo
2. **Clicar no stash**
3. **Unstash**
4. ✅ Mudanças recuperadas!

---

## 📊 Passo 12: Visualizar Histórico

### Timeline

- **Ver todos os commits** visualmente
- **Navegar** clicando nos commits
- **Ver diferenças** entre commits

### Comparar branches

1. **Selecionar duas branches**
2. **Ver diferenças** visualmente
3. **Identificar mudanças** antes de merge

---

## 🔍 Passo 13: Buscar no Histórico

1. **Ctrl/Cmd + /** (ou botão de busca)
2. **Digitar** termo de busca
3. **Ver resultados** em commits, mensagens, arquivos
4. ✅ Encontrado!

---

## ⚙️ Passo 14: Configurações Recomendadas

### Preferences (Ctrl/Cmd + ,)

1. **Editor**
   - Escolher editor padrão (Cursor, VS Code, etc.)
   - Para abrir arquivos do GitKraken

2. **UI Theme**
   - Escolher tema (Dark/Light)
   - Personalizar interface

3. **Git**
   - Configurar merge tool
   - Configurar diff tool

4. **Notifications**
   - Ativar notificações de push/pull
   - Alertas de conflitos

---

## 🎨 Passo 15: Atalhos Úteis

```
Ctrl/Cmd + K          → Commit
Ctrl/Cmd + Shift + P → Push
Ctrl/Cmd + Shift + L → Pull
Ctrl/Cmd + B          → Criar Branch
Ctrl/Cmd + /          → Buscar
Ctrl/Cmd + Shift + S  → Stash
Ctrl/Cmd + ,          → Preferences
```

---

## 🔄 Workflow Completo: Windows → Mac

### No Windows (antes de sair)

1. **Abrir GitKraken**
2. **Ver mudanças não commitadas**
3. **Commit** tudo que fez
4. **Push** para remoto
5. ✅ Tudo sincronizado!

### No Mac (ao chegar)

1. **Abrir GitKraken**
2. **Abrir repositório** NossaMaternidade
3. **Pull** (Ctrl/Cmd + Shift + L)
4. **Ver commits** do Windows na timeline
5. ✅ Continuar trabalho!

### Continuar no Mac

1. **Fazer mudanças** no Cursor
2. **Commit** no GitKraken
3. **Push** quando terminar
4. ✅ Sincronizado!

---

## 🚨 Solução de Problemas Comuns

### GitKraken não detecta mudanças

1. **File** → **Refresh**
2. Ou: fechar e abrir repositório novamente

### Erro de autenticação

1. **Preferences** → **Authentication**
2. **Remover** conta
3. **Adicionar novamente**
4. **Reautorizar**

### Push rejeitado

1. **Fazer Pull primeiro**
2. **Resolver conflitos** (se houver)
3. **Push novamente**

### Branch não aparece

1. **Pull** para atualizar branches remotas
2. **Verificar** se branch existe no remoto

---

## ✅ Checklist de Configuração

- [ ] GitKraken instalado
- [ ] Login feito
- [ ] Pro ativado
- [ ] GitHub/GitLab conectado
- [ ] Repositório aberto
- [ ] Git configurado (nome e email)
- [ ] Primeiro commit feito (se necessário)
- [ ] Push para remoto (se necessário)
- [ ] Atalhos aprendidos
- [ ] Workflow configurado

---

## 🎯 Próximos Passos

1. ✅ **Explorar interface** - Navegar pela timeline
2. ✅ **Fazer primeiro commit** - Testar workflow
3. ✅ **Criar branch** - Testar branching
4. ✅ **Fazer merge** - Testar merge visual
5. ✅ **Sincronizar Windows/Mac** - Testar workflow completo

---

## 💡 Dicas Finais

1. **Use GitKraken para visualização** - Ver histórico e branches
2. **Use Cursor para edição** - Melhor experiência de código
3. **Commit frequentemente** - Commits pequenos são melhores
4. **Mensagens claras** - `feat:`, `fix:`, `chore:`, etc.
5. **Pull antes de Push** - Evitar conflitos

---

## 📚 Recursos

- **Documentação:** https://support.gitkraken.com
- **Tutoriais:** https://www.gitkraken.com/learn
- **Suporte:** support@gitkraken.com

---

**Pronto para começar!** 🚀

Se tiver dúvidas, consulte `docs/GITKRAKEN_GUIDE.md` para mais detalhes.

**Última atualização:** 16/12/2025
