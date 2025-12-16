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

import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import { MainTabScreenProps, ChatMessage } from "../types/navigation";
import { useChatStore, Conversation, useAppStore } from "../state/store";
import { useIsPremium } from "../state/premium-store";
import { Avatar } from "../components/ui";
import * as Haptics from "expo-haptics";
import {
  getNathIAResponse,
  estimateTokens,
  detectMedicalQuestion,
} from "../api/ai-service";
import {
  prepareMessagesForAPI,
  getRandomFallbackMessage,
  containsSensitiveTopic,
  SENSITIVE_TOPIC_DISCLAIMER,
} from "../config/nathia";
import { logger } from "../utils/logger";
import { VoiceMessagePlayer } from "../components/VoiceMessagePlayer";
import { useVoicePremiumGate } from "../hooks/useVoice";
import { SHADOWS } from "../theme/design-system";
import { useTheme } from "../hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ============================================
// DESIGN TOKENS - Azul Pastel Maternidade
// Função para retornar tokens baseados no tema
// ============================================
const getThemeColors = (isDark: boolean) => ({
  // Primary colors (Azul Pastel #7DB9D5)
  primary: isDark ? "#8BC5DD" : "#7DB9D5",
  primaryLight: isDark ? "#1A2027" : "#E8F3F9",
  primaryLighter: isDark ? "#0F1419" : "#F7FBFD",
  primaryDark: isDark ? "#7DB9D5" : "#5BA3C7",

  // Backgrounds
  bgPrimary: isDark ? "#0F1419" : "#F7FBFD",
  bgSecondary: isDark ? "#1A2027" : "#FFFFFF",
  bgTertiary: isDark ? "#242D36" : "#EDF4F8",
  bgSidebar: isDark ? "#1A2027" : "#FFFFFF",

  // Text
  textPrimary: isDark ? "#F3F5F7" : "#1F2937",
  textSecondary: isDark ? "#9DA8B4" : "#6B7280",
  textTertiary: isDark ? "#7D8B99" : "#9CA3AF",
  textMuted: isDark ? "#5C6B7A" : "#D1D5DB",

  // Borders
  border: isDark ? "#2F3B46" : "#DCE9F1",
  borderLight: isDark ? "#242D36" : "#E8F3F9",

  // Message bubbles
  userBubble: isDark ? "#5BA3C7" : "#7DB9D5",
  aiBubble: isDark ? "#1A2027" : "#FFFFFF",
});

// Default para StyleSheet estático (light mode)
const THEME_LIGHT = getThemeColors(false);

// ============================================
// SUGGESTED PROMPTS
// ============================================
interface SuggestedPrompt {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    icon: "nutrition-outline",
    title: "Alimentação",
    subtitle: "O que posso comer na gravidez?"
  },
  {
    icon: "fitness-outline",
    title: "Exercícios",
    subtitle: "Atividades seguras para gestantes"
  },
  {
    icon: "medical-outline",
    title: "Sintomas",
    subtitle: "Quando devo procurar um médico?"
  },
  {
    icon: "heart-outline",
    title: "Bem-estar",
    subtitle: "Dicas para aliviar enjoos"
  },
];

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
        logger.error("Failed to load message count", "AssistantScreen", error instanceof Error ? error : new Error(String(error)));
      }
    };
    loadMessageCount();
  }, [isPremium, user?.id]);

  // Handler para quando voz premium é necessária
  const handleVoicePremiumRequired = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Paywall", { source: "voice_nathia" });
  }, [navigation]);

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
        logger.error("Failed to save message count", "AssistantScreen", error instanceof Error ? error : new Error(String(error)));
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
      logger.error("NathIA API error", "AssistantScreen", error instanceof Error ? error : new Error(String(error)));

      let errorMessage = getRandomFallbackMessage();

      if (error instanceof Error) {
        if (error.message.includes("não autenticado") || error.message.includes("Sessão expirada")) {
          errorMessage = "Sua sessão expirou. Faça login novamente para continuar conversando comigo. 🔒";
        } else if (error.message.includes("muitas mensagens") || error.message.includes("Rate limit")) {
          errorMessage = "Você está enviando muitas mensagens! Aguarde um minutinho e voltamos a conversar. ⏱️";
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
  }, [inputText, isLoading, conversations, currentConversationId, addMessage, setLoading, isPremium, messageCount, navigation, user]);

  const handleNewChat = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentConversation(null);
    setShowHistory(false);
  };

  const handleSelectConversation = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentConversation(id);
    setShowHistory(false);
  };

  const handleDeleteConversation = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteConversation(id);
  };

  const handleSuggestedPrompt = async (text: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText(text);
  };

  const handleMicPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Mensagem de Voz",
      description: "Em breve você poderá enviar mensagens de voz para a NathIA.",
      emoji: "🎙️",
      primaryCtaLabel: "Voltar",
    });
  };

  const handleAcceptAITerms = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    acceptAITerms();
    setShowAIConsent(false);
  };

  const handleDeclineAITerms = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to Home tab instead of goBack() for consistent behavior in TabNavigator
    navigation.navigate("Home");
  };

  const handleAttachment = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ComingSoon", {
      title: "Anexos",
      description: "Em breve você poderá enviar fotos e documentos para a NathIA analisar.",
      emoji: "📎",
      primaryCtaLabel: "Voltar",
    });
  };

  // ============================================
  // MESSAGE BUBBLE COMPONENT
  // ============================================
  const MessageBubble = React.memo(({ message, index }: {
    message: ChatMessage;
    index: number;
  }) => {
    const isUser = message.role === "user";

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 20).duration(300)}
        style={[styles.messageContainer, isUser ? styles.messageUser : styles.messageAI]}
      >
        {/* AI Avatar */}
        {!isUser && (
          <Avatar
            size={28}
            isNathIA={true}
            style={styles.messageAvatar}
          />
        )}

        {/* Message Bubble */}
        <View style={[
          styles.messageBubble,
          isUser
            ? [styles.bubbleUser, { backgroundColor: THEME.userBubble }]
            : [styles.bubbleAI, { backgroundColor: THEME.aiBubble }]
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.textUser : [styles.textAI, { color: THEME.textPrimary }]
          ]}>
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
  });
  MessageBubble.displayName = "MessageBubble";

  // ============================================
  // EMPTY STATE
  // ============================================
  const renderEmptyState = () => (
    <Animated.View entering={FadeIn.duration(600)} style={styles.emptyContainer}>
      {/* Logo/Avatar */}
      <Animated.View entering={FadeInDown.delay(100).duration(600).springify()}>
        <View style={styles.emptyAvatarContainer}>
          <Avatar
            size={72}
            isNathIA={true}
          />
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.Text
        entering={FadeInDown.delay(200).duration(600).springify()}
        style={styles.emptyTitle}
      >
        NathIA
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(300).duration(600).springify()}
        style={styles.emptySubtitle}
      >
        Sua assistente inteligente 24h
      </Animated.Text>

      {/* Welcome Message */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(600).springify()}
        style={styles.welcomeCard}
      >
        <View style={styles.welcomeIcon}>
          <Ionicons name="sparkles" size={20} color={THEME.primary} />
        </View>
        <Text style={styles.welcomeText}>
          Olá! Eu sou a NathIA. ✨ Estou aqui para tirar suas dúvidas, te acalmar e conversar sobre essa fase incrível. O que você gostaria de saber hoje?
        </Text>
      </Animated.View>

      {/* Suggested Prompts Grid */}
      <Animated.View entering={FadeInUp.delay(500).duration(600).springify()} style={styles.promptsGrid}>
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(600 + index * 80).duration(400)}
            style={styles.promptCard}
          >
            <Pressable
              onPress={() => handleSuggestedPrompt(prompt.subtitle)}
              style={styles.promptPressable}
            >
              <View style={styles.promptIconContainer}>
                <Ionicons name={prompt.icon} size={20} color={THEME.primary} />
              </View>
              <Text style={styles.promptTitle}>{prompt.title}</Text>
              <Text style={styles.promptSubtitle} numberOfLines={2}>
                {prompt.subtitle}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>
    </Animated.View>
  );

  // ============================================
  // AI CONSENT MODAL
  // ============================================
  const renderAIConsentModal = () => (
    <Modal visible={showAIConsent} animationType="fade" transparent statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.consentCard}>
          {/* Header */}
          <View style={styles.consentHeader}>
            <View style={styles.consentIconContainer}>
              <Ionicons name="sparkles" size={28} color={THEME.primary} />
            </View>
            <Text style={styles.consentTitle}>Antes de começar</Text>
          </View>

          {/* Content */}
          <Text style={styles.consentText}>
            A NathIA utiliza inteligência artificial para oferecer apoio. Suas conversas são processadas para gerar respostas personalizadas.
          </Text>

          {/* Links */}
          <View style={styles.consentLinks}>
            <Pressable
              onPress={() => navigation.navigate("Legal")}
              style={styles.consentLink}
            >
              <Ionicons name="shield-checkmark-outline" size={18} color={THEME.primary} />
              <Text style={[styles.consentLinkText, { color: THEME_LIGHT.primary }]}>
                Política de Privacidade
              </Text>
              <Ionicons name="chevron-forward" size={16} color={THEME.primary} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("Legal")}
              style={styles.consentLink}
            >
              <Ionicons name="document-text-outline" size={18} color={THEME.primary} />
              <Text style={[styles.consentLinkText, { color: THEME_LIGHT.primary }]}>
                Termos de Uso
              </Text>
              <Ionicons name="chevron-forward" size={16} color={THEME.primary} />
            </Pressable>
          </View>

          {/* Disclaimer */}
          <View style={styles.consentDisclaimer}>
            <Ionicons name="medkit-outline" size={16} color="#B45309" style={{ marginTop: 2 }} />
            <Text style={styles.disclaimerText}>
              A NathIA não substitui atendimento médico. Em caso de emergência, procure ajuda profissional.
            </Text>
          </View>

          {/* Buttons */}
          <Pressable onPress={handleAcceptAITerms} style={styles.consentButtonPrimary}>
            <Text style={styles.consentButtonPrimaryText}>Aceito e quero continuar</Text>
          </Pressable>
          <Pressable onPress={handleDeclineAITerms} style={styles.consentButtonSecondary}>
            <Text style={styles.consentButtonSecondaryText}>Não, obrigada</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );

  // ============================================
  // HISTORY SIDEBAR
  // ============================================
  const renderHistorySidebar = () => (
    <Modal visible={showHistory} animationType="none" transparent statusBarTranslucent>
      <View style={styles.sidebarOverlay}>
        {/* Backdrop */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setShowHistory(false)}
        />

        {/* Sidebar */}
        <Animated.View
          entering={SlideInLeft.duration(300)}
          exiting={SlideOutLeft.duration(300)}
          style={[styles.sidebar, { paddingTop: insets.top }]}
        >
          {/* Sidebar Header */}
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Conversas</Text>
            <Pressable
              onPress={() => setShowHistory(false)}
              style={styles.sidebarCloseButton}
            >
              <Ionicons name="close" size={20} color={THEME.textSecondary} />
            </Pressable>
          </View>

          {/* New Chat Button */}
          <Pressable onPress={handleNewChat} style={styles.newChatButton}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.newChatText}>Nova conversa</Text>
          </Pressable>

          {/* Conversations List */}
          <ScrollView style={styles.sidebarList} showsVerticalScrollIndicator={false}>
            {groupedConversations.length === 0 ? (
              <View style={styles.sidebarEmpty}>
                <Ionicons name="chatbubbles-outline" size={48} color={THEME.border} />
                <Text style={styles.sidebarEmptyText}>Nenhuma conversa ainda</Text>
              </View>
            ) : (
              groupedConversations.map((group) => (
                <View key={group.title} style={styles.sidebarGroup}>
                  <Text style={styles.sidebarGroupTitle}>{group.title}</Text>
                  {group.conversations.map((conv) => (
                    <Pressable
                      key={conv.id}
                      onPress={() => handleSelectConversation(conv.id)}
                      style={[
                        styles.sidebarItem,
                        conv.id === currentConversationId && styles.sidebarItemActive
                      ]}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={16}
                        color={conv.id === currentConversationId ? THEME_LIGHT.primary : THEME_LIGHT.textMuted}
                      />
                      <View style={styles.sidebarItemContent}>
                        <Text
                          style={[
                            styles.sidebarItemTitle,
                            conv.id === currentConversationId && { color: THEME_LIGHT.primary }
                          ]}
                          numberOfLines={1}
                        >
                          {conv.title}
                        </Text>
                        <Text style={styles.sidebarItemSubtitle}>
                          {conv.messages.length} mensagens
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleDeleteConversation(conv.id)}
                        style={styles.sidebarItemDelete}
                        hitSlop={8}
                      >
                        <Ionicons name="trash-outline" size={14} color={THEME.textMuted} />
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
              ))
            )}
          </ScrollView>

          {/* Sidebar Footer */}
          <View style={[styles.sidebarFooter, { paddingBottom: insets.bottom + 16 }]}>
            <Avatar size={36} isNathIA={true} style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.sidebarFooterTitle}>NathIA</Text>
              <Text style={styles.sidebarFooterSubtitle}>Sua assistente</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <View style={[styles.container, { backgroundColor: THEME.bgPrimary }]}>
      {/* Header - Clean, minimal */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: THEME.bgSecondary, borderBottomColor: THEME.borderLight }]}>
        <View style={styles.headerContent}>
          {/* Menu Button */}
          <Pressable
            onPress={() => setShowHistory(true)}
            style={styles.headerButton}
          >
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
              <Pressable onPress={clearCurrentChat} style={styles.headerButton}>
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
            {renderEmptyState()}
          </ScrollView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <MessageBubble message={item} index={index} />
            )}
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
                      <Animated.View entering={FadeIn.delay(0).duration(400)} style={[styles.loadingDot, { backgroundColor: THEME.primary }]} />
                      <Animated.View entering={FadeIn.delay(150).duration(400)} style={[styles.loadingDot, { backgroundColor: THEME.primaryLight }]} />
                      <Animated.View entering={FadeIn.delay(300).duration(400)} style={[styles.loadingDot, { backgroundColor: THEME.border }]} />
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
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8, backgroundColor: THEME.bgPrimary }]}>
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
                  style={[styles.chip, { backgroundColor: THEME.bgSecondary, borderColor: THEME.border }]}
                >
                  <Text style={[styles.chipText, { color: THEME.textSecondary }]}>{chip}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {/* Input Box */}
          <View style={[styles.inputBox, { backgroundColor: THEME.bgSecondary, borderColor: THEME.border }]}>
            {/* Attachment */}
            <Pressable onPress={handleAttachment} style={styles.inputButton}>
              <Ionicons name="add-circle-outline" size={26} color={THEME.textMuted} />
            </Pressable>

            {/* Text Input */}
            <TextInput
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
              <Pressable onPress={handleSend} style={[styles.sendButton, { backgroundColor: THEME.primary }]}>
                <Ionicons name="send" size={18} color="#FFF" />
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
      {renderHistorySidebar()}
      {renderAIConsentModal()}
    </View>
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
    color: "#FFFFFF",
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
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyAvatarContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: THEME_LIGHT.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 15,
    color: THEME_LIGHT.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  welcomeCard: {
    backgroundColor: THEME_LIGHT.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  welcomeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_LIGHT.bgSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  welcomeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: THEME_LIGHT.textSecondary,
  },
  promptsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
    width: "100%",
  },
  promptCard: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  promptPressable: {
    backgroundColor: THEME_LIGHT.bgSecondary,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME_LIGHT.border,
    minHeight: 100,
  },
  promptIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: THEME_LIGHT.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  promptTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_LIGHT.textPrimary,
    marginBottom: 4,
  },
  promptSubtitle: {
    fontSize: 12,
    color: THEME_LIGHT.textSecondary,
    lineHeight: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  consentCard: {
    backgroundColor: THEME_LIGHT.bgSecondary,
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 340,
  },
  consentHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  consentIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME_LIGHT.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  consentTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: THEME_LIGHT.textPrimary,
    textAlign: "center",
  },
  consentText: {
    fontSize: 15,
    color: THEME_LIGHT.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  consentLinks: {
    marginBottom: 16,
  },
  consentLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME_LIGHT.borderLight,
  },
  consentLinkText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  consentDisclaimer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#92400E",
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  consentButtonPrimary: {
    backgroundColor: THEME_LIGHT.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  consentButtonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  consentButtonSecondary: {
    backgroundColor: THEME_LIGHT.bgTertiary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  consentButtonSecondaryText: {
    color: THEME_LIGHT.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },

  // Sidebar
  sidebarOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sidebar: {
    width: SCREEN_WIDTH * 0.82,
    backgroundColor: THEME_LIGHT.bgSidebar,
    height: "100%",
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME_LIGHT.borderLight,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: THEME_LIGHT.textPrimary,
  },
  sidebarCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME_LIGHT.bgTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: THEME_LIGHT.primary,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  newChatText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  sidebarList: {
    flex: 1,
  },
  sidebarEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  sidebarEmptyText: {
    fontSize: 14,
    color: THEME_LIGHT.textMuted,
    marginTop: 12,
  },
  sidebarGroup: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sidebarGroupTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME_LIGHT.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  sidebarItemActive: {
    backgroundColor: THEME_LIGHT.primaryLight,
  },
  sidebarItemContent: {
    flex: 1,
    marginLeft: 10,
  },
  sidebarItemTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: THEME_LIGHT.textPrimary,
  },
  sidebarItemSubtitle: {
    fontSize: 12,
    color: THEME_LIGHT.textMuted,
    marginTop: 2,
  },
  sidebarItemDelete: {
    padding: 8,
  },
  sidebarFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: THEME_LIGHT.borderLight,
  },
  sidebarFooterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME_LIGHT.textPrimary,
  },
  sidebarFooterSubtitle: {
    fontSize: 12,
    color: THEME_LIGHT.textMuted,
  },
});
