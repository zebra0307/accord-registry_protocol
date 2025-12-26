# Accord Registry Protocol

[![Solana](https://img.shields.io/badge/Solana-black?logo=solana&logoColor=14F195)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-0.32.1-blue)](https://www.anchor-lang.com/)
[![Token-2022](https://img.shields.io/badge/SPL-Token--2022-purple)](https://spl.solana.com/token-2022)
[![Tests](https://img.shields.io/badge/Tests-18%20Passing-brightgreen)](#run-tests)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **A decentralized carbon credit registry protocol built on Solana, enabling transparent lifecycle management of carbon credits from registration to retirement.**

## About

**Accord Registry** is a next-generation **MRV (Measurement, Reporting, and Verification)** infrastructure protocol designed to bring transparency, trust, and efficiency to global carbon markets. Built on Solana for speed and minimal environmental footprint, it implements the complete lifecycle of carbon credits aligned with **Paris Agreement Article 6** requirements.

The protocol enables:
- 🌿 **Project Developers** to register and tokenize verified carbon reduction/removal projects
- 🔍 **Accredited Validators** to verify projects with on-chain escrow incentives
- 🏛️ **Government Authorities** to issue Letters of Authorization (LoA) preventing double-counting
- 💱 **Market Participants** to trade credits via native AMM DEX and P2P marketplace
- 🔥 **Offset Buyers** to retire credits and receive immutable on-chain retirement certificates

What sets Accord Registry apart:
- **Double-Counting Prevention**: H3 geospatial indexing ensures no overlapping project boundaries
- **Compliance-First Design**: Built-in support for CCTS registry IDs and government signatures
- **Token-2022**: Modern token standard with transfer hooks for audit trails
- **Permissioned Roles**: RBAC system ensures only authorized actors can perform sensitive operations
- **Fully On-Chain**: All state transitions are verifiable on the Solana blockchain

---

## Overview

This project implements a blockchain-based system for managing the lifecycle of Carbon Credits (CCTS):

1.  **Project Registration**: Developers register projects with geospatial data (H3 indices).
2.  **Validation**: Validators (ACVA) review and verify project data.
3.  **Compliance Approval**: Government Authority (BEE) approves compliance (Article 6).
4.  **Credit Issuance**: Verified and compliant projects can mint SPL Token-2022 credits.
5.  **Trading**: Native marketplace and AMM DEX for credit trading.

## Technology Stack

-   **Blockchain**: Solana
-   **Framework**: Anchor 0.32.1
-   **Token Standard**: SPL Token-2022
-   **Testing**: Mocha, Chai, ts-mocha

## Getting Started

### Prerequisites

-   Rust & Cargo (rustup)
-   Solana CLI (`solana-install`)
-   Anchor CLI (`cargo install --git https://github.com/coral-xyz/anchor avm`)
-   Node.js (v18+) & npm

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Program

```bash
anchor build
```

### 3. Run Tests

Run tests with a fresh local validator:
```bash
anchor test
```

Or if you have a validator already running:
```bash
anchor test --skip-local-validator
```

## Program Architecture

### Core Modules (`programs/accord-registry/src/`)

-   **`lib.rs`**: Program entry point and instruction dispatcher.
-   **`models.rs`**: On-chain data structures (Project, UserAccount, GlobalRegistry, etc.).
-   **`instructions/`**: Business logic for each lifecycle stage.
    -   `register_project.rs`: Project creation with double-counting prevention.
    -   `verify_project.rs`: Validator verification and rejection logic.
    -   `compliance.rs`: Government compliance approval (Article 6).
    -   `mint_credits.rs`: Token-2022 minting for verified projects.
    -   `marketplace.rs`: P2P listing and trading.
    -   `dex.rs`: AMM liquidity pool for carbon credits.
-   **`auth_utils/`**: Role-based access control (RBAC).
    -   `role_management.rs`: User registration, role assignment, permissions.

### Key Accounts

| Account            | Seeds                                  | Purpose                                  |
|--------------------|----------------------------------------|------------------------------------------|
| `GlobalRegistry`   | `[b"registry_v3"]`                     | System-wide state, mint authority        |
| `UserAccount`      | `[b"user", wallet_pubkey]`             | Role and permissions for each user       |
| `Project`          | `[b"project", owner, project_id]`      | Project metadata and status              |
| `VerificationNode` | `[b"verifier", verifier_pubkey]`       | Validator credentials and reputation     |
| `LiquidityPool`    | `[b"liquidity_pool", mint_a, mint_b]`  | AMM pool state                           |

## Roles & Permissions

| Role       | Permissions                                      |
|------------|--------------------------------------------------|
| User       | Register projects, mint credits (own projects)   |
| Validator  | Verify/Reject projects, earn audit fees          |
| Government | Approve compliance, authorize exports (LoA)      |
| Admin      | All permissions, system initialization           |

## Test Coverage

All 18 integration tests passing:

- ✅ Registry & Double-Counting Prevention Initialization
- ✅ Role-Based Access Control (RBAC)
- ✅ Project Registration & Verification
- ✅ Compliance Approval (Government)
- ✅ Credit Minting, Transfer & Retirement
- ✅ Batch Minting to Multiple Recipients
- ✅ AMM DEX (Pool Init, Add/Remove Liquidity, Swap)
- ✅ P2P Marketplace (Create, Buy, Cancel Listings)

## Project Structure

```
accord-registry/
├── programs/accord-registry/   # Solana program (Rust)
│   └── src/
│       ├── lib.rs              # Entry point
│       ├── models.rs           # Data structures
│       ├── instructions/       # Business logic
│       └── auth_utils/         # RBAC
├── tests/                      # Integration tests (TypeScript)
├── target/                     # Build artifacts
├── Anchor.toml                 # Anchor configuration
└── package.json                # Node dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

**Built for a sustainable future. 🌍**
