import { useState, useEffect, useRef } from 'react';

export const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }

      // The non-null assertion `!` is used because we know `startTimeRef.current` is set in the first animation frame.
      const progress = timestamp - startTimeRef.current!;
      const percentage = Math.min(progress / duration, 1);
      const currentVal = Math.floor(end * percentage);

      setCount(currentVal);

      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it ends on the exact number
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = undefined;
    };
  }, [end, duration]);

  return count;
};