/**
 * Serviço de upload de imagens para Imgur
 * Usa a API do Imgur para fazer upload de imagens e retornar URLs públicas
 */

import { logger } from "../utils/logger";

const IMGUR_API_URL = "https://api.imgur.com/3/image";
const IMGUR_CLIENT_ID = process.env.EXPO_PUBLIC_IMGUR_CLIENT_ID;

export interface ImgurUploadResponse {
  success: boolean;
  data?: {
    id: string;
    link: string;
    deletehash?: string;
    width: number;
    height: number;
    size: number;
    type: string;
  };
  error?: string;
}

/**
 * Faz upload de uma imagem para o Imgur usando FormData
 * @param imageUri URI local da imagem (file:// ou asset://)
 * @returns URL pública da imagem no Imgur
 */
export async function uploadImageToImgur(imageUri: string): Promise<string> {
  if (!IMGUR_CLIENT_ID) {
    logger.error("Imgur Client ID não configurado", "ImgurService");
    throw new Error("Configuração do Imgur não encontrada. Verifique EXPO_PUBLIC_IMGUR_CLIENT_ID");
  }

  try {
    // Criar FormData com a imagem
    const formData = new FormData();
    
    // Extrair nome do arquivo da URI
    const filename = imageUri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";
    
    formData.append("image", {
      uri: imageUri,
      type,
      name: filename,
    } as unknown as Blob);

    // Fazer upload para Imgur
    logger.info("Fazendo upload para Imgur", "ImgurService");
    const response = await fetch(IMGUR_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Client-ID ${IMGUR_CLIENT_ID}`,
        // Não definir Content-Type - o fetch vai definir automaticamente com boundary para FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error("Erro na API do Imgur", "ImgurService", undefined, {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
      throw new Error(`Erro ao fazer upload: ${response.status} ${response.statusText}`);
    }

    const result: ImgurUploadResponse = await response.json();

    if (!result.success || !result.data?.link) {
      logger.error("Resposta inválida do Imgur", "ImgurService", undefined, { result });
      throw new Error("Resposta inválida do servidor Imgur");
    }

    logger.info("Upload concluído com sucesso", "ImgurService", { imageUrl: result.data.link });
    return result.data.link;
  } catch (error) {
    logger.error("Erro ao fazer upload para Imgur", "ImgurService", error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

/**
 * Faz upload de múltiplas imagens para o Imgur
 * @param imageUris Array de URIs locais das imagens
 * @returns Array de URLs públicas das imagens no Imgur
 */
export async function uploadMultipleImagesToImgur(imageUris: string[]): Promise<string[]> {
  try {
    const uploadPromises = imageUris.map((uri) => uploadImageToImgur(uri));
    const urls = await Promise.all(uploadPromises);
    logger.info("Upload de múltiplas imagens concluído", "ImgurService", { count: urls.length });
    return urls;
  } catch (error) {
    logger.error("Erro ao fazer upload de múltiplas imagens", "ImgurService", error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

