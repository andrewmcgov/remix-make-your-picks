import {useEffect, useRef, useState} from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
}

interface ConfettiProps {
  colors?: string[];
}

const DEFAULT_COLORS = [
  'hsl(226, 100%, 42%)', // accent-primary blue
  'hsl(0, 0%, 97%)', // foreground white
  'hsl(45, 100%, 50%)', // gold
  'hsl(60, 100%, 50%)', // yellow
  'hsl(0, 97%, 42%)', // accent-secondary red
];

export function Confetti({colors = DEFAULT_COLORS}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match window
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Scale context to match device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Set CSS size to actual viewport size
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    setCanvasSize();

    // Determine piece count based on screen size
    const isMobile = window.innerWidth <= 768;
    const pieceCount = isMobile ? 80 : 200;

    // Create confetti pieces
    const pieces: ConfettiPiece[] = [];

    // Helper function to create a new piece
    const createPiece = (startFromTop = false): ConfettiPiece => ({
      x: Math.random() * window.innerWidth,
      y: startFromTop
        ? -Math.random() * 100 // Start just above viewport for new pieces
        : Math.random() * (window.innerHeight + window.innerHeight), // Initial spread across and above viewport
      velocityX: (Math.random() - 0.5) * 3, // Horizontal drift
      velocityY: Math.random() * 3 + 2, // Falling speed (2-5)
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4, // Size between 4-12
    });

    // Initialize confetti pieces
    for (let i = 0; i < pieceCount; i++) {
      pieces.push(createPiece());
    }

    let animationFrameId: number;

    const animate = () => {
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw each piece
      for (let i = pieces.length - 1; i >= 0; i--) {
        const piece = pieces[i];

        // Update physics
        piece.velocityY += 0.15; // Gravity
        piece.y += piece.velocityY;
        piece.x += piece.velocityX;
        piece.rotation += piece.rotationSpeed;

        // Replace pieces that fell off screen with new ones
        if (piece.y > window.innerHeight + 50) {
          pieces[i] = createPiece(true); // true = start from top
          continue;
        }

        // Draw the piece
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;

        // Draw as a small rectangle
        ctx.fillRect(
          -piece.size / 2,
          -piece.size / 2,
          piece.size,
          piece.size / 2,
        );

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [colors, isVisible]);

  return (
    <>
      {isVisible && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        />
      )}
      {showButton && (
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 10000,
            animation: 'fadeInUp 0.5s ease-out',
          }}
        >
          {isVisible ? 'Hide Confetti' : 'Show Confetti'}
        </button>
      )}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
