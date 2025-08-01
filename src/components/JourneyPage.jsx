// src/pages/Journey.jsx
import React from 'react';
import { motion } from 'framer-motion';

const textChunks = ['e', 'ea', 'eat', 'eat &', 'ch', 'chi', 'chill'];

const Journey = () => {
  return (
    <div className="min-h-screen bg-black text-yellow-400 flex items-center justify-center">
      <div className="text-center">
        {textChunks.map((text, index) => (
          <motion.h1
            key={index}
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.4, duration: 0.6 }}
          >
            {text}
          </motion.h1>
        ))}
      </div>
    </div>
  );
};

export default JourneyPage;
