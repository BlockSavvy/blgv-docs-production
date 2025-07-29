/**
 * Auth SDK
 * Authentication and session management
 */

import { AuthCredentials, AuthSession, APIResponse } from '../types';
import { EventEmitter, Storage, Validators, generateId } from '../utils';
import type { BLGVClient } from '../core/BLGVClient';

export class AuthSDK extends EventEmitter {
  private client: BLGVClient;
  private currentSession?: AuthSession;
  private storage: Storage;
  private sessionCheckInterval?: NodeJS.Timeout;

  constructor(client: BLGVClient) {
    super();
    this.client = client;
    this.storage = Storage.getInstance();
  }

  async initialize(): Promise<void> {
    try {
      await this.loadSession();
      this.startSessionCheck();
      this.emit('initialized', { isAuthenticated: this.isAuthenticated() });
    } catch (error) {
      this.emit('error', { error, context: 'auth-initialization' });
      throw error;
    }
  }

  async authenticateWithWallet(walletAddress: string, signature: string): Promise<AuthSession> {
    if (!Validators.bitcoinAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    if (!Validators.signature(signature)) {
      throw new Error('Invalid signature');
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<AuthSession> = await apiClient.post('/auth/wallet', {
        walletAddress,
        signature,
        timestamp: Date.now(),
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Authentication failed');
      }

      this.currentSession = response.data;
      
      // Set auth token for all API clients
      this.setAuthTokenForClients(this.currentSession.sessionId);
      
      await this.saveSession();
      this.emit('authenticated', { session: this.currentSession });
      return this.currentSession;
    } catch (error) {
      this.emit('error', { error, context: 'wallet-auth' });
      throw error;
    }
  }

  async authenticateWithAPIKey(apiKey: string): Promise<AuthSession> {
    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<AuthSession> = await apiClient.post('/auth/api-key', {
        apiKey,
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'API key authentication failed');
      }

      this.currentSession = response.data;
      
      // Set auth token for all API clients
      this.setAuthTokenForClients(apiKey);
      
      await this.saveSession();
      this.emit('authenticated', { session: this.currentSession });
      return this.currentSession;
    } catch (error) {
      this.emit('error', { error, context: 'api-key-auth' });
      throw error;
    }
  }

  async createGuestSession(): Promise<AuthSession> {
    try {
      const sessionId = generateId();
      const guestSession: AuthSession = {
        isAuthenticated: false,
        sessionId,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        permissions: ['read:public'],
        platform: this.client.getPlatform(),
      };

      this.currentSession = guestSession;
      await this.saveSession();
      this.emit('guestSessionCreated', { session: guestSession });
      return guestSession;
    } catch (error) {
      this.emit('error', { error, context: 'guest-session-creation' });
      throw error;
    }
  }

  async refreshSession(): Promise<AuthSession | null> {
    if (!this.currentSession || !this.currentSession.isAuthenticated) {
      return null;
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<AuthSession> = await apiClient.post('/auth/refresh', {
        sessionId: this.currentSession.sessionId,
      });

      if (!response.success || !response.data) {
        await this.logout();
        return null;
      }

      this.currentSession = response.data;
      await this.saveSession();
      this.emit('sessionRefreshed', { session: this.currentSession });
      return this.currentSession;
    } catch (error) {
      this.emit('error', { error, context: 'session-refresh' });
      await this.logout();
      return null;
    }
  }

  async logout(): Promise<void> {
    if (!this.currentSession) return;

    try {
      if (this.currentSession.isAuthenticated) {
        const apiClient = this.client.getAPIClient('main');
        await apiClient.post('/auth/logout', {
          sessionId: this.currentSession.sessionId,
        });
      }

      // Clear auth tokens from all API clients
      this.clearAuthTokensFromClients();
      
      await this.clearSession();
      this.currentSession = undefined;
      this.emit('logout', { timestamp: new Date().toISOString() });
    } catch (error) {
      this.emit('error', { error, context: 'logout' });
      // Still clear local session even if API call fails
      await this.clearSession();
      this.currentSession = undefined;
    }
  }

  getCurrentSession(): AuthSession | null {
    return this.currentSession || null;
  }

  isAuthenticated(): boolean {
    if (!this.currentSession) return false;
    if (!this.currentSession.isAuthenticated) return false;
    if (this.currentSession.expiresAt <= Date.now()) return false;
    return true;
  }

  hasPermission(permission: string): boolean {
    if (!this.currentSession) return false;
    return this.currentSession.permissions.includes(permission);
  }

  getWalletAddress(): string | null {
    return this.currentSession?.walletAddress || null;
  }

  getSessionId(): string | null {
    return this.currentSession?.sessionId || null;
  }

  getTimeUntilExpiry(): number {
    if (!this.currentSession) return 0;
    return Math.max(0, this.currentSession.expiresAt - Date.now());
  }

  isSessionExpiringSoon(thresholdMinutes = 15): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiry();
    return timeUntilExpiry > 0 && timeUntilExpiry < (thresholdMinutes * 60 * 1000);
  }

  private async loadSession(): Promise<void> {
    try {
      const sessionData = await this.storage.getItem('blgv-session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        
        // Check if session is still valid
        if (session.expiresAt > Date.now()) {
          this.currentSession = session;
          
          // Set auth token if authenticated
          if (session.isAuthenticated) {
            this.setAuthTokenForClients(session.sessionId);
          }
        } else {
          // Session expired, clear it
          await this.clearSession();
        }
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
      await this.clearSession();
    }
  }

  private async saveSession(): Promise<void> {
    if (this.currentSession) {
      await this.storage.setItem('blgv-session', JSON.stringify(this.currentSession));
    }
  }

  private async clearSession(): Promise<void> {
    await this.storage.removeItem('blgv-session');
  }

  private setAuthTokenForClients(token: string): void {
    // Get all API clients and set auth token
    const services = ['main', 'dex', 'pool', 'treasury'];
    services.forEach(service => {
      try {
        const client = this.client.getAPIClient(service);
        client.setAuthToken(token);
      } catch (error) {
        // Client might not exist, ignore
      }
    });
  }

  private clearAuthTokensFromClients(): void {
    const services = ['main', 'dex', 'pool', 'treasury'];
    services.forEach(service => {
      try {
        const client = this.client.getAPIClient(service);
        client.removeAuthToken();
      } catch (error) {
        // Client might not exist, ignore
      }
    });
  }

  private startSessionCheck(): void {
    // Check session validity every 5 minutes
    this.sessionCheckInterval = setInterval(async () => {
      if (this.isAuthenticated() && this.isSessionExpiringSoon()) {
        await this.refreshSession();
      } else if (this.currentSession && this.currentSession.expiresAt <= Date.now()) {
        await this.logout();
      }
    }, 5 * 60 * 1000);
  }

  async destroy(): Promise<void> {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = undefined;
    }
    
    await this.logout();
    this.removeAllListeners();
  }
} 