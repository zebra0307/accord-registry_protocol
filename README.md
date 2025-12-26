# Accord Registry Protocol

A decentralized carbon credit registry on Solana, featuring role-based access control for Developers, Validators (ACVA), and Government (BEE).

## Overview

This project implements a blockchain-based system for managing the lifecycle of Carbon Credits (CCTS):

1.  **Project Registration**: Developers register projects with geospatial data (H3 indices).
2.  **Validation**: Validators (ACVA) review and verify project data.
3.  **Compliance Approval**: Government Authority (BEE) approves compliance (Article 6).
4.  **Credit Issuance**: Verified and compliant projects can mint SPL Token-2022 credits.
5.  **Trading**: Native marketplace and AMM DEX for credit trading.

## Technology Stack

-   **Blockchain**: Solana
-   **Framework**: Anchor 0.30.1
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

Start a local validator in one terminal:
```bash
solana-test-validator
```

In another terminal, run the tests:
```bash
anchor test --skip-local-validator
```

Or run tests with a fresh validator:
```bash
anchor test
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

## License

MIT
