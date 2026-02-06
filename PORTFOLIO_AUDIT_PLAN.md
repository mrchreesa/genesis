# Portfolio Projects Audit & Remediation Plan
**Date:** February 5, 2026  
**Auditor:** Kimmy  
**Projects Analyzed:** 6 (Nutri-Tracker → Aetos)

---

## 📊 Executive Summary

| Project | Severity | Status | Est. Hours |
|---------|----------|--------|------------|
| 3. Nutri-Tracker | 🔴 Critical | Outdated, security risks | 8-12h |
| 4. NFT Marketplace | 🟡 Moderate | Web3 dependencies aging | 6-10h |
| 5. Vitus (Counselling) | 🟢 Low | Well maintained | 2-4h |
| 6. Coin Spy | 🔴 Critical | API deprecated, auth issues | 8-12h |
| 7. E-Commerce Store | 🟡 Moderate | Next.js 12 outdated | 4-6h |
| 8. Aetos Restaurant | 🔴 Critical | Next.js 11 EOL, security | 10-14h |

**Total Estimated Effort:** 38-58 hours

---

## 🔴 Project 3: Nutri-Tracker App
**Severity:** CRITICAL | **Live:** nutri-trackerr.vercel.app

### Issues Identified

#### 1. **Deprecated Dependencies (CRITICAL)**
- React 17.0.2 (Current: 19.x) - 2 major versions behind
- Material-UI v4 (Current: v6) - No longer maintained
- Chart.js v2 (Current: v4) - Breaking changes
- axios 0.24.0 has known security vulnerabilities

#### 2. **Backend Dependency Risk (CRITICAL)**
```javascript
// Current hardcoded backend URL:
"https://nutri-tracker-app-backend.vercel.app"
```
- If backend is down or URL changes, app fails completely
- No fallback mechanism
- No health check

#### 3. **API Key Exposure Risk (HIGH)**
- Spoonacular API key likely hardcoded or in insecure storage
- No rate limiting handling
- No API key rotation mechanism

#### 4. **Security Vulnerabilities (HIGH)**
- `react-scripts 5.0.1` has 50+ transitive vulnerabilities
- No Content Security Policy (CSP)
- Missing security headers
- No input sanitization visible

#### 5. **Performance Issues (MEDIUM)**
- No code splitting
- Large bundle size (Material-UI v4 is heavy)
- No lazy loading for charts
- Images not optimized

### Remediation Plan

#### Phase 1: Security & Stability (Priority 1)
1. **Audit & Update Dependencies**
   ```bash
   npm audit --audit-level=moderate
   npm update
   ```
   - Update axios to ^1.6.0
   - Migrate Material-UI v4 → v5 (or better: migrate to Tailwind + Radix)
   - Update Chart.js v2 → v4

2. **Environment Configuration**
   ```env
   REACT_APP_API_BASE_URL=https://nutri-tracker-app-backend.vercel.app
   REACT_APP_SPOONACULAR_API_KEY=
   REACT_APP_FALLBACK_MODE=false
   ```

3. **Add Error Boundaries & Fallbacks**
   - Implement React Error Boundary
   - Add backend health check on app load
   - Graceful degradation when backend is down

#### Phase 2: Migration (Priority 2)
1. **React 17 → 18 Migration**
   - Update ReactDOM.render to createRoot
   - Check for StrictMode compatibility issues
   - Test all lifecycle methods

2. **Material-UI v4 → v5 Migration**
   - Run codemod: `npx @mui/codemod v5.0.0/preset-safe src`
   - Update theme configuration
   - Replace deprecated components (Hidden, makeStyles)

3. **Chart.js Migration**
   - v2 → v4 has breaking API changes
   - Update chart configuration objects
   - Test all chart types

#### Phase 3: Enhancements (Priority 3)
1. **Performance Optimization**
   - Implement React.lazy() for route-based code splitting
   - Add service worker for offline support
   - Optimize images with WebP format

2. **Modern Development Setup**
   - Migrate from react-scripts to Vite (faster builds)
   - Add TypeScript for type safety
   - Implement proper testing (Jest + React Testing Library)

### Questions for Confirmation:
1. **Is the backend (`nutri-tracker-app-backend`) still maintained?** If not, we need to either revive it or mock it for demo purposes.
2. **Do you have the Spoonacular API key?** We need to verify it's still active.
3. **Should we keep Material-UI or migrate to Tailwind CSS?** (Tailwind is lighter and more modern)

---

## 🟡 Project 4: NFT Marketplace
**Severity:** MODERATE | **Live:** new-elements-marketplace.vercel.app

### Issues Identified

#### 1. **Web3 Dependencies Aging (HIGH)**
- `ethers v5.7.2` (Current: v6.x) - v6 has 40% smaller bundle
- `wagmi v1.3.10` (Current: v2.x) - Major API changes
- `@rainbow-me/rainbowkit v1.0.9` (Current: v2.x)
- Both packages have breaking changes in v2

#### 2. **Headless UI Version Risk (MEDIUM)**
```json
"@headlessui/react": "^0.0.0-insiders.159f04d"
```
- Using an insider/canary build
- Not production-stable
- Should upgrade to stable v1.x or v2.x

#### 3. **IPFS Client Deprecated (MEDIUM)**
- `ipfs-http-client v60.0.1` is deprecated
- Recommended: `kubo-rpc-client` or `helia`

#### 4. **Smart Contract Hardcoding (MEDIUM)**
- Contract addresses likely hardcoded
- No network switching validation
- Missing contract ABI versioning

#### 5. **Missing Error Handling (MEDIUM)**
- Web3 transactions lack proper error boundaries
- No handling for rejected wallet connections
- Missing retry logic for failed IPFS uploads

### Remediation Plan

#### Phase 1: Web3 Stack Modernization (Priority 1)
1. **Upgrade Web3 Dependencies**
   ```bash
   npm install wagmi@latest viem@latest @rainbow-me/rainbowkit@latest
   ```
   - Migrate from ethers v5 to viem (recommended by wagmi)
   - Update wagmi v1 → v2 (requires config changes)
   - Update RainbowKit v1 → v2

2. **Configuration Updates**
   - Update `wagmi.ts` config for v2
   - Replace `configureChains` with new API
   - Update connectors configuration

#### Phase 2: Stability (Priority 2)
1. **Fix Headless UI**
   ```bash
   npm install @headlessui/react@latest
   ```
   - Replace insider build with stable v2
   - Update component imports if needed

2. **IPFS Migration**
   - Evaluate: `kubo-rpc-client` vs `helia`
   - For simple uploads: Pinata SDK is easier
   - Update upload logic

#### Phase 3: Smart Contract Safety (Priority 3)
1. **Contract Management**
   ```typescript
   // Create config/contracts.ts
   export const CONTRACTS = {
     [chainId]: {
       marketplace: "0x...",
       nft: "0x...",
       version: "1.0.0"
     }
   };
   ```

2. **Add Error Boundaries**
   - Wallet connection errors
   - Transaction failures
   - Network mismatch handling

### Questions for Confirmation:
1. **Are the smart contracts still deployed and active?** Which networks (Mainnet, Sepolia, Polygon)?
2. **Which IPFS provider are you using?** (Pinata, Infura, local node?)
3. **Do you want to keep the current wallet connection flow?** RainbowKit v2 has a new UI.

---

## 🟢 Project 5: Vitus (Counselling Site)
**Severity:** LOW | **Live:** centrevitus.com

### Issues Identified

#### 1. **Sanity Client Configuration (LOW)**
- Using `@sanity/client` implicitly through `next-sanity`
- No Sanity API version pinned (can break with updates)

#### 2. **Minor Package Updates (LOW)**
- `next-intl v3.5.4` (Current: v3.26+) - patch updates available
- `framer-motion v11.0.6` (Current: v12.x) - major version available

#### 3. **No Critical Issues Found**
- Well-structured Next.js 14 app
- Proper environment variable handling
- Good component organization

### Remediation Plan

#### Phase 1: Maintenance (Priority 1)
1. **Pin Sanity API Version**
   ```typescript
   // sanity.config.ts
   export const client = createClient({
     apiVersion: '2024-02-05', // Pin to specific date
     // ...
   });
   ```

2. **Update Dependencies**
   ```bash
   npm update
   ```

#### Phase 2: Optional Enhancements (Priority 2)
1. **Add ISR Revalidation**
   ```typescript
   // For blog posts
   export const revalidate = 3600; // 1 hour
   ```

2. **Performance**
   - Add `next/image` priority to above-fold images
   - Implement `prefetch` for internal links

### Questions for Confirmation:
1. **Is the Sanity project still active?** Any schema changes planned?
2. **Do you need multi-language support expanded?** Currently has `next-intl` set up.

---

## 🔴 Project 6: Coin Spy
**Severity:** CRITICAL | **Live:** coin-spy.krisrahnev.com

### Issues Identified

#### 1. **CoinGecko API Deprecated (CRITICAL)**
```typescript
// Current implementation
`https://api.coingecko.com/api/v3/coins/markets?...`
```
- CoinGecko deprecated their public API (no API key)
- Now requires API key with rate limits
- **Current implementation WILL FAIL**

#### 2. **Firebase Version Risk (CRITICAL)**
- `firebase v9.11.0` - several major versions behind
- v9 is modular but v10+ has security patches
- Authentication patterns may have changed

#### 3. **PropelAuth Integration (HIGH)**
- `@propelauth/react v1.3.2` - check if still active
- Authentication service dependency
- If PropelAuth changed APIs, auth breaks

#### 4. **Axios Vulnerability (HIGH)**
- `axios v0.27.2` has known CVEs
- Must update to v1.6+

#### 5. **React Router v6 Changes (MEDIUM)**
- Using `react-router-dom v6.4.1`
- Some patterns might be deprecated in v6.20+

### Remediation Plan

#### Phase 1: API Migration (Priority 1 - URGENT)
1. **CoinGecko API Fix**
   - Sign up for free CoinGecko API key at coingecko.com
   - Update all API calls to include `x-cg-demo-api-key` header
   - Implement rate limiting (10-30 calls/min on free tier)
   
   ```typescript
   // lib/api.ts
   const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY;
   
   export const getCoins = async () => {
     const response = await axios.get(
       `${BASE_URL}/coins/markets?vs_currency=usd`,
       { headers: { 'x-cg-demo-api-key': API_KEY } }
     );
     return response.data;
   };
   ```

2. **Fallback API Strategy**
   - Consider adding CoinMarketCap as backup
   - Implement local caching to reduce API calls
   - Add "demo mode" with static data if APIs fail

#### Phase 2: Auth & Firebase (Priority 2)
1. **Firebase v9 → v10 Migration**
   ```bash
   npm install firebase@latest
   ```
   - v9 to v10 is mostly compatible (modular API)
   - Update initialization code
   - Test authentication flows

2. **PropelAuth Verification**
   - Check PropelAuth dashboard for API changes
   - Update to latest SDK version
   - Test login/logout flows

#### Phase 3: Security (Priority 3)
1. **Update axios**
   ```bash
   npm install axios@latest
   ```

2. **Environment Variables**
   ```env
   REACT_APP_COINGECKO_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_API_KEY=
   REACT_APP_PROPEL_AUTH_URL=
   ```

### Questions for Confirmation:
1. **Do you have a CoinGecko API key?** If not, we need to register (free tier available).
2. **Is PropelAuth still your preferred auth solution?** Or should we migrate to Firebase Auth or Clerk?
3. **Is this app actively used?** If it's a demo, we could implement mock data mode.

---

## 🟡 Project 7: E-Commerce Store
**Severity:** MODERATE | **Live:** e-commerce-store-omega.vercel.app

### Issues Identified

#### 1. **Next.js 12 Deprecated (HIGH)**
- Next.js 12.2.2 is 2 major versions behind
- Next.js 15 is current
- Missing App Router benefits (RSC, Server Components)

#### 2. **Stripe SDK Version (MEDIUM)**
- `@stripe/react-stripe-js v1.9.0` (Current: v3.x)
- `stripe v9.16.0` (Current: v17.x)
- Stripe often deprecates old API versions

#### 3. **Styled Components + MUI Conflict (MEDIUM)**
- Using both MUI styled-components AND standalone styled-components
- `@mui/styled-engine-sc` can cause conflicts
- Next.js 12 has known issues with styled-components SSR

#### 4. **Hygraph CMS Dependency (MEDIUM)**
- Using `graphql-request` for Hygraph
- No error handling for CMS downtime
- No caching strategy

#### 5. **Missing Modern Features (LOW)**
- No image optimization with `next/image`
- No incremental static regeneration
- No middleware for auth/protection

### Remediation Plan

#### Phase 1: Next.js Migration (Priority 1)
1. **Next.js 12 → 14/15 Migration**
   ```bash
   npm install next@latest react@latest react-dom@latest
   ```
   
   Breaking changes to address:
   - `next/image` import changes
   - `getServerSideProps` behavior changes
   - Webpack 5 configuration (if custom)

2. **Pages Router → App Router (Optional)**
   - Gradual migration possible
   - Move `/pages` to `/app`
   - Convert `getServerSideProps` to Server Components

#### Phase 2: Stripe Update (Priority 2)
1. **Update Stripe SDKs**
   ```bash
   npm install @stripe/react-stripe-js@latest @stripe/stripe-js@latest stripe@latest
   ```

2. **API Version Check**
   - Verify Stripe dashboard API version compatibility
   - Update webhook handlers if needed
   - Test checkout flow thoroughly

#### Phase 3: Styling Cleanup (Priority 3)
1. **Remove Styled Components Duplication**
   - Choose one: MUI styled-components OR standalone
   - Recommend: MUI with Emotion (default, lighter)
   ```bash
   npm uninstall @mui/styled-engine-sc styled-components
   npm install @mui/styled-engine
   ```

#### Phase 4: Performance (Priority 4)
1. **Add ISR for Products**
   ```typescript
   export const revalidate = 3600; // Rebuild every hour
   ```

2. **Image Optimization**
   - Replace `<img>` with `<Image>` from next/image
   - Configure `next.config.js` for Hygraph images

### Questions for Confirmation:
1. **Is the Hygraph CMS project still active?** Are products being updated there?
2. **Is Stripe still the preferred payment provider?** Any subscription features planned?
3. **Should we migrate to App Router or keep Pages Router?** App Router offers better performance but requires more changes.

---

## 🔴 Project 8: Aetos Restaurant
**Severity:** CRITICAL | **Live:** aetostaverna.co.uk

### Issues Identified

#### 1. **Next.js 11 End-of-Life (CRITICAL)**
- Next.js 11.1.0 is 4 major versions behind
- No longer receiving security patches
- Webpack 4 (old)
- No React 18 support
- Multiple breaking changes to migrate

#### 2. **React 17 Deprecated (CRITICAL)**
- React 17.0.2 is 2 major versions behind
- Missing React 18 performance features (Concurrent Rendering)
- Many libraries dropping React 17 support

#### 3. **Chakra UI v1 Deprecated (HIGH)**
- `@chakra-ui/react v1.6.6` (Current: v3.x)
- v1 no longer maintained
- v2 has breaking changes (ESM only)
- v3 is complete rewrite

#### 4. **Framer Motion v4 Deprecated (MEDIUM)**
- `framer-motion v4.1.17` (Current: v12.x)
- API changes in v5+ and v10+
- May have compatibility issues with React 18

#### 5. **ESLint Version Conflict (MEDIUM)**
```json
"eslint": "7.32.0"
"eslint-config-next": "11.1.0"
```
- Outdated ESLint rules
- Missing modern React/Next.js lint rules

#### 6. **Image Case Sensitivity Issues (LOW)**
```
'assets/homepage/burger.JPG' collides with 'assets/homepage/burger.jpg'
```
- Git warning about case-sensitive paths
- Can cause issues on case-insensitive filesystems (macOS/Windows)

### Remediation Plan

#### Phase 1: Full Stack Modernization (Priority 1 - URGENT)
1. **Create Fresh Next.js 15 Project**
   ```bash
   npx create-next-app@latest aetos-v2
   ```
   - This is safer than incremental migration due to 4-version gap
   - Migrate components one by one
   - Keep old project as reference

2. **React 17 → 18 Migration**
   - Update hydration methods
   - Check for `ReactDOM.render` usages
   - Test all interactive components

#### Phase 2: UI Framework Decision (Priority 2)
**Decision Point:** Chakra UI has changed significantly

**Option A: Stay with Chakra v3** (Recommended)
```bash
npm install @chakra-ui/react@latest @emotion/react @emotion/styled framer-motion
```
- Pros: Familiar API, good restaurant template ecosystem
- Cons: Major rewrite needed, v3 is very different

**Option B: Migrate to Tailwind + Radix UI** (Modern, lightweight)
```bash
npm install tailwindcss @radix-ui/react-dialog @radix-ui/react-form
```
- Pros: Better performance, more customizable
- Cons: Need to rebuild components

#### Phase 3: Component Migration (Priority 3)
1. **Migrate pages one by one:**
   - Home (with image gallery)
   - Menu
   - Contact (with form)
   - About

2. **Update Image Handling**
   ```typescript
   // Use next/image properly
   import Image from 'next/image';
   
   <Image 
     src="/homepage/burger.jpg" 
     alt="Burger"
     width={800}
     height={600}
     priority // for above-fold images
   />
   ```

3. **Fix Image Case Issues**
   ```bash
   # Standardize all extensions to lowercase .jpg
   mv burger.JPG burger.jpg
   ```

#### Phase 4: Form Handling (Priority 4)
1. **Update Contact Form**
   ```typescript
   // Using react-hook-form v7 (still current)
   // Just needs React 18 compatibility check
   ```

2. **Nodemailer Update**
   ```bash
   npm install nodemailer@latest
   ```
   - Test email sending after migration
   - Update SMTP configuration if needed

#### Phase 5: SEO & Performance (Priority 5)
1. **Keep next-seo or use Next.js built-in metadata**
   ```typescript
   // app/layout.tsx (App Router)
   export const metadata = {
     title: 'Aetos Restaurant',
     description: '...',
   };
   ```

2. **Add Performance Optimizations**
   - Font optimization with `next/font`
   - Image optimization
   - Core Web Vitals monitoring

### Questions for Confirmation:
1. **Is the restaurant still operating?** If not, should we archive this or keep it as a demo?
2. **Do you receive contact form submissions?** Need to verify nodemailer still works.
3. **UI Framework preference:** Stick with Chakra or migrate to Tailwind? (Tailwind is more future-proof)
4. **Pages Router or App Router?** App Router offers better performance but requires more migration work.

---

## 📋 Implementation Strategy

### Recommended Order:
1. **Vitus** (Quick win - 2-4h, already works well)
2. **Coin Spy** (Urgent - API is broken, 8-12h)
3. **E-Commerce** (Moderate - 4-6h)
4. **Nutri-Tracker** (Heavy - 8-12h)
5. **NFT Marketplace** (Web3 complexity - 6-10h)
6. **Aetos** (Full rewrite - 10-14h)

### Resources Needed:
- **API Keys:** CoinGecko, Firebase, PropelAuth (for Coin Spy)
- **Backend Access:** Nutri-Tracker backend verification
- **CMS Access:** Hygraph (E-Commerce), Sanity (Vitus)
- **Design Assets:** Original Figma/design files if available

---

## ❓ Pre-Implementation Questions

Please confirm:

1. **Budget/Time:** Should we fix all projects or prioritize specific ones?
2. **Live Sites:** Can we take sites down for maintenance or should we use staging?
3. **Backend Dependencies:** Which backends are still maintained?
4. **API Keys:** Do you have access to all API keys and can share them securely?
5. **Design Changes:** Any UI/UX updates wanted, or strictly technical fixes?
6. **Hosting:** All on Vercel - should we set up staging environments?

---

## ✅ Acceptance Criteria

Each project will be considered complete when:
- [ ] All dependencies updated to latest stable versions
- [ ] `npm audit` shows zero high/critical vulnerabilities
- [ ] `npm run build` completes without errors
- [ ] All existing features work (manual QA checklist)
- [ ] Performance score 90+ on Lighthouse
- [ ] No console errors in production build
- [ ] Mobile responsiveness verified
- [ ] README updated with setup instructions

---

**Ready for your review!** Please confirm the plan and priority order before we begin implementation.
