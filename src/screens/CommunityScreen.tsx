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
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ComposerCard, NewPostModal, PostCard } from "../components/community";
import { useCommunity } from "../hooks/useCommunity";
import { useTheme } from "../hooks/useTheme";
import { COLORS, RADIUS, SHADOWS, SPACING } from "../theme/design-system";
import type { MainTabScreenProps } from "../types/navigation";

export default function CommunityScreen({ navigation }: MainTabScreenProps<"Community">) {
  const insets = useSafeAreaInsets();
  const { colors, isDark, spacing, brand } = useTheme();

  // Hook com toda a lógica
  const community = useCommunity(navigation);

  // Theme colors
  const bgPrimary = colors.background.primary;
  const textMain = isDark ? colors.neutral[100] : colors.neutral[900];
  const textMuted = isDark ? colors.neutral[400] : colors.neutral[500];
  const textSecondary = isDark ? colors.neutral[400] : COLORS.text.secondary;
  const borderColor = isDark ? colors.neutral[700] : COLORS.neutral[200];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <View style={[styles.container, { backgroundColor: bgPrimary }]}>
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          style={[styles.header, { paddingHorizontal: spacing.xl }]}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTitle}>
              <Text style={styles.headerEmoji}>💕</Text>
              <Text style={[styles.title, { color: textMain }]}>Mães Valente</Text>
            </View>

            <Pressable
              onPress={community.handleSearchToggle}
              style={({ pressed }) => [
                styles.searchButton,
                {
                  backgroundColor: isDark ? colors.neutral[800] : colors.primary[50],
                  borderColor: isDark ? colors.neutral[700] : colors.primary[100],
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Ionicons
                name={community.isSearchVisible ? "close" : "search"}
                size={20}
                color={isDark ? colors.primary[300] : colors.primary[500]}
              />
            </Pressable>
          </View>

          <Text style={[styles.subtitle, { color: textMuted }]}>
            Comunidade de apoio e inspiração
          </Text>

          {/* Search Input */}
          {community.isSearchVisible && (
            <Animated.View
              entering={FadeIn.duration(200)}
              style={[
                styles.searchInput,
                {
                  backgroundColor: isDark ? colors.neutral[800] : COLORS.neutral[0],
                  borderColor,
                },
              ]}
            >
              <Ionicons name="search" size={18} color={textSecondary} />
              <TextInput
                value={community.searchQuery}
                onChangeText={community.setSearchQuery}
                placeholder="Buscar posts..."
                placeholderTextColor={textSecondary}
                autoFocus
                style={[styles.searchTextInput, { color: textMain }]}
              />
            </Animated.View>
          )}
        </Animated.View>

        {/* Feed */}
        <FlatList
          data={community.filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <PostCard
              post={item}
              index={index}
              onLike={community.handleLike}
              onComment={community.handleCommentPress}
              onShare={community.handleSharePress}
              onPress={community.handlePostPress}
            />
          )}
          ListHeaderComponent={
            <View>
              <ComposerCard onPress={community.openNewPostModal} />
              {/* Separador de seção */}
              <View style={styles.sectionDivider}>
                <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
                <Text style={[styles.sectionLabel, { color: textMuted }]}>
                  Publicações recentes
                </Text>
                <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
              </View>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: spacing.xl,
              paddingBottom: 120 + insets.bottom,
            },
          ]}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />

        {/* FAB */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          style={[styles.fabContainer, { bottom: insets.bottom + SPACING.xl }]}
        >
          <Pressable
            onPress={community.openNewPostModal}
            style={({ pressed }) => [
              styles.fab,
              {
                backgroundColor: isDark ? brand.accent[500] : brand.accent[400],
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.92 : 1 }],
              },
            ]}
          >
            <Ionicons name="add" size={28} color={colors.neutral[900]} />
          </Pressable>
        </Animated.View>

        {/* Modal */}
        <NewPostModal
          visible={community.isNewPostModalVisible}
          onClose={community.closeNewPostModal}
          onSubmit={community.handleNewPost}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Manrope_700Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    borderWidth: 1,
  },
  searchTextInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: 15,
    paddingVertical: SPACING.xs,
  },
  listContent: {
    paddingTop: SPACING.lg,
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "Manrope_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fabContainer: {
    position: "absolute",
    right: SPACING.xl,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.lg,
  },
});
