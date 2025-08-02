import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import MoodSelector from './components/MoodSelector';
import JourneyPage from './components/JourneyPage';
// import ShowcasePage from './components/ShowcasePage';
import ImageGrid from './components/ImageGrid';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState('expand'); // 'expand' | 'shrink'

  // Show loader for 5 seconds (changed from 3.5s)
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 6500); // 5000ms = 5s
    return () => clearTimeout(timer);
  }, []);

  // Transition logic
  useEffect(() => {
    if (isTransitioning) {
      setTransitionPhase('expand');
      const shrinkTimer = setTimeout(() => {
        setTransitionPhase('shrink');
        const completeTimer = setTimeout(() => {
          setShowJourney(true);
          setIsTransitioning(false);
        }, 800); // Shrink duration
        return () => clearTimeout(completeTimer);
      }, 1000); // Expand duration
      return () => clearTimeout(shrinkTimer);
    }
  }, [isTransitioning]);

  const handleJourneyStart = (mood) => {
    setSelectedMood(mood);
    setIsTransitioning(true);
  };

  // Dynamic gradient based on mood
  const getOverlayGradient = () => {
    if (!selectedMood) return 'from-orange-400 via-yellow-400 to-amber-400';
    switch (selectedMood.id) {
      case 'happy': return 'from-yellow-400 via-orange-400 to-amber-500';
      case 'tired': return 'from-purple-400 via-violet-400 to-indigo-400';
      case 'sad': return 'from-blue-400 via-cyan-400 to-teal-400';
      case 'stressed': return 'from-red-400 via-pink-400 to-rose-400';
      default: return 'from-orange-400 via-yellow-400 to-amber-400';
    }
  };

  return (
    <div className="relative">
      {/* Transition Overlay (Internal) */}
      {isTransitioning && (
        <motion.div className="fixed inset-0 z-50 pointer-events-none">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getOverlayGradient()}`}
            initial={{ clipPath: 'circle(0% at 80% 20%)', scale: 0.8 }}
            animate={
              transitionPhase === 'expand' 
                ? { 
                    clipPath: 'circle(150% at 80% 20%)', 
                    scale: 1,
                    transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }
                  }
                : { 
                    clipPath: 'circle(0% at 20% 80%)', 
                    scale: 0.8,
                    transition: { duration: 0.8, ease: [0.55, 0.06, 0.68, 0.19] }
                  }
            }
          />

          {/* Optional floating elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{
                top: `${20 + (i * 15)}%`,
                left: `${10 + (i * 12)}%`,
              }}
              animate={
                transitionPhase === 'expand'
                  ? {
                      scale: [0, 1, 0.8, 1.2, 0],
                      opacity: [0, 0.6, 0.8, 0.4, 0],
                      y: [-20, 0, -10, 5, -30],
                      transition: { duration: 2, delay: i * 0.1 }
                    }
                  : { scale: 0, opacity: 0 }
              }
            />
          ))}
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {showLoader ? (
          <Loader key="loader" />
        ) : showJourney ? (
          <JourneyPage key="journey" selectedMood={selectedMood} />
        ) : (
          <MoodSelector key="mood-selector" onJourneyStart={handleJourneyStart} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;