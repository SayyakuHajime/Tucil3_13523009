// components/Piece.js - Fixed animation
import React from "react";
import { motion } from "framer-motion";

export default function Piece({
  id,
  isPrimary,
  isMoving,
  moveDistance = 1,
  moveDirection = null,
}) {
  // Generate a consistent color for each piece
  const generateColor = (id) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-lime-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-fuchsia-500",
      "bg-rose-500",
    ];

    // Use character code to select a color (consistent for same letters)
    const charCode = id.charCodeAt(0) % colors.length;
    return colors[charCode];
  };

  // Calculate animation based on direction and distance
  const getAnimationProps = () => {
    if (!isMoving || !moveDirection || moveDistance <= 0) {
      return {};
    }

    // Calculate scaled distance (adjust based on your UI size)
    const distance = moveDistance * 48; // 48px is approximately the size of one cell (including gap)

    // Define movement animation based on direction
    let x = 0,
      y = 0;
    switch (moveDirection) {
      case "up":
        y = -distance;
        break;
      case "down":
        y = distance;
        break;
      case "left":
        x = -distance;
        break;
      case "right":
        x = distance;
        break;
    }

    // Create a smooth sliding animation
    return {
      x,
      y,
      transition: {
        duration: Math.min(0.3 + moveDistance * 0.1, 0.8), // Balanced duration
        ease: "easeInOut",
      },
    };
  };

  return (
    <motion.div
      className={`
        w-full h-full rounded-md flex items-center justify-center
        ${isPrimary ? "bg-red-600" : generateColor(id)}
        ${isMoving ? "ring-2 ring-white shadow-lg z-10" : ""}
      `}
      animate={getAnimationProps()}
      initial={false} // Don't animate from an initial position
    >
      <span className="flex h-full w-full items-center justify-center text-white font-bold text-lg">
        {id}
      </span>
      {isMoving && moveDistance > 1 && (
        <div className="absolute bottom-0 right-0 bg-white text-black text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {moveDistance}
        </div>
      )}
    </motion.div>
  );
}
