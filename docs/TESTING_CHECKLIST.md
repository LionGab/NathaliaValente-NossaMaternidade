# Checklist de Testes Manuais - Nossa Maternidade

Guia completo para testes manuais dos fluxos críticos antes de produção.

## Configuração Inicial

### 1. Ambiente de Teste

```bash
# Limpar cache
npm run clean

# Instalar dependências
npm install

# Rodar app
npm run ios  # ou npm run android
```

### 2. Usuário de Teste

Criar conta de teste via:
- Email: `teste@nossamaternidade.com`
- Senha: (definir senha segura)

---

## Fluxos Críticos

### ✅ 1. Login e Autenticação

#### 1.1 Login com Email

- [ ] Abrir app (tela de welcome)
- [ ] Clicar "Entrar com Email"
- [ ] Inserir email válido
- [ ] Inserir senha correta
- [ ] Login bem-sucedido → Redireciona para Home
- [ ] **Validação:** User profile carregado

#### 1.2 Login Social (Google)

- [ ] Tela de login
- [ ] Clicar "Continuar com Google"
- [ ] Popup de OAuth aparece
- [ ] Selecionar conta Google
- [ ] Login bem-sucedido
- [ ] **Validação:** User profile criado automaticamente

#### 1.3 Logout

- [ ] Ir para Perfil
- [ ] Clicar "Sair"
- [ ] Confirmação de logout
- [ ] Redireciona para tela de login
- [ ] **Validação:** Sessão limpa

---

### ✅ 2. Onboarding (6 Etapas)

#### 2.1 Nath Journey (Stories)

- [ ] Após login, aparece onboarding de stories
- [ ] Navegar pelos 5 stories
- [ ] Botão "Próximo" funciona
- [ ] Última story → "Começar"
- [ ] **Validação:** Progress bar atualiza

#### 2.2 Onboarding Clássico

- [ ] Nome: Inserir nome válido
- [ ] Stage: Selecionar "Grávida" / "Pós-parto" / "Tentante"
- [ ] Interesses: Selecionar 3+ interesses
- [ ] **Validação:** Botões habilitam/desabilitam corretamente

#### 2.3 NathIA Onboarding

- [ ] 5 perguntas personalizadas
- [ ] Respostas em texto livre
- [ ] Botão "Continuar" sempre habilitado
- [ ] Última pergunta → "Finalizar"
- [ ] **Validação:** hasCompletedOnboarding = true

---

### ✅ 3. Home Screen

- [ ] Saudação personalizada (Bom dia/tarde/noite + nome)
- [ ] Card hero com mensagem inspiradora
- [ ] 4 Quick Actions (Ciclo, NathIA, Afirmações, Calculadora)
- [ ] Carrossel de dicas (swipe horizontal)
- [ ] Preview da comunidade
- [ ] **Validação:** Todos os cards clicáveis

---

### ✅ 4. NathIA Chat

#### 4.1 Nova Conversa

- [ ] Tab "NathIA"
- [ ] Input de mensagem visível
- [ ] Digitar "Olá, NathIA!"
- [ ] Enviar mensagem
- [ ] Loading indicator aparece
- [ ] Resposta da IA carrega
- [ ] **Validação:** Mensagem salva em histórico

#### 4.2 Histórico de Conversas

- [ ] Ícone de menu (sidebar)
- [ ] Sidebar abre
- [ ] Lista de conversas por data
- [ ] Clicar em conversa → Carrega histórico
- [ ] **Validação:** Mensagens antigas aparecem

#### 4.3 Deletar Conversa

- [ ] Sidebar aberto
- [ ] Swipe left em conversa
- [ ] Botão "Deletar" aparece
- [ ] Confirmar deleção
- [ ] **Validação:** Conversa removida

---

### ✅ 5. Ciclo Menstrual

#### 5.1 Configurar Ciclo

- [ ] Tab "Ciclo"
- [ ] Primeira vez → Prompt para configurar
- [ ] Selecionar data da última menstruação
- [ ] Duração do ciclo (28 dias padrão)
- [ ] Salvar
- [ ] **Validação:** Calendário aparece

#### 5.2 Visualizar Calendário

- [ ] Calendário de 6 semanas visível
- [ ] Dias de período marcados (vermelho)
- [ ] Dias de ovulação marcados (azul)
- [ ] Janela fértil marcada (verde)
- [ ] **Validação:** Cores corretas

#### 5.3 Registro Diário

- [ ] Clicar em dia específico
- [ ] Modal de "Daily Log" abre
- [ ] Selecionar humor (8 opções)
- [ ] Slider de intensidade (0-100%)
- [ ] Adicionar sintomas
- [ ] Salvar
- [ ] **Validação:** Log salvo e aparece no calendário

---

### ✅ 6. Permissões

#### 6.1 Notificações

- [ ] Após onboarding → Tela de permissões
- [ ] Solicitar permissão de notificações
- [ ] Aceitar no iOS/Android
- [ ] **Validação:** Push token salvo

#### 6.2 Câmera (se usar)

- [ ] Ir para Comunidade → Novo Post
- [ ] Adicionar imagem
- [ ] Solicitar permissão de câmera
- [ ] Aceitar
- [ ] **Validação:** Câmera funciona

---

### ✅ 7. Comunidade

#### 7.1 Feed de Posts

- [ ] Tab "Comunidade"
- [ ] Lista de posts carrega
- [ ] Scroll funciona (FlatList)
- [ ] **Validação:** Performance smooth

#### 7.2 Criar Post

- [ ] Botão "+" no canto inferior direito
- [ ] Modal abre
- [ ] Selecionar tipo (Dúvida/Desabafo/Vitória/Dica)
- [ ] Escrever texto
- [ ] Publicar
- [ ] **Validação:** Post aparece no feed

#### 7.3 Likes e Comentários

- [ ] Clicar no coração → Like
- [ ] Contador aumenta
- [ ] Clicar novamente → Unlike
- [ ] Contador diminui
- [ ] **Validação:** Estado persiste

---

### ✅ 8. Premium/Paywall (Se Implementado)

#### 8.1 Tentar Feature Bloqueada

- [ ] Tentar acessar feature premium (ex: voz NathIA)
- [ ] Paywall aparece
- [ ] **Validação:** Botão de compra visível

#### 8.2 Compra Sandbox (Teste)

- [ ] Clicar "Assinar Premium"
- [ ] Modal de compra (RevenueCat)
- [ ] Selecionar plano (Mensal/Anual)
- [ ] Confirmar (sandbox payment)
- [ ] **Validação:** isPremium = true

---

## Testes de Acessibilidade

### VoiceOver (iOS)

- [ ] Ativar VoiceOver (Settings → Accessibility)
- [ ] Navegar pelo app
- [ ] Todos os elementos têm labels
- [ ] Botões anunciam ação
- [ ] **Validação:** 100% navegável via VoiceOver

### TalkBack (Android)

- [ ] Ativar TalkBack (Settings → Accessibility)
- [ ] Mesmos testes do VoiceOver
- [ ] **Validação:** 100% navegável via TalkBack

---

## Testes de Performance

### 1. Tempo de Carregamento

- [ ] Home screen carrega em < 2s
- [ ] NathIA responde em < 5s
- [ ] Ciclo tracker renderiza em < 1s
- [ ] **Validação:** Sem delays perceptíveis

### 2. Animações

- [ ] Transições suaves (60fps)
- [ ] Sem travamentos
- [ ] Feedback háptico funciona
- [ ] **Validação:** Performance fluída

---

## Testes de Conectividade

### 1. Modo Offline

- [ ] Desabilitar WiFi e dados móveis
- [ ] Abrir app
- [ ] Banner "Offline" aparece
- [ ] Funcionalidades locais funcionam (ciclo tracker)
- [ ] **Validação:** UX degradada gracefully

### 2. Reconexão

- [ ] Reabilitar conexão
- [ ] Banner desaparece
- [ ] Dados sincronizam automaticamente
- [ ] **Validação:** Sem perda de dados

---

## Checklist Final

### Antes de Submeter

- [ ] Todos os fluxos críticos testados
- [ ] Zero crashes ou erros fatais
- [ ] Permissões funcionando
- [ ] Notificações recebidas
- [ ] Performance aceitável (< 2s load time)
- [ ] Acessibilidade 100% (VoiceOver/TalkBack)
- [ ] Screenshots capturados
- [ ] Feature graphic criado

### Documentação

- [ ] `docs/TESTING_RESULTS.md` atualizado
- [ ] Bugs encontrados documentados em Issues
- [ ] Melhorias sugeridas anotadas

---

**Tempo estimado:** 2-3 horas
**Responsável:** QA Team / Developer

**Última atualização:** 25/12/2025
