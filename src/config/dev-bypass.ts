/**
 * DEV BYPASS Configuration
 *
 * ⚠️ FOR LOCAL TESTING ONLY - NEVER COMMIT WITH BYPASS ENABLED
 *
 * This file allows you to bypass authentication/onboarding to quickly test app screens.
 *
 * Usage:
 * 1. Set ENABLE_DEV_BYPASS = true
 * 2. Restart Expo server (npm start)
 * 3. App will skip login and go straight to MainTabs
 *
 * Remember to set back to false before committing!
 */

export const DEV_CONFIG = {
  // Set to true to bypass login/onboarding
  ENABLE_DEV_BYPASS: false,

  // Mock user data when bypass is enabled
  MOCK_USER: {
    id: 'dev-test-user-001',
    name: 'Usuária Teste',
    email: 'teste@nossamaternidade.com',
    pregnancyStage: 'pregnant' as const,
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    interests: ['exercise', 'nutrition', 'mindfulness'] as const,
    createdAt: new Date().toISOString(),
  },

  // What to bypass
  BYPASS_LOGIN: true,
  BYPASS_NOTIFICATION_PERMISSION: true,
  BYPASS_ONBOARDING: true,
  BYPASS_NATHIA_ONBOARDING: true,
};

/**
 * Helper function to check if dev bypass is active
 */
export const isDevBypassActive = () => {
  // Only allow bypass in development environment
  const isDev = __DEV__;
  return isDev && DEV_CONFIG.ENABLE_DEV_BYPASS;
};
