import React, { useState, useEffect, useRef, useCallback } from 'react';

const Journey = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);
  const particleId = useRef(0);

  // Premium showcase projects
  const showcaseProjects = [
   {
    id: 1,
    primary: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=800&fit=crop&auto=format', // Premium golden-hour steak dish
    secondary: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=800&fit=crop&auto=format', // Elegant plated dessert
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

  // Luxury particle system for cursor trail
  const createParticle = useCallback((x, y, velocityX = 0, velocityY = 0) => {
    const id = particleId.current++;
    
    // Create multiple particle types for richness
    const particleTypes = [
      // Golden sparkles (main trail)
      {
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
        hue: 45 + Math.random() * 15, // Pure golden range
        saturation: 85 + Math.random() * 15,
        lightness: 70 + Math.random() * 20,
        alpha: 0.8 + Math.random() * 0.2,
        shimmer: Math.random() * Math.PI * 2,
        shimmerSpeed: 0.1 + Math.random() * 0.1
      },
      // Soft glow particles (ambient)
      {
        type: 'glow',
        x: x + (Math.random() - 0.5) * 15,
        y: y + (Math.random() - 0.5) * 15,
        vx: velocityX * 0.05 + (Math.random() - 0.5) * 0.3,
        vy: velocityY * 0.05 + (Math.random() - 0.5) * 0.3,
        life: 1,
        maxLife: 1,
        decay: 0.008 + Math.random() * 0.007,
        size: 3 + Math.random() * 4,
        baseSize: 3 + Math.random() * 4,
        hue: 35 + Math.random() * 25, // Warm golden tones
        saturation: 60 + Math.random() * 20,
        lightness: 60 + Math.random() * 15,
        alpha: 0.3 + Math.random() * 0.2,
        shimmer: 0,
        shimmerSpeed: 0
      }
    ];
    
    // Randomly select particle type (80% sparkles, 20% glow)
    const selectedType = Math.random() < 0.8 ? particleTypes[0] : particleTypes[1];
    
    const particle = {
      id,
      ...selectedType
    };
    
    setParticles(prev => [...prev.slice(-80), particle]); // Increased limit for richer effect
  }, []);

  // Enhanced mouse movement handler with velocity tracking
  useEffect(() => {
    let lastTime = 0;
    let lastPosition = { x: 0, y: 0 };
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      const currentPosition = { x: e.clientX, y: e.clientY };
      
      // Calculate velocity for more dynamic particles
      const deltaTime = now - lastTime;
      const velocityX = deltaTime > 0 ? (currentPosition.x - lastPosition.x) / deltaTime * 10 : 0;
      const velocityY = deltaTime > 0 ? (currentPosition.y - lastPosition.y) / deltaTime * 10 : 0;
      
      setMousePosition(currentPosition);
      
      // Create particles more frequently for smoother trail (every 25ms)
      if (now - lastTime > 25) {
        // Create 2-3 particles per frame for richer effect
        const particleCount = Math.min(3, Math.max(1, Math.abs(velocityX) + Math.abs(velocityY)) / 5);
        
        for (let i = 0; i < particleCount; i++) {
          setTimeout(() => {
            createParticle(
              currentPosition.x, 
              currentPosition.y, 
              velocityX, 
              velocityY
            );
          }, i * 8); // Slight delay between particles
        }
        
        lastTime = now;
      }
      
      lastPosition = currentPosition;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createParticle]);

  // Luxury particle animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const updateCanvasSize = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
    };
    
    updateCanvasSize();
    
    const animate = () => {
      // Clear with slight trail effect for smoother motion
      ctx.fillStyle = 'rgba(14, 14, 14, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      setParticles(prev => {
        const updated = prev
          .map(particle => {
            // Update particle physics
            const newParticle = {
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              life: particle.life - particle.decay,
              vx: particle.vx * 0.985, // Slight air resistance
              vy: particle.vy * 0.985,
              shimmer: particle.shimmer + particle.shimmerSpeed
            };
            
            // Dynamic size based on life for organic feel
            newParticle.size = newParticle.baseSize * (0.3 + 0.7 * newParticle.life);
            
            return newParticle;
          })
          .filter(particle => particle.life > 0);
        
        // Render particles with luxury effects
        updated.forEach(particle => {
          if (particle.life > 0) {
            const fadeAlpha = Math.pow(particle.life / particle.maxLife, 1.5);
            const shimmerIntensity = 1 + Math.sin(particle.shimmer) * 0.3;
            
            if (particle.type === 'sparkle') {
              // Golden sparkle with shimmer effect
              const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
              );
              
              // Core golden glow
              gradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + shimmerIntensity * 10}%, ${fadeAlpha * particle.alpha})`);
              gradient.addColorStop(0.4, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${fadeAlpha * particle.alpha * 0.8})`);
              gradient.addColorStop(0.7, `hsla(${particle.hue}, ${particle.saturation - 20}%, ${particle.lightness - 10}%, ${fadeAlpha * particle.alpha * 0.4})`);
              gradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation - 40}%, ${particle.lightness - 20}%, 0)`);
              
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size * shimmerIntensity, 0, Math.PI * 2);
              ctx.fill();
              
              // Add bright core highlight
              if (fadeAlpha > 0.7) {
                ctx.fillStyle = `hsla(${particle.hue}, 100%, 90%, ${fadeAlpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
              }
              
            } else if (particle.type === 'glow') {
              // Soft ambient glow
              const glowGradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 1.5
              );
              
              glowGradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${fadeAlpha * particle.alpha * 0.6})`);
              glowGradient.addColorStop(0.5, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness - 5}%, ${fadeAlpha * particle.alpha * 0.3})`);
              glowGradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation - 10}%, ${particle.lightness - 10}%, 0)`);
              
              ctx.fillStyle = glowGradient;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
            }
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
  }, [dimensions]);

  // Auto-scroll functionality
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (!isGalleryHovered && scrollContainer) {
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
  }, [isGalleryHovered]);

  // Calculate text transforms based on mouse position
  const getTextTransform = () => {
    const xPercent = (mousePosition.x / dimensions.width) * 100;
    const yPercent = (mousePosition.y / dimensions.height) * 100;
    
    const translateX = (xPercent - 50) * 0.4;
    const translateY = (yPercent - 50) * 0.2;
    const rotateY = (xPercent - 50) * 0.1;
    const rotateX = (50 - yPercent) * 0.05;
    
    return `translate3d(${translateX}px, ${translateY}px, 0) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#0e0e0e] via-[#1a1a1a] to-[#0e0e0e] relative overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* Cursor Trail Canvas */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Hero Section */}
      <div 
        className="px-8 py-20 text-center max-w-6xl mx-auto relative z-10 animate-fadeInUp"
        style={{ 
          animation: 'fadeInUp 1.2s ease-out',
          animationFillMode: 'both'
        }}
      >
        <h1 
          className="text-7xl md:text-9xl font-light text-white mb-8 tracking-tight leading-none transition-transform duration-300 ease-out"
          style={{
            transform: getTextTransform(),
            transformStyle: 'preserve-3d'
          }}
        >
          Curated
          <span 
            className="block bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 bg-clip-text text-transparent font-medium animate-gradientShift"
          >
            Experiences
          </span>
        </h1>
        
        <p 
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-300"
          style={{
            transform: `translateX(${(mousePosition.x / dimensions.width - 0.5) * 10}px)`,
            opacity: 0.7 + (mousePosition.y / dimensions.height) * 0.3
          }}
        >
          Explore our meticulously designed collection where innovation meets artistry, 
          creating spaces that transcend the ordinary.
        </p>
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
          <span
            className="inline-block transition-all duration-300 hover:scale-105 hover:text-amber-400"
          >
            Explore
          </span>
          {' '}
          <span
            className="inline-block transition-all duration-300 hover:scale-105 hover:text-purple-400"
          >
            Our
          </span>
          {' '}
          <span
            className="inline-block bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent transition-transform duration-300 hover:scale-110"
          >
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
            msOverflowStyle: 'none',
            animation: 'fadeInUp 0.8s ease-out 0.8s both'
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
      <div 
        className="px-8 py-24 text-center relative z-10"
        style={{ animation: 'fadeIn 1s ease-out 1.2s both' }}
      >
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradientShift {
          background-size: 200% 200%;
          animation: gradientShift 8s ease-in-out infinite;
        }

        /* Hide scrollbar */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
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