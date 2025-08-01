import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// PageTransition Component
const PageTransition = ({ isTransitioning, onComplete, selectedMood }) => {
  const [phase, setPhase] = useState('expand'); // 'expand' | 'shrink'

  useEffect(() => {
    if (isTransitioning) {
      setPhase('expand');
      
      // Switch to shrink phase after expansion completes
      const timer = setTimeout(() => {
        setPhase('shrink');
        
        // Complete transition after shrink animation
        const completeTimer = setTimeout(() => {
          onComplete();
        }, 800);
        
        return () => clearTimeout(completeTimer);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, onComplete]);

  // Get overlay color based on selected mood
  const getOverlayGradient = () => {
    if (!selectedMood) return 'from-orange-400 via-yellow-400 to-amber-400';
    
    switch (selectedMood.id) {
      case 'happy':
        return 'from-yellow-400 via-orange-400 to-amber-500';
      case 'tired':
        return 'from-purple-400 via-violet-400 to-indigo-400';
      case 'sad':
        return 'from-blue-400 via-cyan-400 to-teal-400';
      case 'stressed':
        return 'from-red-400 via-pink-400 to-rose-400';
      default:
        return 'from-orange-400 via-yellow-400 to-amber-400';
    }
  };

  if (!isTransitioning) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main Overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getOverlayGradient()}`}
        initial={{ 
          clipPath: 'circle(0% at 80% 20%)',
          scale: 0.8 
        }}
        animate={phase === 'expand' ? {
          clipPath: 'circle(150% at 80% 20%)',
          scale: 1,
          transition: { 
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }
        } : {
          clipPath: 'circle(0% at 20% 80%)',
          scale: 0.8,
          transition: { 
            duration: 0.8,
            ease: [0.55, 0.06, 0.68, 0.19]
          }
        }}
      />

      {/* Floating Elements for Visual Interest */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full"
            style={{
              top: `${20 + (i * 15)}%`,
              left: `${10 + (i * 12)}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={phase === 'expand' ? {
              scale: [0, 1, 0.8, 1.2, 0],
              opacity: [0, 0.6, 0.8, 0.4, 0],
              y: [-20, 0, -10, 5, -30],
              transition: {
                duration: 2,
                delay: i * 0.1,
                ease: "easeInOut"
              }
            } : {
              scale: 0,
              opacity: 0,
              transition: { duration: 0.3 }
            }}
          />
        ))}
      </div>

      {/* Center Pulse Effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={phase === 'expand' ? {
          scale: [0, 1, 1.5, 0],
          opacity: [0, 0.3, 0.1, 0],
          transition: {
            duration: 1.5,
            ease: "easeOut"
          }
        } : {
          scale: 0,
          opacity: 0
        }}
      >
        <div className="w-32 h-32 bg-white/10 rounded-full blur-xl" />
      </motion.div>
    </motion.div>
  );
};

// Journey Component (Placeholder)
const Journey = ({ selectedMood }) => {
  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-br ${
        selectedMood?.background || 'from-orange-400 via-yellow-400 to-amber-400'
      } flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="text-center text-white">
        <motion.div
          className="text-6xl mb-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {selectedMood?.emoji || '🌍'}
        </motion.div>
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your {selectedMood?.name || 'Culinary'} Journey
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Get ready to explore amazing dishes that match your {selectedMood?.name.toLowerCase() || 'current'} mood!
        </motion.p>
        
        <motion.div
          className="mt-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-medium">Loading your personalized food adventure...</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Updated MoodSelector Component
const MoodSelector = ({ onStartJourney }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showJourneyButton, setShowJourneyButton] = useState(false);
  const [currentBackground, setCurrentBackground] = useState('from-purple-400 via-pink-500 to-red-500');

  const moods = [
    {
      id: 'happy',
      emoji: '😄',
      name: 'Happy',
      subtext: "Let's celebrate with vibrant flavors!",
      background: 'from-yellow-400 via-orange-500 to-red-500',
      color: 'text-yellow-600'
    },
    {
      id: 'tired',
      emoji: '😴',
      name: 'Tired',
      subtext: "Comfort food to recharge your soul",
      background: 'from-purple-400 via-purple-600 to-indigo-600',
      color: 'text-purple-600'
    },
    {
      id: 'sad',
      emoji: '😢',
      name: 'Sad',
      subtext: "Warming dishes to lift your spirits",
      background: 'from-blue-400 via-blue-600 to-cyan-600',
      color: 'text-blue-600'
    },
    {
      id: 'stressed',
      emoji: '😤',
      name: 'Stressed',
      subtext: "Spicy adventures to energize you",
      background: 'from-red-400 via-pink-500 to-rose-600',
      color: 'text-red-600'
    }
  ];

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setCurrentBackground(mood.background);
    setTimeout(() => setShowJourneyButton(true), 500);
  };

  const handleJourneyStart = () => {
    onStartJourney(selectedMood);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    selected: {
      scale: 1.1,
      y: -15,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const PlaneIcon = () => (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ x: -10, rotate: -15 }}
      animate={{ x: 0, rotate: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <path
        d="M20.56 3.44C21.15 4.03 21.15 4.97 20.56 5.56L5.56 20.56C4.97 21.15 4.03 21.15 3.44 20.56C2.85 19.97 2.85 19.03 3.44 18.44L18.44 3.44C19.03 2.85 19.97 2.85 20.56 3.44Z"
        fill="currentColor"
      />
      <path
        d="M10 2L14 6L12 8L8 4L10 2Z"
        fill="currentColor"
      />
      <path
        d="M16 12L20 16L18 18L14 14L16 12Z"
        fill="currentColor"
      />
    </motion.svg>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentBackground}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      
      {/* Background Animation Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content Layout */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* Left Side - Vertical Text Reveal Animation */}
          <motion.div
            className="flex-1 flex flex-col items-center lg:items-start justify-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Vertical Stacked Text Animation */}


            {/* Hero Heading */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                How are you
                <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  feeling today?
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/90 font-light max-w-md">
                Pick your mood and we'll take you on a culinary journey around the world
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Mood Cards Grid */}
          <motion.div
            className="flex-1 w-full max-w-2xl"
            variants={containerVariants}
          >
            <motion.div
              className="grid grid-cols-2 gap-4 md:gap-6"
              variants={containerVariants}
            >
              {moods.map((mood) => (
                <motion.div
                  key={mood.id}
                  variants={cardVariants}
                  whileHover="hover"
                  animate={selectedMood?.id === mood.id ? "selected" : "visible"}
                  className={`
                    relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 cursor-pointer
                    border border-white/20 hover:border-white/40 transition-all duration-300
                    ${selectedMood?.id === mood.id ? 'ring-4 ring-white/50 bg-white/20' : ''}
                  `}
                  onClick={() => handleMoodSelect(mood)}
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/20 to-white/10 opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      className="text-4xl md:text-6xl mb-3 md:mb-4"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {mood.emoji}
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">
                      {mood.name}
                    </h3>
                    <p className="text-white/80 text-xs md:text-sm leading-relaxed">
                      {mood.subtext}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  <AnimatePresence>
                    {selectedMood?.id === mood.id && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                      >
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Journey Start Button */}
        <AnimatePresence>
          {showJourneyButton && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-16"
            >
              <motion.button
                onClick={handleJourneyStart}
                className={`
                  group relative px-12 py-4 bg-white text-gray-800 rounded-full font-bold text-lg
                  shadow-2xl hover:shadow-3xl transition-all duration-300
                  flex items-center gap-3 mx-auto overflow-hidden
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button background animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Start Your Journey
                </span>
                <motion.div
                  className="relative z-10 group-hover:text-white transition-colors duration-300"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlaneIcon />
                </motion.div>

                {/* Sparkle effects */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </motion.div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('mood-selector'); // 'mood-selector' | 'journey'
  const [selectedMood, setSelectedMood] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartJourney = (mood) => {
    setSelectedMood(mood);
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setCurrentPage('journey');
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {currentPage === 'mood-selector' && (
          <motion.div
            key="mood-selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MoodSelector onStartJourney={handleStartJourney} />
          </motion.div>
        )}
        
        {currentPage === 'journey' && (
          <motion.div
            key="journey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Journey selectedMood={selectedMood} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Transition Overlay */}
      <PageTransition 
        isTransitioning={isTransitioning}
        onComplete={handleTransitionComplete}
        selectedMood={selectedMood}
      />
    </div>
  );
};

export default App;