/**
 * Treasury SDK
 * Treasury data, analytics, and BTC treasury operations
 */

import { TreasuryData, Performance, APIResponse } from '../types';
import { EventEmitter, Formatters } from '../utils';
import type { BLGVClient } from '../core/BLGVClient';

export class TreasurySDK extends EventEmitter {
  private client: BLGVClient;
  private treasuryData?: TreasuryData;
  private refreshInterval?: NodeJS.Timeout;

  constructor(client: BLGVClient) {
    super();
    this.client = client;
  }

  async initialize(): Promise<void> {
    try {
      await this.loadTreasuryData();
      this.startAutoRefresh();
      this.emit('initialized', { treasuryData: this.treasuryData });
    } catch (error) {
      this.emit('error', { error, context: 'treasury-initialization' });
      throw error;
    }
  }

  async getTreasuryData(): Promise<TreasuryData | null> {
    try {
      const apiClient = this.client.getAPIClient('treasury');
      const response: APIResponse<TreasuryData> = await apiClient.get('/treasury');

      if (!response.success || !response.data) {
        return null;
      }

      this.treasuryData = response.data;
      this.emit('dataUpdated', { data: this.treasuryData });
      return this.treasuryData;
    } catch (error) {
      this.emit('error', { error, context: 'treasury-data-fetch' });
      return null;
    }
  }

  async getBTCPrice(): Promise<number | null> {
    try {
      const apiClient = this.client.getAPIClient('treasury');
      const response: APIResponse<{ price: number }> = await apiClient.get('/btc/price');

      if (!response.success || !response.data) {
        return null;
      }

      return response.data.price;
    } catch (error) {
      this.emit('error', { error, context: 'btc-price-fetch' });
      return null;
    }
  }

  async getStockPrice(): Promise<number | null> {
    try {
      const apiClient = this.client.getAPIClient('treasury');
      const response: APIResponse<{ price: number }> = await apiClient.get('/stock/price');

      if (!response.success || !response.data) {
        return null;
      }

      return response.data.price;
    } catch (error) {
      this.emit('error', { error, context: 'stock-price-fetch' });
      return null;
    }
  }

  async getPerformance(period: string = '30d'): Promise<Performance | null> {
    try {
      const apiClient = this.client.getAPIClient('treasury');
      const response: APIResponse<Performance> = await apiClient.get(`/treasury/performance?period=${period}`);

      if (!response.success || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      this.emit('error', { error, context: 'performance-fetch' });
      return null;
    }
  }

  getCachedTreasuryData(): TreasuryData | null {
    return this.treasuryData || null;
  }

  calculatePremiumDiscount(): number {
    if (!this.treasuryData) return 0;
    const { btcNAV, marketNAV } = this.treasuryData;
    return ((marketNAV - btcNAV) / btcNAV) * 100;
  }

  formatBTCBalance(): string {
    if (!this.treasuryData) return '0.00000000';
    return Formatters.formatBTC(this.treasuryData.btcBalance);
  }

  formatUSDValue(): string {
    if (!this.treasuryData) return '$0.00';
    const usdValue = this.treasuryData.btcBalance * this.treasuryData.btcPrice;
    return Formatters.formatUSD(usdValue);
  }

  private async loadTreasuryData(): Promise<void> {
    await this.getTreasuryData();
  }

  private startAutoRefresh(): void {
    // Refresh every 30 seconds
    this.refreshInterval = setInterval(async () => {
      await this.getTreasuryData();
    }, 30000);
  }

  async destroy(): Promise<void> {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
    }
    this.treasuryData = undefined;
    this.removeAllListeners();
  }
} 