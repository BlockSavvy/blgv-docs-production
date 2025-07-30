# 📝 Coding Standards

Professional coding standards for the BLGV ecosystem.

## 🎯 **Core Principles**

### Bitcoin-First Development
- **No Hardcoded Data** - All data from regtest or production APIs
- **Real-Time First** - WebSocket-driven live updates
- **Security First** - Enterprise-grade security in every line
- **Mobile-First** - Design for mobile consumption first

### TypeScript Standards
```typescript
// ✅ Good - Strict typing
interface TreasuryData {
  btcHoldings: number;
  btcPerShare: number;
  lastUpdated: string;
  reserveProof: string;
}

// ❌ Bad - Any types
interface TreasuryData {
  data: any;
  info: any;
}
```

## 🗂️ **File Organization**

### Directory Structure
```
platform/
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript definitions
│   ├── config/           # Configuration files
│   └── sdk/              # SDK integration
```

### Naming Conventions
- **Files**: `kebab-case.ts` 
- **Components**: `PascalCase.tsx`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types**: `PascalCase`

## ⚛️ **React Standards**

### Component Structure
```typescript
interface ComponentProps {
  // Required props first
  data: DataType;
  onAction: (action: ActionType) => void;
  
  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Component: React.FC<ComponentProps> = ({
  data,
  onAction,
  variant = 'primary',
  className
}) => {
  const theme = useTheme();
  
  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      {/* Component implementation */}
    </div>
  );
};
```

### Hooks Standards
```typescript
// Custom hook pattern
const useBitcoinPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await blgvSDK.treasury.getBitcoinPrice();
        setPrice(response.data.usd);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrice();
  }, []);
  
  return { price, loading, error };
};
```

## 🎨 **Styling Standards**

### Tailwind CSS Approach
```typescript
// ✅ Good - Semantic class organization
const buttonStyles = {
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  variants: {
    primary: 'bg-bitcoin-orange text-white hover:bg-bitcoin-orange-dark',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  },
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
};

// ❌ Bad - Inline classes everywhere
<button className="inline-flex items-center justify-center rounded-md font-medium transition-colors bg-bitcoin-orange text-white hover:bg-bitcoin-orange-dark px-4 py-2 text-base">
```

### Theme Integration
```typescript
const useTheme = () => {
  const { theme } = useContext(ThemeContext);
  
  return {
    colors: {
      primary: theme === 'dark' ? '#f7931a' : '#d73027',
      background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      text: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    }
  };
};
```

## 🔌 **API Standards**

### Response Format
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId: string;
}

// Implementation
const handleAPICall = async <T>(
  endpoint: string
): Promise<APIResponse<T>> => {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    };
  }
};
```

### Error Handling
```typescript
// Centralized error handling
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const handleError = (error: unknown): APIError => {
  if (error instanceof APIError) return error;
  if (error instanceof Error) return new APIError(error.message, 500);
  return new APIError('Unknown error occurred', 500);
};
```

## 🔐 **Security Standards**

### Environment Variables
```typescript
// ✅ Good - Validated environment variables
const config = {
  apiKey: process.env.BLGV_API_KEY || (() => {
    throw new Error('BLGV_API_KEY is required');
  })(),
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || (() => {
    throw new Error('DATABASE_URL is required');
  })(),
};

// ❌ Bad - Direct process.env access
fetch(`${process.env.API_URL}/data`, {
  headers: { 'X-API-Key': process.env.API_KEY }
});
```

### Input Validation
```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  bitcoinAddress: z.string().regex(/^[a-zA-Z0-9]{26,35}$/),
});

const validateInput = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error.message}`);
  }
  return result.data;
};
```

## 🧪 **Testing Standards**

### Unit Test Structure
```typescript
describe('Bitcoin Price Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should fetch Bitcoin price successfully', async () => {
    // Arrange
    const mockPrice = 50000;
    jest.spyOn(blgvSDK.treasury, 'getBitcoinPrice').mockResolvedValue({
      success: true,
      data: { usd: mockPrice }
    });
    
    // Act
    const { result, waitForNextUpdate } = renderHook(() => useBitcoinPrice());
    await waitForNextUpdate();
    
    // Assert
    expect(result.current.price).toBe(mockPrice);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
```

## 📚 **Documentation Standards**

### JSDoc Comments
```typescript
/**
 * Calculates Bitcoin-per-share for the treasury
 * @param totalBtc - Total BTC holdings
 * @param shareCount - Total number of shares outstanding
 * @returns Bitcoin-per-share ratio
 * @throws {Error} When shareCount is zero
 * @example
 * ```typescript
 * const bps = calculateBitcoinPerShare(100, 1000000);
 * console.log(bps); // 0.0001
 * ```
 */
const calculateBitcoinPerShare = (
  totalBtc: number, 
  shareCount: number
): number => {
  if (shareCount === 0) {
    throw new Error('Share count cannot be zero');
  }
  return totalBtc / shareCount;
};
```

## 🚀 **Performance Standards**

### Bundle Optimization
```typescript
// ✅ Good - Dynamic imports
const LazyComponent = lazy(() => import('./HeavyComponent'));

// Code splitting by route
const TreasuryPage = lazy(() => import('../pages/TreasuryPage'));
const DEXPage = lazy(() => import('../pages/DEXPage'));

// ❌ Bad - Everything imported upfront
import HeavyComponent from './HeavyComponent';
import TreasuryPage from '../pages/TreasuryPage';
import DEXPage from '../pages/DEXPage';
```

### Memoization
```typescript
// Expensive calculations
const expensiveCalculation = useMemo(() => {
  return calculatePortfolioValue(holdings, prices);
}, [holdings, prices]);

// Callback optimization
const handleSubmit = useCallback((data: FormData) => {
  onSubmit(data);
}, [onSubmit]);
```

## 🔧 **Git Standards**

### Commit Messages
```
feat(treasury): add Bitcoin-per-share calculation
fix(dex): resolve WebSocket connection timeout
docs(readme): update installation instructions
refactor(sdk): simplify API response handling
test(pool): add mining reward calculation tests
```

### Branch Naming
- `feature/treasury-dashboard-redesign`
- `fix/dex-websocket-timeout`
- `docs/api-documentation-update`
- `refactor/sdk-consolidation`

## ✅ **Pre-commit Checklist**

- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] ESLint passes with no warnings
- [ ] No console.logs in production code
- [ ] Environment variables documented
- [ ] Security review completed
- [ ] Performance impact assessed
- [ ] Documentation updated 