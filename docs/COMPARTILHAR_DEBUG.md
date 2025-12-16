# 📸 Como Compartilhar Screenshots e Debug Info

## 📱 Screenshots do Terminal/App

### No Mac:

**Screenshot de tela inteira:**

- `Cmd + Shift + 3` - Tela inteira
- `Cmd + Shift + 4` - Área selecionada
- `Cmd + Shift + 4 + Space` - Janela específica

**Screenshot do Terminal:**

- Selecione o texto no terminal
- `Cmd + Shift + 4` e selecione área do terminal
- Ou copie texto: `Cmd + C` e cole aqui

**Screenshot do Simulador iOS:**

- Abra o simulador
- `Cmd + S` - Salva screenshot na área de trabalho
- Ou `Cmd + Shift + 4` e selecione o simulador

---

## 📋 Copiar Texto do Terminal

### No Mac Terminal:

**Copiar texto selecionado:**

- Selecione com mouse
- `Cmd + C` (ou botão direito → Copy)
- Cole aqui no chat

**Copiar saída completa:**

```bash
# Salvar output em arquivo
bun run start > expo-output.txt 2>&1

# Ou copiar últimas linhas
bun run start 2>&1 | tail -50
```

---

## 🔍 Informações Úteis para Compartilhar

Quando pedir ajuda, inclua:

### 1. Erro do Terminal:

```bash
# Copie o erro completo
# Exemplo:
Error: Cannot find module 'react-native-reanimated'
```

### 2. Versões:

```bash
# No Mac
node --version
bun --version
npx expo --version
```

### 3. Status do Servidor:

```bash
# Output do Expo
npx expo start
```

### 4. Logs do App:

- Screenshot do erro no simulador
- Console logs (se visível)

---

## 📤 Formas de Compartilhar

### Opção 1: Colar Diretamente no Chat

- Cole o texto do terminal aqui
- Ou descreva o erro

### Opção 2: Screenshot

- Tire screenshot (`Cmd + Shift + 4`)
- Cole aqui (suporta imagens)

### Opção 3: Arquivo de Log

```bash
# Criar arquivo de log
bun run start 2>&1 | tee expo-debug.log

# Depois compartilhe o conteúdo do arquivo
```

---

## 🎯 Exemplo de Informação Útil

Quando compartilhar, inclua:

```
Erro: [cole o erro aqui]

Comando executado:
bun run ios

Versões:
Node: v20.x.x
Bun: v1.x.x
Expo: 54.0.19

Sistema:
MacBook M1, macOS Sonoma
```

---

## 💡 Dica Rápida

**Para copiar rápido do terminal:**

1. Selecione o texto
2. `Cmd + C`
3. Cole aqui (`Cmd + V`)

**Para screenshot:**

1. `Cmd + Shift + 4`
2. Selecione área
3. Cole aqui (suporta imagens)

---

## 🔧 Comandos Úteis para Debug

```bash
# Ver logs detalhados
bun run start --verbose

# Verificar erros TypeScript
bun run typecheck

# Verificar lint
bun run lint

# Limpar e reiniciar
bun run clean
bun run start:clear
```
