// components/Piece.js
import React from "react";
import { motion } from "framer-motion";

export default function Piece({ id, isPrimary, isMoving }) {
  // Generate a consistent color for each piece
  const generateColor = (id) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-orange-500", "bg-pink-500", "bg-indigo-500", "bg-yellow-500"
    ];
    
    // Use character code to select a color (consistent for same letters)
    const charCode = id.charCodeAt(0) % colors.length;
    return colors[charCode];
  };

  return (
    <motion.div
      className={`
        w-10 h-10 rounded-sm 
        ${isPrimary ? 'bg-red-600' : generateColor(id)}
        ${isMoving ? 'ring-2 ring-white' : ''}
      `}
      initial={{ scale: 1 }}
      animate={{ 
        scale: isMoving ? [1, 1.1, 1] : 1
      }}
      transition={{ duration: 0.5 }}
    >
      <span className="flex h-full w-full items-center justify-center text-white font-bold">
        {id}
      </span>
    </motion.div>
  );
}