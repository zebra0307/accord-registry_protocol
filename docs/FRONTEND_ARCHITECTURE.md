# Accord Registry - Frontend Architecture

## 🏗️ Complete Platform Architecture

### Core Features Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ACCORD REGISTRY PLATFORM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   MARKETPLACE   │  │   DEX / AMM     │  │   RETIREMENT    │              │
│  │                 │  │                 │  │                 │              │
│  │ • P2P Listings  │  │ • Liquidity     │  │ • Offset Credits│              │
│  │ • Buy/Sell      │  │   Pools         │  │ • Mint NFT Cert │              │
│  │ • Negotiate     │  │ • Swap Credits  │  │ • Track Impact  │              │
│  └─────────────────┘  │ • Add/Remove LP │  └─────────────────┘              │
│                       └─────────────────┘                                    │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   REGISTRY      │  │   MONITORING    │  │   ANALYTICS     │              │
│  │                 │  │                 │  │                 │              │
│  │ • Register Proj │  │ • DePIN Data    │  │ • Platform Stats│              │
│  │ • Verify        │  │ • IoT Sensors   │  │ • Volume Charts │              │
│  │ • Mint Credits  │  │ • Satellite     │  │ • Leaderboards  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Web Folder Architecture

```
web/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with providers
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles
│   │
│   ├── (public)/                     # Public routes (no wallet needed)
│   │   ├── explore/
│   │   │   └── page.tsx              # Browse all projects
│   │   ├── project/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Project detail page
│   │   ├── marketplace/
│   │   │   └── page.tsx              # View marketplace listings
│   │   ├── analytics/
│   │   │   └── page.tsx              # Platform statistics
│   │   └── map/
│   │       └── page.tsx              # Interactive H3 map
│   │
│   ├── (authenticated)/              # Requires wallet connection
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Role-based redirect
│   │   │   ├── developer/
│   │   │   │   └── page.tsx          # Developer dashboard
│   │   │   ├── validator/
│   │   │   │   └── page.tsx          # ACVA dashboard
│   │   │   └── government/
│   │   │       └── page.tsx          # BEE dashboard
│   │   │
│   │   ├── register/
│   │   │   └── page.tsx              # Register new project
│   │   │
│   │   ├── my-projects/
│   │   │   ├── page.tsx              # List user's projects
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Single project management
│   │   │       ├── mint/
│   │   │       │   └── page.tsx      # Mint credits
│   │   │       └── monitoring/
│   │   │           └── page.tsx      # Upload DePIN data
│   │   │
│   │   ├── wallet/
│   │   │   ├── page.tsx              # Token balances
│   │   │   ├── transfer/
│   │   │   │   └── page.tsx          # Transfer credits
│   │   │   └── retire/
│   │   │       └── page.tsx          # Retire & get certificate
│   │   │
│   │   ├── marketplace/
│   │   │   ├── create/
│   │   │   │   └── page.tsx          # Create new listing
│   │   │   ├── my-listings/
│   │   │   │   └── page.tsx          # Manage listings
│   │   │   └── [listingId]/
│   │   │       └── page.tsx          # Buy from listing
│   │   │
│   │   ├── dex/
│   │   │   ├── page.tsx              # DEX overview
│   │   │   ├── swap/
│   │   │   │   └── page.tsx          # Swap interface
│   │   │   ├── pools/
│   │   │   │   ├── page.tsx          # All pools
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx      # Create new pool
│   │   │   │   └── [poolId]/
│   │   │   │       ├── page.tsx      # Pool details
│   │   │   │       ├── add/
│   │   │   │       │   └── page.tsx  # Add liquidity
│   │   │   │       └── remove/
│   │   │   │           └── page.tsx  # Remove liquidity
│   │   │   └── my-positions/
│   │   │       └── page.tsx          # User's LP positions
│   │   │
│   │   └── verify/                   # Validator-only routes
│   │       ├── page.tsx              # Projects to verify
│   │       └── [projectId]/
│   │           └── page.tsx          # Verification form
│   │
│   └── api/                          # API routes
│       ├── ipfs/
│       │   └── upload/
│       │       └── route.ts          # IPFS upload handler
│       └── oracle/
│           └── depin/
│               └── route.ts          # DePIN data ingestion
│
├── components/
│   ├── ui/                           # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── toast.tsx
│   │
│   ├── layout/                       # Layout components
│   │   ├── Header.tsx                # Main navigation
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx               # Dashboard sidebar
│   │   ├── WalletButton.tsx          # Connect wallet
│   │   └── RoleGuard.tsx             # Role-based access
│   │
│   ├── project/                      # Project-related
│   │   ├── ProjectCard.tsx           # Summary card
│   │   ├── ProjectDetails.tsx        # Full details
│   │   ├── ProjectStatus.tsx         # Status badge
│   │   ├── ProjectForm.tsx           # Registration form
│   │   ├── LocationPicker.tsx        # Map-based location
│   │   └── VerificationTimeline.tsx  # Status history
│   │
│   ├── marketplace/                  # Marketplace components
│   │   ├── ListingCard.tsx           # Listing summary
│   │   ├── ListingForm.tsx           # Create listing
│   │   ├── BuyModal.tsx              # Purchase modal
│   │   ├── PriceChart.tsx            # Historical prices
│   │   └── FilterSidebar.tsx         # Filter options
│   │
│   ├── dex/                          # DEX components
│   │   ├── SwapInterface.tsx         # Token swap UI
│   │   ├── PoolCard.tsx              # Pool summary
│   │   ├── LiquidityForm.tsx         # Add/remove LP
│   │   ├── PositionCard.tsx          # User's LP position
│   │   ├── PriceImpact.tsx           # Slippage display
│   │   └── PoolChart.tsx             # TVL / Volume charts
│   │
│   ├── wallet/                       # Wallet components
│   │   ├── TokenBalance.tsx          # Credit balance
│   │   ├── TransferForm.tsx          # Transfer credits
│   │   ├── RetireForm.tsx            # Retirement form
│   │   └── CertificateCard.tsx       # Retirement NFT
│   │
│   ├── monitoring/                   # DePIN / Monitoring
│   │   ├── SatelliteViewer.tsx       # Sentinel-2 imagery
│   │   ├── NDVIChart.tsx             # Vegetation health
│   │   ├── IoTDataGrid.tsx           # Sensor readings
│   │   ├── HealthScore.tsx           # Ecosystem score
│   │   └── DataUploader.tsx          # Upload monitoring data
│   │
│   ├── analytics/                    # Charts and stats
│   │   ├── PlatformStats.tsx         # Global stats
│   │   ├── VolumeChart.tsx           # Trading volume
│   │   ├── LeaderboardTable.tsx      # Top projects
│   │   ├── ActivityFeed.tsx          # Recent transactions
│   │   └── ImpactMetrics.tsx         # Environmental impact
│   │
│   ├── map/                          # Map components
│   │   ├── H3Map.tsx                 # H3 hexagon map
│   │   ├── ProjectMarker.tsx         # Project location
│   │   ├── PolygonDrawer.tsx         # Draw project bounds
│   │   └── MapLegend.tsx             # Legend overlay
│   │
│   └── verification/                 # Validator components
│       ├── VerificationQueue.tsx     # Projects to review
│       ├── VerificationForm.tsx      # Approve/reject form
│       ├── DePINReview.tsx           # Review DePIN data
│       └── EscrowStatus.tsx          # Fee status
│
├── hooks/                            # Custom React hooks
│   ├── useProgram.ts                 # Anchor program instance
│   ├── useWallet.ts                  # Extended wallet hook
│   ├── useUserRole.ts                # Get user's role
│   ├── useProject.ts                 # Fetch project data
│   ├── useProjects.ts                # Fetch all projects
│   ├── useListing.ts                 # Fetch listing
│   ├── useListings.ts                # Fetch all listings
│   ├── usePool.ts                    # Fetch pool data
│   ├── usePools.ts                   # Fetch all pools
│   ├── useTokenBalance.ts            # Token balances
│   ├── useMonitoringData.ts          # DePIN data
│   ├── usePlatformStats.ts           # Global stats
│   └── useTransaction.ts             # TX builder helper
│
├── lib/                              # Utilities
│   ├── anchor/
│   │   ├── program.ts                # Program initialization
│   │   ├── pdas.ts                   # PDA derivation helpers
│   │   └── idl.ts                    # IDL types
│   │
│   ├── constants.ts                  # Program IDs, etc.
│   ├── utils.ts                      # General utilities
│   ├── format.ts                     # Number/date formatting
│   ├── ipfs.ts                       # IPFS client
│   └── h3.ts                         # H3 geospatial utilities
│
├── stores/                           # State management (Zustand)
│   ├── useWalletStore.ts             # Wallet state
│   ├── useProjectStore.ts            # Project cache
│   ├── useMarketplaceStore.ts        # Listings cache
│   ├── useDexStore.ts                # Pools cache
│   └── useNotificationStore.ts       # Toast notifications
│
├── providers/                        # Context providers
│   ├── WalletProvider.tsx            # Solana wallet adapter
│   ├── ProgramProvider.tsx           # Anchor program context
│   └── QueryProvider.tsx             # React Query provider
│
├── types/                            # TypeScript types
│   ├── project.ts                    # Project types
│   ├── listing.ts                    # Marketplace types
│   ├── pool.ts                       # DEX types
│   ├── user.ts                       # User/role types
│   └── monitoring.ts                 # DePIN types
│
├── styles/                           # Styling
│   └── theme.ts                      # Design tokens
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── anchor/                           # Anchor artifacts
│   └── idl/
│       ├── accord_registry.json      # IDL file
│       └── accord_registry.ts        # TypeScript IDL
│
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json
└── .env.local                        # Environment variables
```

---

## 🛒 Marketplace Implementation Detail

### Listing Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MARKETPLACE FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SELLER                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 1. createMarketplaceListing()                                           ││
│  │    • Set price per ton                                                  ││
│  │    • Set quantity                                                       ││
│  │    • Set expiry date                                                    ││
│  │    • Credits transferred to Listing Vault (escrow)                      ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                              ↓                                               │
│                                                                              │
│  LISTING ACCOUNT (On-Chain)                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ {                                                                       ││
│  │   project_id: "ICM-MH-2024-001",                                        ││
│  │   seller: "5abc...xyz",                                                 ││
│  │   vintage_year: 2024,                                                   ││
│  │   quantity_available: 500,                                              ││
│  │   price_per_ton: 15_000_000,  // 15 USDC                               ││
│  │   certification_standards: ["Gold Standard", "VCS"],                    ││
│  │   currency_mint: "USDC_MINT",                                           ││
│  │   expiry_date: 1735689600,                                              ││
│  │   is_active: true                                                       ││
│  │ }                                                                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                              ↓                                               │
│                                                                              │
│  BUYER                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 2. buyMarketplaceListing(amount)                                        ││
│  │    • Payment transferred: Buyer → Seller                                ││
│  │    • Credits transferred: Vault → Buyer                                 ││
│  │    • quantity_available decremented                                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                      OR                                                      │
│                                                                              │
│  SELLER                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 3. cancelMarketplaceListing()                                           ││
│  │    • Remaining credits returned: Vault → Seller                         ││
│  │    • Listing closed                                                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💱 DEX / AMM Implementation Detail

### Pool Mechanics (Constant Product AMM: x * y = k)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DEX ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LIQUIDITY POOL ACCOUNT                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Seeds: ["liquidity_pool", credit_mint, quote_mint]                      ││
│  │                                                                         ││
│  │ {                                                                       ││
│  │   credit_mint: ACCORD_TOKEN,        // Token A (Carbon Credits)         ││
│  │   quote_mint: USDC,                 // Token B (Quote Currency)         ││
│  │   credit_reserve: 10000,            // Credits in pool                  ││
│  │   quote_reserve: 150000,            // USDC in pool                     ││
│  │   lp_token_supply: 12247,           // sqrt(10000 * 150000)             ││
│  │   fee_bps: 30,                      // 0.3% fee                         ││
│  │   authority: PDA,                                                       ││
│  │ }                                                                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                                                                              │
│  OPERATIONS                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │  1. initializePool(fee_bps)                                             ││
│  │     • Create pool PDA                                                   ││
│  │     • Create LP token mint                                              ││
│  │     • Set fee (0.3% default)                                            ││
│  │                                                                         ││
│  │  2. addLiquidity(credit_amount, quote_amount)                           ││
│  │     • Transfer tokens to pool vaults                                    ││
│  │     • Mint LP tokens to provider                                        ││
│  │     • LP = sqrt(credit_amount * quote_amount) for first deposit         ││
│  │     • LP = min(credit/reserve * supply, quote/reserve * supply) after   ││
│  │                                                                         ││
│  │  3. removeLiquidity(lp_amount)                                          ││
│  │     • Burn LP tokens                                                    ││
│  │     • Return proportional share of both tokens                          ││
│  │     • credit_out = lp_amount / supply * credit_reserve                  ││
│  │     • quote_out = lp_amount / supply * quote_reserve                    ││
│  │                                                                         ││
│  │  4. swap(amount_in, min_amount_out)                                     ││
│  │     • x * y = k (constant product)                                      ││
│  │     • amount_out = (reserve_out * amount_in) / (reserve_in + amount_in) ││
│  │     • Apply fee: amount_out * (1 - fee_bps/10000)                       ││
│  │     • Slippage protection via min_amount_out                            ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pool Creation UI Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CREATE POOL PAGE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  CREATE LIQUIDITY POOL                                               │   │
│  │                                                                       │   │
│  │  Token A (Carbon Credit):                                            │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ ACCORD (Accord Carbon Credits)                      [Select] v │ │   │
│  │  │ Balance: 5,000 ACCORD                                          │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  Token B (Quote Currency):                                           │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │ USDC (USD Coin)                                     [Select] v │ │   │
│  │  │ Balance: 10,000 USDC                                           │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  Initial Liquidity:                                                  │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                   │   │
│  │  │ 1000 ACCORD         │  │ 15000 USDC          │                   │   │
│  │  └─────────────────────┘  └─────────────────────┘                   │   │
│  │                                                                       │   │
│  │  Initial Price: 15 USDC per ACCORD                                   │   │
│  │  Fee Tier: [0.3%] [0.5%] [1.0%]                                      │   │
│  │                                                                       │   │
│  │  You will receive: ~3,872 LP tokens                                  │   │
│  │                                                                       │   │
│  │  [Create Pool]                                                       │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Credit Retirement Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RETIREMENT FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  USER                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ retireCredits(amount, retirement_id)                                    ││
│  │                                                                         ││
│  │ 1. Burn carbon credit tokens                                            ││
│  │ 2. Mint retirement certificate NFT (soulbound, non-transferable)        ││
│  │ 3. Record on-chain: amount, date, beneficiary                           ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│                              ↓                                               │
│                                                                              │
│  RETIREMENT CERTIFICATE (NFT)                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ ┌─────────────────────────────────────────────────────────────────────┐ ││
│  │ │                                                                     │ ││
│  │ │  🌿 CARBON RETIREMENT CERTIFICATE 🌿                               │ ││
│  │ │                                                                     │ ││
│  │ │  Certificate ID: RET-2024-001                                       │ ││
│  │ │  Amount Retired: 100 tCO2e                                          │ ││
│  │ │  Date: December 27, 2024                                            │ ││
│  │ │  Project: ICM-MH-2024-001 (Mangrove Restoration)                    │ ││
│  │ │  Beneficiary: 5abc...xyz                                            │ ││
│  │ │                                                                     │ ││
│  │ │  This certificate is immutable and soulbound.                       │ ││
│  │ │  Verify: https://accord.registry/verify/RET-2024-001                │ ││
│  │ │                                                                     │ ││
│  │ └─────────────────────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Analytics Dashboard

### Key Metrics to Display

| Category | Metrics | Data Source |
|----------|---------|-------------|
| **Platform** | Total Projects, Total Credits, TVL | GlobalRegistry, PlatformStats |
| **Trading** | 24h Volume, Price, Market Cap | Pool reserves, Trade events |
| **Environmental** | CO2 Offset, Active Projects | Retirement events, Project status |
| **Geographic** | Projects by Country, H3 Coverage | Project.location, Registry |

---

## 🔧 Implementation Order

### Phase 1: Core Infrastructure
1. ✅ Project scaffolding with Next.js 14
2. ✅ Wallet connection (Solana Wallet Adapter)
3. ✅ Program provider setup
4. ✅ Basic UI components (shadcn/ui)

### Phase 2: Public Pages
1. Landing page
2. Project explorer
3. Interactive map
4. Platform analytics

### Phase 3: Developer Features
1. Project registration form
2. Mint credits page
3. Create marketplace listing
4. DEX swap interface

### Phase 4: Validator Features
1. Verification queue
2. DePIN data review
3. Verification form

### Phase 5: Government Features
1. Compliance approval page
2. LoA issuance
3. Export authorization

### Phase 6: Advanced DEX
1. Pool creation
2. Add/remove liquidity
3. LP positions dashboard

### Phase 7: Polish
1. Notifications & toasts
2. Transaction history
3. Mobile responsive
4. Performance optimization
