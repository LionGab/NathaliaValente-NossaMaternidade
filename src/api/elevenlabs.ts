/**
 * ElevenLabs Text-to-Speech Service
 *
 * Servico para converter texto em fala usando a API do ElevenLabs.
 * Usa chamadas diretas a API (NAO o SDK) para compatibilidade com Expo Go.
 * Audio playback gerenciado pelo expo-av.
 */

import * as FileSystem from "expo-file-system/legacy";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import { logger } from "../utils/logger";
import { fetchWithRetry, TIMEOUT_PRESETS } from "../utils/fetch-utils";
import {
  AppError,
  ErrorCode,
  wrapError,
  isAppError,
} from "../utils/error-handler";

// ============================================
// CONFIGURACAO
// ============================================

// API Key do ElevenLabs (via env)
const ELEVENLABS_API_KEY =
  Constants.expoConfig?.extra?.elevenLabsApiKey ||
  process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY ||
  "";

// Voice ID da NathIA (clone da Nathalia Valente)
// Fallback para voz feminina padrao se nao configurado
const NATHIA_VOICE_ID =
  Constants.expoConfig?.extra?.nathiaVoiceId ||
  process.env.EXPO_PUBLIC_NATHIA_VOICE_ID ||
  "EXAVITQu4vr4xnSDxMaL"; // Bella - voz feminina padrao

// URL base da API
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Configuracoes de voz otimizadas para NathIA
// Tom: Caloroso, maternal, brasileiro
const NATHIA_VOICE_SETTINGS = {
  stability: 0.5,           // Equilibrio entre consistencia e expressividade
  similarity_boost: 0.75,   // Proximidade com voz original
  style: 0.4,               // Expressividade moderada
  use_speaker_boost: true,  // Clareza aprimorada
};

// Modelos disponiveis
const MODELS = {
  MULTILINGUAL_V2: "eleven_multilingual_v2",  // Melhor para PT-BR
  FLASH_V2: "eleven_flash_v2_5",              // Mais rapido, menor qualidade
  TURBO_V2: "eleven_turbo_v2_5",              // Baixa latencia
} as const;

// ============================================
// TIPOS
// ============================================

interface GenerateSpeechOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  voiceSettings?: typeof NATHIA_VOICE_SETTINGS;
}

interface VoiceInfo {
  voice_id: string;
  name: string;
  category: string;
  language?: string;
}

interface ApiStatus {
  isAvailable: boolean;
  characterCount?: number;
  characterLimit?: number;
  canGenerate?: boolean;
}

// ============================================
// FUNCOES PRINCIPAIS
// ============================================

/**
 * Verifica se a API esta configurada
 */
export function isElevenLabsConfigured(): boolean {
  return !!ELEVENLABS_API_KEY && ELEVENLABS_API_KEY.length > 10;
}

/**
 * Gera fala a partir de texto usando a API do ElevenLabs
 * Retorna URI local do arquivo de audio para playback
 * Inclui retry + timeout para melhor reliability
 *
 * @param options - Opcoes de geracao
 * @returns URI do arquivo de audio local
 * @throws AppError se configuração inválida ou geração falhar
 */
export async function generateSpeech(
  options: GenerateSpeechOptions
): Promise<string> {
  const {
    text,
    voiceId = NATHIA_VOICE_ID,
    modelId = MODELS.MULTILINGUAL_V2,
    voiceSettings = NATHIA_VOICE_SETTINGS,
  } = options;

  // Validacoes
  if (!isElevenLabsConfigured()) {
    throw new AppError(
      "ElevenLabs API key not configured",
      ErrorCode.API_ERROR,
      "Áudio não está configurado. Contate o suporte.",
      undefined,
      { component: "ElevenLabs" }
    );
  }

  if (!text || text.trim().length === 0) {
    throw new AppError(
      "Text is required for speech generation",
      ErrorCode.INVALID_INPUT,
      "Texto vazio não pode ser convertido em áudio.",
      undefined,
      { component: "ElevenLabs" }
    );
  }

  // Validar limite de caracteres (ElevenLabs tem limites)
  const MAX_CHARS = 5000; // Limite conservador
  if (text.length > MAX_CHARS) {
    throw new AppError(
      `Text exceeds maximum length: ${text.length} > ${MAX_CHARS}`,
      ErrorCode.INVALID_INPUT,
      `Texto muito longo. Máximo ${MAX_CHARS} caracteres.`,
      undefined,
      { component: "ElevenLabs", textLength: text.length, maxChars: MAX_CHARS }
    );
  }

  const trimmedText = text.trim();

  logger.debug("Generating speech", "ElevenLabs", {
    textLength: trimmedText.length,
    voiceId,
    modelId,
  });

  try {
    // Chamar API COM RETRY + TIMEOUT
    const response = await fetchWithRetry(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: modelId,
          voice_settings: voiceSettings,
        }),
        // TTS pode demorar dependendo do tamanho do texto
        timeoutMs: TIMEOUT_PRESETS.LONG,
        context: "ElevenLabs",
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
        maxDelay: 5000,
        retryable: (error) => {
          if (isAppError(error)) {
            // Não retry em erros de autenticação ou validação
            return ![
              ErrorCode.UNAUTHORIZED,
              ErrorCode.INVALID_INPUT,
            ].includes(error.code as ErrorCode);
          }
          return true;
        },
      }
    );

    // Obter audio como blob
    const audioBlob = await response.blob();

    if (audioBlob.size === 0) {
      throw new AppError(
        "Empty audio response from ElevenLabs",
        ErrorCode.API_ERROR,
        "Resposta inválida do servidor de áudio.",
        undefined,
        { component: "ElevenLabs" }
      );
    }

    // Converter blob para base64
    const base64Audio = await blobToBase64(audioBlob);

    // Salvar em arquivo local para playback
    if (!FileSystem.cacheDirectory) {
      throw new AppError(
        "Cache directory not available",
        ErrorCode.API_ERROR,
        "Erro ao salvar arquivo de áudio.",
        undefined,
        { component: "ElevenLabs" }
      );
    }

    const filename = `nathia_voice_${Date.now()}.mp3`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, base64Audio, {
      encoding: FileSystem.EncodingType.Base64,
    });

    logger.info("Speech generated successfully", "ElevenLabs", {
      textLength: trimmedText.length,
      audioSize: audioBlob.size,
      fileUri,
    });

    return fileUri;
  } catch (error) {
    // Se já é AppError, re-throw
    if (isAppError(error)) {
      throw error;
    }

    // Converter erro genérico
    throw wrapError(
      error,
      ErrorCode.AUDIO_PROCESSING_ERROR,
      "Erro ao gerar áudio. Tente novamente.",
      {
        component: "ElevenLabs",
        textLength: trimmedText.length,
      }
    );
  }
}

/**
 * Reproduz arquivo de audio usando expo-av
 *
 * @param fileUri - URI do arquivo de audio
 * @returns Instancia do Audio.Sound para controle de playback
 */
export async function playAudio(fileUri: string): Promise<Audio.Sound> {
  try {
    // Configurar sessao de audio
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,       // Tocar mesmo no silencioso
      staysActiveInBackground: false,   // Nao continuar em background
      shouldDuckAndroid: true,          // Reduzir volume de outros apps
    });

    // Criar e reproduzir som
    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: true, volume: 1.0 }
    );

    logger.info("Audio playback started", "ElevenLabs", { fileUri });

    return sound;
  } catch (error) {
    logger.error(
      "Audio playback failed",
      "ElevenLabs",
      error instanceof Error ? error : new Error(String(error))
    );
    throw error;
  }
}

/**
 * Para e descarrega um som
 */
export async function stopAudio(sound: Audio.Sound | null): Promise<void> {
  if (!sound) return;

  try {
    await sound.stopAsync();
    await sound.unloadAsync();
    logger.info("Audio stopped and unloaded", "ElevenLabs");
  } catch {
    // Silenciar erro - pode ja estar descarregado
  }
}

/**
 * Verifica status da API e quota de caracteres
 */
export async function checkApiStatus(): Promise<ApiStatus> {
  if (!isElevenLabsConfigured()) {
    return { isAvailable: false };
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/user/subscription`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      return { isAvailable: false };
    }

    const data = await response.json();

    const characterCount = data.character_count || 0;
    const characterLimit = data.character_limit || 0;
    const canGenerate = characterCount < characterLimit;

    return {
      isAvailable: true,
      characterCount,
      characterLimit,
      canGenerate,
    };
  } catch (error) {
    logger.error(
      "Failed to check API status",
      "ElevenLabs",
      error instanceof Error ? error : new Error(String(error))
    );
    return { isAvailable: false };
  }
}

/**
 * Lista vozes disponiveis na conta
 */
export async function getAvailableVoices(): Promise<VoiceInfo[]> {
  if (!isElevenLabsConfigured()) {
    return [];
  }

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    logger.error(
      "Failed to get voices",
      "ElevenLabs",
      error instanceof Error ? error : new Error(String(error))
    );
    return [];
  }
}

/**
 * Limpa arquivos de audio em cache
 * Deve ser chamado periodicamente para liberar espaco
 */
export async function cleanupAudioCache(): Promise<number> {
  try {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return 0;

    const files = await FileSystem.readDirectoryAsync(cacheDir);
    const audioFiles = files.filter((f) => f.startsWith("nathia_voice_"));

    let deletedCount = 0;
    for (const file of audioFiles) {
      try {
        await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
        deletedCount++;
      } catch {
        // Ignorar erros de arquivos individuais
      }
    }

    logger.info("Audio cache cleaned", "ElevenLabs", {
      filesRemoved: deletedCount,
    });

    return deletedCount;
  } catch (error) {
    logger.error(
      "Failed to clean audio cache",
      "ElevenLabs",
      error instanceof Error ? error : new Error(String(error))
    );
    return 0;
  }
}

// ============================================
// HELPERS
// ============================================

/**
 * Converte Blob para string Base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove o prefixo data URL (ex: "data:audio/mpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ============================================
// EXPORTS
// ============================================

export {
  NATHIA_VOICE_ID,
  NATHIA_VOICE_SETTINGS,
  MODELS,
};
