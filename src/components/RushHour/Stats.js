// components/RushHour/Stats.js - Compact version for middle column
import React from "react";

export default function Stats({ stats, currentMove }) {
  if (!stats) return null;

  // Create a compact stats layout with icons and minimalist design
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Current move indicator - if applicable */}
      {currentMove && (
        <div className="bg-white rounded-lg p-2 w-full max-w-[130px] text-center shadow-sm border border-indigo-100">
          <div className="text-xl mb-1">👣</div>
          <div className="w-full h-[1px] bg-indigo-200 mb-1" />
          <p className="text-xs font-medium text-indigo-800">
            Step {currentMove.step}: {currentMove.piece} {currentMove.direction}
            {currentMove.distance > 1 ? ` (${currentMove.distance})` : ""}
          </p>
        </div>
      )}

      {/* Compact stats display - horizontal for narrow column */}
      <div className="bg-[#334155] grid grid-cols-3 rounded-md p-1 gap-1 w-full">
        {/* Moves stat */}
        <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-indigo-100">
          <div className="text-lg mb-1">🚗</div>
          <div className="w-full h-[1px] bg-indigo-200 mb-1" />
          <p className="text-xs font-bold text-indigo-800">{stats.moves}</p>
          <p className="text-[10px] text-indigo-600">Moves</p>
        </div>

        {/* Nodes visited stat */}
        <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-indigo-100">
          <div className="text-lg mb-1">🔍</div>
          <div className="w-full h-[1px] bg-indigo-200 mb-1" />
          <p className="text-xs font-bold text-indigo-800">
            {stats.nodesVisited}
          </p>
          <p className="text-[10px] text-indigo-600">Nodes</p>
        </div>

        {/* Time stat */}
        <div className="bg-white rounded-lg p-2 text-center shadow-sm border border-indigo-100">
          <div className="text-lg mb-1">⏱️</div>
          <div className="w-full h-[1px] bg-indigo-200 mb-1" />
          <p className="text-xs font-bold text-indigo-800">
            {parseFloat(stats.executionTime).toFixed(2)}ms
          </p>
          <p className="text-[10px] text-indigo-600">Time</p>
        </div>
      </div>

      {/* Algorithm info - display at bottom of stats */}
      <div className="text-center w-full mt-1">
        <p className="text-[16px] text-white font-medium">
          {stats.algorithm?.toUpperCase()} + {stats.heuristic}
        </p>
      </div>
    </div>
  );
}
