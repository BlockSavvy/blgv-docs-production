/**
 * BLGV Ecosystem SDK
 * Unified SDK for cross-platform data synchronization across:
 * - Mobile App (iOS/Android)
 * - DEX Platform (Web)
 * - Mining Pool (Web)
 * - Treasury Intelligence (Web/API)
 * 
 * @version 1.0.0
 * @author BLGV Development Team
 */

// Core SDK modules
export { BLGVClient } from './core/BLGVClient';
export { WalletSDK } from './wallet/WalletSDK';
export { TreasurySDK } from './treasury/TreasurySDK';
export { DEXSDK } from './dex/DEXSDK';
export { PoolSDK } from './pool/PoolSDK';
export { ProfileSDK } from './profile/ProfileSDK';
export { AuthSDK } from './auth/AuthSDK';
export { SyncSDK } from './sync/SyncSDK';

// Types and interfaces (exclude Platform to avoid conflicts)
export type {
  Environment,
  AuthCredentials,
  AuthSession,
  UserProfile,
  UserPreferences,
  NotificationSettings,
  PrivacySettings,
  VerificationStatus,
  CrossPlatformData,
  DEXActivity,
  MiningActivity,
  AIUsage,
  TreasuryAccess,
  WalletData,
  WalletBalance,
  TreasuryData,
  Performance,
  DEXMarketData,
  DEXOrder,
  PoolStats,
  PoolPayout,
  MinerConfig,
  APIResponse,
  APIError,
  SyncOperation,
  SyncConflict,
  ConflictDetail,
  SDKConfiguration,
  SDKEvent,
  PaginatedResponse,
  TimeSeries,
  ChartData
} from './types';

// Export Platform type with alias to avoid conflict
export type { Platform as PlatformType } from './types';

// Configuration
export { SDKConfig, createSDKConfig } from './config';

// Utils (exclude Platform object to avoid conflicts)
export {
  APIClient,
  Validators,
  Formatters,
  Storage,
  EventEmitter,
  retry,
  debounce,
  deepMerge,
  generateId,
  toTimestamp
} from './utils';

// Platform-specific exports
export { MobileSDK, WebSDK, APIClientSDK } from './platforms';

// Constants
export const SDK_VERSION = '1.0.0';
export const SUPPORTED_PLATFORMS = ['mobile', 'web', 'api'] as const;
export const BLGV_ENDPOINTS = {
  NEW_API: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.blgvbtc.com',
  MAIN_API: 'https://api.blgvbtc.com',
  DEX_API: 'https://dex.blgvbtc.com/api',
  POOL_API: 'https://pool.blgvbtc.com/api',
  TREASURY_API: 'https://blgvbtc.com/api',
} as const; 