import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CRTOverlay = () => {
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    // Hide boot sequence after 2.5 seconds
    const bootTimer = setTimeout(() => {
      setShowBoot(false);
    }, 2500);

    return () => {
      clearTimeout(bootTimer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden h-full w-full">
      {/* Boot Sequence */}
      <AnimatePresence>
        {showBoot && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-zinc-950 flex items-center justify-center z-[60] pointer-events-auto"
          >
            <div className="font-mono text-green-500 text-sm md:text-base">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <p>&gt; SYSTEM_INIT...</p>
                <p>&gt; LOADING_MODULES...</p>
                <p>&gt; ESTABLISHING_UPLINK...</p>
                <p className="animate-pulse">&gt; READY_</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bright Spot */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-white/5 blur-[100px] mix-blend-overlay"
        animate={{
          x: ['-20%', '100vw', '50vw', '-20%', '110vw'],
          y: ['-20%', '40vh', '110vh', '-20%', '60vh'],
          scale: [1, 1.2, 0.9, 1.1, 1],
          opacity: [0.3, 0.5, 0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}
      />

      {/* Scanlines */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" 
        style={{ backgroundSize: '100% 2px, 3px 100%', animation: 'scanline 10s linear infinite' }}
      />
      <style>{`
        @keyframes scanline {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
      `}</style>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};
