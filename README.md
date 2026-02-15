<p align="center">
  <img src="https://img.shields.io/badge/Midnight-Network-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==&logoColor=white" alt="Midnight Network" />
  <img src="https://img.shields.io/badge/Compact-v0.28.0-06B6D4?style=for-the-badge" alt="Compact v0.28.0" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/License-Apache_2.0-D22B2B?style=for-the-badge" alt="License" />
</p>

<h1 align="center">🐾 Private Veterinary Record Vault</h1>

<p align="center">
  <strong>A privacy-preserving DApp on Midnight Network that lets pet owners prove vaccination status without exposing full veterinary records.</strong>
</p>

<p align="center">
  Built with <a href="https://midnight.network">Midnight's</a> zero-knowledge proof technology — your pet's health data stays private, but verifiable.
</p>

---

## 📋 Table of Contents

- [What Is This?](#-what-is-this)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Deployed Smart Contract](#-deployed-smart-contract)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Available Commands](#-available-commands)
- [Tech Stack](#-tech-stack)
- [License](#-license)

---

## 🤔 What Is This?

Imagine you need to board your dog at a kennel, cross a border with your cat, or enroll your pet in daycare. Each of these requires **proof of vaccination** — but today that means handing over your pet's *entire* medical history to strangers.

**Private Veterinary Record Vault** solves this problem using **zero-knowledge proofs** on the [Midnight Network](https://midnight.network). Pet owners can:

1. **Store** a cryptographic commitment of their pet's health records on-chain  
2. **Prove** their pet is vaccinated to any third party  
3. **Keep** the full veterinary record completely private — it never leaves their device  

> 💡 **Think of it like a digital vaccination card** — it proves the important fact (vaccinated ✅) without revealing the doctor's notes, visit history, or medical details.

---

## ⚙️ How It Works

The DApp uses three smart contract circuits written in Midnight's **Compact** language:

```
┌─────────────────────────────────────────────────────────┐
│                  On-Chain (Public)                       │
│                                                         │
│  record_commitments   →   Map<PetID, Hash(Record)>      │
│  is_vaccinated        →   Map<PetID, true/false>        │
│                                                         │
└──────────────────────────┬──────────────────────────────┘
                           │
            ┌──────────────┼──────────────────┐
            │              │                  │
     register_pet   verify_vaccination   revoke_verification
            │              │                  │
            ▼              ▼                  ▼
    Stores hash of    Uses ZK proof to     Resets the
    private record    verify without       vaccination
    on-chain          revealing data       status flag
```

| Step | Who | What Happens |
|------|-----|-------------|
| **1. Register** | Pet Owner | Uploads a hash (commitment) of their pet's health record to the blockchain. The actual record stays on their device. |
| **2. Verify** | Pet Owner | Proves the private record matches the on-chain commitment using a zero-knowledge proof. The `is_vaccinated` flag is set to `true`. |
| **3. Check** | Third Party (Kennel, Border Control) | Reads the public `is_vaccinated` map to confirm the pet's status — no private data needed. |
| **4. Revoke** | Pet Owner | Resets the vaccination status (e.g., when a new vaccination is required). |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔒 **Privacy-First** | Pet health records never leave the owner's device. Only a cryptographic hash is stored on-chain. |
| ✅ **Verifiable Proof** | Third parties can confirm vaccination status without accessing private data. |
| 🧮 **Zero-Knowledge Proofs** | Powered by Midnight's ZK circuits — mathematical proof without data disclosure. |
| 🔄 **Revocable Status** | Owners can reset vaccination status when records need updating. |
| 🌐 **React Frontend** | Modern web UI built with React 19, Vite, and Tailwind CSS. |
| 🔗 **Wallet Integration** | Connects to Midnight Lace wallet for transaction signing and management. |
| 🛠️ **Full-Stack DApp** | Includes smart contract, CLI tools, and frontend — everything you need to run it. |

---

## 📜 Deployed Smart Contract

| Property | Value |
|----------|-------|
| **Network** | Midnight (Local / Undeployed Testnet) |
| **Contract Address** | `ba8a9f0cca948dc3a5d63c92d733cb68788e8eafc5c9fcb37e48166dd8d84eeb` |
| **Compact Version** | `0.28.0` |
| **Circuits** | `register_pet`, `verify_vaccination`, `revoke_verification` |

---

## 📁 Project Structure

```
midnight-starter-template/
│
├── vet-contract/              # 📝 Smart Contract (Compact language)
│   ├── src/
│   │   ├── vet.compact        #    → The contract source code
│   │   ├── witnesses.ts       #    → Witness (private input) definitions
│   │   └── managed/           #    → Compiled contract artifacts (keys, zkir)
│   └── package.json
│
├── vet-cli/                   # 🖥️ CLI Tools (TypeScript)
│   ├── src/
│   │   ├── deploy.ts          #    → Deploy the contract to Midnight
│   │   ├── api.ts             #    → Core SDK: wallet, providers, deployment
│   │   ├── config.ts          #    → Network configuration (local/preview/preprod)
│   │   └── test/              #    → Integration tests
│   └── package.json
│
├── frontend-vite-react/       # 🎨 Web Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/        #    → UI components
│   │   ├── modules/midnight/  #    → Midnight SDK integration
│   │   └── pages/             #    → Application pages
│   └── package.json
│
└── package.json               # 🏗️ Monorepo root (npm workspaces)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 (recommended: v22 via [nvm](https://github.com/nvm-sh/nvm))
- **Docker** (for running the local Midnight network)
- **Compact Compiler** v0.28.0 (for compiling the smart contract)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/private-vet-vault.git
cd private-vet-vault
npm install
```

### 2. Compile the Smart Contract

```bash
cd vet-contract
npm run compact       # Compile vet.compact → managed artifacts
npm run build         # Build TypeScript + copy artifacts to dist/
```

### 3. Start the Local Midnight Network

```bash
cd vet-cli
docker compose -f standalone.yml up -d
```

### 4. Deploy the Contract

```bash
cd vet-cli
npm run deploy
```

You'll see output like:
```
✓ Building wallet
✓ Syncing with network
✓ Deploying Private Veterinary Record Vault...
SUCCESS! Contract Deployed.
Contract Address: ba8a9f0cca948dc3a5d63c92d733cb68788e8eafc5c9fcb37e48166dd8d84eeb
```

### 5. Run the Frontend

```bash
cd frontend-vite-react
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Available Commands

Run from the **monorepo root**:

| Command | Description |
|---------|-------------|
| `npm run build` | Build all packages (contract + CLI + frontend) |
| `npm run compact` | Compile all Compact smart contracts |
| `npm run dev:frontend` | Start the frontend dev server |
| `npm run setup-standalone` | Set up the local Docker environment |

Run from **`vet-contract/`**:

| Command | Description |
|---------|-------------|
| `npm run compact` | Compile `vet.compact` to ZK artifacts |
| `npm run build` | Build and copy managed assets |
| `npm run test` | Run contract unit tests |

Run from **`vet-cli/`**:

| Command | Description |
|---------|-------------|
| `npm run deploy` | Deploy the contract to the network |
| `npm run tui-undeployed` | Launch interactive CLI (local network) |
| `npm run test-undeployed` | Run integration tests against local network |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Smart Contract** | [Compact](https://docs.midnight.network) (Midnight's ZK language) |
| **ZK Proofs** | Midnight Network ZK circuits |
| **Backend / CLI** | TypeScript, Node.js, ts-node |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Wallet** | Midnight Lace Wallet + SDK |
| **State Management** | RxJS observables |
| **Monorepo** | npm workspaces + Turborepo |

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with 💜 on <a href="https://midnight.network">Midnight Network</a>
</p>
