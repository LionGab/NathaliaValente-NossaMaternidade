# 📥 Instruções para Baixar Imagens do Instagram

## Método Recomendado: Download Manual

### Passo 1: Acessar os Posts

Abra cada URL abaixo no seu navegador (com login no Instagram):

#### **Posts com Thales (PUERPERIO / MAE_RECENTE)**

1. **Post: Chegamos em Paris**
   - URL: https://www.instagram.com/nathaliavalente/p/DSchB9Pjnz3/
   - **Salvar como**: `stage-puerperio.jpg` ou `stage-mae-recente.jpg`
   - **Descrição**: Nathália com Thales em Paris

2. **Post: 1ª vez do Thales em um avião**
   - URL: https://www.instagram.com/nathaliavalente/p/DSaNWCrjvD7/
   - **Salvar como**: `checkin-nath-thales.jpg`
   - **Descrição**: Nathália segurando Thales no avião

3. **Post: Thales e Zuzu**
   - URL: https://www.instagram.com/nathaliavalente/p/DSTJIo3koYr/
   - **Salvar como**: `stage-mae-recente.jpg`
   - **Descrição**: Família com Thales e Zuzu

4. **Post: Zuzu - nova integrante**
   - URL: https://www.instagram.com/nathaliavalente/p/DSQrV_wEnun/
   - **Salvar como**: `concern-relacionamento.jpg`
   - **Descrição**: Família com nova integrante

#### **Posts de Paris (GRAVIDA_T2/T3)**

5. **Post: Última noite em Paris**
   - URL: https://www.instagram.com/nathaliavalente/p/DSle1-aCCwC/
   - **Salvar como**: `stage-gravida-t2.jpg` ou `stage-gravida-t3.jpg`
   - **Descrição**: Nathália em Paris (verificar se estava grávida)

6. **Post: The best photo**
   - URL: https://www.instagram.com/nathaliavalente/p/DSitUgijNJc/
   - **Salvar como**: `stage-gravida-t2.jpg` ou `stage-gravida-t3.jpg`
   - **Descrição**: Foto em Paris

### Passo 2: Baixar as Imagens

**Opção A: Download Manual**

1. Abra o post no navegador
2. Clique com botão direito na imagem principal
3. Selecione "Salvar imagem como" ou "Download"
4. Salve em: `assets/onboarding/images/`
5. Use o nome sugerido acima

**Opção B: Extensão do Browser**

1. Instale extensão "Downloader for Instagram" (Chrome/Firefox)
2. Acesse o post
3. Clique no ícone da extensão
4. Baixe a imagem
5. Renomeie conforme necessário

**Opção C: Site Online**

1. Acesse: https://instadp.com/ ou https://downloadgram.com/
2. Cole a URL do post
3. Baixe a imagem
4. Renomeie e mova para `assets/onboarding/images/`

### Passo 3: Organizar Arquivos

Após baixar, organize assim:

```
assets/onboarding/images/
├── stage-tentante.jpg          # Buscar posts mais antigos
├── stage-gravida-t1.jpg        # Buscar posts mais antigos
├── stage-gravida-t2.jpg        # Posts de Paris
├── stage-gravida-t3.jpg        # Posts de Paris
├── stage-puerperio.jpg         # Posts com Thales
├── stage-mae-recente.jpg       # Posts com Thales
├── concern-ansiedade.jpg       # Buscar posts sobre ansiedade
├── concern-informacao.jpg      # Buscar posts pesquisando
├── concern-sintomas.jpg        # Buscar posts sobre sintomas
├── concern-corpo.jpg           # Buscar posts mostrando barriga
├── concern-relacionamento.jpg  # Posts com parceiro/família
├── concern-trabalho.jpg        # Posts sobre trabalho/CEO
├── concern-solidao.jpg         # Posts sozinha
├── concern-financas.jpg        # Buscar posts sobre enxoval
├── emotional-bem.jpg           # Posts sorrindo
├── emotional-ansiosa-leve.jpg # Buscar posts sobre ansiedade leve
├── emotional-ansiosa-grave.jpg # Buscar posts sobre ansiedade grave
├── emotional-triste.jpg        # Buscar posts sobre cansaço/tristeza
├── checkin-nath-thales.jpg     # Post do avião
└── nath-profile-small.jpg      # Foto de perfil (60x60px)
```

### Passo 4: Verificar Downloads

Execute o script para verificar:

```bash
node scripts/download-instagram-images.js
```

## 📝 Notas Importantes

- **Direitos**: Certifique-se de ter permissão da Nathália para usar as imagens
- **Qualidade**: Use imagens em alta resolução (mínimo 800x600px)
- **Formato**: Salve como JPG (melhor compressão)
- **Tamanho**: Otimize se necessário (máximo 2MB por imagem)

## 🔄 Após Baixar

1. Execute o script de verificação
2. Atualize `src/config/nath-journey-onboarding-data.ts` substituindo placeholders
3. Teste visualmente no app

---

**Última atualização**: Janeiro 2025
