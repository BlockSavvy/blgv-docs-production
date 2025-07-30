/**
 * BLGV SDK Utilities
 * Shared utility functions for cross-platform compatibility
 */

import { APIResponse, APIError, Platform as PlatformType } from '../types';

// API Utilities
export class APIClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(baseURL: string, timeout = 30000, headers: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = { ...this.headers, ...customHeaders };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        const error: APIError = {
          code: responseData.code || 'API_ERROR',
          message: responseData.message || 'An error occurred',
          details: responseData.details,
        };

        return {
          success: false,
          error,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: responseData,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      const apiError: APIError = {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error occurred',
        details: error,
      };

      return {
        success: false,
        error: apiError,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, headers);
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, data, headers);
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, data, headers);
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<APIResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, headers);
  }

  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.headers['Authorization'];
  }
}

// Validation utilities
export const Validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  bitcoinAddress: (address: string): boolean => {
    // Basic Bitcoin address validation (simplified)
    const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const segwitRegex = /^bc1[a-z0-9]{39,59}$/;
    const taprootRegex = /^bc1p[a-z0-9]{58}$/;
    
    return legacyRegex.test(address) || segwitRegex.test(address) || taprootRegex.test(address);
  },

  amount: (amount: number): boolean => {
    return !isNaN(amount) && amount > 0 && amount <= 21000000; // Max BTC supply
  },

  signature: (signature: string): boolean => {
    // Basic signature validation (hex string)
    const hexRegex = /^[a-fA-F0-9]+$/;
    return hexRegex.test(signature) && signature.length >= 128;
  },

  walletType: (type: string): boolean => {
    return ['p2wpkh', 'p2tr'].includes(type);
  },

  network: (network: string): boolean => {
    return ['mainnet', 'testnet', 'regtest'].includes(network);
  },
};

// Format utilities
export const Formatters = {
  satoshisToBTC: (satoshis: number): number => {
    return satoshis / 100000000;
  },

  btcToSatoshis: (btc: number): number => {
    return Math.round(btc * 100000000);
  },

  formatBTC: (amount: number, precision = 8): string => {
    return amount.toFixed(precision);
  },

  formatUSD: (amount: number, precision = 2): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(amount);
  },

  formatPercentage: (value: number, precision = 2): string => {
    return `${value.toFixed(precision)}%`;
  },

  formatDate: (date: string | Date): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  truncateAddress: (address: string, start = 6, end = 4): string => {
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  },

  formatHashrate: (hashrate: number): string => {
    const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
    let unitIndex = 0;
    let value = hashrate;

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000;
      unitIndex++;
    }

    return `${value.toFixed(2)} ${units[unitIndex]}`;
  },
};

// Platform detection utilities
export const Platform = {
  isMobile: (): boolean => {
    if (typeof navigator === 'undefined') return false;
    return Boolean(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  },

  isWeb: (): boolean => {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  },

  isNode: (): boolean => {
    return typeof process !== 'undefined' && Boolean(process.versions && process.versions.node);
  },

  getCurrentPlatform: (): PlatformType => {
    if (Platform.isNode()) return 'api';
    if (Platform.isMobile()) return 'mobile';
    return 'web';
  },
};

// Storage utilities (platform-agnostic)
export class Storage {
  private static instance: Storage;
  private storage: any;

  constructor() {
    if (Platform.isWeb()) {
      this.storage = localStorage;
    } else if (Platform.isNode()) {
      // For Node.js, we'd use a file-based storage or memory
      this.storage = new Map();
    } else {
      // For React Native, this would be AsyncStorage
      this.storage = new Map(); // Fallback
    }
  }

  static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (this.storage.setItem) {
      this.storage.setItem(key, value);
    } else if (this.storage.set) {
      this.storage.set(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (this.storage.getItem) {
      return this.storage.getItem(key);
    } else if (this.storage.get) {
      return this.storage.get(key) || null;
    }
    return null;
  }

  async removeItem(key: string): Promise<void> {
    if (this.storage.removeItem) {
      this.storage.removeItem(key);
    } else if (this.storage.delete) {
      this.storage.delete(key);
    }
  }

  async clear(): Promise<void> {
    if (this.storage.clear) {
      this.storage.clear();
    } else if (this.storage.clear) {
      this.storage.clear();
    }
  }
}

// Event utilities
export class EventEmitter {
  private events: Record<string, Function[]> = {};

  on(event: string, callback: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(...args));
  }

  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Retry utility
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) {
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay * 2); // Exponential backoff
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Deep merge utility
export function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Convert to timestamp
export function toTimestamp(date?: Date | string): string {
  if (!date) return new Date().toISOString();
  if (typeof date === 'string') return date;
  return date.toISOString();
} 