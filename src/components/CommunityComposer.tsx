import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Avatar } from "./ui";
import { useAppStore } from "../state/store";
import { uploadImageToImgur } from "../api/imgur";
import { logger } from "../utils/logger";
import * as Haptics from "expo-haptics";

const POST_TYPES = [
  { id: "duvida", label: "Dúvida", emoji: "❓", color: "#3B82F6", bgColor: "#EFF6FF" },
  { id: "desabafo", label: "Desabafo", emoji: "💭", color: "#8B5CF6", bgColor: "#F5F3FF" },
  { id: "vitoria", label: "Vitória", emoji: "🎉", color: "#10B981", bgColor: "#ECFDF5" },
  { id: "dica", label: "Dica", emoji: "💡", color: "#F59E0B", bgColor: "#FFFBEB" },
];

interface CommunityComposerProps {
  onPost: (content: string, type: string, imageUrl?: string) => void;
  onExpand?: () => void;
}

export default function CommunityComposer({ onPost, onExpand }: CommunityComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const user = useAppStore((s) => s.user);

  const handleExpand = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(true);
    onExpand?.();
  };

  const handleTypeSelect = async (typeId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedType(typeId === selectedType ? null : typeId);
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) return;
    
    setIsUploading(true);
    let imageUrl: string | undefined;

    try {
      // Fazer upload da imagem se houver
      if (selectedImage) {
        logger.info("Iniciando upload de imagem", "CommunityComposer");
        imageUrl = await uploadImageToImgur(selectedImage);
        logger.info("Upload concluído", "CommunityComposer", { imageUrl });
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPost(content.trim(), selectedType || "geral", imageUrl);
      setContent("");
      setSelectedType(null);
      setSelectedImage(null);
      setIsExpanded(false);
    } catch (error) {
      logger.error("Erro ao publicar post", "CommunityComposer", error instanceof Error ? error : new Error(String(error)));
      Alert.alert(
        "Erro",
        "Não foi possível publicar o post. Verifique sua conexão e tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setSelectedType(null);
    setSelectedImage(null);
    setIsExpanded(false);
  };

  const handleImagePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à sua galeria para adicionar fotos.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      logger.error("Erro ao selecionar imagem", "CommunityComposer", error instanceof Error ? error : new Error(String(error)));
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  if (!isExpanded) {
    return (
      <Pressable
        onPress={handleExpand}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 16,
          marginBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
        }}
      >
        <View className="flex-row items-center">
          <Avatar
            size={44}
            source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
            isNathalia={!user?.avatarUrl}
            fallbackIcon="person"
            fallbackColor="#E11D48"
            fallbackBgColor="#FEE2E2"
            style={{ marginRight: 12 }}
          />
          <Text style={{ flex: 1, color: "#9CA3AF", fontSize: 15 }}>
            Como você está hoje?
          </Text>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E11D48",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
        </View>

        {/* Quick Type Shortcuts */}
        <View className="flex-row mt-4 pt-4 border-t border-gray-100">
          {POST_TYPES.map((type) => (
            <Pressable
              key={type.id}
              onPress={() => {
                handleExpand();
                setSelectedType(type.id);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: type.bgColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{type.emoji}</Text>
              <Text style={{ color: type.color, fontSize: 13, fontWeight: "500" }}>
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Avatar
            size={40}
            source={user?.avatarUrl ? { uri: user.avatarUrl } : null}
            isNathalia={!user?.avatarUrl}
            fallbackIcon="person"
            fallbackColor="#E11D48"
            fallbackBgColor="#FEE2E2"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "#1F2937", fontSize: 15, fontWeight: "600" }}>
            Nova publicação
          </Text>
        </View>
        <Pressable onPress={handleCancel}>
          <Ionicons name="close" size={24} color="#9CA3AF" />
        </Pressable>
      </View>

      {/* Type Selection */}
      <View className="flex-row mb-4">
        {POST_TYPES.map((type, index) => (
          <Animated.View
            key={type.id}
            entering={FadeInUp.delay(index * 50).duration(200)}
          >
            <Pressable
              onPress={() => handleTypeSelect(type.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: selectedType === type.id ? type.color : type.bgColor,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{type.emoji}</Text>
              <Text
                style={{
                  color: selectedType === type.id ? "#FFFFFF" : type.color,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                {type.label}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      {/* Text Input */}
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Compartilhe o que está pensando..."
        placeholderTextColor="#9CA3AF"
        multiline
        autoFocus
        style={{
          fontSize: 16,
          color: "#1F2937",
          minHeight: 100,
          textAlignVertical: "top",
          marginBottom: 16,
        }}
      />

      {/* Image Preview */}
      {selectedImage && (
        <View className="mb-4 relative">
          <Image
            source={{ uri: selectedImage }}
            className="w-full rounded-xl"
            style={{ height: 200 }}
            resizeMode="cover"
          />
          <Pressable
            onPress={handleRemoveImage}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 20,
              padding: 8,
            }}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
        <View className="flex-row items-center">
          <Pressable
            onPress={handleImagePress}
            disabled={isUploading}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Ionicons name="image-outline" size={20} color="#6B7280" />
          </Pressable>
          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F3F4F6",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="happy-outline" size={20} color="#6B7280" />
          </Pressable>
        </View>

        <Pressable
          onPress={handlePost}
          disabled={(!content.trim() && !selectedImage) || isUploading}
          style={{
            backgroundColor: (content.trim() || selectedImage) && !isUploading ? "#E11D48" : "#F3F4F6",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isUploading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                Enviando...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  color: (content.trim() || selectedImage) ? "#FFFFFF" : "#9CA3AF",
                  fontSize: 14,
                  fontWeight: "600",
                  marginRight: 4,
                }}
              >
                Publicar
              </Text>
              <Ionicons
                name="send"
                size={16}
                color={(content.trim() || selectedImage) ? "#FFFFFF" : "#9CA3AF"}
              />
            </>
          )}
        </Pressable>
      </View>
    </Animated.View>
  );
}
