# BLGV Design Specifications & Brand Guidelines
**For Design Team Meeting - Version 2.0**

## 🎨 **Executive Design Brief**

**Project**: BLGV Unified Bitcoin Ecosystem  
**Company**: Belgravia Hartford Capital Inc. (CSE: BLGV.V)  
**Objective**: Create a cohesive, professional, Bitcoin-first design system across all platforms  
**Target Audience**: Institutional investors, Bitcoin professionals, retail crypto users  

---

## 📱 **Platform Overview**

### **4 Primary Platforms**
1. **Treasury Intelligence** - https://blgvbtc.com (Executive Dashboard)
2. **DEX Trading** - https://dex.blgvbtc.com (Trading Platform)  
3. **Mining Pool** - https://pool.blgvbtc.com (Mining Operations)
4. **Mobile App** - iOS/Android (Unified Access)

### **Design Priority Order**
1. **Mobile App** (Primary focus - TestFlight ready)
2. **Treasury Intelligence** (Executive/investor facing)
3. **DEX Trading** (Professional trading interface)
4. **Mining Pool** (Operational dashboard)

---

## 🎯 **Core Design Principles**

### **1. Bitcoin-First Aesthetic**
- Professional, institutional-grade visual identity
- Bitcoin orange (#F7931A) as primary brand color
- Clean, modern typography that conveys trust and innovation
- Subtle Bitcoin iconography without being overly branded

### **2. Mobile-First Approach**
- All designs must work perfectly on mobile devices first
- Progressive enhancement for tablet and desktop
- Touch-friendly interfaces with proper target sizes
- Gesture-based navigation where appropriate

### **3. Financial Professional Standards**
- Clean data visualization with real-time updates
- Professional color schemes suitable for financial data
- High contrast for accessibility and readability
- Consistent spacing and typography hierarchy

### **4. Cross-Platform Consistency**
- Unified design language across all platforms
- Consistent component library and design tokens
- Harmonious user experience regardless of platform
- Shared visual identity and branding elements

---

## 🎨 **Visual Identity System**

### **Primary Color Palette**
```css
/* Bitcoin Orange - Primary Brand Color */
--bitcoin-primary: #F7931A;
--bitcoin-hover: #E68900;
--bitcoin-light: #FFF5E6;

/* Neutral Grays - Professional Foundation */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Semantic Colors */
--success: #22C55E;   /* Green for profits, gains */
--danger: #EF4444;    /* Red for losses, alerts */
--warning: #F59E0B;   /* Amber for warnings */
--info: #3B82F6;      /* Blue for information */
```

### **Theme System**
```css
/* Light Theme (Default) */
--background: #FFFFFF;
--surface: #F8F9FA;
--surface-elevated: #FFFFFF;
--text-primary: #1A1A1A;
--text-secondary: #6C757D;
--text-muted: #9CA3AF;
--border: #E5E7EB;

/* Dark Theme */
--background: #0F0F0F;
--surface: #1A1A1A;
--surface-elevated: #2A2A2A;
--text-primary: #FFFFFF;
--text-secondary: #E5E7EB;
--text-muted: #9CA3AF;
--border: #374151;
```

### **Typography System**
```css
/* Primary Font: Inter (Web) / San Francisco (iOS) / Roboto (Android) */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Typography Scale */
--text-xs: 0.75rem;     /* 12px - Captions, labels */
--text-sm: 0.875rem;    /* 14px - Body text, secondary */
--text-base: 1rem;      /* 16px - Body text, primary */
--text-lg: 1.125rem;    /* 18px - Large body, small headings */
--text-xl: 1.25rem;     /* 20px - Card titles, medium headings */
--text-2xl: 1.5rem;     /* 24px - Section headings */
--text-3xl: 1.875rem;   /* 30px - Page titles */
--text-4xl: 2.25rem;    /* 36px - Hero headings */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### **Spacing System**
```css
/* Consistent 8px grid system */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### **Border Radius System**
```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Modals */
--radius-full: 9999px;  /* Full rounded */
```

### **Shadow System**
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

---

## 📱 **Platform-Specific Design Requirements**

### **1. Mobile Application (Priority 1)**

#### **Key Screens to Design**
1. **Onboarding Flow** (3-4 screens)
   - Welcome screen with BLGV branding
   - Wallet creation/import options
   - Treasury account linking
   - Security setup (biometrics)

2. **Home Dashboard**
   - Live BTC price (large, prominent)
   - Stock prices (CSE, OTC, FRA)
   - Portfolio summary
   - Quick actions (send, receive, trade)

3. **Treasury Screen**
   - Company metrics dashboard
   - Holdings breakdown
   - NAV calculations
   - Acquisition timeline

4. **DEX Trading Screen**
   - Trading pairs list
   - Order book interface
   - Trading form
   - Portfolio balance

5. **Mining Screen**
   - Pool statistics
   - Earnings overview
   - Miner management

6. **Settings Screen**
   - Profile management
   - Security settings
   - Theme preferences
   - About/help

#### **Mobile Design Specifications**
- **Screen Sizes**: iPhone 12 Pro (390x844), iPhone SE (375x667), Large Android (414x896)
- **Touch Targets**: Minimum 44x44pt for all interactive elements
- **Navigation**: Tab bar with 5 primary sections
- **Gestures**: Pull-to-refresh, swipe navigation where appropriate
- **Safe Areas**: Proper handling of notches and home indicators

#### **Component Library Needed**
- Custom Tab Bar with Bitcoin iconography
- Price Display Cards (large, medium, small variants)
- Action Buttons (primary, secondary, ghost)
- Data Tables (mobile-optimized)
- Chart Components (line charts, pie charts)
- Modal/Sheet Components
- Form Input Components
- Loading States and Skeletons

### **2. Treasury Intelligence Platform**

#### **Executive Dashboard Requirements**
- **Hero Section**: Live BTC price, company valuation, key metrics
- **Stock Performance**: Real-time prices from all 3 exchanges
- **Treasury Holdings**: Bitcoin acquisition timeline, NAV analysis
- **Analytics**: Interactive charts, trend analysis
- **Reports**: Downloadable reports, screenshots capability

#### **Design Considerations**
- Professional, executive-appropriate aesthetic
- Large data visualizations optimized for presentations
- Print-friendly layouts for reports
- High information density without clutter
- Responsive design for various screen sizes

### **3. DEX Trading Platform**

#### **Trading Interface Requirements**
- **Order Book**: Real-time bid/ask display
- **Trading Form**: Buy/sell orders with validation
- **Portfolio View**: Asset balances, trading history
- **Market Data**: Price charts, volume indicators
- **Wallet Integration**: Seamless Bitcoin wallet connection

#### **Design Considerations**
- Professional trading platform aesthetics
- High contrast for easy data reading
- Fast visual feedback for trades
- Mobile-responsive trading interface
- Real-time data updates without jarring animations

### **4. Mining Pool Platform**

#### **Operations Dashboard Requirements**
- **Pool Statistics**: Hashrate, difficulty, blocks found
- **Miner Management**: Individual miner monitoring
- **Earnings Tracking**: Payouts, performance charts
- **Real-time Monitoring**: Live operational data

#### **Design Considerations**
- Technical, operations-focused interface
- Real-time data visualization
- Mobile-friendly for on-the-go monitoring
- Clear status indicators and alerts

---

## 🔧 **Component Design Specifications**

### **Buttons**
```css
/* Primary Button - Bitcoin Orange */
.btn-primary {
  background: var(--bitcoin-primary);
  color: white;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  min-height: 44px; /* Touch target */
}

/* Secondary Button - Outline */
.btn-secondary {
  background: transparent;
  color: var(--bitcoin-primary);
  border: 1px solid var(--bitcoin-primary);
  padding: 12px 24px;
  border-radius: var(--radius-md);
}

/* Ghost Button - Text Only */
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  padding: 12px 24px;
  border-radius: var(--radius-md);
}
```

### **Cards**
```css
/* Standard Card */
.card {
  background: var(--surface-elevated);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border);
}

/* Price Display Card */
.price-card {
  background: gradient or solid color;
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  text-align: center;
}
```

### **Navigation**
```css
/* Tab Bar (Mobile) */
.tab-bar {
  background: var(--surface-elevated);
  border-top: 1px solid var(--border);
  padding: var(--space-2) 0;
  height: 80px; /* Safe area compatible */
}

/* Tab Item */
.tab-item {
  min-width: 60px;
  min-height: 44px;
  padding: var(--space-2);
}
```

---

## 📊 **Data Visualization Guidelines**

### **Chart Color System**
```css
/* Price Charts */
--chart-green: #22C55E;     /* Positive/gains */
--chart-red: #EF4444;       /* Negative/losses */
--chart-bitcoin: #F7931A;   /* Bitcoin-specific data */
--chart-neutral: #6B7280;   /* Neutral/secondary data */

/* Multi-series Charts */
--chart-series-1: #F7931A;  /* Bitcoin orange */
--chart-series-2: #3B82F6;  /* Blue */
--chart-series-3: #22C55E;  /* Green */
--chart-series-4: #8B5CF6;  /* Purple */
--chart-series-5: #F59E0B;  /* Amber */
```

### **Chart Types Needed**
1. **Line Charts**: Price history, performance tracking
2. **Bar Charts**: Volume data, comparative metrics
3. **Pie Charts**: Portfolio allocation, asset distribution
4. **Candlestick Charts**: Trading data (DEX platform)
5. **Area Charts**: Cumulative data visualization

---

## 🎯 **Accessibility Requirements**

### **WCAG 2.1 AA Compliance**
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus states for all interactive elements
- **Alternative Text**: Descriptive alt text for all images and charts
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Semantic HTML and ARIA labels

### **Mobile Accessibility**
- **Touch Targets**: Minimum 44x44pt (iOS) / 48x48dp (Android)
- **Dynamic Type**: Support for large text sizes
- **Voice Control**: Compatible with iOS/Android voice commands
- **Reduced Motion**: Respect user's motion preferences

---

## 🌍 **Responsive Design Breakpoints**

```css
/* Mobile First Approach */
/* Base: 320px+ (Small mobile) */

/* Small mobile */
@media (min-width: 375px) { }

/* Large mobile */
@media (min-width: 414px) { }

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large desktop */
@media (min-width: 1440px) { }
```

---

## 🚀 **Implementation Priorities**

### **Phase 1: Mobile App (Immediate)**
1. Design system foundations (colors, typography, spacing)
2. Component library (buttons, cards, forms)
3. Key screen layouts (Home, Treasury, DEX)
4. Dark/light theme variants

### **Phase 2: Treasury Platform**
1. Executive dashboard layout
2. Data visualization components
3. Responsive design implementation
4. Print/export layouts

### **Phase 3: DEX & Pool Platforms**
1. Trading interface components
2. Operations dashboard layouts
3. Cross-platform consistency audit
4. Performance optimizations

---

## 📋 **Deliverables Needed**

### **Design Assets**
1. **Design System Documentation** (Figma/Sketch)
2. **Component Library** (Interactive prototypes)
3. **High-fidelity Mockups** (All key screens)
4. **Responsive Layout Variants**
5. **Icon Library** (Bitcoin-themed icons)
6. **Brand Assets** (Logos, illustrations)

### **Technical Specifications**
1. **CSS Design Tokens** (Variables file)
2. **Component Specifications** (Developer handoff)
3. **Animation Guidelines** (Micro-interactions)
4. **Accessibility Checklist**
5. **Implementation Guidelines**

### **Documentation**
1. **Style Guide** (Brand usage guidelines)
2. **Pattern Library** (UI patterns and components)
3. **Best Practices** (Do's and don'ts)
4. **Maintenance Guidelines** (Design system evolution)

---

## 🎨 **Brand Personality**

### **Adjectives**
- **Professional**: Institutional-grade quality
- **Trustworthy**: Reliable financial platform
- **Innovative**: Cutting-edge Bitcoin technology
- **Accessible**: User-friendly for all skill levels
- **Transparent**: Clear, honest communication

### **Avoid**
- Overly technical or intimidating
- Consumer crypto "meme" aesthetics
- Cluttered or overwhelming interfaces
- Generic financial app appearance
- Outdated or legacy design patterns

---

## 📱 **Technical Constraints**

### **Platform Limitations**
- **iOS**: Native design patterns, Human Interface Guidelines
- **Android**: Material Design considerations
- **Web**: Cross-browser compatibility
- **Performance**: Smooth animations, fast loading

### **Development Framework**
- **Mobile**: React Native + Expo
- **Web**: React + TypeScript
- **Styling**: Tailwind CSS + Custom CSS variables
- **Icons**: React Native Vector Icons / Heroicons

---

## 🔄 **Design Process**

### **Workflow**
1. **Discovery**: Review current designs and requirements
2. **Wireframing**: Low-fidelity layout exploration
3. **Design System**: Establish foundations and components
4. **High-Fidelity**: Detailed mockups and prototypes
5. **Review & Iterate**: Stakeholder feedback and refinement
6. **Handoff**: Developer-ready specifications

### **Timeline Suggestions**
- **Week 1**: Discovery and wireframing
- **Week 2**: Design system and component library
- **Week 3**: High-fidelity mockups (mobile focus)
- **Week 4**: Responsive variants and documentation
- **Week 5**: Review, iteration, and handoff

---

## 📞 **Contact & Next Steps**

### **Key Stakeholders**
- **Product Owner**: Mobile app TestFlight priority
- **Development Team**: React Native + React implementation
- **Company Leadership**: Professional, institutional focus

### **Immediate Questions for Designers**
1. What's your experience with Bitcoin/crypto design?
2. Can you provide examples of professional financial interfaces?
3. What's your process for design system creation?
4. How do you approach mobile-first responsive design?
5. What tools do you use for developer handoff?

---

*Document Version: 2.0*  
*Last Updated: July 17, 2025*  
*Prepared for: Design team meeting and implementation* 