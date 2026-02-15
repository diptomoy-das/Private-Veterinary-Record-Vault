"use client";

import { motion } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import PetRegistration from "./PetRegistration";
import VerificationPanel from "./VerificationPanel";
import TransactionLog from "./TransactionLog";
import { truncateAddress } from "@/lib/contract";

export default function DashboardSection() {
  const { isConnected, contractAddress, isProcessing, processingMessage, address, network } = useWallet();

  return (
    <section className="relative z-20 bg-base-dark">
      {/* Gradient transition */}
      <div className="h-32 bg-gradient-to-b from-transparent to-base-dark" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12"
        >
          <span className="font-heading text-[10px] tracking-[0.35em] text-accent-metal uppercase">
            DApp Interface
          </span>
          <h2 className="font-heading text-xl md:text-2xl tracking-[0.1em] text-white uppercase mt-3">
            Private Veterinary Record Vault
          </h2>
          <p className="font-body text-sm text-white/30 mt-2 max-w-xl">
            Register pet health records privately on-chain and prove vaccination status
            to third parties without revealing full veterinary history.
          </p>
        </motion.div>

        {/* Contract Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-8"
        >
          <div className="bg-base-dark p-4">
            <div className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">
              Contract
            </div>
            <div className="font-body text-xs text-white/50 font-mono truncate">
              {truncateAddress(contractAddress)}
            </div>
          </div>
          <div className="bg-base-dark p-4">
            <div className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">
              Network
            </div>
            <div className="font-body text-xs text-accent-metal uppercase">
              {network || "Not connected"}
            </div>
          </div>
          <div className="bg-base-dark p-4">
            <div className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">
              Wallet
            </div>
            <div className="font-body text-xs text-white/50 font-mono">
              {isConnected ? truncateAddress(address || "") : "—"}
            </div>
          </div>
        </motion.div>

        {/* Processing Banner */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 border border-accent-metal/20 bg-accent-metal/5 flex items-center gap-3"
          >
            <span className="w-4 h-4 border-2 border-t-accent-metal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            <span className="font-body text-sm text-accent-metal">
              {processingMessage}
            </span>
          </motion.div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column — Actions */}
          <div className="lg:col-span-5 space-y-6">
            <PetRegistration />
            <VerificationPanel />
          </div>

          {/* Right Column — Transaction Log */}
          <div className="lg:col-span-7">
            <TransactionLog />
          </div>
        </div>

        {/* Circuits Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5"
        >
          {[
            {
              name: "register_pet",
              desc: "Store a cryptographic commitment of the pet's health record on-chain.",
              params: "pet_id: Uint<64>, commitment: Uint<248>",
            },
            {
              name: "verify_vaccination",
              desc: "Prove vaccination status via ZK witness without revealing the full record.",
              params: "pet_id: Uint<64>",
            },
            {
              name: "revoke_verification",
              desc: "Reset vaccination status when a new record update is needed.",
              params: "pet_id: Uint<64>",
            },
          ].map((circuit, i) => (
            <div
              key={circuit.name}
              className="bg-base-dark p-6 hover:bg-neutral-carbon/30 transition-colors duration-500"
            >
              <div className="font-heading text-[10px] tracking-[0.2em] text-accent-metal uppercase mb-2">
                Circuit {String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-heading text-sm text-white tracking-wide mb-2">
                {circuit.name}
              </div>
              <p className="font-body text-xs text-white/30 leading-relaxed mb-3">
                {circuit.desc}
              </p>
              <div className="font-body text-[10px] text-white/15 font-mono">
                ({circuit.params})
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent-metal" />
            <span className="font-heading text-xs tracking-[0.3em] text-white/40 uppercase">
              Private Veterinary Record Vault
            </span>
          </div>
          <div className="font-body text-[10px] text-white/15">
            Powered by Midnight Network • Zero-Knowledge Proofs
          </div>
        </div>
      </footer>
    </section>
  );
}
