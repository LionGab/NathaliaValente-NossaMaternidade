/**
 * Nossa Maternidade - Main Tab Navigator (Calm FemTech)
 *
 * Tabs: Home | Mães | NathIA (centro) | MundoNath | Hábitos
 * Design com glassmorphism + Manrope font
 * iOS/Android compatible
 */

import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarButtonProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SHADOWS, SPACING } from "../theme/design-system";
import { brand } from "../theme/presets/calmFemtech";
import { MainTabParamList, MainTabScreenProps } from "../types/navigation";

// Screens
import AssistantScreen from "../screens/AssistantScreen";
import CommunityScreen from "../screens/CommunityScreen";
import HabitsScreen from "../screens/HabitsScreen";
import HomeScreen from "../screens/HomeScreen";
import MundoDaNathScreenOriginal from "../screens/MundoDaNathScreen";

// Wrapper para MundoDaNathScreen (compatibiliza props de Tab com Stack)
const MundoDaNathScreen = ({ navigation }: MainTabScreenProps<"MundoNath">) => {
  // Adapta a navegação para o formato esperado pelo MundoDaNathScreen
  const adaptedNavigation = {
    ...navigation,
    goBack: () => navigation.goBack(),
    navigate: navigation.navigate as never,
  };
  return (
    <MundoDaNathScreenOriginal
      navigation={adaptedNavigation as never}
      route={{ key: "MundoDaNath", name: "MundoDaNath" } as never}
    />
  );
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Animated Tab Icon Component
const AnimatedTabIcon = ({
  name,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}) => {
  const scale = useSharedValue(focused ? 1.1 : 1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 15 });
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? `${COLORS.primary[500]}15` : "transparent",
        },
        animatedStyle,
      ]}
    >
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
};

// NathIA Center Button Component (Calm FemTech - azul dominante + label)
const NathIACenterButton = ({ onPress, focused }: { onPress: () => void; focused: boolean }) => {
  const scale = useSharedValue(1);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.9, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10 });
    }, 100);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} style={{ alignItems: "center" }}>
      <Animated.View
        style={[
          {
            marginTop: -20,
            alignItems: "center",
            ...SHADOWS.lg,
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={[brand.primary[400], brand.primary[600], brand.accent[400]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 3,
            borderColor: COLORS.background.primary,
          }}
        >
          <Ionicons
            name={focused ? "sparkles" : "sparkles-outline"}
            size={26}
            color={COLORS.text.inverse}
          />
        </LinearGradient>
        {/* Label NathIA sempre visível */}
        <Text
          style={{
            fontSize: 11,
            fontWeight: "600",
            fontFamily: "Manrope_600SemiBold",
            color: focused ? COLORS.primary[500] : COLORS.neutral[400],
            marginTop: 4,
          }}
        >
          NathIA
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  // Tab bar height based on platform
  const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 72;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : COLORS.background.primary,
          borderTopWidth: 0,
          elevation: 0,
          height: TAB_BAR_HEIGHT,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : SPACING.sm,
          paddingTop: SPACING.sm,
        },
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.neutral[400],
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          fontFamily: "Manrope_600SemiBold",
          lineHeight: 12,
          marginTop: 0,
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingVertical: Platform.OS === "ios" ? 4 : 6,
        },
        tabBarShowLabel: true,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="light"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderTopWidth: 1,
                borderTopColor: `${COLORS.neutral[900]}0D`, // ~5% opacity
              }}
            />
          ) : (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: COLORS.background.primary,
                borderTopWidth: 1,
                borderTopColor: COLORS.neutral[200],
              }}
            />
          ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarAccessibilityLabel: "Início - Tela principal do app",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon
              name={focused ? "home" : "home-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: "Mães",
          tabBarAccessibilityLabel: "Mães - Conecte-se com outras mães",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon
              name={focused ? "people" : "people-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{
          tabBarLabel: "NathIA",
          tabBarAccessibilityLabel: "NathIA - Assistente de inteligência artificial",
          tabBarButton: (props: BottomTabBarButtonProps) => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: Platform.OS === "ios" ? SPACING.sm : 0,
              }}
            >
              <NathIACenterButton
                onPress={() => {
                  // Cast para evitar erro de tipagem do GestureResponderEvent
                  (props.onPress as (() => void) | undefined)?.();
                }}
                focused={props.accessibilityState?.selected ?? false}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MundoNath"
        component={MundoDaNathScreen}
        options={{
          tabBarLabel: "MundoNath",
          tabBarAccessibilityLabel: "Mundo da Nath - Conteúdo exclusivo",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon
              name={focused ? "heart" : "heart-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyCare"
        component={HabitsScreen}
        options={{
          tabBarLabel: "Hábitos",
          tabBarAccessibilityLabel: "Hábitos - Rotinas de bem-estar",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <AnimatedTabIcon
              name={focused ? "checkbox" : "checkbox-outline"}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
