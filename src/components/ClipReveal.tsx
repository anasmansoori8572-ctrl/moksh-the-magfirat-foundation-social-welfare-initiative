import React from 'react';
import { motion } from 'motion/react';

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const ClipReveal: React.FC<ClipRevealProps> = ({ children, className = '', delay = 0.5 }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ClipReveal;
