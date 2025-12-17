/**
 * PostCard - Card de post da comunidade
 *
 * Design: Inspirado no Instagram/Twitter
 * - Cards com espaçamento generoso
 * - Hierarquia visual clara
 * - Ações bem espaçadas
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../../theme/design-system";
import type { Post } from "../../types/navigation";
import { formatTimeAgo } from "../../utils/formatters";

interface PostCardProps {
  post: Post;
  index: number;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (post: Post) => void;
  onPress: (id: string) => void;
}

export const PostCard: React.FC<PostCardProps> = React.memo(
  ({ post, index, onLike, onComment, onShare, onPress }) => {
    const { isDark } = useTheme();
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

    // Theme colors
    const bgCard = isDark ? COLORS.neutral[800] : COLORS.neutral[0];
    const textPrimary = isDark ? COLORS.neutral[100] : COLORS.text.primary;
    const textSecondary = isDark ? COLORS.neutral[400] : COLORS.text.secondary;
    const borderColor = isDark ? COLORS.neutral[700] : COLORS.neutral[200];
    const isPending = post.status === "pending";

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 60).duration(450).springify()}
        style={[styles.container, animatedStyle]}
      >
        <Pressable
          onPress={() => onPress(post.id)}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: bgCard,
              borderColor: isPending ? COLORS.primary[300] : borderColor,
              opacity: pressed ? 0.98 : 1,
              transform: [{ scale: pressed ? 0.995 : 1 }],
            },
          ]}
        >
          {/* Status de revisão */}
          {isPending && (
            <View style={styles.pendingBadge}>
              <Ionicons name="time-outline" size={12} color={COLORS.primary[500]} />
              <Text style={styles.pendingText}>Em revisão</Text>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: isDark ? COLORS.primary[900] : COLORS.primary[100] }]}>
              <Ionicons name="person" size={20} color={COLORS.primary[500]} />
            </View>
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: textPrimary }]}>
                {post.authorName}
              </Text>
              <Text style={[styles.timeAgo, { color: textSecondary }]}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.moreButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => onPress(post.id)}
            >
              <Ionicons name="ellipsis-horizontal" size={18} color={textSecondary} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.contentWrapper}>
            <Text style={[styles.content, { color: textPrimary }]}>
              {post.content}
            </Text>
          </View>

          {/* Image */}
          {post.imageUrl && (
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: post.imageUrl }}
                style={styles.image}
                contentFit="cover"
              />
            </View>
          )}

          {/* Actions */}
          <View style={[styles.actionsWrapper, { borderTopColor: borderColor }]}>
            <View style={styles.actionsRow}>
              {/* Like */}
              <Pressable
                onPress={handleLikePress}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={22}
                  color={post.isLiked ? COLORS.accent[500] : textSecondary}
                />
                <Text
                  style={[
                    styles.actionText,
                    { color: post.isLiked ? COLORS.accent[500] : textSecondary },
                  ]}
                >
                  {post.likesCount}
                </Text>
              </Pressable>

              {/* Comment */}
              <Pressable
                onPress={() => onComment(post.id)}
                style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons name="chatbubble-outline" size={20} color={textSecondary} />
                <Text style={[styles.actionText, { color: textSecondary }]}>
                  {post.commentsCount}
                </Text>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={() => onShare(post)}
                style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.7 : 1 }]}
              >
                <Ionicons name="share-outline" size={20} color={textSecondary} />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

PostCard.displayName = "PostCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl, // 20pt entre cards (era 16pt)
  },
  card: {
    borderRadius: RADIUS["2xl"], // 24pt border radius
    borderWidth: 1,
    ...SHADOWS.md,
    overflow: "hidden",
  },

  // === PENDING BADGE ===
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  pendingText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    color: COLORS.primary[600],
  },

  // === HEADER ===
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg, // 16pt padding
    paddingBottom: SPACING.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  authorInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  timeAgo: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    marginTop: 2,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // === CONTENT ===
  contentWrapper: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: "Manrope_500Medium",
  },

  // === IMAGE ===
  imageWrapper: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[200],
  },

  // === ACTIONS ===
  actionsWrapper: {
    borderTopWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingRight: SPACING["2xl"], // 24pt entre botões
    gap: SPACING.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  shareButton: {
    marginLeft: "auto",
    padding: SPACING.sm,
  },
});
