import React from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';

interface ScrollFXContainerProps {
  children: React.ReactNode;
}

const ScrollFXContainer: React.FC<ScrollFXContainerProps> = ({ children }) => {
  const { scrollY } = useScroll();
  
  // Get a smoothed velocity value from the scrollY motion value
  const scrollYVelocity = useVelocity(scrollY);

  // Map the velocity to a blur value.
  // The faster you scroll (positive or negative velocity), the more blur.
  const blurValue = useTransform(
    scrollYVelocity,
    [-2000, 0, 2000], // Input velocity range
    [8, 0, 8],      // Output blur in pixels
    { clamp: true }  // Don't go beyond 8px of blur
  );

  // Smooth the blur value with a spring for a more natural effect
  const smoothBlur = useSpring(blurValue, {
    stiffness: 400,
    damping: 40,
  });

  // Create the filter string from the smoothed blur value
  const filter = useTransform(smoothBlur, (v) => `blur(${v}px)`);
  
  // Also map velocity to scale for the "slow down" effect
  const scaleValue = useTransform(
      scrollYVelocity,
      [-2000, 0, 2000],
      [0.98, 1, 0.98],
      { clamp: true }
  );

  const smoothScale = useSpring(scaleValue, {
      stiffness: 400,
      damping: 40,
  });


  return (
    <motion.div style={{ filter, scale: smoothScale, willChange: 'transform, filter' }}>
      {children}
    </motion.div>
  );
};

export default ScrollFXContainer;