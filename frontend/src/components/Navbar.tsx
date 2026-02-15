"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/context/WalletContext";
import { truncateAddress, formatBalance } from "@/lib/contract";

export default function Navbar() {
  const { isConnected, isConnecting, address, balance, network, connect, disconnect } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 glass"
    >
      {/* Left — Mark */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent-metal animate-glow-pulse" />
        <span className="font-heading text-xs tracking-[0.3em] text-white/70 uppercase">
          VET VAULT
        </span>
        {network && (
          <span className="font-heading text-[9px] tracking-[0.2em] text-accent-metal/60 uppercase border border-accent-metal/20 px-2 py-0.5 rounded-sm">
            {network}
          </span>
        )}
      </div>

      {/* Right — Wallet */}
      <div className="relative">
        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="pointer-events-auto font-heading text-[10px] tracking-[0.25em] text-white/50 uppercase border border-white/10 px-4 py-2 hover:text-white hover:border-accent-metal hover:bg-accent-metal/10 transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border border-t-accent-metal border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              "Connect Wallet"
            )}
          </button>
        ) : (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="pointer-events-auto font-heading text-[10px] tracking-[0.15em] text-white/70 uppercase border border-white/10 px-4 py-2 hover:border-accent-metal/40 transition-all duration-500 flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-green-500/80" />
            <span>{address ? truncateAddress(address) : ""}</span>
            <span className="text-white/30">|</span>
            <span className="text-accent-metal">{formatBalance(balance)} tN</span>
          </button>
        )}

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && isConnected && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-64 bg-neutral-carbon/95 backdrop-blur-xl border border-white/5 p-4 pointer-events-auto"
            >
              <div className="space-y-3">
                <div>
                  <div className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">
                    Address
                  </div>
                  <div className="font-body text-xs text-white/60 break-all">
                    {address}
                  </div>
                </div>
                <div>
                  <div className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">
                    Balance
                  </div>
                  <div className="font-body text-sm text-white">
                    {formatBalance(balance)} <span className="text-white/30">tNight</span>
                  </div>
                </div>
                <div>
                  <div className="font-heading text-[9px] tracking-[0.3em] text-white/30 uppercase mb-1">
                    Network
                  </div>
                  <div className="font-body text-xs text-accent-metal uppercase">
                    {network}
                  </div>
                </div>
                <button
                  onClick={() => {
                    disconnect();
                    setShowDropdown(false);
                  }}
                  className="w-full mt-2 font-heading text-[10px] tracking-[0.2em] text-white/40 uppercase border border-white/10 px-3 py-2 hover:text-accent-metal hover:border-accent-metal/40 transition-all duration-300"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
