// ── Mock Contract Service Layer ──
// Simulates Midnight Network wallet + contract interactions
// Ready to swap for real DApp Connector API when available

export interface WalletInfo {
  address: string;
  balance: bigint;
  network: string;
  seed: string;
}

export interface PetRecord {
  petId: string;
  commitment: string;
  isVaccinated: boolean;
  registeredAt: Date;
}

export interface Transaction {
  id: string;
  txHash: string;
  type: "register_pet" | "verify_vaccination" | "revoke_verification" | "connect" | "deploy";
  petId?: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: Date;
  blockHeight?: number;
}

// ── Helpers ──

const randomHex = (bytes: number): string =>
  Array.from({ length: bytes }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join("");

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const CONTRACT_ADDRESS = "ba8a9f0cca948dc3a5d63c92d733cb68788e8eafc5c9fcb37e48166dd8d84eeb";

// ── In-memory State ──

let walletState: WalletInfo | null = null;
const pets: Map<string, PetRecord> = new Map();
const transactions: Transaction[] = [];
let txCounter = 0;

// ── Mock API ──

export async function connectWallet(): Promise<WalletInfo> {
  await delay(1200 + Math.random() * 800);

  const seed = randomHex(32);
  walletState = {
    address: `midnight1${randomHex(20)}`,
    balance: BigInt(Math.floor(Math.random() * 50000 + 10000)) * 1000000000n,
    network: "preprod",
    seed,
  };

  const tx: Transaction = {
    id: `tx-${++txCounter}`,
    txHash: randomHex(32),
    type: "connect",
    status: "confirmed",
    timestamp: new Date(),
    blockHeight: Math.floor(Math.random() * 100000 + 500000),
  };
  transactions.unshift(tx);

  return walletState;
}

export async function disconnectWallet(): Promise<void> {
  await delay(300);
  walletState = null;
}

export function getWalletState(): WalletInfo | null {
  return walletState;
}

export function getContractAddress(): string {
  return CONTRACT_ADDRESS;
}

export async function registerPet(
  petId: string,
  ownerName: string
): Promise<Transaction> {
  if (!walletState) throw new Error("Wallet not connected");

  const commitment = randomHex(31); // Uint<248> = 31 bytes

  const tx: Transaction = {
    id: `tx-${++txCounter}`,
    txHash: randomHex(32),
    type: "register_pet",
    petId,
    status: "pending",
    timestamp: new Date(),
  };
  transactions.unshift(tx);

  // Simulate transaction processing
  await delay(2000 + Math.random() * 1500);

  const pet: PetRecord = {
    petId,
    commitment,
    isVaccinated: false,
    registeredAt: new Date(),
  };
  pets.set(petId, pet);

  tx.status = "confirmed";
  tx.blockHeight = Math.floor(Math.random() * 100000 + 500000);

  return tx;
}

export async function verifyVaccination(petId: string): Promise<Transaction> {
  if (!walletState) throw new Error("Wallet not connected");

  const pet = pets.get(petId);
  if (!pet) throw new Error(`Pet ${petId} not found`);

  const tx: Transaction = {
    id: `tx-${++txCounter}`,
    txHash: randomHex(32),
    type: "verify_vaccination",
    petId,
    status: "pending",
    timestamp: new Date(),
  };
  transactions.unshift(tx);

  await delay(2500 + Math.random() * 2000);

  pet.isVaccinated = true;
  tx.status = "confirmed";
  tx.blockHeight = Math.floor(Math.random() * 100000 + 500000);

  return tx;
}

export async function revokeVerification(petId: string): Promise<Transaction> {
  if (!walletState) throw new Error("Wallet not connected");

  const pet = pets.get(petId);
  if (!pet) throw new Error(`Pet ${petId} not found`);

  const tx: Transaction = {
    id: `tx-${++txCounter}`,
    txHash: randomHex(32),
    type: "revoke_verification",
    petId,
    status: "pending",
    timestamp: new Date(),
  };
  transactions.unshift(tx);

  await delay(1800 + Math.random() * 1200);

  pet.isVaccinated = false;
  tx.status = "confirmed";
  tx.blockHeight = Math.floor(Math.random() * 100000 + 500000);

  return tx;
}

export function getPets(): PetRecord[] {
  return Array.from(pets.values());
}

export function getTransactions(): Transaction[] {
  return [...transactions];
}

export function formatBalance(balance: bigint): string {
  const whole = balance / 1000000000n;
  return whole.toLocaleString();
}

export function truncateAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 10)}...${address.slice(-6)}`;
}
