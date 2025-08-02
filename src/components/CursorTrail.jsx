import React, { useState, useEffect, useRef, useCallback } from 'react';

const CursorTrail = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return null;
  const [particles, setParticles] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const canvasRef = useRef(null);
  const particleId = useRef(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });

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

  // Create particle function
  const createParticle = useCallback((x, y, velocityX = 0, velocityY = 0) => {
    const id = particleId.current++;
    
    const particleTypes = [
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
        hue: 45 + Math.random() * 15,
        saturation: 85 + Math.random() * 15,
        lightness: 70 + Math.random() * 20,
        alpha: 0.8 + Math.random() * 0.2,
        shimmer: Math.random() * Math.PI * 2,
        shimmerSpeed: 0.1 + Math.random() * 0.1
      },
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
        hue: 35 + Math.random() * 25,
        saturation: 60 + Math.random() * 20,
        lightness: 60 + Math.random() * 15,
        alpha: 0.3 + Math.random() * 0.2,
        shimmer: 0,
        shimmerSpeed: 0
      }
    ];
    
    const selectedType = Math.random() < 0.8 ? particleTypes[0] : particleTypes[1];
    
    const particle = {
      id,
      ...selectedType
    };
    
    setParticles(prev => [...prev.slice(-80), particle]);
  }, []);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const currentPosition = { x: e.clientX, y: e.clientY };
      
      const deltaTime = now - lastTimeRef.current;
      const velocityX = deltaTime > 0 ? (currentPosition.x - lastPositionRef.current.x) / deltaTime * 10 : 0;
      const velocityY = deltaTime > 0 ? (currentPosition.y - lastPositionRef.current.y) / deltaTime * 10 : 0;
      
      if (now - lastTimeRef.current > 25) {
        const particleCount = Math.min(3, Math.max(1, Math.abs(velocityX) + Math.abs(velocityY)) / 5);
        
        for (let i = 0; i < particleCount; i++) {
          setTimeout(() => {
            createParticle(
              currentPosition.x, 
              currentPosition.y, 
              velocityX, 
              velocityY
            );
          }, i * 8);
        }
        
        lastTimeRef.current = now;
      }
      
      lastPositionRef.current = currentPosition;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createParticle]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const updateCanvasSize = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
    };
    
    updateCanvasSize();
    
    const animate = () => {
      ctx.fillStyle = 'rgba(14, 14, 14, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      setParticles(prev => {
        const updated = prev
          .map(particle => {
            const newParticle = {
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              life: particle.life - particle.decay,
              vx: particle.vx * 0.985,
              vy: particle.vy * 0.985,
              shimmer: particle.shimmer + particle.shimmerSpeed
            };
            
            newParticle.size = newParticle.baseSize * (0.3 + 0.7 * newParticle.life);
            
            return newParticle;
          })
          .filter(particle => particle.life > 0);
        
        updated.forEach(particle => {
          if (particle.life > 0) {
            const fadeAlpha = Math.pow(particle.life / particle.maxLife, 1.5);
            const shimmerIntensity = 1 + Math.sin(particle.shimmer) * 0.3;
            
            if (particle.type === 'sparkle') {
              const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
              );
              
              gradient.addColorStop(0, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness + shimmerIntensity * 10}%, ${fadeAlpha * particle.alpha})`);
              gradient.addColorStop(0.4, `hsla(${particle.hue}, ${particle.saturation}%, ${particle.lightness}%, ${fadeAlpha * particle.alpha * 0.8})`);
              gradient.addColorStop(0.7, `hsla(${particle.hue}, ${particle.saturation - 20}%, ${particle.lightness - 10}%, ${fadeAlpha * particle.alpha * 0.4})`);
              gradient.addColorStop(1, `hsla(${particle.hue}, ${particle.saturation - 40}%, ${particle.lightness - 20}%, 0)`);
              
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size * shimmerIntensity, 0, Math.PI * 2);
              ctx.fill();
              
              if (fadeAlpha > 0.7) {
                ctx.fillStyle = `hsla(${particle.hue}, 100%, 90%, ${fadeAlpha * 0.6})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
              }
              
            } else if (particle.type === 'glow') {
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
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorTrail;