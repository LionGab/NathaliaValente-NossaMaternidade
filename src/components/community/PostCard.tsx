/**
 * PostCard - Card de post da comunidade
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
        entering={FadeInUp.delay(index * 50).duration(400).springify()}
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
            <View style={styles.avatar}>
              <Ionicons name="person" size={18} color={COLORS.primary[500]} />
            </View>
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: textPrimary }]}>
                {post.authorName}
              </Text>
              <Text style={[styles.timeAgo, { color: textSecondary }]}>
                {formatTimeAgo(post.createdAt)}
              </Text>
            </View>
          </View>

          {/* Content */}
          <Text style={[styles.content, { color: textPrimary }]}>
            {post.content}
          </Text>

          {/* Image */}
          {post.imageUrl && (
            <Image
              source={{ uri: post.imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
          )}

          {/* Actions */}
          <View style={[styles.actions, { borderTopColor: borderColor }]}>
            <Pressable
              onPress={handleLikePress}
              style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons
                name={post.isLiked ? "heart" : "heart-outline"}
                size={20}
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

            <Pressable
              onPress={() => onComment(post.id)}
              style={({ pressed }) => [styles.actionButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="chatbubble-outline" size={18} color={textSecondary} />
              <Text style={[styles.actionText, { color: textSecondary }]}>
                {post.commentsCount}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => onShare(post)}
              style={({ pressed }) => [styles.shareButton, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="share-outline" size={18} color={textSecondary} />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  }
);

PostCard.displayName = "PostCard";

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
    alignSelf: "flex-start",
    gap: SPACING.xs,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    color: COLORS.primary[600],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary[100],
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Manrope_500Medium",
    marginBottom: SPACING.md,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.neutral[200],
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: SPACING.md,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING["2xl"],
  },
  actionText: {
    fontSize: 13,
    marginLeft: SPACING.xs,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
  },
  shareButton: {
    marginLeft: "auto",
  },
});
