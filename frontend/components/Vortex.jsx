'use client';

import React, { useEffect, useRef } from 'react';

const Vortex = ({
  children,
  backgroundColor = 'black',
  rangeY = 800,
  particleCount = 500,
  baseHue = 120,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 2000;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.hue = baseHue + (Math.random() - 0.5) * 60;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        // Vortex effect
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = this.x - centerX;
        const dy = this.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          const angle = Math.atan2(dy, dx);
          const force = (rangeY - this.z) / rangeY;
          
          this.vx += Math.cos(angle + Math.PI / 2) * force * 0.5;
          this.vy += Math.sin(angle + Math.PI / 2) * force * 0.5;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.z -= 2;

        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Reset if out of bounds
        if (
          this.x < -50 ||
          this.x > canvas.width + 50 ||
          this.y < -50 ||
          this.y > canvas.height + 50 ||
          this.z < 0
        ) {
          this.reset();
        }
      }

      draw(ctx) {
        const scale = (2000 - this.z) / 2000;
        const size = this.size * scale;
        const alpha = scale * 0.8;

        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    particles.current = Array.from({ length: particleCount }, () => new Particle());

    // Animation loop
    const animate = () => {
      ctx.fillStyle = `${backgroundColor}`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [backgroundColor, rangeY, particleCount, baseHue]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ background: backgroundColor }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default Vortex;
