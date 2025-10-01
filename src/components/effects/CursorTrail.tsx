"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

export default function CursorTrail() {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON'
      );
    };

    window.addEventListener('mousemove', updateCursorPosition);
    return () => window.removeEventListener('mousemove', updateCursorPosition);
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          background: 'white',
          left: cursorPosition.x - 8,
          top: cursorPosition.y - 8,
        }}
        animate={{
          scale: isPointer ? 0.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      
      {/* Cursor ring */}
      <motion.div
        className="fixed w-10 h-10 rounded-full border-2 border-teal-500 pointer-events-none z-[9998]"
        style={{
          left: cursorPosition.x - 20,
          top: cursorPosition.y - 20,
        }}
        animate={{
          scale: isPointer ? 1.5 : 1,
          borderColor: isPointer ? '#3b82f6' : '#14b8a6',
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      />
    </>
  );
}
