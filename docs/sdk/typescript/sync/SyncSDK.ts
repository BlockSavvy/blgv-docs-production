/**
 * Sync SDK
 * Cross-platform data synchronization and conflict resolution
 */

import { SyncOperation, SyncConflict, APIResponse, UserProfile } from '../types';
import { EventEmitter, Storage, generateId, toTimestamp } from '../utils';
import type { BLGVClient } from '../core/BLGVClient';

export class SyncSDK extends EventEmitter {
  private client: BLGVClient;
  private storage: Storage;
  private pendingOperations: Map<string, SyncOperation> = new Map();
  private syncInterval?: NodeJS.Timeout;
  private isOnline = true;
  private isSyncing = false;

  constructor(client: BLGVClient) {
    super();
    this.client = client;
    this.storage = Storage.getInstance();
  }

  async initialize(): Promise<void> {
    try {
      await this.loadPendingOperations();
      this.setupNetworkMonitoring();
      this.startAutoSync();
      this.emit('initialized', { pendingOperations: this.pendingOperations.size });
    } catch (error) {
      this.emit('error', { error, context: 'sync-initialization' });
      throw error;
    }
  }

  async queueOperation(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'status'>): Promise<string> {
    const syncOperation: SyncOperation = {
      id: generateId(),
      timestamp: toTimestamp(),
      status: 'pending',
      ...operation,
      platform: operation.platform || this.client.getPlatform(),
    };

    this.pendingOperations.set(syncOperation.id, syncOperation);
    await this.savePendingOperations();

    this.emit('operationQueued', { operation: syncOperation });

    // Try to sync immediately if online
    if (this.isOnline && !this.isSyncing) {
      setImmediate(() => this.syncPendingOperations());
    }

    return syncOperation.id;
  }

  async syncNow(): Promise<boolean> {
    if (this.isSyncing) {
      return false;
    }

    try {
      this.isSyncing = true;
      this.emit('syncStarted');

      // Sync user profile first
      await this.syncProfile();

      // Sync pending operations
      await this.syncPendingOperations();

      // Pull latest changes from server
      await this.pullServerChanges();

      this.emit('syncCompleted', { 
        pendingOperations: this.pendingOperations.size,
        timestamp: toTimestamp()
      });

      return true;
    } catch (error) {
      this.emit('error', { error, context: 'sync-operation' });
      return false;
    } finally {
      this.isSyncing = false;
    }
  }

  async resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge', mergedData?: any): Promise<boolean> {
    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<boolean> = await apiClient.post(`/sync/conflicts/${conflictId}/resolve`, {
        resolution,
        mergedData,
      });

      if (!response.success) {
        return false;
      }

      this.emit('conflictResolved', { conflictId, resolution });
      return true;
    } catch (error) {
      this.emit('error', { error, context: 'conflict-resolution' });
      return false;
    }
  }

  async getConflicts(): Promise<SyncConflict[]> {
    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<SyncConflict[]> = await apiClient.get('/sync/conflicts');

      if (!response.success || !response.data) {
        return [];
      }

      return response.data;
    } catch (error) {
      this.emit('error', { error, context: 'conflicts-fetch' });
      return [];
    }
  }

  async enableAutoSync(): Promise<void> {
    const config = this.client.getConfig();
    if (!config.enableSync) {
      this.client.updateConfig({ enableSync: true });
    }
    this.startAutoSync();
    this.emit('autoSyncEnabled');
  }

  async disableAutoSync(): Promise<void> {
    this.stopAutoSync();
    this.client.updateConfig({ enableSync: false });
    this.emit('autoSyncDisabled');
  }

  getLastSyncTime(): string | null {
    // This would typically be stored in local storage
    return null; // Placeholder
  }

  getPendingOperationsCount(): number {
    return this.pendingOperations.size;
  }

  isSyncEnabled(): boolean {
    return this.client.getConfig().enableSync;
  }

  isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }

  getNetworkStatus(): boolean {
    return this.isOnline;
  }

  private async syncProfile(): Promise<void> {
    const profileSDK = this.client.profile;
    await profileSDK.syncProfile();
  }

  private async syncPendingOperations(): Promise<void> {
    if (this.pendingOperations.size === 0) {
      return;
    }

    const operations = Array.from(this.pendingOperations.values());
    const batchSize = 10; // Process operations in batches

    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize);
      await this.processBatch(batch);
    }
  }

  private async processBatch(operations: SyncOperation[]): Promise<void> {
    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<{ processed: string[], conflicts: SyncConflict[] }> = 
        await apiClient.post('/sync/operations', { operations });

      if (!response.success || !response.data) {
        // Mark operations as failed but keep them for retry
        operations.forEach(op => {
          op.status = 'failed';
          this.pendingOperations.set(op.id, op);
        });
        return;
      }

      // Remove successfully processed operations
      response.data.processed.forEach(id => {
        this.pendingOperations.delete(id);
        this.emit('operationSynced', { operationId: id });
      });

      // Handle conflicts
      if (response.data.conflicts.length > 0) {
        this.emit('conflictsDetected', { conflicts: response.data.conflicts });
      }

      await this.savePendingOperations();
    } catch (error) {
      this.emit('error', { error, context: 'batch-processing' });
    }
  }

  private async pullServerChanges(): Promise<void> {
    try {
      const profile = this.client.profile.getCurrentProfile();
      if (!profile) return;

      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<{
        walletChanges: any[];
        profileChanges: any[];
        dexChanges: any[];
        poolChanges: any[];
      }> = await apiClient.get(`/sync/changes?since=${profile.lastSyncAt}`);

      if (!response.success || !response.data) {
        return;
      }

      const { walletChanges, profileChanges, dexChanges, poolChanges } = response.data;

      // Apply changes to respective SDKs
      if (walletChanges.length > 0) {
        this.emit('walletChangesReceived', { changes: walletChanges });
      }

      if (profileChanges.length > 0) {
        this.emit('profileChangesReceived', { changes: profileChanges });
      }

      if (dexChanges.length > 0) {
        this.emit('dexChangesReceived', { changes: dexChanges });
      }

      if (poolChanges.length > 0) {
        this.emit('poolChangesReceived', { changes: poolChanges });
      }

      // Update last sync time
      await this.client.profile.updateProfile({
        lastSyncAt: toTimestamp()
      });

    } catch (error) {
      this.emit('error', { error, context: 'server-changes-pull' });
    }
  }

  private async loadPendingOperations(): Promise<void> {
    try {
      const data = await this.storage.getItem('blgv-pending-operations');
      if (data) {
        const operations = JSON.parse(data);
        operations.forEach((op: SyncOperation) => {
          this.pendingOperations.set(op.id, op);
        });
      }
    } catch (error) {
      console.warn('Failed to load pending operations:', error);
    }
  }

  private async savePendingOperations(): Promise<void> {
    try {
      const operations = Array.from(this.pendingOperations.values());
      await this.storage.setItem('blgv-pending-operations', JSON.stringify(operations));
    } catch (error) {
      console.warn('Failed to save pending operations:', error);
    }
  }

  private setupNetworkMonitoring(): void {
    // Basic network monitoring
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.emit('networkStatusChanged', { isOnline: true });
        // Sync when coming back online
        if (!this.isSyncing) {
          setImmediate(() => this.syncNow());
        }
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.emit('networkStatusChanged', { isOnline: false });
      });

      this.isOnline = navigator.onLine;
    }
  }

  private startAutoSync(): void {
    if (!this.isSyncEnabled()) return;

    // Sync every 5 minutes
    this.syncInterval = setInterval(async () => {
      if (this.isOnline && !this.isSyncing) {
        await this.syncNow();
      }
    }, 5 * 60 * 1000);
  }

  private stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = undefined;
    }
  }

  async destroy(): Promise<void> {
    this.stopAutoSync();
    await this.savePendingOperations();
    this.pendingOperations.clear();
    this.removeAllListeners();
  }
} 