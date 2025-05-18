// components/Board.js
import React, { useState, useEffect } from "react";
import Piece from "./Piece";

export default function Board({ size, configuration, primaryPiece, exit, moves, currentMove }) {
  // Size is an array [rows, cols]
  const [board, setBoard] = useState([]);
  
  useEffect(() => {
    // Initialize board based on configuration
    // This would create a grid representation of the Rush Hour game
    const newBoard = [];
    for (let i = 0; i < size[0]; i++) {
      const row = [];
      for (let j = 0; j < size[1]; j++) {
        row.push(configuration[i][j] || '.');
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
  }, [configuration, size]);

  return (
    <div className="bg-secondary rounded-xl p-4 shadow-md w-full max-w-xl mx-auto">
      <div 
        className="grid gap-1 bg-background p-2 rounded-lg"
        style={{ 
          gridTemplateRows: `repeat(${size[0]}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${size[1]}, minmax(0, 1fr))`
        }}
      >
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-12 h-12 flex items-center justify-center rounded
                ${cell === 'K' ? 'bg-yellow-300' : 'bg-gray-200'}
                ${cell === '.' ? 'bg-gray-200' : ''}
              `}
            >
              {cell !== '.' && cell !== 'K' && (
                <Piece 
                  id={cell} 
                  isPrimary={cell === 'P'} 
                  isMoving={moves[currentMove]?.piece === cell}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}