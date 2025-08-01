// src/App.jsx
import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import MoodSelector from './components/MoodSelector';
// import JourneyPage from './components/JourneyPage';
import TransitionOverlay from './components/TransitionOverlay';

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [showJourney, setShowJourney] = useState(false);

  // Show loader for 3.5 seconds
  useEffect(() => {
    const loaderTimer = setTimeout(() => setShowLoader(false), 3500);
    return () => clearTimeout(loaderTimer);
  }, []);

  const handleJourneyStart = () => {
    setShowTransition(true);

    setTimeout(() => {
      setShowJourney(true);
      setShowTransition(false);
    }, 1600); // Matches transition duration
  };

  return (
    <>
      <TransitionOverlay show={showTransition} onComplete={() => {}} />

      {showLoader ? (
        <Loader />
      ) : showJourney ? (
        <JourneyPage />
      ) : (
        <MoodSelector onJourneyStart={handleJourneyStart} />
      )}
    </>
  );
}

export default App;
