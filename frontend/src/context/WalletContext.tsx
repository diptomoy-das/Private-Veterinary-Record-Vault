"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import * as contract from "@/lib/contract";

interface WalletContextType {
  // Wallet state
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: bigint;
  network: string | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;

  // Pets
  pets: contract.PetRecord[];
  registerPet: (petId: string, ownerName: string) => Promise<void>;
  verifyVaccination: (petId: string) => Promise<void>;
  revokeVerification: (petId: string) => Promise<void>;

  // Transactions
  transactions: contract.Transaction[];
  isProcessing: boolean;
  processingMessage: string;

  // Contract
  contractAddress: string;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [network, setNetwork] = useState<string | null>(null);
  const [pets, setPets] = useState<contract.PetRecord[]>([]);
  const [transactions, setTransactions] = useState<contract.Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  const refreshState = useCallback(() => {
    setPets(contract.getPets());
    setTransactions(contract.getTransactions());
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const wallet = await contract.connectWallet();
      setIsConnected(true);
      setAddress(wallet.address);
      setBalance(wallet.balance);
      setNetwork(wallet.network);
      refreshState();
    } finally {
      setIsConnecting(false);
    }
  }, [refreshState]);

  const disconnect = useCallback(async () => {
    await contract.disconnectWallet();
    setIsConnected(false);
    setAddress(null);
    setBalance(0n);
    setNetwork(null);
  }, []);

  const registerPet = useCallback(
    async (petId: string, ownerName: string) => {
      setIsProcessing(true);
      setProcessingMessage("Submitting register_pet transaction...");
      try {
        await contract.registerPet(petId, ownerName);
        refreshState();
      } finally {
        setIsProcessing(false);
        setProcessingMessage("");
      }
    },
    [refreshState]
  );

  const verifyVaccination = useCallback(
    async (petId: string) => {
      setIsProcessing(true);
      setProcessingMessage("Proving vaccination via ZK circuit...");
      try {
        await contract.verifyVaccination(petId);
        refreshState();
      } finally {
        setIsProcessing(false);
        setProcessingMessage("");
      }
    },
    [refreshState]
  );

  const revokeVerification = useCallback(
    async (petId: string) => {
      setIsProcessing(true);
      setProcessingMessage("Revoking verification on-chain...");
      try {
        await contract.revokeVerification(petId);
        refreshState();
      } finally {
        setIsProcessing(false);
        setProcessingMessage("");
      }
    },
    [refreshState]
  );

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        address,
        balance,
        network,
        connect,
        disconnect,
        pets,
        registerPet,
        verifyVaccination,
        revokeVerification,
        transactions,
        isProcessing,
        processingMessage,
        contractAddress: contract.getContractAddress(),
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
