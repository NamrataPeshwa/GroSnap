import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const glowVariant = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "drop-shadow(0 0 10px rgba(229, 62, 62, 0.5))",
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

export default function IntroGroSnap({ onFinish }) {
  const [stage, setStage] = useState("logo");
  const navigate = useNavigate();

  useEffect(() => {
    const totalDuration = 3.5;
    const fadeOutTime = 0.5;

    setTimeout(() => setStage("fade"), totalDuration * 1000);
    setTimeout(() => setStage("main"), (totalDuration + fadeOutTime) * 1000);
  }, []);

  const handleComplete = () => {
    if (onFinish) onFinish();
    navigate('/'); // Ensure navigation to home after intro
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 overflow-hidden flex items-center justify-center px-4">
      {/* Background animation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, rgba(255,247,237,1) 0%, rgba(253,230,230,1) 100%)",
            "radial-gradient(circle at 70% 50%, rgba(255,247,237,1) 0%, rgba(253,230,230,1) 100%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      <AnimatePresence mode="wait">
        {stage !== "main" ? (
          <motion.div
            key="logo"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] max-w-[280px] z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="/logo.png" 
              alt="GroSnap Logo"
              className="w-full h-auto"
              variants={glowVariant}
              initial="hidden"
              animate="visible"
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            className="flex flex-col items-center justify-center gap-6 w-full max-w-xl z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.img
              src="/logo.png"
              alt="GroSnap Logo"
              className="w-[40%] max-w-[200px] mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />

            <motion.h2
              className="text-rose-600 text-xl md:text-2xl text-center font-bold"
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              onAnimationComplete={() => {
                setTimeout(handleComplete, 2000); // stay 2 seconds longer
              }}

            >
              From Kirana to Kitchen — In a Snap
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}