# Sessão de Polimento UI - 16 Dez 2025

## Resumo Geral

Polimento das telas principais seguindo o design system **Calm FemTech**:
- Azul domina, rosa aparece como "momento de ação"
- Superfícies silenciosas, estados visuais fortes
- Sem cores "arco-íris", sem gradientes pesados

---

## 1. HomeScreen - Polimento Premium

### Check-in Emocional (`EmotionalCheckInPrimary.tsx`)
- **Emojis em vez de ícones**: 😊 😴 😔 ❤️ (comunicam emoção em 0.2s)
- **Estados visuais fortes**:
  - Selected: `bg primary[100]`, `border primary[400]`, `text primary`
  - Unselected: `bg surface.elevated`, `border neutral[200]`, `text muted`

### CTA Rosa
- Suavizado: `accent[400]` em vez de `accent[500]`
- Texto navy (`neutral[900]`)
- Borda sutil, sem sombra pesada

### Cards Secundários (`RowCard.tsx`)
- Padrão **outlined sem sombra** (removido `SHADOWS.sm`)
- Calm FemTech = superfícies limpas

### Tab Bar (`MainTabNavigator.tsx`)
- Label "NathIA" sempre visível no botão central
- Estados: active `primary[500]`, inactive `neutral[400]`

---

## 2. MundoDaNathScreen - Refatoração Completa

### Header
- **Removido botão back** (é TAB, não stack)
- Gradiente suave: `primary[100] → primary[50] → surface`
- **Métricas em linha única**: "5 posts • 12.5K seg • 5.601 curtidas"

### Foto da Nathalia
- URL: `https://i.imgur.com/37dbPJE.jpg`
- **Header**: 72x72px com zoom (100x100px, offset -14)
- **Posts**: 40x40px com zoom (56x56px, offset -8)
- Técnica: container com `overflow: hidden` + imagem maior com margin negativo

### Destaques (Stories)
- **Removido arco-íris**: todas usam `primary[100]` como `thumbnailColor`
- Borda ativa: `primary[400]`
- Borda inativa: `neutral[200]`

### Post Cards
- **Removido `POST_TYPE_CONFIG`** (simplificação)
- Badge de tipo só aparece para `tip` ("Dica")
- "Criadora" virou ícone ✓ verificado discreto
- **Fixado**: fundo `primary[50]` sutil (não gradiente)

---

## 3. CommunityScreen - Reescrita Total

### Conceito
- **Feed único** tipo Instagram (removido tabs Feed/Grupos)
- **Sem grupos** - comunidade única "Mães Valente"
- Posts enviados para **revisão** antes de publicar

### Composer Estilo Facebook
```
┌─────────────────────────────────────────────┐
│ 👤  No que você está pensando?              │
├─────────────────────────────────────────────┤
│        📷 Foto          🎬 Vídeo            │
└─────────────────────────────────────────────┘

Sobre o que você quer falar?

❓ Dúvida   💭 Desabafo   😴 Sono   🤢 Enjoo
😰 Ansiedade   🤱 Amamentação   👶 Bebê   🎉 Vitória
```

### Tópicos de Dores/Dúvidas
| Emoji | Tópico | Por que |
|-------|--------|---------|
| ❓ | Dúvida | Perguntas gerais |
| 💭 | Desabafo | Lugar seguro |
| 😴 | Sono | Maior dor na gravidez/pós-parto |
| 🤢 | Enjoo | Comum no 1º trimestre |
| 😰 | Ansiedade | Saúde mental |
| 🤱 | Amamentação | Desafios comuns |
| 👶 | Bebê | Dúvidas sobre cuidados |
| 🎉 | Vitória | Celebrar conquistas |

### Sistema de Revisão
- Post criado com `status: "pending"`
- Badge "Em revisão" aparece no card
- Toast: "Post enviado para revisão!"
- Tipo `Post` atualizado com campo `status?: "pending" | "approved" | "rejected"`

### FAB + Modal
- FAB azul no canto inferior direito
- Modal dedicado para criar post
- Suporte: texto + imagem + vídeo (máx 1 min)

---

## 4. Tipos Atualizados (`navigation.ts`)

```typescript
export interface Post {
  // ... campos existentes
  videoUrl?: string;
  status?: "pending" | "approved" | "rejected";
}
```

---

## Arquivos Modificados

1. `src/components/home/EmotionalCheckInPrimary.tsx`
2. `src/screens/HomeScreen.tsx`
3. `src/components/ui/RowCard.tsx`
4. `src/navigation/MainTabNavigator.tsx`
5. `src/screens/MundoDaNathScreen.tsx`
6. `src/screens/CommunityScreen.tsx`
7. `src/types/navigation.ts`

---

## Constantes Importantes

```typescript
// Foto da Nathalia Valente
const NATHALIA_AVATAR_URL = "https://i.imgur.com/37dbPJE.jpg";
```

---

## Princípios Calm FemTech Aplicados

1. **Azul domina** - primary como cor base
2. **Rosa = ação** - accent para CTAs e destaques
3. **Sem arco-íris** - cores comunicam estados, não categorias
4. **Outlined > elevated** - superfícies limpas sem sombras pesadas
5. **Estados fortes** - seleção óbvia com borda + fundo
6. **Badges mínimos** - máx 2 por card
7. **Verificado discreto** - ícone ✓ em vez de texto "Criadora"
