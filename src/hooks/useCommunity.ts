/**
 * useCommunity Hook
 *
 * Hook customizado para gerenciar estado e lógica da Community
 */

import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Share } from "react-native";
import { MOCK_POSTS } from "../config/community";
import { useAppStore, useCommunityStore } from "../state/store";
import type { MainTabScreenProps, Post } from "../types/navigation";

type NavigationProp = MainTabScreenProps<"Community">["navigation"];

export interface UseCommunityReturn {
  // State
  posts: Post[];
  filteredPosts: Post[];
  isSearchVisible: boolean;
  searchQuery: string;
  isNewPostModalVisible: boolean;

  // Handlers
  handleNewPost: (content: string, mediaUri?: string) => void;
  handleCommentPress: (postId: string) => Promise<void>;
  handleSharePress: (post: Post) => Promise<void>;
  handlePostPress: (postId: string) => void;
  handleSearchToggle: () => Promise<void>;
  handleLike: (postId: string) => void;
  openNewPostModal: () => void;
  closeNewPostModal: () => void;
  setSearchQuery: (query: string) => void;
}

export function useCommunity(navigation: NavigationProp): UseCommunityReturn {
  // Store selectors (individual para evitar re-renders)
  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const setPosts = useCommunityStore((s) => s.setPosts);
  const addPost = useCommunityStore((s) => s.addPost);
  const userName = useAppStore((s) => s.user?.name);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isNewPostModalVisible, setIsNewPostModalVisible] = useState(false);

  // Inicializar posts mock se vazio
  useEffect(() => {
    if (posts.length === 0) {
      setPosts(MOCK_POSTS);
    }
  }, [posts.length, setPosts]);

  // Posts filtrados pela busca
  const filteredPosts = useMemo(() => {
    const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;

    if (!searchQuery.trim()) {
      return displayPosts;
    }

    const query = searchQuery.toLowerCase();
    return displayPosts.filter(
      (post) =>
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query) ||
        post.type?.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleNewPost = useCallback(
    (content: string, mediaUri?: string) => {
      const newPost: Post = {
        id: Date.now().toString(),
        authorId: "currentUser",
        authorName: userName || "Você",
        content,
        imageUrl: mediaUri,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        type: "geral",
        status: "pending",
      };
      addPost(newPost);
    },
    [addPost, userName]
  );

  const handleCommentPress = useCallback(
    async (postId: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  const handleSharePress = useCallback(async (post: Post) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${post.content.substring(0, 100)}... - via Nossa Maternidade`,
      });
    } catch {
      // Silent error
    }
  }, []);

  const handlePostPress = useCallback(
    (postId: string) => {
      navigation.navigate("PostDetail", { postId });
    },
    [navigation]
  );

  const handleSearchToggle = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSearchVisible((prev) => {
      if (prev) {
        setSearchQuery("");
      }
      return !prev;
    });
  }, []);

  const handleLike = useCallback(
    (postId: string) => {
      toggleLike(postId);
    },
    [toggleLike]
  );

  const openNewPostModal = useCallback(() => {
    setIsNewPostModalVisible(true);
  }, []);

  const closeNewPostModal = useCallback(() => {
    setIsNewPostModalVisible(false);
  }, []);

  return {
    // State
    posts,
    filteredPosts,
    isSearchVisible,
    searchQuery,
    isNewPostModalVisible,

    // Handlers
    handleNewPost,
    handleCommentPress,
    handleSharePress,
    handlePostPress,
    handleSearchToggle,
    handleLike,
    openNewPostModal,
    closeNewPostModal,
    setSearchQuery,
  };
}
