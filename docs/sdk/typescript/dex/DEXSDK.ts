/**
 * DEX SDK
 * Decentralized exchange trading operations and market data
 */

import { DEXMarketData, DEXOrder, APIResponse, PaginatedResponse } from '../types';
import { EventEmitter, Validators } from '../utils';
import type { BLGVClient } from '../core/BLGVClient';

export class DEXSDK extends EventEmitter {
  private client: BLGVClient;
  private markets: Map<string, DEXMarketData> = new Map();
  private orders: Map<string, DEXOrder> = new Map();
  private priceUpdateInterval?: NodeJS.Timeout;

  constructor(client: BLGVClient) {
    super();
    this.client = client;
  }

  async initialize(): Promise<void> {
    try {
      await this.loadMarkets();
      this.startPriceUpdates();
      this.emit('initialized', { marketsCount: this.markets.size });
    } catch (error) {
      this.emit('error', { error, context: 'dex-initialization' });
      throw error;
    }
  }

  async getMarkets(): Promise<DEXMarketData[]> {
    try {
      const apiClient = this.client.getAPIClient('dex');
      const response: APIResponse<DEXMarketData[]> = await apiClient.get('/markets');

      if (!response.success || !response.data) {
        return [];
      }

      this.markets.clear();
      response.data.forEach(market => {
        this.markets.set(market.symbol, market);
      });

      this.emit('marketsUpdated', { markets: response.data });
      return response.data;
    } catch (error) {
      this.emit('error', { error, context: 'markets-fetch' });
      return [];
    }
  }

  async getMarket(symbol: string): Promise<DEXMarketData | null> {
    try {
      const apiClient = this.client.getAPIClient('dex');
      const response: APIResponse<DEXMarketData> = await apiClient.get(`/markets/${symbol}`);

      if (!response.success || !response.data) {
        return null;
      }

      this.markets.set(symbol, response.data);
      return response.data;
    } catch (error) {
      this.emit('error', { error, context: 'market-fetch' });
      return null;
    }
  }

  async placeOrder(params: {
    marketId: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    amount: number;
    price?: number;
    walletAddress: string;
  }): Promise<DEXOrder | null> {
    const { marketId, side, type, amount, price, walletAddress } = params;

    if (!Validators.bitcoinAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    if (!Validators.amount(amount)) {
      throw new Error('Invalid amount');
    }

    if (type === 'limit' && (!price || !Validators.amount(price))) {
      throw new Error('Price is required for limit orders');
    }

    try {
      const apiClient = this.client.getAPIClient('dex');
      const response: APIResponse<DEXOrder> = await apiClient.post('/orders', {
        marketId,
        side,
        type,
        amount,
        price,
        walletAddress,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to place order');
      }

      const order = response.data;
      this.orders.set(order.id, order);
      this.emit('orderPlaced', { order });
      return order;
    } catch (error) {
      this.emit('error', { error, context: 'order-placement' });
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const apiClient = this.client.getAPIClient('dex');
      const response = await apiClient.delete(`/orders/${orderId}`);

      if (!response.success) {
        return false;
      }

      const order = this.orders.get(orderId);
      if (order) {
        order.status = 'cancelled';
        this.emit('orderCancelled', { order });
      }

      return true;
    } catch (error) {
      this.emit('error', { error, context: 'order-cancellation' });
      return false;
    }
  }

  async getOrders(walletAddress?: string): Promise<DEXOrder[]> {
    try {
      const apiClient = this.client.getAPIClient('dex');
      const endpoint = walletAddress ? `/orders?wallet=${walletAddress}` : '/orders';
      const response: APIResponse<PaginatedResponse<DEXOrder>> = await apiClient.get(endpoint);

      if (!response.success || !response.data) {
        return [];
      }

      response.data.data.forEach(order => {
        this.orders.set(order.id, order);
      });

      return response.data.data;
    } catch (error) {
      this.emit('error', { error, context: 'orders-fetch' });
      return [];
    }
  }

  async getOrderHistory(walletAddress: string, limit = 50): Promise<DEXOrder[]> {
    try {
      const apiClient = this.client.getAPIClient('dex');
      const response: APIResponse<PaginatedResponse<DEXOrder>> = await apiClient.get(
        `/orders/history?wallet=${walletAddress}&limit=${limit}`
      );

      if (!response.success || !response.data) {
        return [];
      }

      return response.data.data;
    } catch (error) {
      this.emit('error', { error, context: 'order-history-fetch' });
      return [];
    }
  }

  async getTradingVolume(walletAddress: string, period = '24h'): Promise<number> {
    try {
      const apiClient = this.client.getAPIClient('dex');
      const response: APIResponse<{ volume: number }> = await apiClient.get(
        `/trading/volume?wallet=${walletAddress}&period=${period}`
      );

      if (!response.success || !response.data) {
        return 0;
      }

      return response.data.volume;
    } catch (error) {
      this.emit('error', { error, context: 'volume-fetch' });
      return 0;
    }
  }

  getCachedMarkets(): DEXMarketData[] {
    return Array.from(this.markets.values());
  }

  getCachedOrders(): DEXOrder[] {
    return Array.from(this.orders.values());
  }

  getMarketBySymbol(symbol: string): DEXMarketData | null {
    return this.markets.get(symbol) || null;
  }

  private async loadMarkets(): Promise<void> {
    await this.getMarkets();
  }

  private startPriceUpdates(): void {
    // Update prices every 10 seconds
    this.priceUpdateInterval = setInterval(async () => {
      await this.getMarkets();
    }, 10000);
  }

  async destroy(): Promise<void> {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = undefined;
    }
    this.markets.clear();
    this.orders.clear();
    this.removeAllListeners();
  }
} 