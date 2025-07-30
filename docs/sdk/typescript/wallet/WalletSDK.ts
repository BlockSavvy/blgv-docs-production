/**
 * Wallet SDK
 * Bitcoin wallet management and operations
 */

import { WalletData, WalletBalance, APIResponse } from '../types';
import { EventEmitter, Validators, Formatters } from '../utils';
import type { BLGVClient } from '../core/BLGVClient';
import { createTestModeHeaders, isTestMode, shouldShowFakeAssets } from '../config';

export class WalletSDK extends EventEmitter {
  private client: BLGVClient;
  private wallets: Map<string, WalletData> = new Map();
  private defaultWallet?: string;

  constructor(client: BLGVClient) {
    super();
    this.client = client;
  }

  async initialize(): Promise<void> {
    try {
      await this.loadWallets();
      this.emit('initialized', { walletsCount: this.wallets.size });
    } catch (error) {
      this.emit('error', { error, context: 'wallet-initialization' });
      throw error;
    }
  }

  async createWallet(params: {
    type: 'p2wpkh' | 'p2tr';
    network?: 'mainnet' | 'testnet' | 'regtest';
    label?: string;
  }): Promise<WalletData> {
    const { type, network = 'mainnet', label = 'Default Wallet' } = params;

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<WalletData> = await apiClient.post('/wallets', {
        type,
        network,
        label,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create wallet');
      }

      const wallet = response.data;
      this.wallets.set(wallet.address, wallet);

      if (!this.defaultWallet) {
        this.setDefaultWallet(wallet.address);
      }

      this.emit('walletCreated', { wallet });
      return wallet;
    } catch (error) {
      this.emit('error', { error, context: 'wallet-creation' });
      throw error;
    }
  }

  async importWallet(params: {
    mnemonic?: string;
    privateKey?: string;
    xpub?: string;
    type: 'p2wpkh' | 'p2tr';
    network?: 'mainnet' | 'testnet' | 'regtest';
    label?: string;
  }): Promise<WalletData> {
    const { mnemonic, privateKey, xpub, type, network = 'mainnet', label = 'Imported Wallet' } = params;

    if (!mnemonic && !privateKey && !xpub) {
      throw new Error('One of mnemonic, privateKey, or xpub is required');
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<WalletData> = await apiClient.post('/wallets/import', {
        mnemonic,
        privateKey,
        xpub,
        type,
        network,
        label,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to import wallet');
      }

      const wallet = response.data;
      this.wallets.set(wallet.address, wallet);

      this.emit('walletImported', { wallet });
      return wallet;
    } catch (error) {
      this.emit('error', { error, context: 'wallet-import' });
      throw error;
    }
  }

  async getWallet(address: string): Promise<WalletData | null> {
    const cachedWallet = this.wallets.get(address);
    if (cachedWallet) {
      return cachedWallet;
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<WalletData> = await apiClient.get(`/wallets/${address}`);

      if (!response.success || !response.data) {
        return null;
      }

      const wallet = response.data;
      this.wallets.set(wallet.address, wallet);
      return wallet;
    } catch (error) {
      this.emit('error', { error, context: 'wallet-fetch' });
      return null;
    }
  }

  async getBalance(address: string): Promise<WalletBalance | null> {
    try {
      const apiClient = this.client.getAPIClient('main');
      
      // Add test mode headers for proper API routing
      const headers: Record<string, string> = {};
      const config = this.client.getConfig();
      if (isTestMode(config)) {
        Object.assign(headers, createTestModeHeaders(config));
      }

      const requestOptions: any = {};
      if (Object.keys(headers).length > 0) {
        requestOptions.headers = headers;
      }

      const response: APIResponse<WalletBalance> = await apiClient.get(`/wallets/${address}/balance`, requestOptions);

      if (!response.success || !response.data) {
        return null;
      }

      // Return actual API data (including real test faucet amounts if in test mode)
      return response.data;
    } catch (error) {
      this.emit('error', { error, context: 'balance-fetch' });
      return null;
    }
  }

  async sendTransaction(params: {
    fromAddress: string;
    toAddress: string;
    amount: number;
    feeRate?: number;
  }): Promise<string> {
    const { fromAddress, toAddress, amount, feeRate } = params;

    if (!Validators.bitcoinAddress(fromAddress)) {
      throw new Error('Invalid from address');
    }

    if (!Validators.bitcoinAddress(toAddress)) {
      throw new Error('Invalid to address');
    }

    if (!Validators.amount(amount)) {
      throw new Error('Invalid amount');
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<{ txid: string }> = await apiClient.post('/transactions/send', {
        fromAddress,
        toAddress,
        amount,
        feeRate,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to send transaction');
      }

      const txid = response.data.txid;
      this.emit('transactionSent', { txid, fromAddress, toAddress, amount });
      return txid;
    } catch (error) {
      this.emit('error', { error, context: 'transaction-send' });
      throw error;
    }
  }

  getAllWallets(): WalletData[] {
    return Array.from(this.wallets.values());
  }

  getDefaultWallet(): WalletData | null {
    return this.defaultWallet ? this.wallets.get(this.defaultWallet) || null : null;
  }

  setDefaultWallet(address: string): void {
    if (!this.wallets.has(address)) {
      throw new Error('Wallet not found');
    }

    this.defaultWallet = address;
    this.emit('defaultWalletChanged', { address });
  }

  async deleteWallet(address: string): Promise<void> {
    try {
      const apiClient = this.client.getAPIClient('main');
      const response = await apiClient.delete(`/wallets/${address}`);

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to delete wallet');
      }

      this.wallets.delete(address);

      if (this.defaultWallet === address) {
        const remainingWallets = this.getAllWallets();
        this.defaultWallet = remainingWallets.length > 0 ? remainingWallets[0].address : undefined;
      }

      this.emit('walletDeleted', { address });
    } catch (error) {
      this.emit('error', { error, context: 'wallet-deletion' });
      throw error;
    }
  }

  private async loadWallets(): Promise<void> {
    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<WalletData[]> = await apiClient.get('/wallets');

      if (response.success && response.data) {
        this.wallets.clear();
        response.data.forEach(wallet => {
          this.wallets.set(wallet.address, wallet);
          if (wallet.isDefault) {
            this.defaultWallet = wallet.address;
          }
        });
      }
    } catch (error) {
      // Silent fail for initial load
      console.warn('Failed to load wallets:', error);
    }
  }

  async destroy(): Promise<void> {
    this.wallets.clear();
    this.defaultWallet = undefined;
    this.removeAllListeners();
  }
} 