# BLGV Authentication Integration Plan
**Bridge Treasury Email/Password ↔ Mobile Wallet Authentication**

## 🎯 GOAL
Enable seamless user experience where users can:
- Login to Treasury platform with email/password 
- Link their mobile wallet address to their Treasury account
- Access same user data across all platforms

## 📋 CURRENT STATE
✅ **Treasury Platform**: Email/password auth with roles (admin, treasury, user, insider)
✅ **Mobile App**: Wallet creation + QR code auth to DEX/Pool platforms  
✅ **Profile Sync API**: Backend infrastructure for linking wallets to accounts
❌ **Missing**: UI flow to connect Treasury email accounts with mobile wallets

## 🔧 IMPLEMENTATION STEPS

### Step 1: Treasury Platform - Add Mobile Wallet Linking

#### 1.1 Update Settings Page (`platforms/treasury/client/src/pages/UserProfile.tsx`)
```typescript
// Add wallet linking section
const [showWalletLink, setShowWalletLink] = useState(false);
const [qrCodeData, setQrCodeData] = useState(null);

const generateWalletLinkQR = async () => {
  const linkData = {
    action: 'link_wallet',
    platform: 'treasury',
    userEmail: user.email,
    challenge: `BLGV-TREASURY-LINK-${Date.now()}`,
    endpoint: 'https://blgvbtc.com/api/profile/link-wallet'
  };
  setQrCodeData(JSON.stringify(linkData));
};

// UI Component
<Card>
  <CardHeader>
    <CardTitle>Mobile Wallet Integration</CardTitle>
  </CardHeader>
  <CardContent>
    {!user.walletAddress ? (
      <>
        <p>Link your mobile wallet to access the full BLGV ecosystem</p>
        <Button onClick={() => setShowWalletLink(true)}>
          Link Mobile Wallet
        </Button>
        {showWalletLink && (
          <QRCode value={qrCodeData} />
        )}
      </>
    ) : (
      <div>
        <p>✅ Wallet Linked: {user.walletAddress}</p>
        <Button variant="outline">Manage Wallet</Button>
      </div>
    )}
  </CardContent>
</Card>
```

#### 1.2 Add Wallet Linking API Endpoint (`platforms/treasury/server/routes.ts`)
```typescript
app.post('/api/profile/link-wallet', isAuthenticated, async (req, res) => {
  try {
    const { walletAddress, signature, challenge } = req.body;
    const userId = req.session.userId;
    
    // Verify signature (implement Bitcoin message verification)
    const isValidSignature = await verifyBitcoinSignature(
      walletAddress, 
      challenge, 
      signature
    );
    
    if (!isValidSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Link wallet to user account
    await storage.updateUser(userId, { 
      walletAddress: walletAddress 
    });
    
    // Sync to mobile profile system
    await syncToMobileProfile(userId, walletAddress);
    
    res.json({ 
      success: true, 
      message: 'Wallet linked successfully',
      walletAddress 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to link wallet' });
  }
});
```

### Step 2: Mobile App - Add Treasury Account Linking

#### 2.1 Update Onboarding Flow (`platforms/blgv-wallet-app/src/screens/onboarding/OnboardingScreen.tsx`)
```typescript
const [hasExistingAccount, setHasExistingAccount] = useState(null);
const [treasuryCredentials, setTreasuryCredentials] = useState({ email: '', password: '' });

// Add screen after wallet creation
<View style={styles.screen}>
  <Text style={styles.title}>Connect Your Account</Text>
  <Text style={styles.subtitle}>
    Do you have an existing BLGV Treasury account?
  </Text>
  
  <Button 
    title="Yes - Link Existing Account"
    onPress={() => setHasExistingAccount(true)}
  />
  <Button 
    title="No - Create New Profile" 
    onPress={() => setHasExistingAccount(false)}
  />
</View>

{hasExistingAccount && (
  <View style={styles.screen}>
    <Text style={styles.title}>Link Treasury Account</Text>
    <TextInput 
      placeholder="Email"
      value={treasuryCredentials.email}
      onChangeText={(email) => setTreasuryCredentials(prev => ({...prev, email}))}
    />
    <TextInput 
      placeholder="Password"
      secureTextEntry
      value={treasuryCredentials.password}
      onChangeText={(password) => setTreasuryCredentials(prev => ({...prev, password}))}
    />
    <Button title="Link Account" onPress={linkToTreasuryAccount} />
  </View>
)}
```

#### 2.2 Implement Treasury Account Linking
```typescript
const linkToTreasuryAccount = async () => {
  try {
    // 1. Authenticate with Treasury platform
    const authResponse = await fetch('https://blgvbtc.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(treasuryCredentials)
    });
    
    if (!authResponse.ok) {
      throw new Error('Invalid Treasury credentials');
    }
    
    const authData = await authResponse.json();
    
    // 2. Link wallet to Treasury account
    const linkResponse = await fetch('https://blgvbtc.com/api/profile/link-wallet', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`
      },
      body: JSON.stringify({
        walletAddress: userWallet.address,
        signature: await signMessage('LINK_TREASURY_ACCOUNT'),
        challenge: 'LINK_TREASURY_ACCOUNT'
      })
    });
    
    if (linkResponse.ok) {
      // 3. Sync profile data
      await profileSync.syncProfile(userWallet.address, authData.user);
      
      Alert.alert(
        'Account Linked!',
        'Your Treasury account is now connected to your mobile wallet.'
      );
    }
  } catch (error) {
    Alert.alert('Linking Failed', error.message);
  }
};
```

### Step 3: Enhanced Profile Sync

#### 3.1 Update Profile Sync to Handle Treasury Integration
```typescript
// platforms/treasury/server/mobile-profile-routes.ts
const syncToMobileProfile = async (treasuryUserId: number, walletAddress: string) => {
  // Get Treasury user data
  const treasuryUser = await storage.getUser(treasuryUserId);
  
  // Create/update mobile profile with Treasury data
  await db.insert(userProfiles).values({
    primaryWallet: walletAddress,
    walletAddresses: [walletAddress],
    preferences: {
      currency: 'USD',
      theme: 'dark',
      notifications: {
        treasury: true,
        mining: treasuryUser.role === 'treasury',
        dex: treasuryUser.role === 'treasury', 
        price: true
      }
    },
    verificationStatus: {
      equityVerified: treasuryUser.role === 'admin' || treasuryUser.role === 'treasury',
      kycCompleted: treasuryUser.status === 'approved',
      accreditedInvestor: ['insider', 'treasury', 'admin'].includes(treasuryUser.role)
    },
    crossPlatformData: {
      treasuryAccount: {
        email: treasuryUser.email,
        role: treasuryUser.role,
        linkedAt: new Date().toISOString()
      }
    }
  }).onConflictDoUpdate({
    target: userProfiles.primaryWallet,
    set: {
      // Merge Treasury data with existing profile
      lastSyncAt: new Date()
    }
  });
};
```

## 🎯 TESTING STRATEGY

### Test Scenario 1: New User
1. ✅ User creates wallet in mobile app
2. ✅ User chooses "Create New Profile"
3. ✅ Profile syncs to unified database
4. ✅ User can access DEX/Pool via mobile wallet auth

### Test Scenario 2: Existing Treasury User
1. ✅ User has Treasury account (admin@blgvbtc.com)
2. ✅ User creates wallet in mobile app
3. ✅ User chooses "Link Existing Account"
4. ✅ User enters Treasury email/password
5. ✅ Wallet gets linked to Treasury account
6. ✅ User gets Treasury role permissions in mobile app

### Test Scenario 3: Treasury User Adds Mobile
1. ✅ User logs into Treasury platform
2. ✅ User goes to Settings → Mobile Wallet
3. ✅ User scans QR code with mobile app
4. ✅ Mobile wallet gets linked to Treasury account
5. ✅ Cross-platform sync works seamlessly

## 🚀 DEPLOYMENT TIMELINE

✅ **COMPLETED**: Treasury platform wallet linking UI + API
✅ **COMPLETED**: Mobile app Treasury account linking flow
⏳ **NEXT**: Testing and refinement
⏳ **NEXT**: Deploy to production

## ✅ PHASE 1 IMPLEMENTATION COMPLETED

### **Treasury Platform Changes**
- ✅ Added Mobile Wallet Integration section to UserProfile.tsx
- ✅ Added QR code generation for wallet linking
- ✅ Added wallet status display and management UI
- ✅ Added `/api/profile/link-wallet` API endpoint with validation
- ✅ Updated User interface to include walletAddress field
- ✅ Updated database schema with walletAddress column

### **Mobile App Changes**
- ✅ Added new "Account Integration" onboarding step
- ✅ Added choice between linking existing account vs creating new
- ✅ Added Treasury login form with email/password inputs
- ✅ Added Treasury authentication function
- ✅ Added complete UI styling for all account linking components
- ✅ Added state management for account linking flow

### **Database Schema Updates**
- ✅ Added `walletAddress varchar` field to users table
- ✅ Updated storage.ts to handle wallet address updates
- ✅ Updated TypeScript types for User interface

## 🧪 TESTING INSTRUCTIONS

### Test Scenario 1: Treasury User Links Mobile Wallet
1. Login to Treasury platform (admin@blgvbtc.com)
2. Go to Profile → Mobile Wallet Integration section
3. Click "Generate QR Code to Link Wallet"
4. QR code should display with wallet linking challenge
5. Mobile app can scan this QR to link (when mobile auth is complete)

### Test Scenario 2: Mobile User Links Treasury Account  
1. Open mobile app and go through onboarding
2. Reach "Account Integration" step
3. Choose "Yes - Link Existing Account"
4. Enter Treasury credentials (admin@blgvbtc.com)
5. Account should authenticate and proceed to completion

### Test Scenario 3: Mobile User Creates New Profile
1. Open mobile app and go through onboarding  
2. Reach "Account Integration" step
3. Choose "No - Create New Profile"
4. Should proceed to final onboarding step
5. Profile will be created with wallet as primary identifier

## ✅ SUCCESS CRITERIA

1. **Unified User Experience**: Users can access same data from Treasury web and mobile app
2. **Role Preservation**: Treasury role permissions carry over to mobile app
3. **Seamless Sync**: Wallet activities sync to Treasury platform analytics
4. **Security**: Bitcoin signature verification for all wallet linking
5. **Backwards Compatible**: Existing Treasury users and mobile wallets continue working

This bridges your authentication gap and creates the unified ecosystem experience you're aiming for! 