import {useState, useEffect, useCallback, useRef} from 'react';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Position = {x: number; y: number};

export interface SnakeGameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const getInitialSnake = (): Position[] => [
  {x: 10, y: 10},
  {x: 9, y: 10},
  {x: 8, y: 10},
];

export function useSnakeGame(initialPaused: boolean = true) {
  const [snake, setSnake] = useState<Position[]>(getInitialSnake());
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(initialPaused);
  
  const directionQueueRef = useRef<Direction[]>([]);
  const gameLoopRef = useRef<number | null>(null);

  const isPositionEqual = (pos1: Position, pos2: Position) =>
    pos1.x === pos2.x && pos1.y === pos2.y;

  const spawnFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    let attempts = 0;
    do {
      newFood = getRandomPosition();
      attempts++;
    } while (
      currentSnake.some((segment) => isPositionEqual(segment, newFood)) &&
      attempts < 100
    );
    setFood(newFood);
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    // Queue direction changes to prevent reverse-direction bugs
    directionQueueRef.current.push(newDirection);
  }, []);

  const resetGame = useCallback(() => {
    setSnake(getInitialSnake());
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(true); // Always pause when resetting
    directionQueueRef.current = [];
  }, []);

  const togglePause = useCallback(() => {
    if (!isGameOver) {
      setIsPaused((prev) => !prev);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((currentSnake) => {
        // Process next direction from queue
        let currentDirection = direction;
        if (directionQueueRef.current.length > 0) {
          const nextDirection = directionQueueRef.current.shift()!;
          
          // Prevent moving in opposite direction
          const opposites: Record<Direction, Direction> = {
            UP: 'DOWN',
            DOWN: 'UP',
            LEFT: 'RIGHT',
            RIGHT: 'LEFT',
          };
          
          if (opposites[currentDirection] !== nextDirection) {
            currentDirection = nextDirection;
            setDirection(currentDirection);
          }
        }

        const head = currentSnake[0];
        let newHead: Position;

        switch (currentDirection) {
          case 'UP':
            newHead = {x: head.x, y: head.y - 1};
            break;
          case 'DOWN':
            newHead = {x: head.x, y: head.y + 1};
            break;
          case 'LEFT':
            newHead = {x: head.x - 1, y: head.y};
            break;
          case 'RIGHT':
            newHead = {x: head.x + 1, y: head.y};
            break;
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return currentSnake;
        }

        // Check self collision
        if (currentSnake.some((segment) => isPositionEqual(segment, newHead))) {
          setIsGameOver(true);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        // Check if food was eaten
        if (isPositionEqual(newHead, food)) {
          setScore((prev) => prev + 1);
          spawnFood(newSnake);
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, INITIAL_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [direction, food, isGameOver, isPaused, spawnFood]);

  return {
    snake,
    food,
    direction,
    score,
    isGameOver,
    isPaused,
    changeDirection,
    resetGame,
    togglePause,
    gridSize: GRID_SIZE,
  };
}
