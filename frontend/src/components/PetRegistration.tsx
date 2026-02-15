"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

export default function PetRegistration() {
  const { isConnected, registerPet, isProcessing } = useWallet();
  const [petId, setPetId] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId.trim()) return;

    setStatus("idle");
    setErrorMsg("");

    try {
      await registerPet(petId.trim(), ownerName.trim());
      setStatus("success");
      setPetId("");
      setOwnerName("");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true }}
      className="bg-neutral-carbon/30 border border-white/5 p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-metal" />
        <h3 className="font-heading text-xs tracking-[0.25em] text-white/70 uppercase">
          Register Pet
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase block mb-2">
            Pet ID (Uint64)
          </label>
          <input
            type="text"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            placeholder="e.g. 1001"
            disabled={!isConnected || isProcessing}
            className="w-full bg-base-dark border border-white/10 px-4 py-3 font-body text-sm text-white placeholder-white/20 focus:border-accent-metal/50 focus:outline-none transition-colors disabled:opacity-30"
          />
        </div>

        <div>
          <label className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase block mb-2">
            Owner Name
          </label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="e.g. Dr. Smith"
            disabled={!isConnected || isProcessing}
            className="w-full bg-base-dark border border-white/10 px-4 py-3 font-body text-sm text-white placeholder-white/20 focus:border-accent-metal/50 focus:outline-none transition-colors disabled:opacity-30"
          />
        </div>

        <button
          type="submit"
          disabled={!isConnected || isProcessing || !petId.trim()}
          className="w-full font-heading text-[10px] tracking-[0.25em] uppercase py-3 border border-accent-metal/40 text-accent-metal hover:bg-accent-metal/10 transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border border-t-accent-metal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            "Register on Chain"
          )}
        </button>
      </form>

      {/* Status Messages */}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 border border-green-500/20 bg-green-500/5"
        >
          <span className="font-body text-xs text-green-400">
            ✓ Pet registered successfully. Commitment stored on-chain.
          </span>
        </motion.div>
      )}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 border border-accent-metal/20 bg-accent-metal/5"
        >
          <span className="font-body text-xs text-accent-metal">{errorMsg}</span>
        </motion.div>
      )}

      {!isConnected && (
        <div className="mt-4 p-3 border border-white/5 bg-white/[0.02]">
          <span className="font-body text-xs text-white/30">
            Connect your wallet to register pets.
          </span>
        </div>
      )}
    </motion.div>
  );
}
