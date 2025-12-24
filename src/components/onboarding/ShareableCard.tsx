/**
 * ShareableCard - Card compartilhável da temporada
 * Preview do card que será salvo no rolo de câmera
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Tokens } from "../../theme/tokens";

interface ShareableCardProps {
  seasonName: string;
  nathImage?: number | { uri: string }; // require() asset ou URI da foto da Nath
}

export function ShareableCard({ seasonName, nathImage }: ShareableCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Tokens.gradients.accent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Foto da Nath (pequena, canto superior) */}
        {nathImage && (
          <View style={styles.nathImageContainer}>
            <Image source={nathImage} style={styles.nathImage} resizeMode="cover" />
          </View>
        )}

        {/* Texto principal */}
        <View style={styles.textContainer}>
          <Text style={styles.seasonText}>{seasonName}</Text>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>@nathaliavalente • #NossaMaternidade</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1, // Quadrado
    borderRadius: Tokens.radius["2xl"],
    overflow: "hidden",
    ...Tokens.shadows.lg,
  },
  gradient: {
    flex: 1,
    padding: Tokens.spacing["2xl"],
    justifyContent: "space-between",
  },
  nathImageContainer: {
    alignSelf: "flex-end",
    width: 60,
    height: 60,
    borderRadius: Tokens.radius.full,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Tokens.neutral[0],
  },
  nathImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing["2xl"],
  },
  seasonText: {
    fontSize: 28,
    fontWeight: Tokens.typography.headlineLarge.fontWeight,
    color: Tokens.neutral[0],
    textAlign: "center",
    lineHeight: 36,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: Tokens.typography.caption.fontSize,
    color: Tokens.neutral[0],
    opacity: 0.9,
  },
});
