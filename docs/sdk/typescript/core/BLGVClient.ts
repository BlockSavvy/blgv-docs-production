/**
 * BLGV Client - Main SDK Entry Point
 * Orchestrates all SDK modules and provides unified cross-platform interface
 */

import { SDKConfiguration, AuthSession, UserProfile, Platform as PlatformType } from '../types';
import { APIClient, EventEmitter, Platform } from '../utils';
import { WalletSDK } from '../wallet/WalletSDK';
import { TreasurySDK } from '../treasury/TreasurySDK';
import { DEXSDK } from '../dex/DEXSDK';
import { PoolSDK } from '../pool/PoolSDK';
import { ProfileSDK } from '../profile/ProfileSDK';
import { AuthSDK } from '../auth/AuthSDK';
import { SyncSDK } from '../sync/SyncSDK';

export class BLGVClient extends EventEmitter {
  private config: SDKConfiguration;
  private isInitialized = false;
  
  // Core modules
  public readonly wallet: WalletSDK;
  public readonly treasury: TreasurySDK;
  public readonly dex: DEXSDK;
  public readonly pool: PoolSDK;
  public readonly profile: ProfileSDK;
  public readonly auth: AuthSDK;
  public readonly sync: SyncSDK;

  // API clients for each service
  private apiClients: Record<string, APIClient> = {};

  constructor(config: SDKConfiguration) {
    super();
    this.config = config;

    // Initialize API clients
    this.initializeAPIClients();

    // Initialize all SDK modules
    this.wallet = new WalletSDK(this);
    this.treasury = new TreasurySDK(this);
    this.dex = new DEXSDK(this);
    this.pool = new PoolSDK(this);
    this.profile = new ProfileSDK(this);
    this.auth = new AuthSDK(this);
    this.sync = new SyncSDK(this);

    // Set up event forwarding from modules
    this.setupEventForwarding();
  }

  /**
   * Initialize the SDK with configuration validation
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      throw new Error('BLGV SDK already initialized');
    }

    try {
      // Validate configuration
      this.validateConfiguration();

      // Initialize modules in order
      await this.auth.initialize();
      await this.profile.initialize();
      await this.wallet.initialize();
      await this.treasury.initialize();
      await this.dex.initialize();
      await this.pool.initialize();
      await this.sync.initialize();

      this.isInitialized = true;
      this.emit('initialized', { timestamp: new Date().toISOString() });

      console.log(`BLGV SDK v${this.config.version} initialized successfully`);
    } catch (error) {
      this.emit('error', { error, context: 'initialization' });
      throw error;
    }
  }

  /**
   * Get API client for specific service
   */
  getAPIClient(service: string): APIClient {
    const client = this.apiClients[service];
    if (!client) {
      throw new Error(`API client for service '${service}' not found`);
    }
    return client;
  }

  /**
   * Get SDK configuration
   */
  getConfig(): SDKConfiguration {
    return { ...this.config };
  }

  /**
   * Update configuration (for certain properties)
   */
  updateConfig(updates: Partial<SDKConfiguration>): void {
    const allowedUpdates = ['debugMode', 'enableSync', 'enableAnalytics'];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        (this.config as any)[key] = value;
      }
    }

    this.emit('configUpdated', { updates });
  }

  /**
   * Check if SDK is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current platform
   */
  getPlatform(): PlatformType {
    return this.config.platform;
  }

  /**
   * Get environment
   */
  getEnvironment(): string {
    return this.config.environment;
  }

  /**
   * Destroy SDK instance and cleanup resources
   */
  async destroy(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      // Cleanup modules in reverse order
      await this.sync.destroy?.();
      await this.pool.destroy?.();
      await this.dex.destroy?.();
      await this.treasury.destroy?.();
      await this.wallet.destroy?.();
      await this.profile.destroy?.();
      await this.auth.destroy?.();

      // Clear all event listeners
      this.removeAllListeners();

      this.isInitialized = false;
      console.log('BLGV SDK destroyed successfully');
    } catch (error) {
      this.emit('error', { error, context: 'destruction' });
      throw error;
    }
  }

  /**
   * Get current authentication session
   */
  getAuthSession(): AuthSession | null {
    return this.auth.getCurrentSession();
  }

  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    return this.profile.getCurrentProfile();
  }

  /**
   * Authenticate with wallet
   */
  async authenticateWithWallet(walletAddress: string, signature: string): Promise<AuthSession> {
    return this.auth.authenticateWithWallet(walletAddress, signature);
  }

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    await this.auth.logout();
    this.emit('logout', { timestamp: new Date().toISOString() });
  }

  /**
   * Health check - verify all services are accessible
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const [service, client] of Object.entries(this.apiClients)) {
      try {
        const response = await client.get('/health');
        results[service] = response.success;
      } catch (error) {
        results[service] = false;
      }
    }

    return results;
  }

  /**
   * Get version information
   */
  getVersion(): string {
    return this.config.version;
  }

  /**
   * Enable debug mode
   */
  enableDebug(): void {
    this.config.debugMode = true;
    this.emit('debugEnabled');
  }

  /**
   * Disable debug mode
   */
  disableDebug(): void {
    this.config.debugMode = false;
    this.emit('debugDisabled');
  }

  /**
   * Private: Initialize API clients for each service
   */
  private initializeAPIClients(): void {
    for (const [service, endpoint] of Object.entries(this.config.endpoints)) {
      this.apiClients[service] = new APIClient(
        endpoint,
        this.config.timeout,
        this.config.apiKey ? { 'X-API-Key': this.config.apiKey } : {}
      );
    }
  }

  /**
   * Private: Validate SDK configuration
   */
  private validateConfiguration(): void {
    if (!this.config.environment) {
      throw new Error('Environment is required');
    }

    if (!this.config.platform) {
      throw new Error('Platform is required');
    }

    if (!this.config.endpoints || Object.keys(this.config.endpoints).length === 0) {
      throw new Error('At least one endpoint must be configured');
    }

    const requiredEndpoints = ['main'];
    for (const endpoint of requiredEndpoints) {
      if (!this.config.endpoints[endpoint]) {
        throw new Error(`Required endpoint '${endpoint}' not configured`);
      }
    }
  }

  /**
   * Private: Set up event forwarding from modules
   */
  private setupEventForwarding(): void {
    const modules = [this.wallet, this.treasury, this.dex, this.pool, this.profile, this.auth, this.sync];

    modules.forEach(module => {
      // Forward all events from modules with module prefix
      const moduleName = module.constructor.name.replace('SDK', '').toLowerCase();
      
      // Common events to forward
      const eventsToForward = [
        'initialized', 'error', 'updated', 'synced',
        'connected', 'disconnected', 'authenticated', 'logout'
      ];

      eventsToForward.forEach(event => {
        module.on?.(event, (data: any) => {
          this.emit(`${moduleName}:${event}`, data);
          this.emit(event, { module: moduleName, ...data });
        });
      });
    });
  }
} 