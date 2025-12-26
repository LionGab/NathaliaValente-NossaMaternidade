import { supabase } from "../api/supabase";
import { logger } from "../utils/logger";
import { CommunityPost, MediaType } from "../types/community";

export const communityService = {
  // Feed Aprovado
  getFeed: async (page = 1, limit = 10): Promise<CommunityPost[]> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "CommunityService");
        return [];
      }

      const { data, error } = await supabase.functions.invoke("community-feed", {
        body: { page, limit, type: "feed" },
      });

      if (error) throw error;
      return data.data || [];
    } catch (error) {
      logger.error("Erro ao buscar feed Comunidade", "CommunityService", error as Error);
      return [];
    }
  },

  // Meus Posts
  getMyPosts: async (page = 1, limit = 10): Promise<CommunityPost[]> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "CommunityService");
        return [];
      }

      const { data, error } = await supabase.functions.invoke("community-feed", {
        body: { page, limit, type: "my_posts" },
      });

      if (error) throw error;
      return data.data || [];
    } catch (error) {
      logger.error("Erro ao buscar meus posts", "CommunityService", error as Error);
      return [];
    }
  },

  // Criar Post (Upload via FormData para evitar crash de memória com vídeos)
  createPost: async (
    text: string,
    mediaUri: string | null,
    mediaType: MediaType,
    tags: string[] = []
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "CommunityService");
        return { success: false, error: "Supabase not initialized" };
      }

      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Usuário não autenticado");

      let mediaPath = null;

      // 1. Upload Mídia (se houver)
      if (mediaUri) {
        const ext = mediaUri.split(".").pop() || "jpg";
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const path = `${user.id}/${fileName}`;

        // Usar FormData é mais eficiente para memória do que base64
        const formData = new FormData();
        formData.append("files", {
          uri: mediaUri,
          name: fileName,
          type: mediaType === "video" ? "video/mp4" : "image/jpeg",
        } as any);

        const { error: uploadError } = await supabase.storage
          .from("community-media")
          .upload(path, formData, {
            contentType: mediaType === "video" ? "video/mp4" : "image/jpeg",
            upsert: false,
          });

        if (uploadError) {
          // Fallback para arrayBuffer se FormData falhar (alguns ambientes RN antigos)
          // Mas tentamos FormData primeiro
          throw uploadError;
        }
        mediaPath = path;
      }

      // 2. Insert Post (community_posts not in generated types yet)
      const { error: insertError } = await (supabase as any)
        .from("community_posts")
        .insert({
          author_id: user.id,
          text,
          media_path: mediaPath,
          media_type: mediaType,
          tags,
          status: "submitted",
        });

      if (insertError) throw insertError;

      return { success: true };
    } catch (error) {
      logger.error("Erro ao criar post", "CommunityService", error as Error);
      return { success: false, error: (error as Error).message };
    }
  },
};
