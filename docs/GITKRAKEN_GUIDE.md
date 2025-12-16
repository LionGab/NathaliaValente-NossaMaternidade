# 🦑 GitKraken - Guia Completo

## O que é GitKraken?

**GitKraken** é um cliente Git com interface gráfica (GUI) multiplataforma (Windows, Mac, Linux) que facilita o trabalho com Git sem precisar usar comandos no terminal.

---

## 🎯 Principais Funcionalidades

### 1. **Visualização Gráfica do Histórico**
- Ver commits, branches e merges de forma visual
- Timeline interativa do projeto
- Fácil navegação pelo histórico

### 2. **Gerenciamento de Branches**
- Criar, deletar e renomear branches visualmente
- Ver diferenças entre branches
- Merge visual com preview

### 3. **Resolução de Conflitos**
- Interface visual para resolver conflitos
- Comparação lado a lado
- Merge automático quando possível

### 4. **Integrações**
- GitHub, GitLab, Bitbucket
- Pull Requests direto da interface
- Issues e PRs integrados

### 5. **Git Flow**
- Suporte nativo ao Git Flow
- Templates de workflow
- Facilita branching strategy

---

## 🚀 Como Funciona

### Interface Principal

```
┌─────────────────────────────────────────┐
│  [Menu]  [Branch Selector]  [Search]    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ main ───────────────────────────┐  │
│  │  ● commit 1                       │  │
│  │  │                                │  │
│  │  ● commit 2                       │  │
│  │  │                                │  │
│  │  ● commit 3 ────┐                 │  │
│  │  │              │                 │  │
│  │  │         ┌────┴─── feature     │  │
│  │  │         │                      │  │
│  │  │         ● commit 4             │  │
│  │  │         │                      │  │
│  │  └─────────┴────────────────────┘  │
│                                         │
│  [Uncommitted Changes]                  │
│  [Staging Area]                         │
└─────────────────────────────────────────┘
```

### Fluxo de Trabalho Básico

1. **Abrir Repositório**
   - File > Open Repo
   - Ou clonar: File > Clone Repo

2. **Fazer Mudanças**
   - Edite arquivos normalmente
   - GitKraken detecta mudanças automaticamente

3. **Commit**
   - Arraste arquivos para "Staging Area"
   - Digite mensagem de commit
   - Clique em "Commit"

4. **Push/Pull**
   - Botões visuais para Push/Pull
   - Ver commits remotos vs locais

5. **Merge**
   - Arraste branch para fazer merge
   - Resolva conflitos visualmente

---

## 💡 Vantagens para Seu Workflow Windows/Mac

### ✅ Sincronização Fácil

**Cenário:** Trabalhar no Windows e continuar no Mac

1. **No Windows:**
   - Fazer commits normalmente
   - Push para remoto
   - GitKraken mostra status visual

2. **No Mac:**
   - Abrir GitKraken
   - Abrir mesmo repositório
   - Pull para sincronizar
   - Ver histórico completo visualmente

### ✅ Visualização Clara

- Ver todas as branches de uma vez
- Entender o histórico do projeto
- Identificar conflitos rapidamente

### ✅ Menos Erros

- Interface previne comandos errados
- Preview antes de merge
- Validação automática

---

## 📦 Instalação

### Windows

```bash
# Download direto
https://www.gitkraken.com/download

# Ou via Chocolatey
choco install gitkraken
```

### Mac

```bash
# Download direto
https://www.gitkraken.com/download

# Ou via Homebrew
brew install --cask gitkraken
```

### Linux

```bash
# Download direto
https://www.gitkraken.com/download

# Ou via Snap
snap install gitkraken
```

---

## 🔧 Configuração Inicial

### 1. Criar Conta (Opcional)

- Conta gratuita permite repositórios públicos ilimitados
- Repositórios privados: plano pago
- **Dica:** Para projetos pessoais, pode usar sem conta (modo local)

### 2. Conectar com GitHub/GitLab

1. Preferences > Authentication
2. Adicionar conta GitHub/GitLab
3. Autorizar acesso
4. Pronto para usar!

### 3. Configurar Git

```bash
# GitKraken usa o Git instalado no sistema
# Verificar se Git está configurado:

git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

---

## 🎨 Recursos Úteis para Nossa Maternidade

### 1. **Visualizar Histórico do Projeto**

Ver toda a evolução do projeto de forma visual:
- Commits por data
- Branches criadas
- Merges realizados

### 2. **Gerenciar Branches**

```bash
# No GitKraken:
# 1. Clicar em "Branch" no topo
# 2. Digitar nome: "feature/nova-tela"
# 3. Criar branch visualmente
# 4. Fazer commits
# 5. Merge visual arrastando branch
```

### 3. **Resolução de Conflitos**

Quando há conflitos:
1. GitKraken mostra arquivos com conflito
2. Abre editor visual lado a lado
3. Escolha qual versão usar
4. Ou edite manualmente
5. Marque como resolvido

### 4. **Stash (Guardar Mudanças Temporárias)**

```bash
# No GitKraken:
# 1. Ver mudanças não commitadas
# 2. Botão "Stash"
# 3. Digite nome do stash
# 4. Mudanças guardadas
# 5. Pode trocar de branch
# 6. Depois: "Unstash" para recuperar
```

---

## 🔄 Workflow Recomendado

### Trabalhando no Windows

1. **Abrir GitKraken**
   - File > Open Repo > NossaMaternidade

2. **Criar Branch (se necessário)**
   - Branch > New Branch > `feature/nome-feature`

3. **Fazer Mudanças**
   - Editar arquivos no Cursor
   - GitKraken detecta automaticamente

4. **Commit**
   - Arrastar arquivos para staging
   - Mensagem: `feat: adicionar nova funcionalidade`
   - Commit

5. **Push**
   - Botão Push
   - Ou: Cmd/Ctrl + Shift + P

### Continuando no Mac

1. **Abrir GitKraken no Mac**
   - File > Open Repo > NossaMaternidade

2. **Pull**
   - Botão Pull
   - Sincronizar com remoto

3. **Ver Mudanças**
   - Timeline mostra commits do Windows
   - Branches visíveis

4. **Continuar Trabalho**
   - Fazer commits normalmente
   - Push quando terminar

---

## 🆚 GitKraken vs Terminal

### Quando Usar GitKraken

✅ **Use GitKraken quando:**
- Quer ver histórico visualmente
- Está aprendendo Git
- Precisa resolver conflitos complexos
- Trabalha com muitas branches
- Quer interface amigável

### Quando Usar Terminal

✅ **Use Terminal quando:**
- Quer velocidade máxima
- Está automatizando (scripts)
- Precisa de comandos avançados
- Trabalha via SSH
- Prefere linha de comando

**Dica:** Você pode usar ambos! GitKraken para visualização e terminal para comandos rápidos.

---

## 🎯 Comandos Equivalentes

| Terminal | GitKraken |
|----------|-----------|
| `git status` | Painel "Uncommitted Changes" |
| `git add .` | Arrastar arquivos para staging |
| `git commit -m "msg"` | Digitar mensagem + Commit |
| `git push` | Botão Push |
| `git pull` | Botão Pull |
| `git branch` | Menu Branch |
| `git merge branch` | Arrastar branch para merge |
| `git log` | Timeline visual |
| `git stash` | Botão Stash |
| `git diff` | Comparação visual |

---

## 🔐 Segurança

### Credenciais

- GitKraken armazena credenciais de forma segura
- Suporta SSH keys
- Integração com gerenciadores de senha

### Repositórios Privados

- **Gratuito:** Apenas repositórios públicos
- **Pro:** Repositórios privados ilimitados
- **Alternativa:** Use modo local (sem conta)

---

## 💰 Planos

### Free (Gratuito)
- ✅ Repositórios públicos ilimitados
- ✅ Todas as funcionalidades básicas
- ✅ Suporte à comunidade
- ❌ Repositórios privados

### Pro (Pago)
- ✅ Tudo do Free
- ✅ Repositórios privados ilimitados
- ✅ Suporte prioritário
- ✅ Recursos avançados

**Para Nossa Maternidade:** Se o repositório for privado, precisará do plano Pro ou usar modo local.

---

## 🚀 Dicas e Truques

### 1. Atalhos de Teclado

```
Ctrl/Cmd + K    → Commit
Ctrl/Cmd + Shift + P → Push
Ctrl/Cmd + Shift + L → Pull
Ctrl/Cmd + B    → Criar Branch
Ctrl/Cmd + /    → Buscar
```

### 2. Favoritos

- Marque repositórios como favoritos
- Acesso rápido na sidebar
- Organize por pastas

### 3. Templates de Commit

Configure templates para mensagens padronizadas:
- `feat:`
- `fix:`
- `chore:`
- `refactor:`

### 4. Integração com Cursor

- GitKraken detecta mudanças do Cursor automaticamente
- Não precisa fechar/abrir
- Sincronização em tempo real

---

## 🔧 Solução de Problemas

### GitKraken não detecta mudanças

```bash
# Verificar se Git está configurado
git config --list

# Recarregar repositório no GitKraken
# File > Refresh
```

### Erro de autenticação

1. Preferences > Authentication
2. Remover conta
3. Adicionar novamente
4. Reautorizar

### Conflitos não aparecem

1. Fazer Pull primeiro
2. GitKraken mostra conflitos automaticamente
3. Resolver na interface

---

## 📚 Recursos Adicionais

- **Documentação Oficial:** https://support.gitkraken.com
- **Tutoriais:** https://www.gitkraken.com/learn
- **YouTube:** Buscar "GitKraken tutorial"

---

## ✅ Resumo para Nossa Maternidade

**Recomendação:** GitKraken é excelente para:
- ✅ Visualizar histórico do projeto
- ✅ Gerenciar branches facilmente
- ✅ Sincronizar entre Windows e Mac
- ✅ Resolver conflitos visualmente

**Workflow Sugerido:**
1. Windows: Trabalhar no Cursor + GitKraken para commits
2. Mac: Abrir GitKraken + Pull para sincronizar
3. Continuar trabalho normalmente
4. Push quando terminar

**Alternativa:** Se preferir terminal, os comandos Git funcionam normalmente. GitKraken é apenas uma interface visual mais amigável.

---

**Última atualização:** 16/12/2025

