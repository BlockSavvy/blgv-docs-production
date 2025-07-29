/**
 * Pool SDK
 * Mining pool operations and miner management
 */

import { PoolStats, PoolPayout, MinerConfig, APIResponse } from '../types';
import { EventEmitter, Validators, Formatters } from '../utils';
import type { BLGVClient } from '../core/BLGVClient';

export class PoolSDK extends EventEmitter {
  private client: BLGVClient;
  private poolStats?: PoolStats;
  private miners: Map<string, MinerConfig> = new Map();
  private statsUpdateInterval?: NodeJS.Timeout;

  constructor(client: BLGVClient) {
    super();
    this.client = client;
  }

  async initialize(): Promise<void> {
    try {
      await this.loadPoolStats();
      await this.loadMiners();
      this.startStatsUpdates();
      this.emit('initialized', { minersCount: this.miners.size });
    } catch (error) {
      this.emit('error', { error, context: 'pool-initialization' });
      throw error;
    }
  }

  async getPoolStats(): Promise<PoolStats | null> {
    try {
      const apiClient = this.client.getAPIClient('pool');
      const response: APIResponse<PoolStats> = await apiClient.get('/stats');

      if (!response.success || !response.data) {
        return null;
      }

      this.poolStats = response.data;
      this.emit('statsUpdated', { stats: this.poolStats });
      return this.poolStats;
    } catch (error) {
      this.emit('error', { error, context: 'pool-stats-fetch' });
      return null;
    }
  }

  async getMinerStats(walletAddress: string): Promise<MinerConfig | null> {
    if (!Validators.bitcoinAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    try {
      const apiClient = this.client.getAPIClient('pool');
      const response: APIResponse<MinerConfig> = await apiClient.get(`/miners/${walletAddress}`);

      if (!response.success || !response.data) {
        return null;
      }

      const miner = response.data;
      this.miners.set(walletAddress, miner);
      return miner;
    } catch (error) {
      this.emit('error', { error, context: 'miner-stats-fetch' });
      return null;
    }
  }

  async addMiner(params: {
    name: string;
    type: 'asic' | 'bitaxe' | 'other';
    walletAddress: string;
    expectedHashrate?: number;
    powerConsumption?: number;
  }): Promise<MinerConfig | null> {
    const { name, type, walletAddress, expectedHashrate = 0, powerConsumption = 0 } = params;

    if (!Validators.bitcoinAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    try {
      const apiClient = this.client.getAPIClient('pool');
      const response: APIResponse<MinerConfig> = await apiClient.post('/miners', {
        name,
        type,
        walletAddress,
        expectedHashrate,
        powerConsumption,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to add miner');
      }

      const miner = response.data;
      this.miners.set(miner.id, miner);
      this.emit('minerAdded', { miner });
      return miner;
    } catch (error) {
      this.emit('error', { error, context: 'miner-addition' });
      throw error;
    }
  }

  async updateMiner(minerId: string, updates: Partial<MinerConfig>): Promise<MinerConfig | null> {
    try {
      const apiClient = this.client.getAPIClient('pool');
      const response: APIResponse<MinerConfig> = await apiClient.put(`/miners/${minerId}`, updates);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update miner');
      }

      const miner = response.data;
      this.miners.set(minerId, miner);
      this.emit('minerUpdated', { miner });
      return miner;
    } catch (error) {
      this.emit('error', { error, context: 'miner-update' });
      throw error;
    }
  }

  async removeMiner(minerId: string): Promise<boolean> {
    try {
      const apiClient = this.client.getAPIClient('pool');
      const response = await apiClient.delete(`/miners/${minerId}`);

      if (!response.success) {
        return false;
      }

      this.miners.delete(minerId);
      this.emit('minerRemoved', { minerId });
      return true;
    } catch (error) {
      this.emit('error', { error, context: 'miner-removal' });
      return false;
    }
  }

  async getPayouts(walletAddress: string, limit = 50): Promise<PoolPayout[]> {
    if (!Validators.bitcoinAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    try {
      const apiClient = this.client.getAPIClient('pool');
      const response: APIResponse<PoolPayout[]> = await apiClient.get(
        `/payouts?wallet=${walletAddress}&limit=${limit}`
      );

      if (!response.success || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      this.emit('error', { error, context: 'payouts-fetch' });
      return [];
    }
  }

  async getTotalEarnings(walletAddress: string, period = 'all'): Promise<number> {
    if (!Validators.bitcoinAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    try {
      const apiClient = this.client.getAPIClient('pool');
      const response: APIResponse<{ earnings: number }> = await apiClient.get(
        `/earnings?wallet=${walletAddress}&period=${period}`
      );

      if (!response.success || !response.data) {
        return 0;
      }

      return response.data.earnings;
    } catch (error) {
      this.emit('error', { error, context: 'earnings-fetch' });
      return 0;
    }
  }

  getCachedPoolStats(): PoolStats | null {
    return this.poolStats || null;
  }

  getCachedMiners(): MinerConfig[] {
    return Array.from(this.miners.values());
  }

  getMinerById(id: string): MinerConfig | null {
    return this.miners.get(id) || null;
  }

  formatHashrate(hashrate: number): string {
    return Formatters.formatHashrate(hashrate);
  }

  calculateEfficiency(hashrate: number, power: number): number {
    if (power === 0) return 0;
    return hashrate / power; // J/TH
  }

  private async loadPoolStats(): Promise<void> {
    await this.getPoolStats();
  }

  private async loadMiners(): Promise<void> {
    try {
      const apiClient = this.client.getAPIClient('pool');
      const response: APIResponse<MinerConfig[]> = await apiClient.get('/miners');

      if (response.success && response.data) {
        this.miners.clear();
        response.data.forEach(miner => {
          this.miners.set(miner.id, miner);
        });
      }
    } catch (error) {
      // Silent fail for initial load
      console.warn('Failed to load miners:', error);
    }
  }

  private startStatsUpdates(): void {
    // Update stats every 60 seconds
    this.statsUpdateInterval = setInterval(async () => {
      await this.getPoolStats();
    }, 60000);
  }

  async destroy(): Promise<void> {
    if (this.statsUpdateInterval) {
      clearInterval(this.statsUpdateInterval);
      this.statsUpdateInterval = undefined;
    }
    this.poolStats = undefined;
    this.miners.clear();
    this.removeAllListeners();
  }
} 