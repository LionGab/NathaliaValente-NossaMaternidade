/**
 * NewPostModal - Modal para criar novo post
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "../ui";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../hooks/useTheme";
import { useAppStore } from "../../state/store";
import { COLORS, RADIUS, SPACING } from "../../theme/design-system";

interface NewPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, mediaUri?: string, mediaType?: "image" | "video") => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
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
  const bgColor = isDark ? COLORS.neutral[900] : COLORS.background.primary;
  const inputBg = isDark ? COLORS.neutral[800] : COLORS.neutral[100];

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
        videoMaxDuration: 60,
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
        style={[styles.container, { backgroundColor: bgColor }]}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + SPACING.md,
              borderBottomColor: borderColor,
            },
          ]}
        >
          <Pressable onPress={handleClose} hitSlop={8}>
            <Text style={[styles.cancelText, { color: textSecondary }]}>Cancelar</Text>
          </Pressable>
          <Text style={[styles.title, { color: textPrimary }]}>Novo Post</Text>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[
              styles.submitButton,
              { backgroundColor: canSubmit ? COLORS.primary[500] : COLORS.neutral[300] },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={COLORS.neutral[0]} />
            ) : (
              <Text style={styles.submitText}>Enviar</Text>
            )}
          </Pressable>
        </View>

        {/* Info de revisão */}
        <View style={styles.reviewInfo}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary[500]} />
          <Text style={styles.reviewText}>
            Seu post será revisado pela nossa equipe antes de ser publicado.
          </Text>
        </View>

        {/* Composer */}
        <View style={styles.composer}>
          <View style={styles.userRow}>
            <Avatar
              size={44}
              source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
              fallbackIcon="person"
              fallbackColor={COLORS.primary[500]}
              fallbackBgColor={COLORS.primary[100]}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: textPrimary }]}>
                {user?.name || "Você"}
              </Text>
              <Text style={[styles.userHint, { color: textSecondary }]}>
                Compartilhe com a comunidade
              </Text>
            </View>
          </View>

          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="O que você gostaria de compartilhar?"
            placeholderTextColor={COLORS.neutral[400]}
            multiline
            autoFocus
            style={[styles.input, { color: textPrimary }]}
          />

          {/* Media Preview */}
          {selectedMedia && (
            <View style={styles.mediaPreview}>
              {mediaType === "image" ? (
                <Image source={{ uri: selectedMedia }} style={styles.mediaImage} contentFit="cover" />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="videocam" size={48} color={COLORS.neutral[500]} />
                  <Text style={styles.videoText}>Vídeo selecionado</Text>
                </View>
              )}
              <Pressable onPress={handleRemoveMedia} style={styles.removeMedia}>
                <Ionicons name="close" size={20} color={COLORS.neutral[0]} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Actions */}
        <View
          style={[
            styles.actions,
            {
              paddingBottom: insets.bottom + SPACING.lg,
              borderTopColor: borderColor,
            },
          ]}
        >
          <Pressable
            onPress={handlePickImage}
            disabled={isSubmitting}
            style={[styles.actionButton, { backgroundColor: inputBg }]}
          >
            <Ionicons name="image-outline" size={20} color={COLORS.primary[500]} />
            <Text style={styles.actionText}>Foto</Text>
          </Pressable>

          <Pressable
            onPress={handlePickVideo}
            disabled={isSubmitting}
            style={[styles.actionButton, { backgroundColor: inputBg }]}
          >
            <Ionicons name="videocam-outline" size={20} color={COLORS.primary[500]} />
            <Text style={styles.actionText}>Vídeo</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["2xl"],
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  submitButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  submitText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.neutral[0],
  },
  reviewInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  reviewText: {
    fontSize: 12,
    color: COLORS.primary[600],
    flex: 1,
  },
  composer: {
    flex: 1,
    padding: SPACING["2xl"],
  },
  userRow: {
    flexDirection: "row",
    marginBottom: SPACING.lg,
  },
  userAvatar: {
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  userHint: {
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: SPACING.lg,
  },
  mediaPreview: {
    marginBottom: SPACING.lg,
    position: "relative",
  },
  mediaImage: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[200],
  },
  videoPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.neutral[200],
    alignItems: "center",
    justifyContent: "center",
  },
  videoText: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: SPACING.sm,
  },
  removeMedia: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: RADIUS.full,
    padding: SPACING.sm,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING["2xl"],
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    gap: SPACING.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary[500],
  },
});
