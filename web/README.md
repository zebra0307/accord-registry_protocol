# Accord Registry - Web Frontend

A **Next.js 15** web application for the Accord Registry Protocol - a decentralized carbon credit registry on Solana.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Landing page
│   │   ├── explore/       # Project explorer
│   │   ├── marketplace/   # P2P marketplace
│   │   ├── map/          # Interactive project map
│   │   ├── dex/          # DEX trading
│   │   └── guide/        # System guide
│   └── (authenticated)/   # Protected routes
│       ├── dashboard/     # Role-based dashboards
│       │   ├── developer/ # Developer dashboard
│       │   ├── validator/ # Validator dashboard
│       │   ├── government/# Government dashboard
│       │   └── admin/    # SuperAdmin dashboard
│       ├── register/     # Project registration
│       ├── wallet/       # Wallet management
│       ├── my-projects/  # User's projects
│       └── settings/     # User settings & KYC
│           └── kyc/      # KYC verification
├── components/            # React components
│   ├── layout/           # Header, Footer, etc.
│   ├── ui/               # Reusable UI components
│   └── solana/           # Wallet components
├── providers/            # Context providers
│   ├── WalletContextProvider.tsx
│   └── ProgramProvider.tsx
├── stores/               # Zustand state management
│   ├── useWalletStore.ts # Wallet & role state
│   └── useKYCStore.ts    # KYC verification state
├── lib/                  # Utilities
└── styles/               # Global styles
```

## 🎨 Features

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, features, how it works |
| Explore | `/explore` | Browse all carbon credit projects |
| Marketplace | `/marketplace` | P2P carbon credit trading |
| Map | `/map` | Interactive global project map |
| DEX | `/dex` | AMM swap and liquidity pools |
| Guide | `/guide` | System documentation |

### Authenticated Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Role-based redirect |
| Developer Dashboard | `/dashboard/developer` | Project management |
| Validator Dashboard | `/dashboard/validator` | Verification queue |
| Government Dashboard | `/dashboard/government` | LoA management |
| SuperAdmin Dashboard | `/dashboard/admin` | Governance & admin |
| Register Project | `/register` | New project registration |
| My Projects | `/my-projects` | User's registered projects |
| Wallet | `/wallet` | Token balances & transactions |
| Settings | `/settings` | Profile & role requests |
| KYC | `/settings/kyc` | Identity verification |

## 🔐 Role-Based Access

| Role | Permissions |
|------|-------------|
| **User** | Register projects, trade on marketplace |
| **Validator** | Verify projects, access verification tools |
| **Government** | Issue LoAs, manage compliance |
| **SuperAdmin** | Full system access, governance |

## 🪪 KYC Verification

Three-tier identity verification system:

| Level | Requirements | Unlocks |
|-------|-------------|---------|
| 0 | Wallet only | View-only |
| 1 | Email + Phone | Projects (1K max), Marketplace ($5K/month) |
| 2 | ID + Selfie + Address | Unlimited access, DEX, Role upgrades |

### Demo Verification Codes

For testing:
- **Email code**: `123456`
- **Phone code**: `654321`

## ⚙️ Environment Variables

Create `.env.local`:

```env
# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Mapbox (for project map)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Optional: Custom program ID
NEXT_PUBLIC_PROGRAM_ID=your_program_id
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Wallet**: Solana Wallet Adapter
- **Blockchain**: Solana Web3.js, Anchor

## 📦 Key Dependencies

```json
{
  "@solana/wallet-adapter-react": "^0.15.x",
  "@solana/web3.js": "^1.95.x",
  "@coral-xyz/anchor": "^0.30.x",
  "next": "15.x",
  "react": "19.x",
  "zustand": "^5.x",
  "tailwindcss": "^3.x"
}
```

## 🔧 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## 📝 Design Decisions

- **SSR Protection**: Wallet hooks wrapped in client-only components to prevent hydration errors
- **Role-Based Routing**: Dashboard auto-redirects based on user role
- **Persistent State**: Zustand with localStorage for role and KYC state
- **SuperAdmin Check**: Direct wallet address verification for critical access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT
