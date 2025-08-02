import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import MoodSelector from './components/MoodSelector';
import JourneyPage from './components/JourneyPage';
import ImageGrid from './components/ImageGrid';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState('mood-selector'); // 'mood-selector' | 'journey' | 'image-grid'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [transitionPhase, setTransitionPhase] = useState('expand');
  const [transitionDirection, setTransitionDirection] = useState('forward');

  // Show loader for 6.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 6500);
    return () => clearTimeout(timer);
  }, []);

  // Transition logic
  useEffect(() => {
    if (isTransitioning) {
      setTransitionPhase('expand');
      const shrinkTimer = setTimeout(() => {
        setTransitionPhase('shrink');
        const completeTimer = setTimeout(() => {
          setIsTransitioning(false);
          // Determine which page to show based on direction
          if (transitionDirection === 'forward') {
            setCurrentPage(currentPage === 'journey' ? 'image-grid' : 'journey');
          } else {
            setCurrentPage('journey');
          }
        }, 800);
        return () => clearTimeout(completeTimer);
      }, 1000);
      return () => clearTimeout(shrinkTimer);
    }
  }, [isTransitioning, currentPage, transitionDirection]);

  const handleJourneyStart = (mood) => {
    setSelectedMood(mood);
    setTransitionDirection('forward');
    setIsTransitioning(true);
  };

  const handleExploreMore = () => {
    setTransitionDirection('forward');
    setIsTransitioning(true);
  };

  const handleGoBack = () => {
    setTransitionDirection('backward');
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

  // Food icons for particle effect
  const foodIcons = ['🍕', '🍔', '🍟', '🌮', '🍣', '🍦', '🍩', '🍎'];

  return (
    <div className="relative">
      {/* Transition Overlay */}
      {isTransitioning && (
        <motion.div className="fixed inset-0 z-50 pointer-events-none">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${getOverlayGradient()}`}
            initial={{ 
              clipPath: transitionDirection === 'forward' 
                ? 'circle(0% at 80% 20%)' 
                : 'circle(0% at 20% 80%)',
              scale: 0.8 
            }}
            animate={
              transitionPhase === 'expand' 
                ? { 
                    clipPath: 'circle(150% at 50% 50%)', 
                    scale: 1,
                    transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }
                  }
                : { 
                    clipPath: transitionDirection === 'forward'
                      ? 'circle(0% at 20% 80%)'
                      : 'circle(0% at 80% 20%)',
                    scale: 0.8,
                    transition: { duration: 0.8, ease: [0.55, 0.06, 0.68, 0.19] }
                  }
            }
          />

          {/* Food particle explosion */}
          {transitionDirection === 'forward' && [...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: '50%',
                top: '50%',
                x: -16,
                y: -16
              }}
              animate={
                transitionPhase === 'expand'
                  ? {
                      x: [0, (Math.random() - 0.5) * 800],
                      y: [0, (Math.random() - 0.5) * 800],
                      rotate: [0, Math.random() * 360],
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      transition: { 
                        duration: 1.5, 
                        delay: i * 0.05,
                        ease: "easeOut"
                      }
                    }
                  : { scale: 0, opacity: 0 }
              }
            >
              {foodIcons[i % foodIcons.length]}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {showLoader ? (
          <Loader key="loader" />
        ) : currentPage === 'mood-selector' ? (
          <MoodSelector key="mood-selector" onJourneyStart={handleJourneyStart} />
        ) : currentPage === 'journey' ? (
          <JourneyPage 
            key="journey" 
            selectedMood={selectedMood} 
            onExploreMore={handleExploreMore}
          />
        ) : (
          <ImageGrid 
            key="image-grid" 
            selectedMood={selectedMood}
            onGoBack={handleGoBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;