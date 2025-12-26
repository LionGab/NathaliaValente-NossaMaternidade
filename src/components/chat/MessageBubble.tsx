/**
 * MessageBubble - Optimized chat message component
 *
 * Performance: Extracted from AssistantScreen to avoid recreation on parent re-renders.
 * Uses React.memo with stable props for optimal rendering.
 */

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { VoiceMessagePlayer } from "../VoiceMessagePlayer";
import { Avatar } from "../ui";
import { neutral, radius, spacing } from "../../theme/tokens";
import { ChatMessage } from "../../types/navigation";

// Theme colors type
interface ThemeColors {
  userBubble: string;
  aiBubble: string;
  textPrimary: string;
  borderLight: string;
  primary: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
  maxWidth: number;
  theme: ThemeColors;
  hasVoiceAccess: boolean;
  onVoicePremiumRequired?: () => void;
}

const MessageBubbleComponent = ({
  message,
  index,
  maxWidth,
  theme,
  hasVoiceAccess,
  onVoicePremiumRequired,
}: MessageBubbleProps) => {
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
          { maxWidth },
          isUser
            ? [styles.bubbleUser, { backgroundColor: theme.userBubble }]
            : [styles.bubbleAI, { backgroundColor: theme.aiBubble }],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.textUser : [styles.textAI, { color: theme.textPrimary }],
          ]}
        >
          {message.content}
        </Text>

        {/* Voice Player - Only for NathIA messages */}
        {!isUser && hasVoiceAccess && (
          <View style={[styles.voiceContainer, { borderTopColor: theme.borderLight }]}>
            <VoiceMessagePlayer
              messageId={message.id}
              text={message.content}
              onPremiumRequired={onVoicePremiumRequired}
              size="small"
              compact
              iconColor={theme.primary}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

// Memoized with custom comparison for stable re-renders
export const MessageBubble = React.memo(
  MessageBubbleComponent,
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.maxWidth === nextProps.maxWidth &&
      prevProps.hasVoiceAccess === nextProps.hasVoiceAccess &&
      prevProps.theme.userBubble === nextProps.theme.userBubble &&
      prevProps.theme.aiBubble === nextProps.theme.aiBubble
    );
  }
);

MessageBubble.displayName = "MessageBubble";

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  messageUser: {
    justifyContent: "flex-end",
  },
  messageAI: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    marginRight: spacing.sm,
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  messageBubble: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    overflow: "hidden",
  },
  bubbleUser: {
    borderBottomRightRadius: radius.sm,
  },
  bubbleAI: {
    borderBottomLeftRadius: radius.sm,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Manrope_400Regular",
  },
  textUser: {
    color: neutral[0],
  },
  textAI: {
    // Color set dynamically via style prop
  },
  voiceContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
});
