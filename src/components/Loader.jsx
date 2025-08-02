import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('airplane'); // airplane, morphing, complete
  const intervalRef = useRef(null);

  // Background cultural icons with positions
  const backgroundIcons = [
    { icon: '🗺️', x: '15%', y: '20%', delay: 0 },
    { icon: '🍜', x: '85%', y: '25%', delay: 0.5 },
    { icon: '🍕', x: '10%', y: '70%', delay: 1 },
    { icon: '🍣', x: '90%', y: '75%', delay: 1.5 },
    { icon: '🌮', x: '20%', y: '40%', delay: 2 },
    { icon: '🥖', x: '80%', y: '50%', delay: 2.5 },
    { icon: '🍛', x: '25%', y: '80%', delay: 3 },
    { icon: '🧀', x: '75%', y: '15%', delay: 3.5 },
    { icon: '✈️', x: '50%', y: '10%', delay: 1 },
    { icon: '🗂️', x: '40%', y: '85%', delay: 2 },
    { icon: '🍴', x: '60%', y: '90%', delay: 1.5 },
    { icon: '🌍', x: '5%', y: '50%', delay: 4 }
  ];

  useEffect(() => {
    // Phase 1: Airplane draws L (2 seconds)
    setTimeout(() => {
      setAnimationPhase('morphing');
    }, 2000);

    // Phase 2: Start progress counter (after 3 seconds, runs for 3 seconds)
    setTimeout(() => {
      setAnimationPhase('complete');
      const startTime = Date.now();
      const duration = 3000; // 3 seconds for smooth counting
      
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
        
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(intervalRef.current);
          // Fade out after completion
          setTimeout(() => {
            setShowLoader(false);
            setTimeout(() => {
              onComplete && onComplete();
            }, 1000);
          }, 800);
        }
      }, 16); // 60fps smooth updates
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onComplete]);

  // Airplane path for the "L" shape
  const airplanePath = "M 40 25 L 40 65 L 70 65";

  return (
    <AnimatePresence mode="wait">
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center overflow-hidden z-50"
        >
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />

          {/* Animated background cultural icons */}
          {backgroundIcons.map((item, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl opacity-0"
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ 
                opacity: 0.15, 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0],
              }}
              transition={{
                delay: item.delay,
                duration: 1.5,
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <span style={{ 
                filter: 'grayscale(0.8) brightness(1.5)',
                textShadow: '0 0 20px rgba(255,255,255,0.3)'
              }}>
                {item.icon}
              </span>
            </motion.div>
          ))}

          {/* Flight path lines */}
          <motion.div
            className="absolute inset-0 opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 1, duration: 2 }}
          >
            <svg className="w-full h-full" viewBox="0 0 1000 600">
              <motion.path
                d="M 100 300 Q 300 200 500 300 T 900 250"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="5,10"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2, duration: 3, ease: "easeInOut" }}
              />
              <motion.path
                d="M 200 500 Q 400 400 600 450 T 800 400"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="3,8"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 2.5, duration: 3, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>

          {/* Main content container */}
          <div className="relative z-20 text-center">
            
            {/* Phase 1: Airplane drawing the "L" */}
            {animationPhase === 'airplane' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-20"
              >
                <div className="relative w-40 h-40 mx-auto">
                  <svg
                    width="160"
                    height="160"
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                  >
                    {/* Airplane trail path */}
                    <motion.path
                      d={airplanePath}
                      stroke="white"
                      strokeWidth="2.5"
                      strokeDasharray="4,4"
                      fill="none"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      style={{
                        filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))',
                        strokeLinecap: 'round'
                      }}
                    />
                    
                    {/* Moving airplane */}
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0.7],
                        scale: [0.5, 1, 1, 1.2]
                      }}
                      transition={{ 
                        duration: 2, 
                        ease: "easeInOut",
                        times: [0, 0.2, 0.8, 1]
                      }}
                    >
                      <motion.path
                        d="M 68 63 L 72 65 L 68 67 Z"
                        fill="white"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))'
                        }}
                        animate={{
                          x: [0, 0, 2],
                          y: [0, 0, 0]
                        }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </motion.g>
                  </svg>
                </div>
              </motion.div>
            )}

            {/* Phase 2 & 3: LOADING text */}
            {(animationPhase === 'morphing' || animationPhase === 'complete') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-16"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.12,
                        delayChildren: 0.2
                      }
                    }
                  }}
                  className="flex justify-center items-center space-x-2 md:space-x-4 mb-6"
                >
                  {['L', 'O', 'A', 'D', 'I', 'N', 'G'].map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { 
                          opacity: 0, 
                          y: 40,
                          filter: 'blur(20px)',
                          scale: 0.5
                        },
                        visible: { 
                          opacity: 1, 
                          y: 0,
                          filter: 'blur(0px)',
                          scale: 1,
                          transition: {
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }
                        }
                      }}
                      className="text-6xl md:text-8xl lg:text-9xl font-bold text-white inline-block"
                      style={{
                        fontFamily: '"Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
                        fontWeight: '800',
                        textShadow: `
                          0 0 30px rgba(255, 255, 255, 0.9),
                          0 0 60px rgba(255, 255, 255, 0.6),
                          0 0 90px rgba(255, 255, 255, 0.3),
                          0 4px 8px rgba(0, 0, 0, 0.5)
                        `,
                        letterSpacing: '0.05em'
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>

                {/* Subtitle */}
<motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.5, duration: 1 }}
  className="font-bold text-amber-400 text-lg md:text-xl tracking-[0.4em] uppercase"
  style={{
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
  }}
>
  Eat Smart
</motion.p>
                
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ delay: 1.8, duration: 1 }}
                  className="text-white/60 text-sm md:text-base tracking-[0.2em] font-light"
                  style={{
                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
                  }}
                >
                  A Food Adventure Around the World
                </motion.p>
              </motion.div>
            )}

            {/* Phase 3: Progress counter */}
            {animationPhase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Large percentage display */}
                <motion.div
                  key={Math.floor(progress / 10)} // Re-trigger animation every 10%
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div 
                    className="text-7xl md:text-8xl lg:text-9xl font-mono font-bold text-white"
                    style={{
                      fontFamily: '"JetBrains Mono", "SF Mono", "Monaco", monospace',
                      textShadow: `
                        0 0 40px rgba(255, 255, 255, 0.9),
                        0 0 80px rgba(255, 255, 255, 0.5),
                        0 0 120px rgba(255, 255, 255, 0.2),
                        0 6px 12px rgba(0, 0, 0, 0.6)
                      `,
                      letterSpacing: '0.1em'
                    }}
                  >
                    {String(progress).padStart(2, '0')}%
                  </div>
                </motion.div>

                {/* Sleek progress bar */}
                <div className="w-80 max-w-full mx-auto">
                  <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full relative"
                      style={{
                        boxShadow: `
                          0 0 20px rgba(255, 255, 255, 0.8),
                          0 0 40px rgba(255, 255, 255, 0.4)
                        `
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Status indicator */}
                <motion.p
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-white/50 text-xs md:text-sm tracking-[0.3em] uppercase font-light"
                  style={{
                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif'
                  }}
                >
                  Preparing your culinary journey
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Minimal corner UI elements */}
          <div className="absolute top-6 left-6 text-white/20 text-xs tracking-wider font-mono">
            SYSTEM_INIT
          </div>
          <div className="absolute top-6 right-6 text-white/20 text-xs tracking-wider font-mono">
            v2.1.0
          </div>
          <div className="absolute bottom-6 right-6 text-white/20 text-xs tracking-wider font-mono">
            {new Date().toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;