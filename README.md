# Accord Registry Protocol

[![Solana](https://img.shields.io/badge/Solana-black?logo=solana&logoColor=14F195)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-0.32.1-blue)](https://www.anchor-lang.com/)
[![Token-2022](https://img.shields.io/badge/SPL-Token--2022-purple)](https://spl.solana.com/token-2022)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Tests](https://img.shields.io/badge/Tests-18%20Passing-brightgreen)](#run-tests)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **A decentralized carbon credit registry protocol built on Solana, enabling transparent lifecycle management of carbon credits from registration to retirement.**

![Accord Registry](docs/banner.png)

## 🌍 About

**Accord Registry** is a next-generation **MRV (Measurement, Reporting, and Verification)** infrastructure protocol designed to bring transparency, trust, and efficiency to global carbon markets. Built on Solana for speed and minimal environmental footprint, it implements the complete lifecycle of carbon credits aligned with **Paris Agreement Article 6** requirements.

### What We Enable

| Role | Capabilities |
|------|-------------|
| 🌿 **Project Developers** | Register and tokenize verified carbon reduction/removal projects |
| 🔍 **Accredited Validators** | Verify projects with on-chain escrow incentives |
| 🏛️ **Government Authorities** | Issue Letters of Authorization (LoA) preventing double-counting |
| 💱 **Market Participants** | Trade credits via native AMM DEX and P2P marketplace |
| 🔥 **Offset Buyers** | Retire credits and receive immutable on-chain retirement certificates |

### Key Differentiators

- **Double-Counting Prevention**: H3 geospatial indexing ensures no overlapping project boundaries
- **Compliance-First Design**: Built-in support for CCTS registry IDs and government signatures
- **Token-2022**: Modern token standard with transfer hooks for audit trails
- **Permissioned Roles**: RBAC system ensures only authorized actors can perform sensitive operations
- **Fully On-Chain**: All state transitions are verifiable on the Solana blockchain
- **KYC Integration**: Multi-level identity verification for regulatory compliance

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ACCORD REGISTRY PROTOCOL                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           WEB FRONTEND (Next.js 15)                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │   │
│  │  │Dashboard│  │   DEX   │  │Marketplace│ │  Map   │  │   KYC/Settings  │ │   │
│  │  │(4 Roles)│  │(AMM/Swap)│ │  (P2P)  │  │(Projects)│ │  (Verification) │ │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│                                      ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                        SOLANA PROGRAM (Anchor)                            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │   │
│  │  │  RBAC    │  │ Projects │  │ Credits  │  │   DEX    │  │ Marketplace│  │   │
│  │  │ (Roles)  │  │(Register)│  │ (Mint)   │  │  (AMM)   │  │   (P2P)    │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Rust & Cargo** (`rustup`)
- **Solana CLI** (`solana-install`)
- **Anchor CLI** (`cargo install --git https://github.com/coral-xyz/anchor avm`)
- **Node.js** (v18+) & npm/yarn

### 1. Clone & Install

```bash
git clone https://github.com/your-org/accord-registry.git
cd accord-registry
npm install
```

### 2. Build the Solana Program

```bash
anchor build
```

### 3. Run Tests

```bash
anchor test
```

### 4. Start the Web Frontend

```bash
cd web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🌐 Web Application

The web frontend is a **Next.js 15** application located in the `/web` directory.

### Features

| Feature | Description |
|---------|-------------|
| 🔐 **Wallet Integration** | Solana wallet adapter with multi-wallet support |
| 📊 **Role-Based Dashboards** | Developer, Validator, Government, SuperAdmin |
| 💱 **DEX Trading** | AMM with swap, liquidity pools, price charts |
| 🏪 **P2P Marketplace** | Buy/sell credits with DePIN verification badges |
| 🗺️ **Interactive Map** | Explore all registered projects globally |
| 🪪 **KYC Verification** | 3-tier identity verification system |
| ⚙️ **Settings** | Profile, role requests, verification history |
| 🏛️ **Multi-Sig Governance** | Admin proposals with threshold voting |

### Dashboard Features by Role

| Role | Dashboard Features |
|------|-------------------|
| **Developer** | Projects list, credits issued, pending verifications, quick actions |
| **Validator** | Pending queue, completed verifications, DePIN tools, stake management |
| **Government** | LoA management, Article 6 compliance, export controls, policy settings |
| **SuperAdmin** | Proposals, admin management, KYC reviews, audit logs, emergency controls |

### KYC Levels

| Level | Requirements | Unlocked Features |
|-------|-------------|-------------------|
| **Level 0** | Wallet only | View-only access |
| **Level 1** | Email + Phone verified | Register projects (1K max), Marketplace ($5K/month) |
| **Level 2** | Government ID + Selfie + Address | Unlimited trading, DEX, Role upgrades, API |

### Running the Web App

```bash
cd web

# Development
npm run dev

# Production build
npm run build
npm start
```

### Environment Variables

Create `web/.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

---

## ⚙️ Solana Program

### Core Modules

```
programs/accord-registry/src/
├── lib.rs              # Entry point
├── models.rs           # Data structures
├── instructions/       # Business logic
│   ├── register_project.rs
│   ├── verify_project.rs
│   ├── compliance.rs
│   ├── mint_credits.rs
│   ├── marketplace.rs
│   └── dex.rs
└── auth_utils/         # RBAC
    └── role_management.rs
```

### Key Accounts

| Account | Seeds | Purpose |
|---------|-------|---------|
| `GlobalRegistry` | `[b"registry_v3"]` | System-wide state, mint authority |
| `UserAccount` | `[b"user", wallet_pubkey]` | Role and permissions per user |
| `Project` | `[b"project", owner, project_id]` | Project metadata and status |
| `VerificationNode` | `[b"verifier", verifier_pubkey]` | Validator credentials |
| `LiquidityPool` | `[b"liquidity_pool", mint_a, mint_b]` | AMM pool state |

### Roles & Permissions

| Role | Permissions |
|------|-------------|
| **User** | Register projects, mint credits (own projects) |
| **Validator** | Verify/Reject projects, earn audit fees |
| **Government** | Approve compliance, authorize exports (LoA) |
| **Admin** | All permissions, system initialization |
| **SuperAdmin** | Multi-sig governance, emergency controls |

---

## ✅ Test Coverage

All 18 integration tests passing:

- ✅ Registry & Double-Counting Prevention Initialization
- ✅ Role-Based Access Control (RBAC)
- ✅ Project Registration & Verification
- ✅ Compliance Approval (Government)
- ✅ Credit Minting, Transfer & Retirement
- ✅ Batch Minting to Multiple Recipients
- ✅ AMM DEX (Pool Init, Add/Remove Liquidity, Swap)
- ✅ P2P Marketplace (Create, Buy, Cancel Listings)

---

## 📁 Project Structure

```
accord-registry/
├── programs/               # Solana program (Rust/Anchor)
│   └── accord-registry/
│       └── src/
│           ├── lib.rs
│           ├── models.rs
│           ├── instructions/
│           └── auth_utils/
├── tests/                  # Integration tests (TypeScript)
├── web/                    # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   ├── (public)/  # Public routes (marketplace, map, explore)
│   │   │   └── (authenticated)/ # Protected routes (dashboard, wallet)
│   │   ├── components/    # React components
│   │   ├── providers/     # Context providers (wallet, program)
│   │   └── stores/        # Zustand state management
│   └── public/            # Static assets
├── Anchor.toml            # Anchor configuration
├── package.json           # Root dependencies
└── README.md              # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- **Documentation**: [docs/](docs/)
- **Solana**: [solana.com](https://solana.com)
- **Anchor**: [anchor-lang.com](https://www.anchor-lang.com/)

---

**Built for a sustainable future. 🌍**
