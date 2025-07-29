/**
 * API Platform SDK
 * Server-side / Node.js specific implementations
 */

import { BLGVClient } from '../core/BLGVClient';
import { createSDKConfig } from '../config';
import { Environment } from '../types';

export class APIClientSDK {
  private client: BLGVClient;

  constructor(options: {
    environment: Environment;
    apiKey: string; // Required for API access
    customEndpoints?: Record<string, string>;
    testMode?: boolean;
  }) {
    const { environment, apiKey, customEndpoints, testMode = false } = options;

    if (!apiKey) {
      throw new Error('API key is required for server-side usage');
    }

    const config = createSDKConfig({
      environment,
      platform: 'api',
      apiKey,
      customEndpoints,
      testMode,
      overrides: {
        // API-specific configurations
        timeout: 60000, // Longer timeout for server-to-server
        enableSync: false, // No sync needed for stateless API usage
        enableAnalytics: false, // No analytics for server usage
      },
    });

    this.client = new BLGVClient(config);
  }

  async initialize(): Promise<void> {
    await this.client.initialize();
  }

  get wallet() {
    return this.client.wallet;
  }

  get treasury() {
    return this.client.treasury;
  }

  get dex() {
    return this.client.dex;
  }

  get pool() {
    return this.client.pool;
  }

  get profile() {
    return this.client.profile;
  }

  get auth() {
    return this.client.auth;
  }

  // Test mode utilities
  isTestMode(): boolean {
    return this.client.getConfig().endpoints?.testMode === 'true';
  }

  // API-specific utilities
  async authenticateService(): Promise<boolean> {
    try {
      const session = await this.auth.authenticateWithAPIKey(this.client.getConfig().apiKey!);
      return session.isAuthenticated;
    } catch (error) {
      console.error('Service authentication failed:', error);
      return false;
    }
  }

  async bulkOperation<T>(operations: (() => Promise<T>)[], batchSize = 10): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(batch.map(op => op()));
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`Batch operation ${i + index} failed:`, result.reason);
        }
      });
    }
    
    return results;
  }

  async healthCheck(): Promise<Record<string, boolean>> {
    return this.client.healthCheck();
  }

  // Rate limiting utility
  async withRateLimit<T>(fn: () => Promise<T>, delayMs = 100): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return fn();
  }

  // Batch processing utility
  async processBatch<T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize = 50
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchPromises = batch.map(item => processor(item));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`Batch item ${i + index} failed:`, result.reason);
        }
      });
      
      // Small delay between batches to avoid overwhelming the API
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  // Event forwarding (limited for server usage)
  on(event: string, callback: Function): void {
    this.client.on(event, callback);
  }

  off(event: string, callback: Function): void {
    this.client.off(event, callback);
  }

  async destroy(): Promise<void> {
    await this.client.destroy();
  }
} 