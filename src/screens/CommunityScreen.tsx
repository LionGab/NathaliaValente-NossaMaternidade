/**
 * CommunityScreen - Feed principal da comunidade Mães Valente
 *
 * Fase 2: Feed seguro com moderação prévia.
 * - Lista apenas posts aprovados
 * - Botão para criar novo post (NewPost)
 * - Acesso a "Meus Posts"
 */

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CommunityPostCard } from "../components/community/CommunityPostCard";
import { useTheme } from "../hooks/useTheme";
import { communityService } from "../services/community";
import { brand, neutral, radius, shadows, spacing, surface } from "../theme/tokens";
import { CommunityPost } from "../types/community";
import { MainTabScreenProps } from "../types/navigation";
import { logger } from "../utils/logger";

// Aliases
const SPACING = spacing;
const RADIUS = radius;
const SHADOWS = shadows;

export default function CommunityScreen({ navigation }: MainTabScreenProps<"Community">) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Theme colors
  const bgPrimary = isDark ? surface.dark.base : surface.light.base;
  const textPrimary = isDark ? neutral[100] : neutral[900];
  const textSecondary = isDark ? neutral[400] : neutral[600];

  const loadFeed = useCallback(async () => {
    try {
      const data = await communityService.getFeed();
      setPosts(data);
    } catch (e) {
      logger.error("Erro ao carregar feed da comunidade", "CommunityScreen", e as Error);
    }
  }, []);

  // Recarrega ao focar na tela
  useFocusEffect(
    useCallback(() => {
      loadFeed().finally(() => setLoading(false));
    }, [loadFeed])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const handleCreatePost = () => {
    navigation.navigate("NewPost");
  };

  const handleMyPosts = () => {
    // Vamos usar a mesma tela NewPost ou criar uma MyPostsScreen.
    // Como não mapeei MyPostsScreen no RootNavigator, vou navegar para NewPost por enquanto
    // ou idealmente criar uma tela de perfil de comunidade.
    // Para MVP, vou usar um filtro local nesta tela ou navegar para uma tela temporária.
    // Melhor: Criar rota MyPosts no Navigator depois.
    // Por hora, vou deixar sem ação ou logger.
    logger.info("Funcionalidade 'Meus Posts' em breve!", "CommunityScreen");
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: SPACING.md }]}>
      <View>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Comunidade</Text>
        <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
          Mães Valente conectadas
        </Text>
      </View>
      <Pressable
        onPress={handleMyPosts}
        style={{
          padding: SPACING.sm,
          backgroundColor: isDark ? neutral[800] : neutral[100],
          borderRadius: RADIUS.full,
        }}
      >
        <Ionicons name="person-circle-outline" size={24} color={brand.primary[500]} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={brand.primary[500]} />
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={{ paddingHorizontal: SPACING.lg }}>
                <CommunityPostCard
                  post={item}
                  index={index}
                  onLike={() => {}}
                  onComment={() => {}}
                  onShare={() => {}}
                  onPress={() => {}}
                />
              </View>
            )}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={<View style={{ height: 100 }} />}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={brand.primary[500]}
              />
            }
            ListEmptyComponent={
              <View style={[styles.center, { padding: SPACING["2xl"], marginTop: SPACING["2xl"] }]}>
                <Ionicons name="heart-outline" size={48} color={neutral[300]} />
                <Text style={{ marginTop: SPACING.md, color: textSecondary, textAlign: "center" }}>
                  Ainda não há posts aprovados.
                </Text>
                <Text style={{ marginTop: SPACING.xs, color: textSecondary, textAlign: "center" }}>
                  Seja a primeira a compartilhar!
                </Text>
              </View>
            }
          />
        )}

        {/* FAB: Criar Post */}
        <Pressable
          onPress={handleCreatePost}
          style={[
            styles.fab,
            {
              bottom: insets.bottom + SPACING.lg,
              backgroundColor: brand.primary[500],
              shadowColor: brand.primary[500],
            },
          ]}
        >
          <Ionicons name="add" size={32} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Manrope_800ExtraBold",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.lg,
    shadowOpacity: 0.4,
    elevation: 8,
  },
});
