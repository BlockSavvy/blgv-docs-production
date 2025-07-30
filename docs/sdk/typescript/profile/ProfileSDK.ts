/**
 * Profile SDK
 * User profile management and cross-platform synchronization
 */

import { UserProfile, CrossPlatformData, VerificationStatus, APIResponse } from '../types';
import { EventEmitter, Storage } from '../utils';
import type { BLGVClient } from '../core/BLGVClient';

export class ProfileSDK extends EventEmitter {
  private client: BLGVClient;
  private currentProfile?: UserProfile;
  private storage: Storage;

  constructor(client: BLGVClient) {
    super();
    this.client = client;
    this.storage = Storage.getInstance();
  }

  async initialize(): Promise<void> {
    try {
      await this.loadProfile();
      this.emit('initialized', { hasProfile: !!this.currentProfile });
    } catch (error) {
      this.emit('error', { error, context: 'profile-initialization' });
      throw error;
    }
  }

  async createProfile(params: {
    walletAddress: string;
    platform: string;
    preferences?: Partial<UserProfile['preferences']>;
  }): Promise<UserProfile> {
    const { walletAddress, platform, preferences = {} } = params;

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<UserProfile> = await apiClient.post('/profiles', {
        walletAddress,
        platform,
        preferences: {
          currency: 'BTC',
          theme: 'dark',
          notifications: {
            treasury: true,
            mining: true,
            dex: true,
            price: true,
            email: false,
            push: true,
          },
          privacy: {
            shareAnalytics: true,
            shareActivity: false,
            publicProfile: false,
          },
          ...preferences,
        },
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to create profile');
      }

      this.currentProfile = response.data;
      await this.saveProfileLocally();
      this.emit('profileCreated', { profile: this.currentProfile });
      return this.currentProfile;
    } catch (error) {
      this.emit('error', { error, context: 'profile-creation' });
      throw error;
    }
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!this.currentProfile) {
      throw new Error('No profile available to update');
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<UserProfile> = await apiClient.put(
        `/profiles/${this.currentProfile.id}`,
        updates
      );

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to update profile');
      }

      this.currentProfile = response.data;
      await this.saveProfileLocally();
      this.emit('profileUpdated', { profile: this.currentProfile });
      return this.currentProfile;
    } catch (error) {
      this.emit('error', { error, context: 'profile-update' });
      throw error;
    }
  }

  async addWalletAddress(address: string): Promise<UserProfile | null> {
    if (!this.currentProfile) {
      throw new Error('No profile available');
    }

    const updatedAddresses = [...this.currentProfile.walletAddresses];
    if (!updatedAddresses.includes(address)) {
      updatedAddresses.push(address);
    }

    return this.updateProfile({ walletAddresses: updatedAddresses });
  }

  async removeWalletAddress(address: string): Promise<UserProfile | null> {
    if (!this.currentProfile) {
      throw new Error('No profile available');
    }

    const updatedAddresses = this.currentProfile.walletAddresses.filter(addr => addr !== address);
    
    // Don't allow removing the primary wallet
    if (this.currentProfile.primaryWallet === address && updatedAddresses.length > 0) {
      const updates: Partial<UserProfile> = {
        walletAddresses: updatedAddresses,
        primaryWallet: updatedAddresses[0],
      };
      return this.updateProfile(updates);
    }

    return this.updateProfile({ walletAddresses: updatedAddresses });
  }

  async setPrimaryWallet(address: string): Promise<UserProfile | null> {
    if (!this.currentProfile) {
      throw new Error('No profile available');
    }

    if (!this.currentProfile.walletAddresses.includes(address)) {
      throw new Error('Wallet address not found in profile');
    }

    return this.updateProfile({ primaryWallet: address });
  }

  async updateVerificationStatus(status: Partial<VerificationStatus>): Promise<UserProfile | null> {
    if (!this.currentProfile) {
      throw new Error('No profile available');
    }

    const updatedStatus = {
      ...this.currentProfile.verificationStatus,
      ...status,
    };

    return this.updateProfile({ verificationStatus: updatedStatus });
  }

  async updateCrossPlatformData(data: Partial<CrossPlatformData>): Promise<UserProfile | null> {
    if (!this.currentProfile) {
      throw new Error('No profile available');
    }

    const updatedData = {
      ...this.currentProfile.crossPlatformData,
      ...data,
    };

    return this.updateProfile({ crossPlatformData: updatedData });
  }

  async syncProfile(): Promise<UserProfile | null> {
    if (!this.currentProfile) {
      return null;
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response: APIResponse<UserProfile> = await apiClient.get(
        `/profiles/${this.currentProfile.id}`
      );

      if (!response.success || !response.data) {
        return null;
      }

      this.currentProfile = response.data;
      await this.saveProfileLocally();
      this.emit('profileSynced', { profile: this.currentProfile });
      return this.currentProfile;
    } catch (error) {
      this.emit('error', { error, context: 'profile-sync' });
      return null;
    }
  }

  getCurrentProfile(): UserProfile | null {
    return this.currentProfile || null;
  }

  isProfileComplete(): boolean {
    if (!this.currentProfile) return false;
    
    return (
      this.currentProfile.walletAddresses.length > 0 &&
      !!this.currentProfile.primaryWallet &&
      !!this.currentProfile.preferences
    );
  }

  isVerified(): boolean {
    return this.currentProfile?.verificationStatus.equityVerified || false;
  }

  hasWallet(address: string): boolean {
    return this.currentProfile?.walletAddresses.includes(address) || false;
  }

  async deleteProfile(): Promise<boolean> {
    if (!this.currentProfile) {
      throw new Error('No profile available to delete');
    }

    try {
      const apiClient = this.client.getAPIClient('main');
      const response = await apiClient.delete(`/profiles/${this.currentProfile.id}`);

      if (!response.success) {
        return false;
      }

      await this.clearProfileLocally();
      this.currentProfile = undefined;
      this.emit('profileDeleted');
      return true;
    } catch (error) {
      this.emit('error', { error, context: 'profile-deletion' });
      return false;
    }
  }

  private async loadProfile(): Promise<void> {
    try {
      // First try to load from local storage
      const localProfile = await this.storage.getItem('blgv-profile');
      if (localProfile) {
        this.currentProfile = JSON.parse(localProfile);
      }

      // Then sync with server if we have a profile
      if (this.currentProfile) {
        await this.syncProfile();
      }
    } catch (error) {
      console.warn('Failed to load profile:', error);
    }
  }

  private async saveProfileLocally(): Promise<void> {
    if (this.currentProfile) {
      await this.storage.setItem('blgv-profile', JSON.stringify(this.currentProfile));
    }
  }

  private async clearProfileLocally(): Promise<void> {
    await this.storage.removeItem('blgv-profile');
  }

  async destroy(): Promise<void> {
    await this.clearProfileLocally();
    this.currentProfile = undefined;
    this.removeAllListeners();
  }
} 