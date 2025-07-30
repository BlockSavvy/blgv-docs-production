/**
 * BLGV Ecosystem SDK Types
 * Comprehensive type definitions for cross-platform compatibility
 */

// Platform types
export type Platform = 'mobile' | 'web' | 'api';
export type Environment = 'development' | 'staging' | 'production';

// Authentication types
export interface AuthCredentials {
  walletAddress?: string;
  signature?: string;
  timestamp?: number;
  sessionId?: string;
  apiKey?: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  walletAddress?: string;
  sessionId: string;
  expiresAt: number;
  permissions: string[];
  platform: Platform;
}

// User profile types
export interface UserProfile {
  id?: string;
  walletAddresses: string[];
  primaryWallet?: string;
  preferences: UserPreferences;
  verificationStatus: VerificationStatus;
  crossPlatformData: CrossPlatformData;
  createdAt: string;
  lastSyncAt: string;
  platform: Platform;
}

export interface UserPreferences {
  currency: 'USD' | 'BTC' | 'SATS';
  theme: 'dark' | 'light' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  treasury: boolean;
  mining: boolean;
  dex: boolean;
  price: boolean;
  email?: boolean;
  push?: boolean;
}

export interface PrivacySettings {
  shareAnalytics: boolean;
  shareActivity: boolean;
  publicProfile: boolean;
}

export interface VerificationStatus {
  equityVerified: boolean;
  schwabConnected: boolean;
  kycCompleted: boolean;
  accreditedInvestor: boolean;
  verificationDate?: string;
}

export interface CrossPlatformData {
  dexActivity: DEXActivity;
  miningActivity: MiningActivity;
  aiUsage: AIUsage;
  treasuryAccess: TreasuryAccess;
}

// Platform-specific activity types
export interface DEXActivity {
  firstVisit?: string;
  lastTrade?: string;
  totalVolume: number;
  preferredPairs: string[];
  activeOrders: number;
  completedTrades: number;
}

export interface MiningActivity {
  firstConnection?: string;
  lastPayout?: string;
  totalEarnings: number;
  connectedMiners: string[];
  currentHashrate: number;
  efficiency: number;
}

export interface AIUsage {
  firstAccess?: string;
  lastQuery?: string;
  favoriteModels: string[];
  queryCount: number;
  subscriptionTier?: 'free' | 'pro' | 'enterprise';
}

export interface TreasuryAccess {
  firstAccess?: string;
  lastView?: string;
  watchedMetrics: string[];
  alertsEnabled: boolean;
  reportAccess: boolean;
}

// Wallet types
export interface WalletData {
  id: string;
  address: string;
  type: 'p2wpkh' | 'p2tr';
  network: 'mainnet' | 'testnet' | 'regtest';
  label: string;
  balance: WalletBalance;
  isDefault: boolean;
  isReadOnly: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface WalletBalance {
  confirmed: number;
  unconfirmed: number;
  total: number;
  fiatValue: number;
  currency: string;
  lastUpdated: string;
}

// Treasury types
export interface TreasuryData {
  btcBalance: number;
  btcPrice: number;
  btcNAV: number;
  marketNAV: number;
  stockPrice: number;
  premiumDiscount: number;
  performance: Performance;
  lastUpdated: string;
}

export interface Performance {
  daily: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  yearly: number;
  allTime: number;
}

// DEX types
export interface DEXMarketData {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  lastPrice: number;
  priceChange24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  spread: number;
  lastUpdated: string;
}

export interface DEXOrder {
  id: string;
  marketId: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price: number;
  filled: number;
  status: 'open' | 'filled' | 'cancelled' | 'expired';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Mining pool types
export interface PoolStats {
  hashrate: number;
  workers: number;
  blocks: number;
  efficiency: number;
  earnings: number;
  payouts: PoolPayout[];
  lastUpdated: string;
}

export interface PoolPayout {
  id: string;
  walletAddress: string;
  amount: number;
  currency: 'BTC' | 'SATS';
  timestamp: string;
  txid?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface MinerConfig {
  id: string;
  name: string;
  type: 'asic' | 'bitaxe' | 'other';
  walletAddress: string;
  hashrate: number;
  power: number;
  efficiency: number;
  status: 'online' | 'offline' | 'error';
  lastSeen: string;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  stack?: string;
}

// Sync types
export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'profile' | 'wallet' | 'transaction' | 'order' | 'payout';
  data: any;
  timestamp: string;
  platform: Platform;
  status: 'pending' | 'completed' | 'failed';
}

export interface SyncConflict {
  id: string;
  operation: SyncOperation;
  conflicts: ConflictDetail[];
  resolution?: 'manual' | 'latest' | 'merge';
  resolvedAt?: string;
}

export interface ConflictDetail {
  field: string;
  localValue: any;
  remoteValue: any;
  timestamp: string;
}

// Configuration types
export interface TestModeConfig {
  /** Enable test mode - matches Treasury Intelligence Platform's isTestMode boolean */
  isTestMode: boolean;
  /** Test session ID for tracking - matches testSessionId varchar(100) */
  testSessionId?: string;
  /** Display fake assets from DEX faucet */
  showFakeAssets: boolean;
  /** Test environment isolation level */
  isolationLevel: 'session' | 'user' | 'global';
}

export interface SDKConfiguration {
  environment: Environment;
  platform: Platform;
  endpoints: Record<string, string>;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
  enableSync: boolean;
  enableAnalytics: boolean;
  debugMode: boolean;
  version: string;
  /** Test mode configuration matching Treasury Intelligence Platform */
  testMode?: TestModeConfig;
}

// Event types
export interface SDKEvent {
  type: string;
  payload: any;
  timestamp: string;
  platform: Platform;
  userId?: string;
}

// Utility types
export type Modify<T, R> = Omit<T, keyof R> & R;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] };

// Generic data types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TimeSeries<T = number> {
  timestamp: string;
  value: T;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface DexEvent {
  id: string;
  eventType: 'swap' | 'addLiquidity' | 'removeLiquidity' | 'feeSweep';
  txid: string;
  satsFee: number;
  assetPair: string;
  amountIn?: string;
  amountOut?: string;
  userPubkey?: string;
  blockHeight?: number;
  timestamp: Date;
  processed: boolean;
  treasuryImpact: 'positive' | 'negative' | 'neutral';
  navImpact: number;
  /** Test mode flag - matches Treasury Intelligence Platform schema */
  isTestMode: boolean;
  /** Test session ID - matches Treasury Intelligence Platform schema */
  testSessionId?: string;
}

export interface TreasuryBalance {
  id: string;
  assetId: string;
  balance: string;
  balanceSats?: number;
  lastUpdated: Date;
  source: 'dex' | 'manual' | 'external';
  isActive: boolean;
  /** Test mode flag - matches Treasury Intelligence Platform schema */
  isTestMode: boolean;
}

export interface WSEvent {
  id: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  processed: boolean;
  /** Test mode flag - matches Treasury Intelligence Platform schema */
  isTestMode: boolean;
} 