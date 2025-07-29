/**
 * Mobile Platform SDK
 * React Native / Expo specific implementations and utilities
 */

import { BLGVClient } from '../core/BLGVClient';
import { createSDKConfig } from '../config';
import { Environment } from '../types';

export class MobileSDK {
  private client: BLGVClient;

  constructor(options: {
    environment: Environment;
    apiKey?: string;
    customEndpoints?: Record<string, string>;
    testMode?: boolean;
  }) {
    const { environment, apiKey, customEndpoints, testMode = false } = options;

    const config = createSDKConfig({
      environment,
      platform: 'mobile',
      apiKey,
      customEndpoints,
      testMode,
      overrides: {
        // Mobile-specific configurations
        timeout: 45000, // Longer timeout for mobile networks
        enableSync: true,
        enableAnalytics: true,
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

  get sync() {
    return this.client.sync;
  }

  // Test mode utilities
  isTestMode(): boolean {
    return this.client.getConfig().endpoints?.testMode === 'true';
  }

  // Mobile-specific utilities
  async enablePushNotifications(): Promise<boolean> {
    try {
      // This would integrate with Expo Notifications
      // For now, return true as placeholder
      return true;
    } catch (error) {
      console.warn('Failed to enable push notifications:', error);
      return false;
    }
  }

  async enableBiometricAuth(): Promise<boolean> {
    try {
      // This would integrate with Expo LocalAuthentication
      // For now, return true as placeholder
      return true;
    } catch (error) {
      console.warn('Failed to enable biometric auth:', error);
      return false;
    }
  }

  // Event forwarding
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