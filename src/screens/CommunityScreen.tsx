/**
 * CommunityScreen - Feed "Mães Valente"
 *
 * Feed único tipo Instagram (sem grupos, sem stories)
 * Posts são enviados para revisão antes de serem publicados
 * Suporta: texto, imagem, vídeo
 *
 * Design: Calm FemTech
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Share,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "../components/ui";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../hooks/useTheme";
import { useAppStore, useCommunityStore } from "../state/store";
import { COLORS, RADIUS, SPACING } from "../theme/design-system";
import { MainTabScreenProps, Post } from "../types/navigation";

// Posts de exemplo
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    authorId: "user1",
    authorName: "Mariana Santos",
    content:
      "Acabei de descobrir que estou grávida! Estou tão feliz e nervosa ao mesmo tempo. Alguém tem dicas para o primeiro trimestre?",
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
    content:
      "O sono no terceiro trimestre está impossível. Já tentei almofadas de amamentação, mas nada funciona. O que vocês usam?",
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
    content:
      "Minha bebê completou 3 meses hoje! O tempo voa. Compartilhando essa conquista com vocês que me apoiaram tanto durante a gestação.",
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
    content:
      "Meninas, alguém mais está sentindo muitas dores nas costas? Tenho 28 semanas e está bem desconfortável.",
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
    content:
      "Acabei de fazer minha primeira ultrassom! Ver o coraçãozinho batendo foi emocionante demais. Chorei muito! 💕",
    likesCount: 156,
    commentsCount: 42,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
    isLiked: true,
    type: "vitoria",
  },
];

// Modal para criar novo post
const NewPostModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, mediaUri?: string, mediaType?: "image" | "video") => void;
}> = ({ visible, onClose, onSubmit }) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { showError, showSuccess } = useToast();
  const user = useAppStore((s) => s.user);

  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textPrimary = isDark ? COLORS.neutral[100] : COLORS.text.primary;
  const textSecondary = isDark ? COLORS.neutral[400] : COLORS.text.secondary;
  const borderColor = isDark ? COLORS.neutral[700] : COLORS.neutral[200];

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de acesso à sua galeria para adicionar fotos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0].uri);
        setMediaType("image");
      }
    } catch {
      showError("Não foi possível selecionar a imagem.");
    }
  };

  const handlePickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Precisamos de acesso à sua galeria para adicionar vídeos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "videos",
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // 1 minuto máximo
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia(result.assets[0].uri);
        setMediaType("video");
      }
    } catch {
      showError("Não foi possível selecionar o vídeo.");
    }
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !selectedMedia) return;

    setIsSubmitting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simular envio para revisão
    setTimeout(() => {
      onSubmit(content.trim(), selectedMedia ?? undefined, mediaType ?? undefined);
      setContent("");
      setSelectedMedia(null);
      setMediaType(null);
      setIsSubmitting(false);
      showSuccess("Post enviado para revisão! Você será notificada quando for aprovado.");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setContent("");
    setSelectedMedia(null);
    setMediaType(null);
    onClose();
  };

  const canSubmit = (content.trim() || selectedMedia) && !isSubmitting;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          backgroundColor: isDark ? COLORS.neutral[900] : COLORS.background.primary,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: SPACING["2xl"],
            paddingTop: insets.top + SPACING.md,
            paddingBottom: SPACING.md,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
          }}
        >
          <Pressable onPress={handleClose} hitSlop={8}>
            <Text style={{ fontSize: 16, color: textSecondary }}>Cancelar</Text>
          </Pressable>
          <Text style={{ fontSize: 17, fontWeight: "700", color: textPrimary }}>Novo Post</Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={{
              backgroundColor: canSubmit ? COLORS.primary[500] : COLORS.neutral[300],
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.sm,
              borderRadius: RADIUS.full,
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={COLORS.neutral[0]} />
            ) : (
              <Text style={{ fontSize: 14, fontWeight: "600", color: COLORS.neutral[0] }}>
                Enviar
              </Text>
            )}
          </Pressable>
        </View>

        {/* Info de revisão */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.primary[50],
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.sm,
            gap: SPACING.sm,
          }}
        >
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary[500]} />
          <Text style={{ fontSize: 12, color: COLORS.primary[600], flex: 1 }}>
            Seu post será revisado pela nossa equipe antes de ser publicado.
          </Text>
        </View>

        {/* Composer */}
        <View style={{ flex: 1, padding: SPACING["2xl"] }}>
          {/* Avatar + Input */}
          <View style={{ flexDirection: "row", marginBottom: SPACING.lg }}>
            <Avatar
              size={44}
              source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
              fallbackIcon="person"
              fallbackColor={COLORS.primary[500]}
              fallbackBgColor={COLORS.primary[100]}
              style={{ marginRight: SPACING.md }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: textPrimary, marginBottom: 2 }}
              >
                {user?.name || "Você"}
              </Text>
              <Text style={{ fontSize: 12, color: textSecondary }}>
                Compartilhe com a comunidade
              </Text>
            </View>
          </View>

          {/* Text Input */}
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="O que você gostaria de compartilhar?"
            placeholderTextColor={COLORS.neutral[400]}
            multiline
            autoFocus
            style={{
              fontSize: 16,
              lineHeight: 24,
              color: textPrimary,
              minHeight: 120,
              textAlignVertical: "top",
              marginBottom: SPACING.lg,
            }}
          />

          {/* Media Preview */}
          {selectedMedia && (
            <View style={{ marginBottom: SPACING.lg, position: "relative" }}>
              {mediaType === "image" ? (
                <Image
                  source={{ uri: selectedMedia }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: RADIUS.xl,
                    backgroundColor: COLORS.neutral[200],
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: RADIUS.xl,
                    backgroundColor: COLORS.neutral[200],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="videocam" size={48} color={COLORS.neutral[500]} />
                  <Text style={{ fontSize: 14, color: COLORS.neutral[500], marginTop: SPACING.sm }}>
                    Vídeo selecionado
                  </Text>
                </View>
              )}
              <Pressable
                onPress={handleRemoveMedia}
                style={{
                  position: "absolute",
                  top: SPACING.sm,
                  right: SPACING.sm,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: RADIUS.full,
                  padding: SPACING.sm,
                }}
              >
                <Ionicons name="close" size={20} color={COLORS.neutral[0]} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Actions - Bottom */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SPACING["2xl"],
            paddingVertical: SPACING.lg,
            paddingBottom: insets.bottom + SPACING.lg,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            gap: SPACING.md,
          }}
        >
          <Pressable
            onPress={handlePickImage}
            disabled={isSubmitting}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.md,
              borderRadius: RADIUS.lg,
              backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral[100],
              gap: SPACING.sm,
            }}
          >
            <Ionicons name="image-outline" size={20} color={COLORS.primary[500]} />
            <Text style={{ fontSize: 14, fontWeight: "500", color: COLORS.primary[500] }}>
              Foto
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePickVideo}
            disabled={isSubmitting}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.md,
              borderRadius: RADIUS.lg,
              backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral[100],
              gap: SPACING.sm,
            }}
          >
            <Ionicons name="videocam-outline" size={20} color={COLORS.primary[500]} />
            <Text style={{ fontSize: 14, fontWeight: "500", color: COLORS.primary[500] }}>
              Vídeo
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Componente de Post Card
const PostCard: React.FC<{
  post: Post;
  index: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (post: Post) => void;
  onPress: (id: string) => void;
  isDark: boolean;
}> = ({ post, index, onLike, onComment, onShare, onPress, isDark }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLikePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.98, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onLike(post.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "agora";
    if (hours === 1) return "há 1h";
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "há 1 dia";
    return `há ${days} dias`;
  };

  const bgCard = isDark ? COLORS.neutral[800] : COLORS.neutral[0];
  const textPrimary = isDark ? COLORS.neutral[100] : COLORS.text.primary;
  const textSecondary = isDark ? COLORS.neutral[400] : COLORS.text.secondary;
  const borderColor = isDark ? COLORS.neutral[700] : COLORS.neutral[200];

  // Status de revisão (para posts do usuário)
  const isPending = post.status === "pending";

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 60)
        .duration(400)
        .springify()}
      style={[{ marginBottom: SPACING.md }, animatedStyle]}
    >
      <Pressable
        onPress={() => onPress(post.id)}
        style={{
          backgroundColor: bgCard,
          borderRadius: RADIUS.xl,
          padding: SPACING.lg,
          borderWidth: 1,
          borderColor: isPending ? COLORS.primary[300] : borderColor,
        }}
      >
        {/* Status de revisão */}
        {isPending && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.primary[50],
              paddingHorizontal: SPACING.sm,
              paddingVertical: SPACING.xs,
              borderRadius: RADIUS.md,
              marginBottom: SPACING.sm,
              alignSelf: "flex-start",
              gap: SPACING.xs,
            }}
          >
            <Ionicons name="time-outline" size={12} color={COLORS.primary[500]} />
            <Text style={{ fontSize: 11, fontWeight: "600", color: COLORS.primary[600] }}>
              Em revisão
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.md }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.primary[100],
              alignItems: "center",
              justifyContent: "center",
              marginRight: SPACING.md,
            }}
          >
            <Ionicons name="person" size={18} color={COLORS.primary[500]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textPrimary, fontSize: 14, fontWeight: "600" }}>
              {post.authorName}
            </Text>
            <Text style={{ color: textSecondary, fontSize: 12, marginTop: 1 }}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* Content */}
        <Text
          style={{
            color: textPrimary,
            fontSize: 14,
            lineHeight: 21,
            marginBottom: SPACING.md,
          }}
        >
          {post.content}
        </Text>

        {/* Image */}
        {post.imageUrl && (
          <Image
            source={{ uri: post.imageUrl }}
            style={{
              width: "100%",
              height: 180,
              borderRadius: RADIUS.lg,
              backgroundColor: COLORS.neutral[200],
              marginBottom: SPACING.md,
            }}
            resizeMode="cover"
          />
        )}

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
            onPress={handleLikePress}
            style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING["2xl"] }}
          >
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={18}
              color={post.isLiked ? COLORS.primary[500] : textSecondary}
            />
            <Text
              style={{
                fontSize: 13,
                marginLeft: SPACING.xs,
                fontWeight: "500",
                color: post.isLiked ? COLORS.primary[500] : textSecondary,
              }}
            >
              {post.likesCount}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onComment(post.id)}
            style={{ flexDirection: "row", alignItems: "center", marginRight: SPACING["2xl"] }}
          >
            <Ionicons name="chatbubble-outline" size={16} color={textSecondary} />
            <Text
              style={{
                fontSize: 13,
                marginLeft: SPACING.xs,
                fontWeight: "500",
                color: textSecondary,
              }}
            >
              {post.commentsCount}
            </Text>
          </Pressable>

          <Pressable onPress={() => onShare(post)} style={{ marginLeft: "auto" }}>
            <Ionicons name="share-outline" size={16} color={textSecondary} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function CommunityScreen({ navigation }: MainTabScreenProps<"Community">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, spacing, brand } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  useToast(); // Hook disponível para uso futuro

  const posts = useCommunityStore((s) => s.posts);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const setPosts = useCommunityStore((s) => s.setPosts);
  const addPost = useCommunityStore((s) => s.addPost);
  const userName = useAppStore((s) => s.user?.name);

  const [isNewPostModalVisible, setIsNewPostModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Padding horizontal responsivo (igual à HomeScreen)
  const horizontalPadding = useMemo(() => {
    const scaleFactor = screenWidth / 375;
    return Math.round(20 * scaleFactor);
  }, [screenWidth]);

  // Carregar posts mock se vazio
  React.useEffect(() => {
    if (posts.length === 0) {
      setPosts(MOCK_POSTS);
    }
  }, [posts.length, setPosts]);

  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS;

  const handleNewPost = useCallback(
    (content: string, mediaUri?: string, _mediaType?: "image" | "video") => {
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
        status: "pending", // Marcado como pendente de revisão
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
      // Handle error silently
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
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchQuery("");
    }
  }, [isSearchVisible]);

  // Cores do tema (igual à HomeScreen)
  const bgPrimary = colors.background.primary;
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];
  const textSecondary = isDark ? colors.neutral[400] : COLORS.text.secondary;
  const borderColor = isDark ? colors.neutral[700] : COLORS.neutral[200];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: bgPrimary }}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          style={{
            paddingHorizontal: horizontalPadding,
            paddingTop: spacing.md,
            paddingBottom: spacing.md,
          }}
        >
          {/* Título + Busca - Calm FemTech: azul como base */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: textMain,
                  fontSize: 20,
                  fontWeight: "700",
                  fontFamily: "Manrope_700Bold",
                }}
              >
                Mães Valente
              </Text>
              <Text style={{ color: textMuted, fontSize: 13, marginTop: 2 }}>
                Comunidade de apoio e inspiração
              </Text>
            </View>

            {/* Ícone de Busca - rosa como accent/ação */}
            <Pressable
              onPress={handleSearchToggle}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDark ? colors.neutral[800] : colors.primary[50],
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isDark ? colors.neutral[700] : colors.primary[100],
              }}
            >
              <Ionicons
                name={isSearchVisible ? "close" : "search"}
                size={20}
                color={isDark ? colors.primary[300] : colors.primary[500]}
              />
            </Pressable>
          </View>

          {/* Busca Expansível */}
          {isSearchVisible && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isDark ? colors.neutral[800] : COLORS.neutral[0],
                borderRadius: RADIUS.lg,
                paddingHorizontal: SPACING.md,
                paddingVertical: SPACING.sm,
                marginTop: SPACING.md,
                borderWidth: 1,
                borderColor,
              }}
            >
              <Ionicons name="search" size={18} color={textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar posts..."
                placeholderTextColor={textSecondary}
                autoFocus
                style={{
                  flex: 1,
                  marginLeft: SPACING.sm,
                  color: textMain,
                  fontSize: 15,
                  paddingVertical: SPACING.xs,
                }}
              />
            </Animated.View>
          )}
        </Animated.View>

        {/* Feed */}
        <FlatList
          data={displayPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PostCard
              post={item}
              index={index}
              onLike={toggleLike}
              onComment={handleCommentPress}
              onShare={handleSharePress}
              onPress={handlePostPress}
              isDark={isDark}
            />
          )}
          ListHeaderComponent={
            // Composer estilo Facebook + Tópicos de dores/dúvidas
            <View style={{ marginBottom: SPACING.lg }}>
              {/* Card principal - "No que você está pensando?" */}
              <Pressable
                onPress={() => setIsNewPostModalVisible(true)}
                style={{
                  backgroundColor: isDark ? COLORS.neutral[800] : COLORS.neutral[0],
                  borderRadius: RADIUS.xl,
                  padding: SPACING.lg,
                  borderWidth: 1,
                  borderColor: isDark ? COLORS.neutral[700] : COLORS.neutral[200],
                }}
              >
                {/* Linha superior: Avatar + Input */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 15,
                      color: textSecondary,
                    }}
                  >
                    No que você está pensando?
                  </Text>
                </View>

                {/* Separador */}
                <View
                  style={{
                    height: 1,
                    backgroundColor: isDark ? COLORS.neutral[700] : COLORS.neutral[100],
                    marginVertical: SPACING.md,
                  }}
                />

                {/* Ações: Foto, Vídeo - Calm FemTech */}
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                  <Pressable
                    style={{ flexDirection: "row", alignItems: "center", gap: SPACING.xs }}
                  >
                    <Ionicons name="image" size={20} color={colors.primary[500]} />
                    <Text style={{ fontSize: 13, fontWeight: "500", color: textSecondary }}>
                      Foto
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{ flexDirection: "row", alignItems: "center", gap: SPACING.xs }}
                  >
                    <Ionicons name="videocam" size={20} color={brand.accent[500]} />
                    <Text style={{ fontSize: 13, fontWeight: "500", color: textSecondary }}>
                      Vídeo
                    </Text>
                  </Pressable>
                </View>
              </Pressable>

              {/* Tópicos comuns - Calm FemTech: primary (azul) e accent (rosa) apenas */}
              <View style={{ marginTop: SPACING.lg }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    fontFamily: "Manrope_600SemiBold",
                    color: textMuted,
                    marginBottom: SPACING.md,
                  }}
                >
                  Sobre o que você quer falar?
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm }}>
                  {[
                    { icon: "help-circle-outline" as const, label: "Dúvida", accent: false },
                    { icon: "chatbubble-outline" as const, label: "Desabafo", accent: true },
                    { icon: "moon-outline" as const, label: "Sono", accent: false },
                    { icon: "medical-outline" as const, label: "Enjoo", accent: false },
                    { icon: "heart-outline" as const, label: "Ansiedade", accent: true },
                    { icon: "water-outline" as const, label: "Amamentação", accent: true },
                    { icon: "happy-outline" as const, label: "Bebê", accent: false },
                    { icon: "trophy-outline" as const, label: "Vitória", accent: true },
                  ].map((topic) => {
                    // Calm FemTech: azul como base, rosa para tópicos emocionais
                    const topicColor = topic.accent
                      ? isDark ? brand.accent[300] : brand.accent[500]
                      : isDark ? colors.primary[300] : colors.primary[500];
                    const topicBg = topic.accent
                      ? isDark ? `${brand.accent[500]}15` : brand.accent[50]
                      : isDark ? `${colors.primary[500]}15` : colors.primary[50];
                    const topicBorder = topic.accent
                      ? isDark ? brand.accent[700] : brand.accent[200]
                      : isDark ? colors.primary[700] : colors.primary[200];

                    return (
                      <Pressable
                        key={topic.label}
                        onPress={async () => {
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setIsNewPostModalVisible(true);
                        }}
                        style={({ pressed }) => ({
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: topicBg,
                          paddingHorizontal: SPACING.md,
                          paddingVertical: SPACING.sm,
                          borderRadius: RADIUS.full,
                          borderWidth: 1,
                          borderColor: topicBorder,
                          opacity: pressed ? 0.85 : 1,
                          transform: [{ scale: pressed ? 0.97 : 1 }],
                        })}
                      >
                        <Ionicons
                          name={topic.icon}
                          size={16}
                          color={topicColor}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "600",
                            fontFamily: "Manrope_600SemiBold",
                            color: topicColor,
                          }}
                        >
                          {topic.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: SPACING["2xl"],
            paddingTop: SPACING.sm,
            paddingBottom: 100 + insets.bottom,
          }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />

        {/* FAB - Criar Post - Rosa como CTA principal */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={{
            position: "absolute",
            bottom: insets.bottom + SPACING.lg,
            right: SPACING.lg,
          }}
        >
          <Pressable
            onPress={() => setIsNewPostModalVisible(true)}
            style={({ pressed }) => ({
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: isDark ? brand.accent[500] : brand.accent[400],
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: brand.accent[500],
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Ionicons name="add" size={28} color={colors.neutral[900]} />
          </Pressable>
        </Animated.View>

        {/* Modal de Novo Post */}
        <NewPostModal
          visible={isNewPostModalVisible}
          onClose={() => setIsNewPostModalVisible(false)}
          onSubmit={handleNewPost}
        />
      </View>
    </SafeAreaView>
  );
}
