"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-teal-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner rotating ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-gray-200 border-t-blue-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
        </motion.div>
      </div>
      
      {/* Loading text */}
      <motion.p
        className="absolute mt-32 text-gray-600 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );
}
