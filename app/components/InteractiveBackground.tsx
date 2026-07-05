'use client';

import React, { useRef, useEffect } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    const spacing = 45; // distance between dots

    let mouse = { x: -1000, y: -1000, radius: 120, baseRadius: 200, isShockwaveActive: false };
    let shockwaveTimer: NodeJS.Timeout | null = null;

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      vx: number;
      vy: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = 2;
        this.density = (Math.random() * 15) + 5; // how quickly they react
        this.vx = 0;
        this.vy = 0;
      }

      draw() {
        if (!ctx) return;
        // Subtle blue-ish white dots to match the brand
        ctx.fillStyle = 'rgba(255, 255, 255,0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;

        // Push force from mouse
        if (distance < mouse.radius) {
          // Push away
          this.vx -= forceDirectionX * force * this.density;
          this.vy -= forceDirectionY * force * this.density;
        }

        // Spring force pulling back to base
        let springForceX = (this.baseX - this.x) * 0.05; // Stiffness
        let springForceY = (this.baseY - this.y) * 0.05;

        this.vx += springForceX;
        this.vy += springForceY;

        // Friction (dampening)
        this.vx *= 0.8;
        this.vy *= 0.8;

        // Apply velocity to position
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    function init() {
      particles = [];
      // Offset starting positions to center the grid perfectly
      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      for (let y = offsetY; y < height; y += spacing) {
        for (let x = offsetX; x < width; x += spacing) {
          particles.push(new Particle(x, y));
        }
      }
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Smoothly return radius to base ONLY after the shockwave delay is over
      if (!mouse.isShockwaveActive && mouse.radius > mouse.baseRadius) {
        mouse.radius -= 10;
      } else if (!mouse.isShockwaveActive && mouse.radius < mouse.baseRadius) {
        mouse.radius = mouse.baseRadius;
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.radius = 400; // Boom! Expand radius to push dots away
      mouse.isShockwaveActive = true;

      // Clear previous timer if they click multiple times rapidly
      if (shockwaveTimer) clearTimeout(shockwaveTimer);

      // Wait 2 seconds before letting it shrink back to base
      shockwaveTimer = setTimeout(() => {
        mouse.isShockwaveActive = false;
      }, 500);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
}
