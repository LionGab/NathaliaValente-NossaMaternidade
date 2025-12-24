// Legacy Components (backward compatibility)
export { default as AppButton } from "./AppButton";
export { default as AppCard } from "./AppCard";
export { default as Avatar } from "./Avatar";
export type { AvatarProps } from "./Avatar";
export { default as Chip } from "./Chip";
export { EmptyState } from "./EmptyState";
export { ErrorState } from "./ErrorState";
export { default as IconButton } from "./IconButton";
export { LoadingState } from "./LoadingState";
export { default as SectionHeader } from "./SectionHeader";
export { CardSkeleton, ListSkeleton, SkeletonLoader } from "./SkeletonLoader";
export { Toast } from "./Toast";
export type { ToastConfig, ToastType } from "./Toast";

// Design System Components (Fase 2 - Dark Mode)
export { Badge } from "./Badge";
export { Button } from "./Button";
export { Card } from "./Card";
export { FAB } from "./FAB";
export { Input } from "./Input";
export { LoadingDots } from "./LoadingDots";
export { RowCard } from "./RowCard";
export { ScreenHeader } from "./ScreenHeader";
export { Text } from "./Text";

// Premium Effects (Design System 2025)
export { GlowEffect, PulseGlow, ShimmerEffect } from "./GlowEffect";
export { PremiumCard, GlassCard, AccentCard } from "./PremiumCard";

// ===========================================
// AVATAR SIZES (Padronized sizes)
// ===========================================
export const AVATAR_SIZES = {
  /** Extra small - list items, compact views */
  xs: 24,
  /** Small - chat bubbles, badges */
  sm: 28,
  /** Medium - headers, cards (default) */
  md: 40,
  /** Large - profile headers */
  lg: 56,
  /** Extra large - profile pages */
  xl: 72,
  /** Hero - main profile display */
  hero: 96,
} as const;
