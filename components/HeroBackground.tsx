import React, { useEffect, useRef } from 'react';

export const HeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Configuration
    const lines = 20; // Number of flow lines
    const particlesCount = 35; // Number of floating particles
    const speed = 0.002; // Global animation speed
    
    // State
    let time = 0;
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }

    const particles: Particle[] = [];

    // Initialize Particles
    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      time += speed;

      // Draw Particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`; // Blue-500
        ctx.fill();
      });

      // Draw Flow Lines
      // We create a superposition of sine waves to create "abstract shapes"
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        
        // Gradient for the line
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const alpha = (i / lines) * 0.5 + 0.1;
        gradient.addColorStop(0, `rgba(59, 130, 246, 0)`);
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${alpha})`); // Blue glow
        gradient.addColorStop(1, `rgba(147, 197, 253, 0)`); // Blue-300 fade out
        
        ctx.strokeStyle = gradient;

        const amplitude = height * 0.15 + (i * 5); // Height of wave
        const frequency = 0.002 + (i * 0.0005); // Width of wave cycles
        const yOffset = height / 2 + (i * 10 - (lines * 5)); // Vertical spacing

        // Draw segments
        for (let x = 0; x <= width; x += 10) {
          // Complex wave formula: combining two sine waves for organic movement
          const y = yOffset + 
                    Math.sin(x * frequency + time + i) * amplitude + 
                    Math.sin(x * frequency * 2 + time * 1.5) * (amplitude / 2);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }} 
    />
  );
};