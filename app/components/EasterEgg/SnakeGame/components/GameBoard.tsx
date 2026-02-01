import {useEffect, useRef} from 'react';
import type {Position} from '../hooks/useSnakeGame';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

const CELL_SIZE = 20;
const SNAKE_COLOR = '#00ff00';
const FOOD_COLOR = '#ff0000';
const BACKGROUND_COLOR = '#000000';
const GRID_COLOR = '#1a1a1a';

export function GameBoard({snake, food, gridSize}: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, gridSize * CELL_SIZE);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(gridSize * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = FOOD_COLOR;
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );

    // Draw snake
    ctx.fillStyle = SNAKE_COLOR;
    snake.forEach((segment, index) => {
      // Head is slightly different
      const padding = index === 0 ? 1 : 2;
      ctx.fillRect(
        segment.x * CELL_SIZE + padding,
        segment.y * CELL_SIZE + padding,
        CELL_SIZE - padding * 2,
        CELL_SIZE - padding * 2
      );
    });
  }, [snake, food, gridSize]);

  return (
    <canvas
      ref={canvasRef}
      width={gridSize * CELL_SIZE}
      height={gridSize * CELL_SIZE}
      style={{
        border: '2px solid #00ff00',
        display: 'block',
      }}
    />
  );
}
