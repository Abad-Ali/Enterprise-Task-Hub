"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 80, damping: 15 } 
    },
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-zinc-950 text-white flex flex-col justify-between p-6 sm:p-12 font-sans select-none">
      
      {/* BACKGROUND CYBER GRID MESH */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 90%)'
        }}
      />

      {/* AMBIENT ENVIRONMENTAL GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[900px] h-[900px] bg-blue-600/10 blur-[180px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div
          animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full left-1/4 top-1/3"
        />
      </div>

      {/* CINEMATIC FULL SCREEN GIANT TEXT GRID */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-4 sm:px-20 opacity-[0.04] pointer-events-none font-mono font-black text-[260px] sm:text-[400px] md:text-[550px] tracking-tighter leading-none select-none [-webkit-text-stroke:2px_blue]">
        <motion.span 
          animate={{ x: [-10, 10, -10] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          4
        </motion.span>
        <motion.span 
          animate={{ y: [10, -10, 10] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          0
        </motion.span>
        <motion.span 
          animate={{ x: [10, -10, 10] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          4
        </motion.span>
      </div>

      {/* TOP DECORATIVE HEADER HUD */}
      <div className="relative w-full flex items-center justify-between border-b border-zinc-900 pb-6 opacity-60 z-20 text-[10px] font-mono tracking-[0.3em] uppercase">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>System // Deep Scan Mode</span>
        </div>
        <div className="hidden sm:block">Sector_0x404_Null_Route</div>
        <div>Error_State: 404</div>
      </div>

      {/* MAIN SPATIAL CONTENT DECK */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex-1 flex flex-col items-center justify-center text-center z-10 max-w-4xl mx-auto w-full px-4"
      >
        {/* LARGE INDEPENDENT CENTER ROBOT CHARACTER */}
        <motion.div variants={itemVariants} className="relative flex items-center justify-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-60 h-60 bg-blue-600 rounded-full blur-[100px]"
          />

          <motion.div
            animate={{ y: [0, -20, 0], rotate: [-3, 3, -3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-36 h-36 bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-blue-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.1)]"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              🤖
            </motion.div>

            {/* EXPANDED SYSTEM OUTER RING */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-20px] border border-dashed border-blue-500/20 rounded-3xl"
            />
          </motion.div>
        </motion.div>

        {/* TYPOGRAPHY BLOCKS */}
        <motion.h2 
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-black tracking-tight mb-4 uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500"
        >
          Lost in Cyberspace
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed font-light mb-10"
        >
          The network endpoint context requested does not map to any live host arrays. The routing layer returned an empty payload index status loop.
        </motion.p>

        {/* PRIMARY CTA SECTOR ACTION */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }}
          className="relative group w-full sm:w-auto"
        >
          <div className="absolute inset-0 bg-blue-600/30 rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition duration-300" />
          <Link
            href="/"
            className="relative w-full sm:w-auto justify-center inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-white/70 text-zinc-950 font-extrabold tracking-widest uppercase text-xs hover:bg-zinc-100 transition-colors shadow-2xl"
          >
            <span>Return to Core Base</span>
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>

      {/* BOTTOM DECORATIVE STATUS FOOTER */}
      <div className="relative w-full flex items-center justify-between border-t border-zinc-900 pt-6 opacity-40 z-20 text-[9px] font-mono tracking-widest uppercase text-zinc-500">
        <div className="flex gap-6">
          <div className="hidden md:block">PING: --ms</div>
          <div>LOSS: 100%</div>
        </div>
        <div className="text-right">DISCONNECTED_FROM_HOST_NODE</div>
      </div>

      {/* ACTIVE DRIFTING SYSTEM ENVIRONMENT PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const top = `${(i * 3.3) % 100}%`;
          const left = `${(i * 7.7) % 100}%`;
          const duration = 14 + (i % 8) * 2;
          const delay = (i % 5) * 1;

          return (
            <motion.div
              key={i}
              style={{ top, left }}
              className="absolute w-[2px] h-[2px] bg-blue-500/20 rounded-full"
              animate={{
                y: [0, -80, 0],
                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                opacity: [0.05, 0.4, 0.05],
                scale: [1, 2, 1]
              }}
              transition={{
                duration: duration,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
