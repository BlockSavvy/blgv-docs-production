/**
 * BLGV SDK Configuration
 * Environment and platform-specific configuration management
 */

import { SDKConfiguration, Environment, Platform, TestModeConfig } from '../types';

export interface SDKConfig extends SDKConfiguration {}

const DEFAULT_CONFIG: Partial<SDKConfiguration> = {
  timeout: 30000,
  retryAttempts: 3,
  enableSync: true,
  enableAnalytics: true,
  debugMode: false,
  version: '1.0.0',
  testMode: {
    isTestMode: false,
    showFakeAssets: false,
    isolationLevel: 'session',
  },
};

const ENVIRONMENT_CONFIGS: Record<Environment, Partial<SDKConfiguration>> = {
  development: {
    endpoints: {
      main: 'http://localhost:3000/api',
      dex: 'http://localhost:3001/api',
      pool: 'http://localhost:3002/api',
      treasury: 'http://localhost:3003/api',
    },
    debugMode: true,
  },
  staging: {
    endpoints: {
      main: 'https://api-staging.blgvbtc.com',
      dex: 'https://dex-staging.blgvbtc.com/api',
      pool: 'https://pool-staging.blgvbtc.com/api',
      treasury: 'https://staging.blgvbtc.com/api',
    },
    debugMode: true,
  },
  production: {
    endpoints: {
      main: 'https://api.blgvbtc.com',
      dex: 'https://api.blgvbtc.com/dex',
      pool: 'https://api.blgvbtc.com/pool',
      treasury: 'https://api.blgvbtc.com/treasury',
    },
    debugMode: false,
  },
};

const PLATFORM_CONFIGS: Record<Platform, Partial<SDKConfiguration>> = {
  mobile: {
    enableSync: true,
    enableAnalytics: true,
    timeout: 45000, // Longer timeout for mobile networks
  },
  web: {
    enableSync: true,
    enableAnalytics: true,
    timeout: 30000,
  },
  api: {
    enableSync: false,
    enableAnalytics: false,
    timeout: 60000, // Longer timeout for server-to-server
  },
};

export function createSDKConfig(options: {
  environment: Environment;
  platform: Platform;
  apiKey?: string;
  customEndpoints?: Record<string, string>;
  overrides?: Partial<SDKConfiguration>;
  testMode?: boolean | TestModeConfig;
}): SDKConfiguration {
  const { environment, platform, apiKey, customEndpoints, overrides = {}, testMode = false } = options;

  const config: SDKConfiguration = {
    ...DEFAULT_CONFIG,
    ...ENVIRONMENT_CONFIGS[environment],
    ...PLATFORM_CONFIGS[platform],
    ...overrides,
    environment,
    platform,
    apiKey,
  } as SDKConfiguration;

  // Configure test mode - matches Treasury Intelligence Platform pattern
  if (testMode) {
    if (typeof testMode === 'boolean') {
      config.testMode = {
        isTestMode: true,
        testSessionId: generateTestSessionId(),
        showFakeAssets: true,
        isolationLevel: 'session',
      };
    } else {
      config.testMode = {
        ...config.testMode,
        ...testMode,
        testSessionId: testMode.testSessionId || generateTestSessionId(),
      };
    }

    // Add test mode headers for API requests
    config.endpoints = {
      ...config.endpoints,
      testMode: config.testMode.isTestMode ? 'true' : 'false',
      ...(config.testMode.testSessionId && { testSessionId: config.testMode.testSessionId }),
    };
  }

  // Override endpoints if provided
  if (customEndpoints) {
    config.endpoints = {
      ...config.endpoints,
      ...customEndpoints,
    };
  }

  return config;
}

export function validateConfig(config: SDKConfiguration): string[] {
  const errors: string[] = [];

  if (!config.environment) {
    errors.push('Environment is required');
  }

  if (!config.platform) {
    errors.push('Platform is required');
  }

  if (!config.endpoints) {
    errors.push('Endpoints configuration is required');
  } else {
    const requiredEndpoints = ['main', 'dex', 'pool', 'treasury'];
    for (const endpoint of requiredEndpoints) {
      if (!config.endpoints[endpoint]) {
        errors.push(`${endpoint} endpoint is required`);
      }
    }
  }

  if (config.timeout && config.timeout < 1000) {
    errors.push('Timeout must be at least 1000ms');
  }

  if (config.retryAttempts && config.retryAttempts < 0) {
    errors.push('Retry attempts cannot be negative');
  }

  return errors;
}

export function getEndpoint(config: SDKConfiguration, service: string): string {
  const endpoint = config.endpoints[service];
  if (!endpoint) {
    throw new Error(`Endpoint for service '${service}' not found`);
  }
  return endpoint;
}

export function isProduction(config: SDKConfiguration): boolean {
  return config.environment === 'production';
}

export function isDevelopment(config: SDKConfiguration): boolean {
  return config.environment === 'development';
}

export function isTestMode(config: SDKConfiguration): boolean {
  return config.testMode?.isTestMode === true;
}

export function getTestSessionId(config: SDKConfiguration): string | undefined {
  return config.testMode?.testSessionId;
}

export function shouldShowFakeAssets(config: SDKConfiguration): boolean {
  return config.testMode?.showFakeAssets === true;
}

function generateTestSessionId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createTestModeHeaders(config: SDKConfiguration): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (isTestMode(config)) {
    headers['X-Test-Mode'] = 'true';
    const sessionId = getTestSessionId(config);
    if (sessionId) {
      headers['X-Test-Session-Id'] = sessionId;
    }
  }
  
  return headers;
}

export function shouldLog(config: SDKConfiguration, level: 'debug' | 'info' | 'warn' | 'error'): boolean {
  if (level === 'error') return true;
  if (level === 'warn') return true;
  if (level === 'info') return true;
  if (level === 'debug') return config.debugMode;
  return false;
} 