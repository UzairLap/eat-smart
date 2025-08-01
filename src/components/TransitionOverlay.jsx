// src/components/TransitionOverlay.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import yellowTexture from '../assets/yellow-paper-texture.png'; // Make sure this exists

const TransitionOverlay = ({ show, onComplete }) => {
  // Trigger callback after animation
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 1600); // Match transition duration
      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] origin-top"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${yellowTexture})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              mixBlendMode: 'multiply',
              backgroundColor: '#facc15', // Tailwind yellow-400 base in case image fails
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransitionOverlay;
