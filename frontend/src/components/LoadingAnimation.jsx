import React from "react";
import { motion } from "motion/react";

function LoadingAnimation() {
  return (
    <div className="flex items-center gap-3 max-w-[75%] py-2 font-sans">
      <div className="flex items-center justify-center px-4 py-3 bg-zinc-800 rounded-3xl rounded-tl-sm border border-white/5 shadow-sm h-[38px]">
        <div className="flex gap-1.5 items-center justify-center">
          <motion.div
            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoadingAnimation;
