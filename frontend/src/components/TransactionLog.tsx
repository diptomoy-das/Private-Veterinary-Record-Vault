"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

const typeLabels: Record<string, string> = {
  register_pet: "REGISTER",
  verify_vaccination: "VERIFY",
  revoke_verification: "REVOKE",
  connect: "CONNECT",
  deploy: "DEPLOY",
};

const typeColors: Record<string, string> = {
  register_pet: "text-blue-400 border-blue-400/30",
  verify_vaccination: "text-green-400 border-green-400/30",
  revoke_verification: "text-accent-metal border-accent-metal/30",
  connect: "text-purple-400 border-purple-400/30",
  deploy: "text-yellow-400 border-yellow-400/30",
};

export default function TransactionLog() {
  const { transactions, isConnected } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      className="bg-neutral-carbon/30 border border-white/5 p-6 h-full flex flex-col"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-metal" />
        <h3 className="font-heading text-xs tracking-[0.25em] text-white/70 uppercase">
          Transaction Log
        </h3>
        {transactions.length > 0 && (
          <span className="ml-auto font-heading text-[9px] tracking-[0.2em] text-white/20 uppercase">
            {transactions.length} txs
          </span>
        )}
      </div>

      {!isConnected ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-body text-xs text-white/20">
            Connect wallet to view transactions.
          </span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="font-body text-xs text-white/20">
            No transactions yet.
          </span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin pr-1" style={{ maxHeight: "400px" }}>
          <AnimatePresence mode="popLayout">
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="p-3 bg-base-dark/60 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  {/* Type badge */}
                  <span
                    className={`font-heading text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border ${
                      typeColors[tx.type] || "text-white/40 border-white/10"
                    }`}
                  >
                    {typeLabels[tx.type] || tx.type}
                  </span>

                  {/* Status */}
                  <span
                    className={`font-heading text-[8px] tracking-[0.15em] uppercase ${
                      tx.status === "confirmed"
                        ? "text-green-400/60"
                        : tx.status === "pending"
                        ? "text-yellow-400/60"
                        : "text-accent-metal/60"
                    }`}
                  >
                    {tx.status === "pending" && (
                      <span className="inline-block w-2 h-2 border border-t-yellow-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-1 align-middle" />
                    )}
                    {tx.status}
                  </span>
                </div>

                {/* TX Hash */}
                <div className="font-body text-[10px] text-white/25 font-mono truncate mb-1">
                  {tx.txHash}
                </div>

                {/* Details */}
                <div className="flex items-center justify-between">
                  {tx.petId && (
                    <span className="font-body text-[10px] text-white/30">
                      Pet #{tx.petId}
                    </span>
                  )}
                  <span className="font-body text-[10px] text-white/15 ml-auto">
                    {tx.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {tx.blockHeight && (
                  <div className="font-body text-[9px] text-white/10 mt-1">
                    Block #{tx.blockHeight.toLocaleString()}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
