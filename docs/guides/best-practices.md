# ✨ Best Practices

Development best practices for the BLGV Bitcoin-native ecosystem.

## 🎯 **BLGV Golden Rules**

### 1. **Never Use Hardcoded Data**
```typescript
// ❌ NEVER DO THIS
const MOCK_BTC_PRICE = 50000;
const SAMPLE_WALLET = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

// ✅ ALWAYS DO THIS  
const btcPrice = await blgvSDK.treasury.getBitcoinPrice();
const wallet = await blgvSDK.wallet.getUserWallet();
```

### 2. **Bitcoin-First Architecture**
```typescript
// All data flows in Bitcoin terms
interface TreasuryMetrics {
  btcHoldings: number;        // Primary metric
  btcPerShare: number;        // Key performance indicator
  usdValue?: number;          // Secondary, calculated from BTC
}
```

### 3. **Real-Time Everything**
```typescript
// WebSocket-first approach
const useRealTimeData = (endpoint: string) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket(`wss://api.blgvbtc.com/ws/${endpoint}`);
    ws.onmessage = (event) => setData(JSON.parse(event.data));
    return () => ws.close();
  }, [endpoint]);
  
  return data;
};
```

## 🏗️ **Architecture Patterns**

### Component Design
```typescript
// Self-contained, reusable components
interface ComponentProps {
  // Data props
  data: DataType;
  loading?: boolean;
  error?: string;
  
  // Behavior props
  onAction: (action: ActionType) => void;
  
  // Styling props
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

### State Management
```typescript
// Zustand for simple state
const useStore = create<Store>((set) => ({
  btcPrice: null,
  updatePrice: (price) => set({ btcPrice: price }),
}));

// Context for complex state
const TreasuryContext = createContext<TreasuryState>();
```

### Error Boundaries
```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    logger.error('Component error:', { error, errorInfo });
    
    // Report to error tracking
    errorTracking.captureException(error);
  }
}
```

## 🚀 **Performance Optimization**

### Code Splitting
```typescript
// Route-based splitting
const Treasury = lazy(() => import('../pages/Treasury'));
const DEX = lazy(() => import('../pages/DEX'));

// Component-based splitting
const HeavyChart = lazy(() => import('../components/HeavyChart'));
```

### Memoization Strategy
```typescript
// Expensive calculations
const portfolioValue = useMemo(() => {
  return calculatePortfolioValue(holdings, prices);
}, [holdings, prices]);

// Event handlers
const handleSubmit = useCallback((data) => {
  onSubmit(data);
}, [onSubmit]);

// Component memoization
const MemoizedChart = memo(Chart, (prev, next) => 
  prev.data.length === next.data.length
);
```

### Bundle Optimization
```typescript
// Tree-shaking friendly imports
import { calculateBPS } from '@blgv/utils';

// Avoid importing entire libraries
import debounce from 'lodash/debounce';
```

## 🔐 **Security Best Practices**

### Input Validation
```typescript
import { z } from 'zod';

const TransactionSchema = z.object({
  amount: z.number().positive(),
  recipient: z.string().bitcoin(),
  message: z.string().max(100).optional(),
});

// Validate all inputs
const validateAndProcess = (input: unknown) => {
  const result = TransactionSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(result.error.message);
  }
  return result.data;
};
```

### Environment Variables
```typescript
// Centralized configuration with validation
const config = {
  apiKey: z.string().min(1).parse(process.env.BLGV_API_KEY),
  environment: z.enum(['development', 'regtest', 'production']).parse(process.env.NODE_ENV),
  databaseUrl: z.string().url().parse(process.env.DATABASE_URL),
};
```

### Authentication Patterns
```typescript
// JWT verification middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

## 📱 **Mobile-First Development**

### Responsive Design
```typescript
const useResponsive = () => {
  const { width } = useWindowDimensions();
  
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    columns: width < 768 ? 1 : width < 1024 ? 2 : 3,
  };
};
```

### Touch-Friendly Interfaces
```css
/* Minimum touch target size */
.button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}

/* Smooth scrolling */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
```

### Offline Considerations
```typescript
const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};
```

## 🧪 **Testing Strategies**

### Unit Testing
```typescript
describe('Bitcoin Price Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should handle API errors gracefully', async () => {
    jest.spyOn(blgvSDK.treasury, 'getBitcoinPrice')
      .mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => useBitcoinPrice());
    
    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
      expect(result.current.price).toBe(null);
    });
  });
});
```

### Integration Testing
```typescript
// Test complete workflows
describe('Treasury Dashboard Integration', () => {
  it('should display treasury data correctly', async () => {
    render(<TreasuryDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/BTC Holdings/)).toBeInTheDocument();
      expect(screen.getByText(/Bitcoin per Share/)).toBeInTheDocument();
    });
  });
});
```

### E2E Testing
```typescript
// Playwright tests
test('user can view portfolio', async ({ page }) => {
  await page.goto('/treasury');
  await page.waitForSelector('[data-testid="btc-holdings"]');
  
  const holdings = await page.textContent('[data-testid="btc-holdings"]');
  expect(holdings).toContain('BTC');
});
```

## 📊 **Monitoring & Observability**

### Logging Standards
```typescript
// Structured logging
const logger = {
  info: (message: string, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  
  error: (message: string, error: Error, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};
```

### Performance Metrics
```typescript
// Track key metrics
const trackPerformance = (action: string, startTime: number) => {
  const duration = performance.now() - startTime;
  
  analytics.track('performance', {
    action,
    duration,
    timestamp: new Date().toISOString()
  });
};
```

### Error Tracking
```typescript
// Global error handler
window.addEventListener('error', (event) => {
  errorTracking.captureException(event.error, {
    tags: {
      platform: 'web',
      environment: process.env.NODE_ENV
    }
  });
});
```

## 🎨 **UI/UX Guidelines**

### Color System
```css
:root {
  /* Bitcoin brand colors */
  --bitcoin-orange: #f7931a;
  --bitcoin-orange-dark: #e6851a;
  
  /* Semantic colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Typography Scale
```css
/* Consistent type system */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
```

### Spacing System
```css
/* 8px grid system */
.space-1 { margin: 0.25rem; }  /* 4px */
.space-2 { margin: 0.5rem; }   /* 8px */
.space-4 { margin: 1rem; }     /* 16px */
.space-8 { margin: 2rem; }     /* 32px */
```

## 🔄 **State Management**

### Data Flow Patterns
```typescript
// Unidirectional data flow
const useDataFlow = () => {
  // 1. Fetch data
  const { data, loading, error } = useFetch('/api/treasury');
  
  // 2. Process data
  const processedData = useMemo(() => 
    data ? processData(data) : null, [data]
  );
  
  // 3. Handle actions
  const handleAction = useCallback((action) => {
    // Dispatch action
    // Update state
    // Trigger side effects
  }, []);
  
  return { processedData, loading, error, handleAction };
};
```

### Cache Management
```typescript
// SWR pattern for caching
const useCachedData = (key: string) => {
  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30 seconds
  });
};
```

## 📝 **Documentation Standards**

### Code Comments
```typescript
/**
 * Calculates the Bitcoin-per-share ratio for treasury holdings
 * 
 * @param totalBtc - Total BTC holdings in the treasury
 * @param shareCount - Total number of outstanding shares
 * @returns The BTC-per-share ratio
 * 
 * @example
 * ```typescript
 * const bps = calculateBPS(100, 1000000);
 * console.log(bps); // 0.0001
 * ```
 */
const calculateBPS = (totalBtc: number, shareCount: number): number => {
  if (shareCount === 0) throw new Error('Share count cannot be zero');
  return totalBtc / shareCount;
};
```

### README Structure
```markdown
# Component Name

Brief description of what this component does.

## Usage

```typescript
import { Component } from './Component';

<Component data={data} onAction={handleAction} />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | DataType | Yes | Component data |
| onAction | Function | Yes | Action handler |

## Examples

### Basic Usage
[Example code]

### Advanced Usage
[Example code]
```

Remember: **Every line of code should serve the mission of building the world's premier Bitcoin-native financial ecosystem.** 