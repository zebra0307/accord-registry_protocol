# Accord Registry (Blue Carbon)
A decentralized registry for carbon credits on Solana, featuring role-based access control for Developers, Validators (ACVA), and Government (BEE).

## Overview
This project implements a blockchain-based system for managing the lifecycle of Carbon Credits (CCTS):
1.  **Project Registration**: Developers register projects with geospatial data (H3 indices).
2.  **Validation**: Validators (ACVA) review and verify project data.
3.  **Credit Issuance**: Government Authority (BEE) approves compliance and issues tokens.
4.  **Trading**: Users can trade credits (marketplace foundation).

## Technology Stack
-   **Blockchain**: Solana (Anchor Framework 0.30.1)
-   **Frontend**: Next.js 14, React, Tailwind CSS
-   **Wallet Integration**: Solana Wallet Adapter
-   **Mapping**: Leaflet + H3-js

## Getting Started

### Prerequisites
-   Rust & Cargo
-   Solana CLI
-   Node.js (v18+) & NPM/Yarn
-   Anchor CLI

### 1. Build the Program
```bash
# Install dependencies
npm install

# Build the Anchor program
anchor build

# Get Program ID (if deploying)
solana address -k target/deploy/accord_registry-keypair.json
```

### 2. Configure Frontend
Navigate to the `web` directory:
```bash
cd web
npm install
```

Create a `.env.local` file in `web/` (if using specific RPCs or keys):
```env
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
```

### 3. Run Application
Inside `web/`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Roles & Features
The dashboard automatically adapts to your role:
-   **User/Developer**: View "My Projects", "Register Project".
-   **Validator**: View "Pending Projects", "Validate Project".
-   **Government**: View "Verified Projects", "Issue Credits".

> **Note**: For this prototype, you can self-assign roles using the "Join Registry" buttons on the Dashboard.

## Project Structure
-   `programs/`: Solana smart contract code (Rust).
-   `tests/`: Integration tests using Mocha/Chai.
-   `web/`: Next.js Frontend application.
