import { isEnvEnabled } from "./env";

export const FEATURE_FLAGS = {
  get MUNDO_NATH_ENABLED() {
    return isEnvEnabled("EXPO_PUBLIC_FEATURE_MUNDO_NATH");
  },
  get COMMUNITY_ENABLED() {
    return isEnvEnabled("EXPO_PUBLIC_FEATURE_COMMUNITY");
  },
  get NATHIA_NEW_UI_ENABLED() {
    return isEnvEnabled("EXPO_PUBLIC_FEATURE_NATHIA_NEW_UI");
  },
} as const;
