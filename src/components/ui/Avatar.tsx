import React from "react";
import { View, Image, ImageSourcePropType, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "../../utils/cn";
import { COLORS, OVERLAY } from "../../theme/design-system";

export interface AvatarProps {
  size?: number;
  source?: ImageSourcePropType | { uri: string } | null;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  fallbackColor?: string;
  fallbackBgColor?: string;
  isNathalia?: boolean; // Se true, usa o avatar padrão da Nathália
  isNathIA?: boolean; // Se true, usa o avatar da NathIA (assistente virtual)
  isCommunity?: boolean; // Se true, usa o avatar de Comunidade/Mundo da Nath
  className?: string;
  style?: ViewStyle;
}

const Avatar = React.memo(function Avatar({
  size = 40,
  source,
  fallbackIcon = "person",
  fallbackColor = COLORS.neutral[600],
  fallbackBgColor = OVERLAY.white.soft,
  isNathalia = false,
  isNathIA = false,
  isCommunity = false,
  className,
  style,
}: AvatarProps) {
  // Prioridade: NathIA > Comunidade > Nathália > source customizado
  let imageSource: ImageSourcePropType | { uri: string } | null = null;
  
  if (isNathIA) {
    imageSource = { uri: "https://i.imgur.com/a4O1jAT.jpg" };
  } else if (isCommunity) {
    imageSource = require("../../../assets/community-avatar.jpg");
  } else if (isNathalia) {
    imageSource = require("../../../assets/nathalia-avatar.jpg");
  } else {
    imageSource = source || null;
  }

  return (
    <View
      className={cn("rounded-full items-center justify-center overflow-hidden", className)}
      style={[
        {
          width: size,
          height: size,
          backgroundColor: imageSource ? "transparent" : fallbackBgColor,
        },
        style,
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={{ width: size, height: size }}
          className="rounded-full"
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={
            isNathIA
              ? "Avatar da NathIA, assistente virtual"
              : isCommunity
              ? "Avatar da Comunidade Mundo da Nath"
              : isNathalia
              ? "Avatar de Nathália Valente"
              : "Avatar do usuário"
          }
        />
      ) : (
        <Ionicons
          name={fallbackIcon}
          size={size * 0.6}
          color={fallbackColor}
          accessibilityLabel="Ícone de avatar padrão"
        />
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparator: só re-renderiza se props relevantes mudarem
  return (
    prevProps.size === nextProps.size &&
    prevProps.source === nextProps.source &&
    prevProps.isNathalia === nextProps.isNathalia &&
    prevProps.isNathIA === nextProps.isNathIA &&
    prevProps.isCommunity === nextProps.isCommunity &&
    prevProps.fallbackIcon === nextProps.fallbackIcon &&
    prevProps.className === nextProps.className
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
