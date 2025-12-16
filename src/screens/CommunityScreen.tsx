/**
 * CommunityScreen - Tela de Comunidade "Mães Valente"
 *
 * Melhorias UX aplicadas:
 * - UMA ação primária de criação (no Composer, não no header)
 * - Header compacto (título + busca inline + tabs)
 * - Tabs como Segmented Control
 * - Contraste WCAG 2.2 AA
 * - Cores Nurture & Calm
 */

import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, FlatList, Pressable, TextInput, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { MainTabScreenProps, Post, Group } from "../types/navigation";
import { useCommunityStore, useAppStore } from "../state/store";
import CommunityComposer from "../components/CommunityComposer";
import * as Haptics from "expo-haptics";
import { useTheme } from "../hooks/useTheme";
import { COLORS, SPACING, RADIUS } from "../theme/design-system";

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    authorId: "user1",
    authorName: "Mariana Santos",
    content: "Acabei de descobrir que estou grávida! Estou tão feliz e nervosa ao mesmo tempo. Alguém tem dicas para o primeiro trimestre?",
    likesCount: 45,
    commentsCount: 23,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
    type: "duvida",
  },
  {
    id: "2",
    authorId: "user2",
    authorName: "Camila Oliveira",
    content: "O sono no terceiro trimestre está impossível. Já tentei almofadas de amamentação, mas nada funciona. O que vocês usam?",
    likesCount: 32,
    commentsCount: 18,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
    type: "desabafo",
  },
  {
    id: "3",
    authorId: "user3",
    authorName: "Juliana Costa",
    content: "Minha bebê completou 3 meses hoje! O tempo voa. Compartilhando essa conquista com vocês que me apoiaram tanto durante a gestação.",
    likesCount: 89,
    commentsCount: 34,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isLiked: false,
    type: "vitoria",
  },
  {
    id: "4",
    authorId: "user4",
    authorName: "Patricia Lima",
    content: "Meninas, alguém mais está sentindo muitas dores nas costas? Tenho 28 semanas e está bem desconfortável.",
    likesCount: 28,
    commentsCount: 15,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    isLiked: false,
    type: "duvida",
  },
  {
    id: "5",
    authorId: "user5",
    authorName: "Fernanda Souza",
    content: "Acabei de fazer minha primeira ultrassom! Ver o coraçãozinho batendo foi emocionante demais. Chorei muito! 💕",
    likesCount: 156,
    commentsCount: 42,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    isLiked: true,
    type: "vitoria",
  },
];

const MOCK_GROUPS: Group[] = [
  { id: "1", name: "Primeiro Trimestre", description: "Para mamães no início da jornada", memberCount: 1234, category: "gestacao" },
  { id: "2", name: "Amamentação", description: "Dicas e apoio para amamentar", memberCount: 2456, category: "pos-parto" },
  { id: "3", name: "Exercícios na Gravidez", description: "Mantendo-se ativa com segurança", memberCount: 890, category: "saude" },
  { id: "4", name: "Mães de Primeira Viagem", description: "Para quem está vivendo isso pela primeira vez", memberCount: 3421, category: "geral" },
  { id: "5", name: "Alimentação Saudável", description: "Nutrição para você e seu bebê", memberCount: 1876, category: "nutricao" },
  { id: "6", name: "Pós-parto Real", description: "Compartilhando experiências reais", memberCount: 2103, category: "pos-parto" },
];

// Cores por categoria (Nurture & Calm)
const CATEGORY_COLORS: Record<string, string> = {
  gestacao: COLORS.accent[500], // Rosa queimado
  "pos-parto": COLORS.secondary[400], // Azul suave
  saude: COLORS.primary[500], // Teal
  geral: COLORS.semantic.warning,
  nutricao: COLORS.primary[600],
};

// Estilos de tipos de post
const POST_TYPE_STYLES: Record<string, { emoji: string; label: string; color: string; bgColor: string }> = {
  duvida: { emoji: "❓", label: "Dúvida", color: COLORS.secondary[600], bgColor: COLORS.secondary[50] },
  desabafo: { emoji: "💭", label: "Desabafo", color: "#8B5CF6", bgColor: "#F5F3FF" },
  vitoria: { emoji: "🎉", label: "Vitória", color: COLORS.semantic.success, bgColor: "#ECFDF5" },
  dica: { emoji: "💡", label: "Dica", color: COLORS.semantic.warning, bgColor: "#FFFBEB" },
};

// Componente de Tab (Segmented Control)
const SegmentedTab: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
  position: "left" | "right";
}> = ({ label, isActive, onPress, position }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderRadius = {
    borderTopLeftRadius: position === "left" ? RADIUS.lg : 0,
    borderBottomLeftRadius: position === "left" ? RADIUS.lg : 0,
    borderTopRightRadius: position === "right" ? RADIUS.lg : 0,
    borderBottomRightRadius: position === "right" ? RADIUS.lg : 0,
  };

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          {
            paddingVertical: SPACING.md,
            alignItems: "center",
            backgroundColor: isActive ? COLORS.primary[500] : COLORS.neutral[100],
          },
          borderRadius,
        ]}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 14,
            color: isActive ? "#FFFFFF" : COLORS.text.secondary,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default function CommunityScreen({ navigation }: MainTabScreenProps<"Community">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"feed" | "groups">("feed");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const setPosts = useCommunityStore((s) => s.setPosts);
  const addPost = useCommunityStore((s) => s.addPost);
  const userName = useAppStore((s) => s.user?.name);

  const handleNewPost = useCallback((content: string, type: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: "currentUser",
      authorName: userName || "Você",
      content,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      type,
    };
    addPost(newPost);
  }, [addPost, userName]);

  const handleCommentPress = useCallback(async (postId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("PostDetail", { postId });
  }, [navigation]);

  const handleSharePress = useCallback(async (post: Post) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${post.content.substring(0, 100)}... - via Nossa Maternidade`,
      });
    } catch {
      // Handle error silently
    }
  }, []);

  const handleOptionsPress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // For future: show action sheet with options
  }, []);

  const handleJoinGroup = useCallback(async (groupId: string) => {
    void groupId;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ComingSoon", {
      title: "Participar do Grupo",
      description: "Em breve você poderá participar de grupos e interagir com outras mães.",
      emoji: "👥",
      primaryCtaLabel: "Voltar",
      secondaryCtaLabel: "Ver Comunidade",
      relatedRoute: "Community",
    });
  }, [navigation]);

  const handleCreateGroup = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Criar Grupo",
      description: "Em breve você poderá criar seu próprio grupo e reunir mães com interesses similares.",
      emoji: "✨",
      primaryCtaLabel: "Voltar",
    });
  }, [navigation]);

  const handleLoadMore = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // For future: load more posts from API
  }, []);

  const handleSearchToggle = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSearchExpanded((prev) => !prev);
    if (isSearchExpanded) {
      setSearchQuery("");
    }
  }, [isSearchExpanded]);

  React.useEffect(() => {
    if (posts.length === 0) {
      setPosts(MOCK_POSTS);
    }
  }, [posts.length, setPosts]);

  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;

  const formatTimeAgo = useCallback((dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "agora";
    if (hours === 1) return "há 1 hora";
    if (hours < 24) return `há ${hours} horas`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "há 1 dia";
    return `há ${days} dias`;
  }, []);

  // Cores do tema
  const bgPrimary = isDark ? colors.background.primary : COLORS.background.primary;
  const bgCard = isDark ? colors.background.secondary : "#FFFFFF";
  const textPrimary = isDark ? colors.neutral[100] : COLORS.text.primary;
  const textSecondary = isDark ? colors.neutral[400] : COLORS.text.secondary;
  const textTertiary = isDark ? colors.neutral[500] : COLORS.text.tertiary;
  const borderColor = isDark ? colors.neutral[700] : COLORS.neutral[200];

  const renderPost = useCallback((post: Post, index: number) => {
    const postType = post.type ? POST_TYPE_STYLES[post.type] : null;

    return (
      <Animated.View
        key={post.id}
        entering={FadeInUp.delay(index * 60).duration(400).springify()}
        style={{ marginBottom: SPACING.lg }}
      >
        <Pressable
          onPress={() => navigation.navigate("PostDetail", { postId: post.id })}
          style={{
            backgroundColor: bgCard,
            borderRadius: RADIUS["2xl"],
            padding: SPACING.lg,
            borderWidth: 1,
            borderColor,
            shadowColor: COLORS.neutral[900],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
          }}
        >
          {/* Post Type Badge */}
          {postType && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                marginBottom: SPACING.sm,
                paddingHorizontal: SPACING.md,
                paddingVertical: SPACING.xs,
                borderRadius: RADIUS.full,
                backgroundColor: postType.bgColor,
              }}
            >
              <Text style={{ fontSize: 12, marginRight: 4 }}>{postType.emoji}</Text>
              <Text style={{ color: postType.color, fontSize: 12, fontWeight: "600" }}>
                {postType.label}
              </Text>
            </View>
          )}

          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.md }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: COLORS.primary[100],
                alignItems: "center",
                justifyContent: "center",
                marginRight: SPACING.md,
              }}
            >
              <Ionicons name="person" size={20} color={COLORS.primary[500]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: textPrimary, fontSize: 15, fontWeight: "600" }}>
                {post.authorName}
              </Text>
              <Text style={{ color: textTertiary, fontSize: 12, marginTop: 2 }}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
            <Pressable onPress={handleOptionsPress} style={{ padding: SPACING.sm }}>
              <Ionicons name="ellipsis-horizontal" size={18} color={textTertiary} />
            </Pressable>
          </View>

          {/* Content */}
          <Text style={{ color: textSecondary, fontSize: 15, lineHeight: 22, marginBottom: SPACING.lg }}>
            {post.content}
          </Text>

          {/* Actions */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingTop: SPACING.md,
              borderTopWidth: 1,
              borderTopColor: borderColor,
            }}
          >
            <Pressable
              onPress={() => toggleLike(post.id)}
              style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING["2xl"] }}
            >
              <Ionicons
                name={post.isLiked ? "heart" : "heart-outline"}
                size={20}
                color={post.isLiked ? COLORS.accent[500] : textTertiary}
              />
              <Text
                style={{
                  fontSize: 13,
                  marginLeft: SPACING.sm,
                  fontWeight: "500",
                  color: post.isLiked ? COLORS.accent[500] : textSecondary,
                }}
              >
                {post.likesCount}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleCommentPress(post.id)}
              style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING["2xl"] }}
            >
              <Ionicons name="chatbubble-outline" size={18} color={textTertiary} />
              <Text style={{ fontSize: 13, marginLeft: SPACING.sm, fontWeight: "500", color: textSecondary }}>
                {post.commentsCount}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleSharePress(post)}
              style={{ flexDirection: "row", alignItems: "center", marginLeft: "auto" }}
            >
              <Ionicons name="share-outline" size={18} color={textTertiary} />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  }, [bgCard, borderColor, formatTimeAgo, handleCommentPress, handleOptionsPress, handleSharePress, navigation, textPrimary, textSecondary, textTertiary, toggleLike]);

  const renderGroup = useCallback((group: Group, index: number) => {
    const categoryColor = CATEGORY_COLORS[group.category] || COLORS.primary[500];

    return (
      <Animated.View
        key={group.id}
        entering={FadeInUp.delay(index * 60).duration(400).springify()}
        style={{ marginBottom: SPACING.lg }}
      >
        <Pressable
          style={{
            backgroundColor: bgCard,
            borderRadius: RADIUS["2xl"],
            padding: SPACING.lg,
            borderWidth: 1,
            borderColor,
            borderLeftWidth: 4,
            borderLeftColor: categoryColor,
            shadowColor: COLORS.neutral[900],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: SPACING.md }}>
            <View style={{ flex: 1, paddingRight: SPACING.md }}>
              <Text style={{ color: textPrimary, fontSize: 16, fontWeight: "600", marginBottom: 4 }}>
                {group.name}
              </Text>
              <Text style={{ color: textSecondary, fontSize: 13, lineHeight: 18 }}>
                {group.description}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: borderColor }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="people" size={14} color={textTertiary} />
              <Text style={{ color: textSecondary, fontSize: 12, marginLeft: 6, fontWeight: "500" }}>
                {group.memberCount.toLocaleString()} membros
              </Text>
            </View>
            <Pressable
              onPress={() => handleJoinGroup(group.id)}
              style={{
                backgroundColor: categoryColor,
                paddingHorizontal: SPACING.lg,
                paddingVertical: SPACING.sm,
                borderRadius: RADIUS.full,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}>Participar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  }, [bgCard, borderColor, handleJoinGroup, textPrimary, textSecondary, textTertiary]);

  return (
    <View style={{ flex: 1, backgroundColor: bgPrimary }}>
      {/* Header Compacto */}
      <View style={{ paddingTop: insets.top, backgroundColor: bgPrimary }}>
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          style={{ paddingHorizontal: SPACING["2xl"], paddingTop: SPACING.lg, paddingBottom: SPACING.md }}
        >
          {/* Título + Busca */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: SPACING.lg }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: textPrimary, fontSize: 26, fontWeight: "800", letterSpacing: -0.5 }}>
                Mães Valente
              </Text>
              <Text style={{ color: textSecondary, fontSize: 13, marginTop: 2 }}>
                Comunidade de apoio e inspiração
              </Text>
            </View>

            {/* Ícone de Busca */}
            <Pressable
              onPress={handleSearchToggle}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? colors.neutral[800] : COLORS.neutral[100],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={isSearchExpanded ? "close" : "search"} size={20} color={textSecondary} />
            </Pressable>
          </View>

          {/* Busca Expansível */}
          {isSearchExpanded && (
            <Animated.View
              entering={FadeInDown.duration(200)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: bgCard,
                borderRadius: RADIUS.lg,
                paddingHorizontal: SPACING.md,
                paddingVertical: SPACING.sm,
                marginBottom: SPACING.md,
                borderWidth: 1,
                borderColor,
              }}
            >
              <Ionicons name="search" size={18} color={textTertiary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar posts ou grupos..."
                placeholderTextColor={textTertiary}
                autoFocus
                style={{
                  flex: 1,
                  marginLeft: SPACING.sm,
                  color: textPrimary,
                  fontSize: 15,
                  paddingVertical: SPACING.xs,
                }}
              />
            </Animated.View>
          )}

          {/* Segmented Control (Tabs) */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDark ? colors.neutral[800] : COLORS.neutral[100],
              borderRadius: RADIUS.lg,
              padding: 2,
            }}
          >
            <SegmentedTab
              label="Feed"
              isActive={activeTab === "feed"}
              onPress={() => setActiveTab("feed")}
              position="left"
            />
            <SegmentedTab
              label="Grupos"
              isActive={activeTab === "groups"}
              onPress={() => setActiveTab("groups")}
              position="right"
            />
          </View>
        </Animated.View>
      </View>

      {/* Content */}
      {activeTab === "feed" ? (
        <FlatList
          data={displayPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => renderPost(item, index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING["2xl"],
            paddingTop: SPACING.lg,
            paddingBottom: 120,
          }}
          ListHeaderComponent={<CommunityComposer onPost={handleNewPost} />}
          ListFooterComponent={
            <Pressable
              onPress={handleLoadMore}
              style={{
                paddingVertical: SPACING.lg,
                alignItems: "center",
                borderRadius: RADIUS.lg,
                marginTop: SPACING.sm,
                backgroundColor: bgCard,
                borderWidth: 1,
                borderColor,
              }}
            >
              <Text style={{ color: textSecondary, fontWeight: "500" }}>Carregar mais posts</Text>
            </Pressable>
          }
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING["2xl"],
            paddingTop: SPACING.lg,
            paddingBottom: 120,
          }}
        >
          {MOCK_GROUPS.map((group, index) => renderGroup(group, index))}

          {/* Criar Grupo */}
          <Pressable
            onPress={handleCreateGroup}
            style={{
              paddingVertical: SPACING.lg,
              alignItems: "center",
              borderRadius: RADIUS.lg,
              marginTop: SPACING.sm,
              backgroundColor: bgCard,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor,
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color={textTertiary} />
            <Text style={{ color: textSecondary, fontWeight: "500", marginTop: SPACING.sm }}>
              Criar novo grupo
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}
