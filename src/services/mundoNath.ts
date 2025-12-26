import { supabase } from "../api/supabase";
import { logger } from "../utils/logger";
import { MundoNathPost } from "../types/community";

export const mundoNathService = {
  getFeed: async (page = 1, limit = 10): Promise<{ data: MundoNathPost[]; isPremium: boolean }> => {
    try {
      if (!supabase) {
        logger.warn("Supabase not initialized", "MundoNathService");
        return { data: [], isPremium: false };
      }

      const { data, error } = await supabase.functions.invoke("mundo-nath-feed", {
        body: { page, limit },
      });

      if (error) throw error;

      return {
        data: data.data || [],
        isPremium: data.user_is_premium || false,
      };
    } catch (error) {
      logger.error("Erro ao buscar feed Mundo Nath", "MundoNathService", error as Error);
      return { data: [], isPremium: false };
    }
  },
};
