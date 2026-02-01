import {useState, useEffect, useRef, useCallback} from 'react';
import {EyesEmoji} from './EyesEmoji';
import {SnakeGame} from './SnakeGame';

const getRandomDelay = () => Math.random() * 5000 + 5000; // 5-10 seconds

export function EasterEgg() {
  const [isEyesVisible, setIsEyesVisible] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [eyesKey, setEyesKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const nextAppearanceRef = useRef<number | null>(null);

  // Handle client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scheduleNextAppearance = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (nextAppearanceRef.current) {
      clearTimeout(nextAppearanceRef.current);
    }

    const delay = getRandomDelay();
    console.log('[EasterEgg] Scheduling next appearance in', delay / 1000, 'seconds');
    nextAppearanceRef.current = window.setTimeout(() => {
      if (!isGameActive) {
        console.log('[EasterEgg] Showing eyes emoji!');
        setIsEyesVisible(true);
        // Increment key to force re-mount and restart animation
        setEyesKey((prev) => prev + 1);
      }
    }, delay);
  }, [isGameActive]);

  // Schedule first appearance on mount
  useEffect(() => {
    if (isMounted) {
      scheduleNextAppearance();
    }

    return () => {
      if (nextAppearanceRef.current) {
        clearTimeout(nextAppearanceRef.current);
      }
    };
  }, [isMounted, scheduleNextAppearance]);

  const handleEyesTrigger = useCallback(() => {
    setIsEyesVisible(false);
    setIsGameActive(true);
    
    // Clear any pending appearance
    if (nextAppearanceRef.current) {
      clearTimeout(nextAppearanceRef.current);
    }
  }, []);

  const handleGameClose = useCallback(() => {
    setIsGameActive(false);
    // Schedule next eyes appearance after game closes
    scheduleNextAppearance();
  }, [scheduleNextAppearance]);

  return (
    <>
      {isEyesVisible && <EyesEmoji key={eyesKey} onTrigger={handleEyesTrigger} />}
      {isGameActive && <SnakeGame onClose={handleGameClose} />}
    </>
  );
}
