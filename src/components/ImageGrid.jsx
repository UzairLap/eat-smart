import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const ImageGrid = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [imagesLoaded, setImagesLoaded] = useState({});
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);

  // Enhanced food images with better categorization
  const foodImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=1200&fit=crop&crop=center',
      alt: 'Artisan sourdough bread with rustic crust',
      size: 'large',
      category: 'Artisan Breads',
      row: 0
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=400&fit=crop&crop=center',
      alt: 'Farm-fresh seasonal vegetables arrangement',
      size: 'medium',
      category: 'Farm to Table',
      row: 0
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=750&fit=crop&crop=center',
      alt: 'Handcrafted pasta with heritage grains',
      size: 'tall',
      category: 'Pasta & Grains',
      row: 1
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=700&h=500&fit=crop&crop=center',
      alt: 'Seasonal comfort food in ceramic bowls',
      size: 'wide',
      category: 'Comfort Food',
      row: 1
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600&h=800&fit=crop&crop=center',
      alt: 'Heritage tomatoes with fresh herbs',
      size: 'medium',
      category: 'Garden Fresh',
      row: 2
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop&crop=center',
      alt: 'Artisanal cheese and charcuterie selection',
      size: 'wide',
      category: 'Charcuterie',
      row: 2
    },
    {
      id: 7,
      src: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=700&fit=crop&crop=center',
      alt: 'Freshly baked pastries with golden crust',
      size: 'tall',
      category: 'Pastries',
      row: 3
    },
    {
      id: 8,
      src: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop&crop=center',
      alt: 'Modern plating techniques with microgreens',
      size: 'medium',
      category: 'Fine Dining',
      row: 3
    }
  ];

  // Chef data
  const chefs = [
    {
      id: 1,
      name: 'Chef Matteo Rossi',
      role: 'Executive Chef',
      specialty: 'Italian Cuisine',
      image: 'https://images.unsplash.com/photo-1583394293214-28a5b89f5ab0?w=600&h=600&fit=crop&crop=face',
      bio: 'With over 15 years of experience in Michelin-starred kitchens across Italy and France, Chef Rossi brings authentic Italian passion to every dish.'
    },
    {
      id: 2,
      name: 'Chef Aria Tanaka',
      role: 'Pastry Chef',
      specialty: 'Sugar Artist',
      image: 'https://images.unsplash.com/photo-1594736797933-d0301ba2fe65?w=600&h=600&fit=crop&crop=face',
      bio: 'A master of molecular gastronomy and traditional Japanese confectionery, Chef Tanaka creates edible art that delights all the senses.'
    },
    {
      id: 3,
      name: 'Chef Luis Mendoza',
      role: 'Farm-to-Table Chef',
      specialty: 'Sustainable Cuisine',
      image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91b?w=600&h=600&fit=crop&crop=face',
      bio: 'A pioneer in sustainable cooking, Chef Mendoza works directly with local farmers to create innovative dishes that celebrate seasonal ingredients.'
    }
  ];

  const handleImageLoad = (imageId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

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

  // Enhanced animation variants for row-based staggering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      y: 80,
      scale: 0.9,
      rotateX: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  // Group images by rows
  const imageRows = foodImages.reduce((acc, image) => {
    if (!acc[image.row]) acc[image.row] = [];
    acc[image.row].push(image);
    return acc;
  }, {});

  return (
    <div className="bg-black">
      {/* Image Grid Section */}
      <section 
        ref={containerRef}
        className="min-h-screen bg-black relative overflow-hidden py-20 px-6 md:px-12"
      >
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
        </motion.div>

        {/* Section Header */}
        <motion.div 
          className="max-w-7xl mx-auto mb-20 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ opacity }}
        >
          <motion.h2 
            className="text-6xl md:text-8xl font-light text-white mb-8 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            Culinary
            <motion.span 
              className="block text-amber-400 font-medium"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              Artistry
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            Discover the intersection of tradition and innovation, where each dish 
            tells a story of passion, technique, and seasonal inspiration.
          </motion.p>
        </motion.div>

        {/* Enhanced Image Grid */}
        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Desktop Grid Layout */}
          <div className="hidden md:block">
            {Object.entries(imageRows).map(([rowIndex, images]) => (
              <motion.div
                key={`row-${rowIndex}`}
                className="grid grid-cols-4 auto-rows-max gap-6 mb-6"
                variants={rowVariants}
              >
                {images.map((image, index) => (
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
              </motion.div>
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
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none z-20" />
      </section>

      {/* Meet the Chefs Section */}
      <ChefsSection chefs={chefs} />
    </div>
  );
};

// Enhanced Image Card Component
const ImageCard = ({ image, index, sizeClasses, variants, onLoad, isLoaded }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      className={`relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-900 ${sizeClasses}`}
      variants={variants}
      whileHover={{ 
        scale: 1.03,
        rotateY: 5,
        z: 50,
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
          <motion.div 
            className="w-full h-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          />
        </div>
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
          initial={{ scale: 1.2, opacity: 0 }}
          animate={isCardInView ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.1 }}
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

      {/* Enhanced Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.5 }}
      />

      {/* Category Label with Enhanced Animation */}
      <motion.div 
        className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100"
        initial={{ y: 30, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.p 
          className="text-amber-400 text-sm font-medium tracking-wider uppercase mb-2"
          initial={{ x: -20 }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {image.category}
        </motion.p>
        <motion.h3 
          className="text-white text-lg font-light tracking-wide line-clamp-2"
          initial={{ x: -20 }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {image.alt}
        </motion.h3>
      </motion.div>

      {/* Premium Glow Effects */}
      <motion.div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ 
          boxShadow: '0 0 60px rgba(251, 191, 36, 0.3), inset 0 0 60px rgba(0,0,0,0.4)' 
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Ambient Light Effect */}
      <motion.div
        className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-30 pointer-events-none blur-xl"
        style={{
          background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.4) 0%, transparent 70%)'
        }}
        animate={isHovered ? { scale: 1.1, opacity: 0.3 } : { scale: 1, opacity: 0 }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  );
};

// Meet the Chefs Section Component
const ChefsSection = ({ chefs }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedChef, setSelectedChef] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      rotateX: 15
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-20 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Section Header */}
      <motion.div 
        className="max-w-7xl mx-auto mb-16 text-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h2 
          className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Meet the
          <span className="block text-amber-400 font-medium">Chefs</span>
        </motion.h2>
        <motion.p 
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Our culinary artists bring passion, innovation, and years of expertise 
          to create unforgettable dining experiences.
        </motion.p>
      </motion.div>

      {/* Chef Cards */}
      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {chefs.map((chef) => (
            <ChefCard
              key={chef.id}
              chef={chef}
              variants={cardVariants}
              onClick={() => setSelectedChef(chef)}
            />
          ))}
        </div>
      </motion.div>

      {/* Chef Modal */}
      <AnimatePresence>
        {selectedChef && (
          <ChefModal 
            chef={selectedChef} 
            onClose={() => setSelectedChef(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// Individual Chef Card Component
const ChefCard = ({ chef, variants, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const isCardInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      variants={variants}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Main Card */}
      <motion.div 
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden"
        whileHover={{ 
          scale: 1.02,
          rotateY: 5,
          transition: { duration: 0.4 }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Chef Image */}
        <div className="relative h-80 md:h-96 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
          )}
          
          <motion.img
            src={chef.image}
            alt={chef.name}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={isCardInView ? { scale: 1, opacity: 1 } : { scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            whileHover={{ scale: 1.1 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          
          {/* Hover Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-amber-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Chef Info */}
        <div className="relative p-8">
          <motion.h3 
            className="text-2xl md:text-3xl font-light text-white mb-2 tracking-wide"
            initial={{ x: -20, opacity: 0 }}
            animate={isCardInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {chef.name}
          </motion.h3>
          
          <motion.p 
            className="text-amber-400 text-lg font-medium mb-1"
            initial={{ x: -20, opacity: 0 }}
            animate={isCardInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {chef.role}
          </motion.p>
          
          <motion.p 
            className="text-gray-300 text-base"
            initial={{ x: -20, opacity: 0 }}
            animate={isCardInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {chef.specialty}
          </motion.p>

          {/* Click Indicator */}
          <motion.div
            className="absolute bottom-4 right-4 text-amber-400 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            animate={isHovered ? { scale: 1, rotate: 360 } : { scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </motion.div>
        </div>

        {/* Border Glow Animation */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            boxShadow: '0 0 0 2px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1)'
          }}
          animate={isHovered ? { 
            boxShadow: [
              '0 0 0 2px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1)',
              '0 0 0 2px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.2)',
              '0 0 0 2px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

// Chef Modal Component
const ChefModal = ({ chef, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Chef Image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
          <img
            src={chef.image}
            alt={chef.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        </div>

        {/* Chef Details */}
        <div className="p-8">
          <h2 className="text-4xl font-light text-white mb-2">{chef.name}</h2>
          <p className="text-amber-400 text-xl font-medium mb-1">{chef.role}</p>
          <p className="text-gray-300 text-lg mb-6">{chef.specialty}</p>
          <p className="text-gray-200 leading-relaxed">{chef.bio}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageGrid;