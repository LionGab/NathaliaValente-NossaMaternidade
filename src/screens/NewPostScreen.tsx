import React, { useState } from "react";
import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { RootStackScreenProps, Post } from "../types/navigation";
import { useCommunityStore, useAppStore } from "../state/store";
import { uploadImageToImgur } from "../api/imgur";
import { logger } from "../utils/logger";
import * as Haptics from "expo-haptics";

export default function NewPostScreen({ navigation }: RootStackScreenProps<"NewPost">) {
  const insets = useSafeAreaInsets();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addPost = useCommunityStore((s) => s.addPost);
  const user = useAppStore((s) => s.user);

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) return;

    setIsUploading(true);
    let imageUrl: string | undefined;

    try {
      // Fazer upload da imagem se houver
      if (selectedImage) {
        logger.info("Iniciando upload de imagem", "NewPostScreen");
        imageUrl = await uploadImageToImgur(selectedImage);
        logger.info("Upload concluído", "NewPostScreen", { imageUrl });
      }

      const newPost: Post = {
        id: Date.now().toString(),
        authorId: user?.id || "me",
        authorName: user?.name || "Você",
        content: content.trim(),
        imageUrl,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
      };

      addPost(newPost);
      navigation.goBack();
    } catch (error) {
      logger.error("Erro ao publicar post", "NewPostScreen", error instanceof Error ? error : new Error(String(error)));
      Alert.alert(
        "Erro",
        "Não foi possível publicar o post. Verifique sua conexão e tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoPress = async () => {
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
      logger.error("Erro ao selecionar imagem", "NewPostScreen", error instanceof Error ? error : new Error(String(error)));
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const handleCameraPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de acesso à câmera para tirar fotos.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      logger.error("Erro ao tirar foto", "NewPostScreen", error instanceof Error ? error : new Error(String(error)));
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-cream-50"
    >
      {/* Header Actions */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-blush-100">
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="text-warmGray-500 text-base">Cancelar</Text>
        </Pressable>
        <Pressable
          onPress={handlePost}
          disabled={(!content.trim() && !selectedImage) || isUploading}
          className={`px-5 py-2 rounded-full flex-row items-center ${(content.trim() || selectedImage) && !isUploading ? "bg-rose-500" : "bg-warmGray-200"}`}
        >
          {isUploading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text className="text-base font-semibold text-white">Enviando...</Text>
            </>
          ) : (
            <Text className={`text-base font-semibold ${(content.trim() || selectedImage) ? "text-white" : "text-warmGray-400"}`}>
              Publicar
            </Text>
          )}
        </Pressable>
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-start">
          <View className="w-11 h-11 rounded-full bg-blush-200 items-center justify-center mr-3">
            <Ionicons name="person" size={22} color="#9E7269" />
          </View>
          <View className="flex-1">
            <Text className="text-warmGray-800 text-base font-semibold">{user?.name || "Voce"}</Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="O que voce quer compartilhar?"
              placeholderTextColor="#A8A29E"
              multiline
              autoFocus
              className="text-warmGray-700 text-base leading-6 mt-2"
              style={{ minHeight: 100 }}
            />
            
            {/* Image Preview */}
            {selectedImage && (
              <View className="mt-4 relative">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full rounded-xl"
                  style={{ height: 200 }}
                  resizeMode="cover"
                />
                <Pressable
                  onPress={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
                >
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View
        className="flex-row items-center px-4 py-3 border-t border-blush-100 bg-white"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <Pressable onPress={handlePhotoPress} className="flex-row items-center mr-6">
          <Ionicons name="image-outline" size={24} color="#BC8B7B" />
          <Text className="ml-2 text-warmGray-500 text-sm">Foto</Text>
        </Pressable>
        <Pressable onPress={handleCameraPress} className="flex-row items-center">
          <Ionicons name="camera-outline" size={24} color="#BC8B7B" />
          <Text className="ml-2 text-warmGray-500 text-sm">Câmera</Text>
        </Pressable>
        <View className="flex-1" />
        <Text className="text-warmGray-300 text-sm">{content.length}/500</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
