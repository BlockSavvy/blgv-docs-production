/**
 * Web Platform SDK
 * Browser-specific implementations and utilities
 */

import { BLGVClient } from '../core/BLGVClient';
import { createSDKConfig } from '../config';
import { Environment } from '../types';

export class WebSDK {
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
      platform: 'web',
      apiKey,
      customEndpoints,
      testMode,
      overrides: {
        // Web-specific configurations
        timeout: 30000,
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

  // Web-specific utilities
  async connectWebWallet(): Promise<string | null> {
    try {
      // This would integrate with MetaMask, Unisat, or other web wallets
      // For now, return null as placeholder
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Example MetaMask integration
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        return accounts[0] || null;
      }
      return null;
    } catch (error) {
      console.warn('Failed to connect web wallet:', error);
      return null;
    }
  }

  async enableWebNotifications(): Promise<boolean> {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    } catch (error) {
      console.warn('Failed to enable web notifications:', error);
      return false;
    }
  }

  async shareData(data: { title: string; text: string; url: string }): Promise<boolean> {
    try {
      if (navigator.share) {
        await navigator.share(data);
        return true;
      }
      
      // Fallback to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${data.title}: ${data.text} - ${data.url}`);
        return true;
      }

      return false;
    } catch (error) {
      console.warn('Failed to share data:', error);
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