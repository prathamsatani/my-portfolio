"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'mesh' | 'dots' | 'waves';
}

export default function AnimatedBackground({ variant = 'mesh' }: AnimatedBackgroundProps) {
  if (variant === 'mesh') {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-0 -right-4 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, rgba(20, 184, 166, 0.15) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
    );
  }

  if (variant === 'waves') {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,50 Q250,0 500,50 T1000,50 T1500,50 V100 H0 Z"
            fill="url(#wave-gradient)"
            animate={{
              d: [
                "M0,50 Q250,0 500,50 T1000,50 T1500,50 V100 H0 Z",
                "M0,50 Q250,100 500,50 T1000,50 T1500,50 V100 H0 Z",
                "M0,50 Q250,0 500,50 T1000,50 T1500,50 V100 H0 Z",
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>
    );
  }

  return null;
}
