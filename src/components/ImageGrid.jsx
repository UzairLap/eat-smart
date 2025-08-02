import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const ImageGrid = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [imagesLoaded, setImagesLoaded] = useState({});

  // Curated food experience images with different aspect ratios for asymmetrical layout
  // TODO: Replace these placeholder URLs with actual high-resolution food photography
  const foodImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=1200&fit=crop&crop=center',
      alt: 'Artisan sourdough bread with rustic crust',
      size: 'large', // Controls grid placement and size
      category: 'Artisan Breads'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop&crop=center',
      alt: 'Farm-fresh seasonal vegetables arrangement',
      size: 'medium',
      category: 'Farm to Table'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=750&fit=crop&crop=center',
      alt: 'Handcrafted pasta with heritage grains',
      size: 'tall',
      category: 'Pasta & Grains'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&h=500&fit=crop&crop=center',
      alt: 'Seasonal comfort food in ceramic bowls',
      size: 'wide',
      category: 'Comfort Food'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600&h=800&fit=crop&crop=center',
      alt: 'Heritage tomatoes with fresh herbs',
      size: 'medium',
      category: 'Garden Fresh'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&crop=center',
      alt: 'Artisanal cheese and charcuterie selection',
      size: 'wide',
      category: 'Charcuterie'
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=700&fit=crop&crop=center',
      alt: 'Freshly baked pastries with golden crust',
      size: 'tall',
      category: 'Pastries'
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop&crop=center',
      alt: 'Modern plating techniques with microgreens',
      size: 'medium',
      category: 'Fine Dining'
    },
    {
      id: 9,
      src: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=1000&fit=crop&crop=center',
      alt: 'Organic ingredients in natural lighting',
      size: 'large',
      category: 'Organic'
    },
    {
      id: 10,
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=700&h=500&fit=crop&crop=center',
      alt: 'Traditional cooking methods and techniques',
      size: 'wide',
      category: 'Traditional'
    },
    {
      id: 11,
      src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=900&fit=crop&crop=center',
      alt: 'Fermented foods and preservation',
      size: 'tall',
      category: 'Fermentation'
    },
    {
      id: 12,
      src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop&crop=center',
      alt: 'Minimalist food presentation',
      size: 'small',
      category: 'Minimalist'
    }
  ];

  // Handle image load for progressive enhancement
  const handleImageLoad = (imageId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  // Grid size classes for asymmetrical layout
  const getSizeClasses = (size) => {
    switch (size) {
      case 'large':
        return 'col-span-2 row-span-2 h-96 md:h-[500px]';
      case 'wide':
        return 'col-span-2 h-48 md:h-64';
      case 'tall':
        return 'col-span-1 row-span-2 h-80 md:h-96';
      case 'small':
        return 'col-span-1 h-32 md:h-40';
      case 'medium':
      default:
        return 'col-span-1 h-48 md:h-56';
    }
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for premium feel
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-black relative overflow-hidden py-20 px-6 md:px-12"
    >
      {/* Section Header */}
      <motion.div 
        className="max-w-7xl mx-auto mb-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
          Culinary
          <span className="block text-amber-400 font-medium">Artistry</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover the intersection of tradition and innovation, where each dish 
          tells a story of passion, technique, and seasonal inspiration.
        </p>
      </motion.div>

      {/* Asymmetrical Image Grid */}
      <motion.div
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-4 auto-rows-max gap-6">
          {foodImages.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              index={index}
              sizeClasses={getSizeClasses(image.size)}
              variants={imageVariants}
              onLoad={() => handleImageLoad(image.id)}
              isLoaded={imagesLoaded[image.id]}
            />
          ))}
        </div>

        {/* Mobile Grid Layout */}
        <div className="md:hidden grid grid-cols-2 auto-rows-max gap-4">
          {foodImages.map((image, index) => (
            <ImageCard
              key={`mobile-${image.id}`}
              image={image}
              index={index}
              sizeClasses={index % 3 === 0 ? 'col-span-2 h-48' : 'col-span-1 h-40'}
              variants={imageVariants}
              onLoad={() => handleImageLoad(`mobile-${image.id}`)}
              isLoaded={imagesLoaded[`mobile-${image.id}`]}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};

// Individual Image Card Component
const ImageCard = ({ image, index, sizeClasses, variants, onLoad, isLoaded }) => {
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-900 ${sizeClasses}`}
      variants={variants}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}

      {/* Main Image */}
      {!imageError && (
        <motion.img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          loading="lazy"
          onLoad={onLoad}
          onError={() => setImageError(true)}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={isCardInView ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
        />
      )}

      {/* Error Fallback */}
      {imageError && (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="w-12 h-12 mx-auto mb-3 opacity-50">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.4 }}
      />

      {/* Category Label */}
      <motion.div 
        className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100"
        initial={{ y: 20 }}
        whileHover={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className="text-amber-400 text-sm font-medium tracking-wider uppercase mb-1">
          {image.category}
        </p>
        <h3 className="text-white text-lg font-light tracking-wide line-clamp-2">
          {image.alt}
        </h3>
      </motion.div>

      {/* Subtle Inner Shadow */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ 
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' 
        }} 
      />

      {/* Hover Glow Effect */}
      <motion.div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ 
          boxShadow: '0 0 40px rgba(251, 191, 36, 0.15)' 
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

export default ImageGrid;