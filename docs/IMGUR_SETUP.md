# Configuração do Imgur - Upload de Imagens

## Visão Geral

O app está configurado para fazer upload de imagens usando a API do Imgur. As imagens são enviadas para o Imgur e retornam URLs públicas que podem ser usadas nos posts da comunidade.

## Configuração

### 1. Obter Client ID do Imgur

1. Acesse: https://api.imgur.com/oauth2/addclient
2. Faça login na sua conta Imgur
3. Preencha o formulário:
   - **Application name**: Nossa Maternidade
   - **Authorization type**: Anonymous usage without user authorization
   - **Authorization callback URL**: (deixe em branco)
   - **App website**: (opcional)
   - **Email**: seu email
4. Clique em "Submit"
5. Copie o **Client ID** gerado

### 2. Configurar Variável de Ambiente

Adicione a variável de ambiente no arquivo `.env`:

```bash
EXPO_PUBLIC_IMGUR_CLIENT_ID=seu_client_id_aqui
```

**⚠️ IMPORTANTE**: 
- NUNCA commite o arquivo `.env` (ele está no `.gitignore`)
- Use apenas o `env.template` como referência
- Para produção, configure via EAS Secrets: `eas secret:create --scope project --name EXPO_PUBLIC_IMGUR_CLIENT_ID --value "seu_client_id"`

### 3. Reiniciar o Servidor

Após adicionar a variável de ambiente, reinicie o servidor Expo:

```bash
npm start -- --clear
```

## Uso no Código

### Serviço de Upload

O serviço está localizado em `src/api/imgur.ts`:

```typescript
import { uploadImageToImgur } from "../api/imgur";

// Upload de uma imagem
const imageUrl = await uploadImageToImgur(localImageUri);

// Upload de múltiplas imagens
const imageUrls = await uploadMultipleImagesToImgur([uri1, uri2, uri3]);
```

### Telas Integradas

#### NewPostScreen
- ✅ Upload de imagens da galeria
- ✅ Upload de fotos da câmera
- ✅ Preview da imagem antes de publicar
- ✅ Indicador de progresso durante upload

#### CommunityComposer
- ⏳ Pendente: Integração de upload de imagens

## Limites da API do Imgur

- **Rate Limit**: 1.250 uploads por dia (Anonymous)
- **Tamanho máximo**: 10 MB por imagem
- **Formatos suportados**: JPEG, PNG, GIF, APNG, TIFF, BMP, PDF, XCF (formato de imagem)

## Troubleshooting

### Erro: "Configuração do Imgur não encontrada"
- Verifique se `EXPO_PUBLIC_IMGUR_CLIENT_ID` está configurado no `.env`
- Reinicie o servidor Expo após adicionar a variável

### Erro: "Erro ao fazer upload: 403"
- Verifique se o Client ID está correto
- Verifique se não excedeu o limite diário de uploads

### Erro: "Erro ao fazer upload: 400"
- Verifique o tamanho da imagem (máximo 10 MB)
- Verifique o formato da imagem (deve ser um formato suportado)

## Próximos Passos

1. ✅ Serviço de upload criado
2. ✅ NewPostScreen integrado
3. ⏳ CommunityComposer - adicionar suporte a imagens
4. ⏳ Exibir imagens nos posts do feed
5. ⏳ Exibir imagens na tela de detalhes do post

