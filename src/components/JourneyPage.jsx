import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const Journey = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [showImageGrid, setShowImageGrid] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);
  const particleId = useRef(0);

  // Premium showcase projects
  const showcaseProjects = [
   {
    id: 1,
    primary: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=800&fit=crop&auto=format',
    secondary: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=800&fit=crop&auto=format',
    title: 'Golden Dusk Platter',
    category: 'Fine Dining'
  },
  {
    id: 2,
    primary: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=800&fit=crop&auto=format',
    secondary: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=800&fit=crop&auto=format',
    title: 'Rustic Brunch Spread',
    category: 'Brunch'
  },
  {
    id: 3,
    primary: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&h=800&fit=crop&auto=format',
    secondary: 'https://images.unsplash.com/photo-1617196035154-1e1b6b8b1e1d?w=600&h=800&fit=crop&auto=format',
    title: 'Sushi Artistry',
    category: 'Japanese Cuisine'
  },
  {
    id: 4,
    primary: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop&auto=format',
    secondary: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=800&fit=crop&auto=format',
    title: 'Fusion Tasting',
    category: 'Modern Fusion'
  },
  {
    id: 5,
    primary: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=800&fit=crop&auto=format',
    secondary: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=800&fit=crop&auto=format',
    title: 'Decadent Desserts',
    category: 'Patisserie'
  },
  {
    id: 6,
    primary: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&h=800&fit=crop&auto=format',
    secondary: 'https://images.unsplash.com/photo-1529566652340-4bdc31b1c1f4?w=600&h=800&fit=crop&auto=format',
    title: 'Street Food Fiesta',
    category: 'Global Street Food'
  }
];

  // Clean transition handler - no complex phase management
  const handleImageGridTransition = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      // Simple delay before showing image grid
      setTimeout(() => {
        setShowImageGrid(true);
        setIsTransitioning(false);
      }, 800);
    }
  };

  const handleBackToJourney = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setShowImageGrid(false);
        setIsTransitioning(false);
      }, 500);
    }
  };

  // Handle window dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Simplified particle system - only for journey page
  const createParticle = useCallback((x, y, velocityX = 0, velocityY = 0) => {
    if (showImageGrid) return; // Don't create particles on image grid page
    
    const id = particleId.current++;
    
    const particle = {
      id,
      type: 'sparkle',
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: velocityX * 0.1 + (Math.random() - 0.5) * 0.8,
      vy: velocityY * 0.1 + (Math.random() - 0.5) * 0.8,
      life: 1,
      maxLife: 1,
      decay: 0.015 + Math.random() * 0.01,
      size: 1.5 + Math.random() * 2.5,
      baseSize: 1.5 + Math.random() * 2.5,
      hue: 45 + Math.random() * 15,
      saturation: 85 + Math.random() * 15,
      lightness: 70 + Math.random() * 20,
      alpha: 0.8 + Math.random() * 0.2,
      shimmer: Math.random() * Math.PI * 2,
      shimmerSpeed: 0.1 + Math.random() * 0.1
    };
    
    setParticles(prev => [...prev.slice(-50), particle]); // Reduced particle count
  }, [showImageGrid]);

  // Mouse movement handler - only for journey page
  useEffect(() => {
    if (showImageGrid) return; // Don't track mouse on image grid page
    
    let lastTime = 0;
    let lastPosition = { x: 0, y: 0 };
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      const currentPosition = { x: e.clientX, y: e.clientY };
      
      const deltaTime = now - lastTime;
      const velocityX = deltaTime > 0 ? (currentPosition.x - lastPosition.x) / deltaTime * 10 : 0;
      const velocityY = deltaTime > 0 ? (currentPosition.y - lastPosition.y) / deltaTime * 10 : 0;
      
      setMousePosition(currentPosition);
      
      if (now - lastTime > 50) { // Reduced frequency
        createParticle(currentPosition.x, currentPosition.y, velocityX, velocityY);
        lastTime = now;
      }
      
      lastPosition = currentPosition;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createParticle, showImageGrid]);

  // Particle animation - only for journey page
  useEffect(() => {
    if (showImageGrid) {
      setParticles([]); // Clear particles when showing image grid
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(14, 14, 14, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      setParticles(prev => {
        const updated = prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - particle.decay,
            vx: particle.vx * 0.985,
            vy: particle.vy * 0.985,
            shimmer: particle.shimmer + particle.shimmerSpeed,
            size: particle.baseSize * (0.3 + 0.7 * particle.life)
          }))
          .filter(particle => particle.life > 0);
        
        updated.forEach(particle => {
          if (particle.life > 0) {
            const fadeAlpha = Math.pow(particle.life / particle.maxLife, 1.5);
            const shimmerIntensity = 1 + Math.sin(particle.shimmer) * 0.3;
            
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, particle.size * 2
            );
            
            gradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + shimmerIntensity * 10}%, ${fadeAlpha * particle.alpha})`);
            gradient.addColorStop(0.4, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${fadeAlpha * particle.alpha * 0.8})`);
            gradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation - 40}%, ${particle.lightness - 20}%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * shimmerIntensity, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        
        return updated;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions, showImageGrid]);

  // Auto-scroll functionality - only for journey page
  useEffect(() => {
    if (showImageGrid) return;
    
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (!isGalleryHovered && scrollContainer && !showImageGrid) {
        scrollContainer.scrollLeft += 0.8;
        
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollContainer.scrollLeft = 0;
        }
        
        animationRef.current = requestAnimationFrame(scroll);
      }
    };
    
    if (!isGalleryHovered) {
      animationRef.current = requestAnimationFrame(scroll);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isGalleryHovered, showImageGrid]);

  // Calculate text transforms based on mouse position - only for journey page
  const getTextTransform = () => {
    if (showImageGrid) return 'translate3d(0, 0, 0)';
    
    const xPercent = (mousePosition.x / dimensions.width) * 100;
    const yPercent = (mousePosition.y / dimensions.height) * 100;
    
    const translateX = (xPercent - 50) * 0.4;
    const translateY = (yPercent - 50) * 0.2;
    const rotateY = (xPercent - 50) * 0.1;
    const rotateX = (50 - yPercent) * 0.05;
    
    return `translate3d(${translateX}px, ${translateY}px, 0) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  // ImageGrid Component
  const ImageGrid = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });
    const [imagesLoaded, setImagesLoaded] = useState({});

    const handleImageLoad = (imageId) => {
      setImagesLoaded(prev => ({
        ...prev,
        [imageId]: true
      }));
    };

    const foodImages = [
      {
        id: 1,
        src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=1200&fit=crop&crop=center',
        alt: 'Artisan sourdough bread with rustic crust',
        size: 'large',
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
      }
    ];

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
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    };

    return (
      <section 
        ref={containerRef}
        className="min-h-screen bg-black relative overflow-hidden py-20 px-6 md:px-12"
      >
        {/* Back Button */}
        <motion.button
          onClick={handleBackToJourney}
          className="fixed top-8 left-8 z-50 group bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-white hover:bg-white/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Journey</span>
          </div>
        </motion.button>

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

        {/* Image Grid */}
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-4 auto-rows-max gap-6">
            {foodImages.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
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
  const ImageCard = ({ image, sizeClasses, variants, onLoad, isLoaded }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const isCardInView = useInView(cardRef, { once: true, margin: '-50px' });

    return (
      <motion.div
        ref={cardRef}
        className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-900 ${sizeClasses}`}
        variants={variants}
        animate={{
          scale: isHovered ? 1.02 : 1,
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        layout
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

  return (
    <div className="relative">
      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500 via-amber-500 to-orange-500"
              initial={{ clipPath: 'circle(0% at 50% 50%)' }}
              animate={{ clipPath: 'circle(150% at 50% 50%)' }}
              exit={{ clipPath: 'circle(0% at 50% 50%)' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showImageGrid ? (
          <motion.div
            key="image-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-black"
          >
            <ImageGrid />
          </motion.div>
        ) : (
          <motion.div 
            key="journey"
            className="min-h-screen bg-gradient-to-br from-[#0e0e0e] via-[#1a1a1a] to-[#0e0e0e] relative overflow-hidden"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cursor Trail Canvas - Only visible on journey page */}
            <canvas 
              ref={canvasRef}
              className="fixed inset-0 pointer-events-none z-50"
              style={{ mixBlendMode: 'screen' }}
            />

            {/* Hero Section */}
            <div className="px-8 py-20 text-center max-w-6xl mx-auto relative z-10">
              <h1 
                className="text-7xl md:text-9xl font-light text-white mb-8 tracking-tight leading-none transition-transform duration-300 ease-out"
                style={{
                  transform: getTextTransform(),
                  transformStyle: 'preserve-3d'
                }}
              >
                Curated
                <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 bg-clip-text text-transparent font-medium">
                  Experiences
                </span>
              </h1>
              
              <p 
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-300 mb-12"
                style={{
                  transform: `translateX(${(mousePosition.x / dimensions.width - 0.5) * 10}px)`,
                  opacity: 0.7 + (mousePosition.y / dimensions.height) * 0.3
                }}
              >
                Explore our meticulously designed collection where innovation meets artistry, 
                creating spaces that transcend the ordinary.
              </p>

              {/* Navigation Button - Only responds to clicks */}
              <motion.button
                onClick={handleImageGridTransition}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-purple-500/20 backdrop-blur-md border border-amber-400/30 rounded-full px-8 py-4 text-white font-medium transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isTransitioning}
              >
                <span className="relative z-10">Explore Gallery</span>
                <svg 
                  className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-purple-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10" />
              </motion.button>
            </div>

            {/* Interactive Floating Headline */}
            <div className="relative z-20 mb-8">
              <h2 
                className="text-center text-4xl md:text-6xl font-light text-white/90 tracking-wide transition-all duration-500 ease-out"
                style={{
                  transform: `translate3d(${(mousePosition.x / dimensions.width - 0.5) * 30}px, ${(mousePosition.y / dimensions.height - 0.5) * 16}px, 0) rotateY(${(mousePosition.x / dimensions.width - 0.5) * 10}deg) rotateX(${(0.5 - mousePosition.y / dimensions.height) * 4}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <span className="inline-block transition-all duration-300 hover:scale-105 hover:text-amber-400">
                  Explore
                </span>
                {' '}
                <span className="inline-block transition-all duration-300 hover:scale-105 hover:text-purple-400">
                  Our
                </span>
                {' '}
                <span className="inline-block bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent transition-transform duration-300 hover:scale-110">
                  Moodboards
                </span>
              </h2>
            </div>

            {/* Auto-Scrolling Gallery */}
            <div className="relative z-10">
              <div
                className="overflow-x-auto py-12"
                ref={scrollContainerRef}
                onMouseEnter={() => setIsGalleryHovered(true)}
                onMouseLeave={() => {
                  setIsGalleryHovered(false);
                  setHoveredCard(null);
                }}
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <div className="flex gap-8 px-8" style={{ width: 'max-content' }}>
                  {[...showcaseProjects, ...showcaseProjects, ...showcaseProjects].map((project, index) => (
                    <ProjectCard
                      key={`${project.id}-${index}`}
                      project={project}
                      isHovered={hoveredCard === `${project.id}-${index}`}
                      onHover={() => setHoveredCard(`${project.id}-${index}`)}
                      onLeave={() => setHoveredCard(null)}
                    />
                  ))}
                </div>
              </div>

              {/* Edge Gradients */}
              <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0e0e0e] via-[#0e0e0e]/80 to-transparent pointer-events-none z-20" />
            </div>

            {/* Bottom Section */}
            <div className="px-8 py-24 text-center relative z-10">
              <p 
                className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed transition-transform duration-300"
                style={{
                  transform: `translateY(${(mousePosition.y / dimensions.height - 0.5) * -6}px)`
                }}
              >
                Every project represents a journey of discovery, where meticulous attention 
                to detail creates environments that inspire and transform.
              </p>
            </div>

            <style jsx>{`
              /* Hide scrollbar */
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ project, isHovered, onHover, onLeave }) => {
  return (
    <div
      className="relative group cursor-pointer flex-shrink-0 transition-all duration-500 ease-out hover:scale-108 hover:-translate-y-2"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        transform: isHovered ? 'scale(1.08) translateY(-10px)' : 'scale(1) translateY(0)',
        transition: 'transform 0.5s ease-out'
      }}
    >
      <div className="relative w-80 h-[28rem] md:w-96 md:h-[32rem] rounded-3xl overflow-hidden bg-gray-900">
        {/* Primary Image */}
        <img
          src={project.primary}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-800 ease-out"
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
        
        {/* Secondary Image Crossfade */}
        <img
          src={project.secondary}
          alt={`${project.title} alternate`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ease-in-out"
          style={{
            opacity: isHovered ? 0.7 : 0
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-400"
          style={{
            opacity: isHovered ? 0.8 : 0.3
          }}
        />
        
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-purple-500/10 transition-opacity duration-400"
          style={{
            opacity: isHovered ? 1 : 0
          }}
        />
        
        {/* Content */}
        <div 
          className="absolute bottom-8 left-8 right-8 transition-all duration-400"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)'
          }}
        >
          <p className="text-amber-400 text-sm font-medium tracking-wider uppercase mb-2">
            {project.category}
          </p>
          <h3 className="text-white text-2xl md:text-3xl font-light tracking-wide">
            {project.title}
          </h3>
        </div>

        {/* Inner Shadow */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ 
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.3), inset 0 0 20px rgba(168,85,247,0.1)' 
          }} 
        />
      </div>
    </div>
  );
};

export default Journey;