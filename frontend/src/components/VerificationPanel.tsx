"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";

export default function VerificationPanel() {
  const { pets, verifyVaccination, revokeVerification, isConnected, isProcessing } = useWallet();

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
        className="bg-neutral-carbon/30 border border-white/5 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-metal/40" />
          <h3 className="font-heading text-xs tracking-[0.25em] text-white/70 uppercase">
            Verification Status
          </h3>
        </div>
        <p className="font-body text-xs text-white/30">
          Connect your wallet to view registered pets.
        </p>
      </motion.div>
    );
  }

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
          Verification Status
        </h3>
        <span className="ml-auto font-heading text-[9px] tracking-[0.2em] text-white/20 uppercase">
          {pets.length} registered
        </span>
      </div>

      {pets.length === 0 ? (
        <div className="py-8 text-center">
          <span className="font-body text-sm text-white/20">
            No pets registered yet.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {pets.map((pet) => (
              <motion.div
                key={pet.petId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-4 p-4 bg-base-dark/60 border border-white/5 group hover:border-white/10 transition-colors"
              >
                {/* Pet Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-heading text-sm text-white tracking-wide">
                      PET #{pet.petId}
                    </span>
                    {/* Status Badge */}
                    <span
                      className={`font-heading text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 border ${
                        pet.isVaccinated
                          ? "text-green-400 border-green-400/30 bg-green-400/5"
                          : "text-yellow-500 border-yellow-500/30 bg-yellow-500/5"
                      }`}
                    >
                      {pet.isVaccinated ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="font-body text-[10px] text-white/20 truncate">
                    Commitment: {pet.commitment.slice(0, 16)}...
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {!pet.isVaccinated ? (
                    <button
                      onClick={() => verifyVaccination(pet.petId)}
                      disabled={isProcessing}
                      className="font-heading text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border border-green-500/30 text-green-400/70 hover:bg-green-500/10 hover:text-green-400 transition-all disabled:opacity-20"
                    >
                      Verify
                    </button>
                  ) : (
                    <button
                      onClick={() => revokeVerification(pet.petId)}
                      disabled={isProcessing}
                      className="font-heading text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border border-accent-metal/30 text-accent-metal/70 hover:bg-accent-metal/10 hover:text-accent-metal transition-all disabled:opacity-20"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
