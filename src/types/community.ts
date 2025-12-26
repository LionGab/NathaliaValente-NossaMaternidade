export type PostStatus = "draft" | "submitted" | "approved" | "rejected" | "needs_changes";
export type MediaType = "text" | "image" | "video";

export interface CommunityPost {
  id: string;
  author_id: string;
  text: string | null;
  media_path: string | null;
  media_type: MediaType;
  tags: string[] | null;
  status: PostStatus;
  review_reason: string | null;
  created_at: string;
  published_at: string | null;
  // Campos virtuais
  profiles?: {
    name: string;
    avatar_url: string;
  };
  signed_media_url?: string | null;
}

export interface MundoNathPost {
  id: string;
  type: MediaType;
  text: string | null;
  media_path: string | null;
  is_published: boolean;
  published_at: string;
  signed_media_url?: string | null;
  is_locked?: boolean;
}
