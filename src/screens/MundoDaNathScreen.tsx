/**
 * Mundo da Nath - Conteúdo exclusivo da influenciadora Nathalia Valente
 *
 * Tela premium onde a Nath posta conteúdos exclusivos para a comunidade.
 * Features:
 * - Feed de posts (texto, imagem, vídeo)
 * - Modo admin para a própria Nath criar conteúdos
 * - Paywall/Lock para usuários free
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdmin } from "../hooks/useAdmin";
import { useTheme } from "../hooks/useTheme";
import { Tokens } from "../theme/tokens";
import { RootStackScreenProps } from "../types/navigation";
import { mundoNathService } from "../services/mundoNath";
import { MundoNathPost } from "../types/community";
import { logger } from "../utils/logger";
import { PremiumEmptyState } from "../components/ui/PremiumEmptyState";

const NATHALIA_AVATAR_URL = "https://i.imgur.com/37dbPJE.jpg";

// Post Card Component
const PostCard: React.FC<{
  post: MundoNathPost;
  index: number;
  onLike: (id: string) => void; // TODO: Implementar likes reais
  onShare: (id: string) => void;
  isDark: boolean;
  isPremiumUser: boolean;
  onUnlockPress: () => void;
}> = ({ post, index, onLike, onShare, isDark, isPremiumUser, onUnlockPress }) => {
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
    if (!dateString) return "";
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "agora";
    if (hours === 1) return "há 1h";
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "há 1 dia";
    return `há ${days} dias`;
  };

  const bgCard = isDark ? Tokens.neutral[800] : Tokens.neutral[0];
  const textPrimary = isDark ? Tokens.neutral[100] : Tokens.neutral[900];
  const textSecondary = isDark ? Tokens.neutral[400] : Tokens.neutral[600];
  const borderColor = isDark ? Tokens.neutral[700] : Tokens.neutral[200];

  // Logic: Se locked (não premium e tem media), mostra lock
  // O backend deve retornar is_locked=true se não for premium
  const isLocked = post.is_locked || (!isPremiumUser && post.media_path);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).duration(500)}
      style={[
        {
          backgroundColor: bgCard,
          borderRadius: Tokens.radius.xl,
          marginBottom: Tokens.spacing.md,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: borderColor,
          shadowColor: Tokens.neutral[900],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        },
        animatedStyle,
      ]}
    >
      {/* Header */}
      <View style={{ padding: Tokens.spacing.md }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: Tokens.spacing.sm }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: Tokens.spacing.sm,
              borderWidth: 1,
              borderColor: Tokens.nathAccent.rose, // Usando rose
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: NATHALIA_AVATAR_URL }}
              style={{
                width: 56,
                height: 56,
                marginTop: -8,
                marginLeft: -8,
              }}
              resizeMode="cover"
            />
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: textPrimary }}>
                Nathalia Valente
              </Text>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={Tokens.nathAccent.rose}
                style={{ marginLeft: 4 }}
              />
            </View>
            <Text style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>
              {formatTimeAgo(post.published_at)}
            </Text>
          </View>

          {/* Badge para tipo */}
          {post.type === "video" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: Tokens.spacing.sm,
                paddingVertical: 4,
                borderRadius: Tokens.radius.full,
                backgroundColor: isDark ? Tokens.neutral[700] : Tokens.nathAccent.roseLight, // Usando rose light
              }}
            >
              <Ionicons name="play-circle" size={12} color={Tokens.nathAccent.roseDark} />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "600",
                  color: Tokens.nathAccent.roseDark,
                  marginLeft: 4,
                }}
              >
                Vídeo
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        {post.text && (
          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              color: textPrimary,
              marginBottom: post.media_path ? Tokens.spacing.sm : 0,
            }}
          >
            {post.text}
          </Text>
        )}
      </View>

      {/* Media (Image/Video) or Lock Placeholder */}
      {post.media_path && (
        <Pressable
          onPress={isLocked ? onUnlockPress : undefined}
          style={({ pressed }) => ({
            position: "relative" as const,
            opacity: isLocked && pressed ? 0.9 : 1,
          })}
        >
          {isLocked ? (
            // LOCK OVERLAY
            <View
              style={{
                height: 250,
                backgroundColor: isDark ? Tokens.neutral[900] : Tokens.neutral[100],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Blur fake visual (opcional) ou padrao geometrico */}
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.1,
                  backgroundColor: Tokens.nathAccent.rose,
                }}
              />

              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: Tokens.nathAccent.rose,
                  alignItems: "center",
                  justifyContent: "center",
                  ...Tokens.shadows.md,
                }}
              >
                <Ionicons name="lock-closed" size={28} color="white" />
              </View>
              <Text
                style={{
                  marginTop: Tokens.spacing.md,
                  fontWeight: "700",
                  color: textPrimary,
                  textAlign: "center",
                }}
              >
                Conteúdo Exclusivo
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: textSecondary,
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                Toque para desbloquear o Mundo da Nath
              </Text>
            </View>
          ) : (
            // MEDIA REAL (Signed URL)
            <View>
              {post.type === "video" ? (
                // Placeholder de video (no MVP nao temos player complexo aqui, usaria um player nativo ou webview)
                // Por enquanto, renderiza como imagem se tiver thumb, ou um placeholder de video player
                <View
                  style={{
                    height: 250,
                    backgroundColor: "black",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* TODO: Implementar Video Player Real */}
                  <Ionicons name="play-circle-outline" size={64} color="white" />
                  <Text style={{ color: "white", marginTop: 8 }}>Reproduzir Vídeo</Text>
                </View>
              ) : (
                <Image
                  source={{ uri: post.signed_media_url || undefined }}
                  style={{
                    width: "100%",
                    height: 300,
                    backgroundColor: Tokens.neutral[200],
                  }}
                  resizeMode="cover"
                />
              )}
            </View>
          )}
        </Pressable>
      )}

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: Tokens.spacing.md,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Pressable
          onPress={handleLikePress}
          style={{ flexDirection: "row", alignItems: "center", marginRight: Tokens.spacing.xl }}
        >
          <Ionicons
            name={"heart-outline"} // TODO: isLiked real
            size={18}
            color={textSecondary}
          />
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              marginLeft: Tokens.spacing.xs,
              color: textSecondary,
            }}
          >
            Curtir
          </Text>
        </Pressable>

        <Pressable style={{ marginLeft: "auto" }} onPress={() => onShare(post.id)}>
          <Ionicons name="share-outline" size={18} color={textSecondary} />
        </Pressable>
      </View>
    </Animated.View>
  );
};

// Main Screen
type Props = RootStackScreenProps<"MundoDaNath">;

export default function MundoDaNathScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [posts, setPosts] = useState<MundoNathPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Verificação de admin (Nathalia Valente)
  const { isAdmin } = useAdmin();

  const bgPrimary = isDark ? Tokens.surface.dark.base : Tokens.surface.light.base;
  const textPrimary = isDark ? Tokens.text.dark.primary : Tokens.text.light.primary;
  const textSecondary = isDark ? Tokens.text.dark.secondary : Tokens.text.light.secondary;

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      setHasError(false);
      const { data, isPremium: premiumStatus } = await mundoNathService.getFeed();
      setPosts(data);
      setIsPremium(premiumStatus);
    } catch (e) {
      setHasError(true);
      logger.error("Erro ao carregar feed", "MundoDaNathScreen", e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleUnlock = () => {
    navigation.navigate("Paywall", { source: "MundoDaNath" });
  };

  const renderHeader = () => (
    <>
      <LinearGradient
        colors={[Tokens.nathAccent.roseLight, isDark ? Tokens.surface.dark.base : Tokens.surface.light.base]} // Gradiente usando rose
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.4 }}
        style={{
          paddingTop: Tokens.spacing.md,
          paddingHorizontal: Tokens.spacing.lg,
          paddingBottom: Tokens.spacing.lg,
        }}
      >
        <Animated.View entering={FadeIn.duration(600)} style={{ alignItems: "center" }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              marginBottom: Tokens.spacing.sm,
              borderWidth: 2,
              borderColor: Tokens.nathAccent.rose,
              overflow: "hidden",
            }}
          >
            <Image
              source={{ uri: NATHALIA_AVATAR_URL }}
              style={{
                width: 100,
                height: 100,
                marginTop: -14,
                marginLeft: -14,
              }}
              resizeMode="cover"
            />
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: textPrimary,
              marginBottom: 2,
              fontFamily: "Manrope_800ExtraBold",
            }}
          >
            Mundo da Nath
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: textSecondary,
              textAlign: "center",
            }}
          >
            Conteúdos exclusivos: bastidores, dicas e vida real.
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* REMOVIDO: STORIES SECTION (Fase 2 Requirement) */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: Tokens.spacing.lg,
          marginBottom: Tokens.spacing.md,
          paddingHorizontal: Tokens.spacing.lg,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "700", color: textPrimary }}>Feed Exclusivo</Text>
        {isPremium && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="star" size={12} color={Tokens.nathAccent.rose} />
            <Text
              style={{ fontSize: 12, color: Tokens.nathAccent.rose, fontWeight: "700", marginLeft: 4 }}
            >
              PREMIUM
            </Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: bgPrimary }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color={Tokens.nathAccent.rose} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={{ paddingHorizontal: Tokens.spacing.lg }}>
                <PostCard
                  post={item}
                  index={index}
                  onLike={() => {}}
                  onShare={() => {}}
                  isDark={isDark}
                  isPremiumUser={isPremium}
                  onUnlockPress={handleUnlock}
                />
              </View>
            )}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={<View style={{ height: 80 }} />}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadFeed}
            ListEmptyComponent={
              hasError ? (
                <PremiumEmptyState
                  title="Ops, algo deu errado"
                  subtitle="Não conseguimos carregar o Mundo da Nath. Tente novamente."
                  type="error"
                  actionLabel="Tentar Novamente"
                  onAction={loadFeed}
                />
              ) : (
                <PremiumEmptyState
                  title="Mundo da Nath"
                  subtitle="Em breve, conteúdos exclusivos dos bastidores e dicas que só compartilho com vocês aqui."
                  image={require("../../assets/nathalia-avatar.jpg")}
                  type="premium"
                />
              )
            }
          />
        )}

        {/* Admin FAB - Placeholder para funcionalidade futura de postagem admin */}
        {isAdmin && !hasError && (
          <Pressable
            style={{
              position: "absolute",
              bottom: insets.bottom + 20,
              right: 20,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: Tokens.nathAccent.rose,
              alignItems: "center",
              justifyContent: "center",
              ...Tokens.shadows.lg,
            }}
            onPress={() => logger.info("Feature de Admin Posting virá no próximo PR!", "MundoDaNathScreen")}
          >
            <Ionicons name="add" size={32} color="white" />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
