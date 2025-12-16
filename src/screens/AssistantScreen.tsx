/**
 * AssistantScreen - NathIA Chat Interface
 *
 * DESIGN: Claude/ChatGPT/Gemini mobile app style
 * PALETTE: Azul Pastel Maternidade (#7DB9D5)
 * FEATURES:
 * - Sidebar com histórico de conversas agrupado por data
 * - Header minimalista com toggle de sidebar
 * - Empty state elegante com sugestões
 * - Input moderno estilo pill
 * - Mensagens com design clean
 */

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { detectMedicalQuestion, estimateTokens, getNathIAResponse } from "../api/ai-service";
import { AIConsentModal } from "../components/chat/AIConsentModal";
import { ChatEmptyState } from "../components/chat/ChatEmptyState";
import { ChatHistorySidebar } from "../components/chat/ChatHistorySidebar";
import { Avatar } from "../components/ui";
import { VoiceMessagePlayer } from "../components/VoiceMessagePlayer";
import {
  containsSensitiveTopic,
  getRandomFallbackMessage,
  prepareMessagesForAPI,
  SENSITIVE_TOPIC_DISCLAIMER,
} from "../config/nathia";
import { useChatHandlers } from "../hooks/useChatHandlers";
import { useTheme } from "../hooks/useTheme";
import { useVoicePremiumGate } from "../hooks/useVoice";
import { useIsPremium } from "../state/premium-store";
import { Conversation, useAppStore, useChatStore } from "../state/store";
import { COLORS_DARK, COLORS as DS_COLORS, SHADOWS } from "../theme/design-system";
import { ChatMessage, MainTabScreenProps } from "../types/navigation";
import { logger } from "../utils/logger";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ============================================
// DESIGN TOKENS - Usando design-system.ts
// ============================================
const getThemeColors = (isDark: boolean) => {
  const palette = isDark ? COLORS_DARK : DS_COLORS;
  return {
    // Primary colors (Azul Pastel)
    primary: palette.primary[500],
    primaryLight: palette.primary[100],
    primaryLighter: palette.primary[50],
    primaryDark: palette.primary[600],

    // Backgrounds
    bgPrimary: palette.background.primary,
    bgSecondary: palette.background.secondary,
    bgTertiary: palette.background.tertiary,
    bgSidebar: palette.background.secondary,

    // Text
    textPrimary: palette.text.primary,
    textSecondary: palette.text.secondary,
    textTertiary: palette.text.tertiary,
    textMuted: palette.text.muted,

    // Borders
    border: palette.primary[200],
    borderLight: palette.primary[100],

    // Message bubbles
    userBubble: palette.primary[500],
    aiBubble: palette.background.secondary,
  };
};

// Default para StyleSheet estático (light mode)
const THEME_LIGHT = getThemeColors(false);

const QUICK_CHIPS = [
  "Como está meu bebê?",
  "Posso tomar café?",
  "Dicas de sono",
  "Preparar enxoval",
];

// ============================================
// CONSTANTS
// ============================================
const FREE_MESSAGE_LIMIT = 10;
const MESSAGE_COUNT_KEY = "nathia_message_count";

// ============================================
// MAIN COMPONENT
// ============================================
export default function AssistantScreen({ navigation }: MainTabScreenProps<"Assistant">) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const THEME = useMemo(() => getThemeColors(isDark), [isDark]);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // Store selectors
  const conversations = useChatStore((s) => s.conversations);
  const currentConversationId = useChatStore((s) => s.currentConversationId);
  const isLoading = useChatStore((s) => s.isLoading);
  const setLoading = useChatStore((s) => s.setLoading);
  const addMessage = useChatStore((s) => s.addMessage);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const setCurrentConversation = useChatStore((s) => s.setCurrentConversation);
  const clearCurrentChat = useChatStore((s) => s.clearCurrentChat);
  const hasAcceptedAITerms = useChatStore((s) => s.hasAcceptedAITerms);
  const acceptAITerms = useChatStore((s) => s.acceptAITerms);

  // Premium status
  const isPremium = useIsPremium();
  const user = useAppStore((s) => s.user);

  // AI Consent state
  const [showAIConsent, setShowAIConsent] = useState(!hasAcceptedAITerms);

  // Voice premium gate
  const { hasAccess: hasVoiceAccess } = useVoicePremiumGate();

  // Load message count on mount
  React.useEffect(() => {
    const loadMessageCount = async () => {
      if (isPremium) {
        setMessageCount(0);
        return;
      }
      try {
        const key = `${MESSAGE_COUNT_KEY}_${user?.id || "anonymous"}`;
        const count = await AsyncStorage.getItem(key);
        setMessageCount(count ? parseInt(count, 10) : 0);
      } catch (error) {
        logger.error(
          "Failed to load message count",
          "AssistantScreen",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    };
    loadMessageCount();
  }, [isPremium, user?.id]);

  // Chat handlers hook
  const handlers = useChatHandlers({
    navigation,
    inputText,
    setInputText,
    messageCount,
    setMessageCount,
    flatListRef,
  });

  // Get current messages
  const currentMessages = useMemo(() => {
    const conv = conversations.find((c) => c.id === currentConversationId);
    return conv?.messages || [];
  }, [conversations, currentConversationId]);

  // Group conversations by date
  const groupedConversations = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups: { title: string; conversations: Conversation[] }[] = [
      { title: "Hoje", conversations: [] },
      { title: "Ontem", conversations: [] },
      { title: "Esta semana", conversations: [] },
      { title: "Anteriores", conversations: [] },
    ];

    conversations.forEach((conv) => {
      const convDate = new Date(conv.createdAt);
      if (convDate.toDateString() === today.toDateString()) {
        groups[0].conversations.push(conv);
      } else if (convDate.toDateString() === yesterday.toDateString()) {
        groups[1].conversations.push(conv);
      } else if (convDate > lastWeek) {
        groups[2].conversations.push(conv);
      } else {
        groups[3].conversations.push(conv);
      }
    });

    return groups.filter((g) => g.conversations.length > 0);
  }, [conversations]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    // Verificar limite de mensagens para usuários free
    if (!isPremium && messageCount >= FREE_MESSAGE_LIMIT) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      navigation.navigate("Paywall", { source: "chat_limit_reached" });
      return;
    }

    const userInput = inputText.trim();
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Criar mensagem do usuário
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMessage);
    setInputText("");
    setLoading(true);

    // Incrementar contador de mensagens para usuários free
    if (!isPremium) {
      const newCount = messageCount + 1;
      setMessageCount(newCount);
      try {
        const key = `${MESSAGE_COUNT_KEY}_${user?.id || "anonymous"}`;
        await AsyncStorage.setItem(key, newCount.toString());
      } catch (error) {
        logger.error(
          "Failed to save message count",
          "AssistantScreen",
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    // Scroll para o fim
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Preparar histórico de mensagens para a API
      const currentConv = conversations.find((c) => c.id === currentConversationId);
      const messageHistory = currentConv?.messages || [];

      // Converter para formato da API
      const conversationForAPI = [
        ...messageHistory.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: userInput },
      ];

      // Preparar mensagens com system prompt da NathIA
      const apiMessages = prepareMessagesForAPI(conversationForAPI);

      // Estimar tokens e detectar se é pergunta médica
      const estimated = estimateTokens(apiMessages);
      const requiresGrounding = detectMedicalQuestion(userInput);

      // Chamar a Edge Function segura
      const response = await getNathIAResponse(apiMessages, {
        estimatedTokens: estimated,
        requiresGrounding,
      });

      let aiContent = response.content;

      // Verificar se é um tópico sensível
      if (containsSensitiveTopic(userInput)) {
        aiContent = aiContent + "\n\n" + SENSITIVE_TOPIC_DISCLAIMER;
      }

      // Se tem grounding, adicionar citations
      if (response.grounding?.citations && response.grounding.citations.length > 0) {
        aiContent += "\n\n📚 Fontes:\n";
        response.grounding.citations.slice(0, 3).forEach((citation, i) => {
          aiContent += `${i + 1}. ${citation.title || "Fonte"}\n`;
        });
      }

      // Criar mensagem da IA
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        createdAt: new Date().toISOString(),
      };
      addMessage(aiMessage);

      logger.info("NathIA response generated", "AssistantScreen", {
        inputLength: userInput.length,
        outputLength: aiContent.length,
        tokens: response.usage?.totalTokens,
        provider: response.provider,
      });
    } catch (error) {
      logger.error(
        "NathIA API error",
        "AssistantScreen",
        error instanceof Error ? error : new Error(String(error))
      );

      let errorMessage = getRandomFallbackMessage();

      if (error instanceof Error) {
        if (
          error.message.includes("não autenticado") ||
          error.message.includes("Sessão expirada")
        ) {
          errorMessage =
            "Sua sessão expirou. Faça login novamente para continuar conversando comigo. 🔒";
        } else if (
          error.message.includes("muitas mensagens") ||
          error.message.includes("Rate limit")
        ) {
          errorMessage =
            "Você está enviando muitas mensagens! Aguarde um minutinho e voltamos a conversar. ⏱️";
        }
      }

      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessage,
        createdAt: new Date().toISOString(),
      };
      addMessage(fallbackMessage);
    } finally {
      setLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [
    inputText,
    isLoading,
    conversations,
    currentConversationId,
    addMessage,
    setLoading,
    isPremium,
    messageCount,
    navigation,
    user,
  ]);

  // Handlers usando hook customizado
  const handleNewChat = useCallback(async () => {
    await handlers.handleNewChat();
    setShowHistory(false);
  }, [handlers]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      await handlers.handleSelectConversation(id);
      setShowHistory(false);
    },
    [handlers]
  );

  const handleDeleteConversation = handlers.handleDeleteConversation;
  const handleSuggestedPromptBase = handlers.handleSuggestedPrompt;

  // Wrapper para handleSuggestedPrompt que preenche + foca input
  const handleSuggestedPrompt = useCallback(
    async (text: string) => {
      await handleSuggestedPromptBase(text);
      // Focar o input após um pequeno delay para garantir que o texto foi preenchido
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
    [handleSuggestedPromptBase]
  );

  const handleMicPress = handlers.handleMicPress;
  const handleAttachment = handlers.handleAttachment;

  const handleAcceptAITerms = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    acceptAITerms();
    setShowAIConsent(false);
  }, [acceptAITerms]);

  const handleDeclineAITerms = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Home");
  }, [navigation]);

  const handleVoicePremiumRequired = handlers.handleVoicePremiumRequired;

  // ============================================
  // MESSAGE BUBBLE COMPONENT
  // ============================================
  const MessageBubble = React.memo(
    ({ message, index }: { message: ChatMessage; index: number }) => {
      const isUser = message.role === "user";

      return (
        <Animated.View
          entering={FadeInUp.delay(index * 20).duration(300)}
          style={[styles.messageContainer, isUser ? styles.messageUser : styles.messageAI]}
        >
          {/* AI Avatar */}
          {!isUser && <Avatar size={28} isNathIA={true} style={styles.messageAvatar} />}

          {/* Message Bubble */}
          <View
            style={[
              styles.messageBubble,
              isUser
                ? [styles.bubbleUser, { backgroundColor: THEME.userBubble }]
                : [styles.bubbleAI, { backgroundColor: THEME.aiBubble }],
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isUser ? styles.textUser : [styles.textAI, { color: THEME.textPrimary }],
              ]}
            >
              {message.content}
            </Text>

            {/* Voice Player - Apenas para mensagens da NathIA */}
            {!isUser && hasVoiceAccess && (
              <View style={[styles.voiceContainer, { borderTopColor: THEME.borderLight }]}>
                <VoiceMessagePlayer
                  messageId={message.id}
                  text={message.content}
                  onPremiumRequired={handleVoicePremiumRequired}
                  size="small"
                  compact
                  iconColor={THEME.primary}
                />
              </View>
            )}
          </View>
        </Animated.View>
      );
    }
  );
  MessageBubble.displayName = "MessageBubble";

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.bgPrimary }} edges={["top"]}>
      <View style={[styles.container, { flex: 1, backgroundColor: THEME.bgPrimary }]}>
        {/* Header - Clean, minimal */}
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top,
              backgroundColor: THEME.bgSecondary,
              borderBottomColor: THEME.borderLight,
            },
          ]}
        >
          <View style={styles.headerContent}>
            {/* Menu Button */}
            <Pressable onPress={() => setShowHistory(true)} style={styles.headerButton}>
              <Ionicons name="menu-outline" size={24} color={THEME.textSecondary} />
            </Pressable>

            {/* Title - Centered */}
            <View style={styles.headerCenter}>
              <Avatar size={28} isNathIA={true} style={{ marginRight: 8 }} />
              <Text style={[styles.headerTitle, { color: THEME.textPrimary }]}>NathIA</Text>
            </View>

            {/* Actions */}
            <View style={styles.headerActions}>
              {currentMessages.length > 0 && (
                <Pressable onPress={handlers.handleClearChat} style={styles.headerButton}>
                  <Ionicons name="trash-outline" size={22} color={THEME.textMuted} />
                </Pressable>
              )}
              <Pressable onPress={handleNewChat} style={styles.headerButton}>
                <Ionicons name="create-outline" size={22} color={THEME.textSecondary} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Messages Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.messagesContainer}
          keyboardVerticalOffset={0}
        >
          {currentMessages.length === 0 ? (
            <ScrollView
              contentContainerStyle={styles.emptyScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ChatEmptyState onSuggestedPrompt={handleSuggestedPrompt} />
            </ScrollView>
          ) : (
            <FlatList
              ref={flatListRef}
              data={currentMessages}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <MessageBubble message={item} index={index} />}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesListContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              ListFooterComponent={
                isLoading ? (
                  <Animated.View entering={FadeIn.duration(300)} style={styles.loadingContainer}>
                    <Avatar size={28} isNathIA={true} style={styles.messageAvatar} />
                    <View style={[styles.loadingBubble, { backgroundColor: THEME.aiBubble }]}>
                      <View style={styles.loadingDots}>
                        <Animated.View
                          entering={FadeIn.delay(0).duration(400)}
                          style={[styles.loadingDot, { backgroundColor: THEME.primary }]}
                        />
                        <Animated.View
                          entering={FadeIn.delay(150).duration(400)}
                          style={[styles.loadingDot, { backgroundColor: THEME.primaryLight }]}
                        />
                        <Animated.View
                          entering={FadeIn.delay(300).duration(400)}
                          style={[styles.loadingDot, { backgroundColor: THEME.border }]}
                        />
                      </View>
                    </View>
                  </Animated.View>
                ) : null
              }
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={7}
              removeClippedSubviews={true}
            />
          )}

          {/* Input Area */}
          <View
            style={[
              styles.inputContainer,
              { paddingBottom: insets.bottom + 8, backgroundColor: THEME.bgPrimary },
            ]}
          >
            {/* Quick Chips - Show when there are messages */}
            {currentMessages.length > 0 && !inputText.trim() && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsScroll}
                contentContainerStyle={styles.chipsContent}
              >
                {QUICK_CHIPS.map((chip, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleSuggestedPrompt(chip)}
                    style={[
                      styles.chip,
                      { backgroundColor: THEME.bgSecondary, borderColor: THEME.border },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: THEME.textSecondary }]}>{chip}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {/* Input Box */}
            <View
              style={[
                styles.inputBox,
                { backgroundColor: THEME.bgSecondary, borderColor: THEME.border },
              ]}
            >
              {/* Attachment */}
              <Pressable onPress={handleAttachment} style={styles.inputButton}>
                <Ionicons name="add-circle-outline" size={26} color={THEME.textMuted} />
              </Pressable>

              {/* Text Input */}
              <TextInput
                ref={inputRef}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Pergunte qualquer coisa..."
                placeholderTextColor={THEME.textMuted}
                multiline
                maxLength={2000}
                style={[styles.textInput, { color: THEME.textPrimary }]}
              />

              {/* Send/Mic Button */}
              {inputText.trim() ? (
                <Pressable
                  onPress={handleSend}
                  style={[styles.sendButton, { backgroundColor: THEME.primary }]}
                >
                  <Ionicons name="send" size={18} color={DS_COLORS.text.inverse} />
                </Pressable>
              ) : (
                <Pressable onPress={handleMicPress} style={styles.micButton}>
                  <Ionicons name="mic-outline" size={22} color={THEME.textMuted} />
                </Pressable>
              )}
            </View>

            {/* Disclaimer */}
            <Text style={[styles.disclaimer, { color: THEME.textMuted }]}>
              NathIA pode cometer erros. Consulte sempre seu médico.
            </Text>
          </View>
        </KeyboardAvoidingView>

        {/* Modals */}
        <ChatHistorySidebar
          visible={showHistory}
          conversations={conversations}
          currentConversationId={currentConversationId}
          groupedConversations={groupedConversations}
          onClose={() => setShowHistory(false)}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        <AIConsentModal
          visible={showAIConsent}
          onAccept={handleAcceptAITerms}
          onDecline={handleDeclineAITerms}
          onNavigateToLegal={() => navigation.navigate("Legal")}
        />
      </View>
    </SafeAreaView>
  );
}

// ============================================
// STYLES (usa THEME_LIGHT como base - dark mode via inline styles)
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesListContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageUser: {
    justifyContent: "flex-end",
  },
  messageAI: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: THEME_LIGHT.userBubble,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: THEME_LIGHT.aiBubble,
    borderBottomLeftRadius: 4,
    ...SHADOWS.sm,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: DS_COLORS.text.inverse,
  },
  textAI: {
    color: THEME_LIGHT.textPrimary,
  },
  voiceContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME_LIGHT.borderLight,
  },

  // Loading
  loadingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  loadingBubble: {
    backgroundColor: THEME_LIGHT.aiBubble,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 16,
    ...SHADOWS.sm,
  },
  loadingDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },

  // Empty State
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },

  // Input
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: THEME_LIGHT.bgPrimary,
  },
  chipsScroll: {
    marginBottom: 8,
  },
  chipsContent: {
    paddingRight: 16,
  },
  chip: {
    backgroundColor: THEME_LIGHT.bgSecondary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: THEME_LIGHT.border,
  },
  chipText: {
    fontSize: 13,
    color: THEME_LIGHT.textSecondary,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: THEME_LIGHT.bgSecondary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: THEME_LIGHT.border,
    minHeight: 48,
    maxHeight: 120,
  },
  inputButton: {
    padding: 11,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: THEME_LIGHT.textPrimary,
    paddingVertical: 12,
    paddingRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_LIGHT.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    marginBottom: 6,
  },
  micButton: {
    padding: 11,
  },
  disclaimer: {
    fontSize: 11,
    color: THEME_LIGHT.textMuted,
    textAlign: "center",
    marginTop: 8,
  },

  // Modal
});
