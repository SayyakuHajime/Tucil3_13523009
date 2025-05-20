// components/RushHour/Board.js - Updated for consistent highlighting
import React, { useState, useEffect } from "react";
import Piece from "./Piece";

export default function Board({
  size,
  configuration,
  primaryPiece,
  exit,
  exitDirection: propExitDirection,
  moves,
  currentMove,
  completedState,
}) {
  // Size is an array [rows, cols]
  const [board, setBoard] = useState([]);
  const [exitPosition, setExitPosition] = useState(null);
  const [exitDirection, setExitDirection] = useState(null);

  useEffect(() => {
    // Initialize board based on configuration
    const newBoard = [];
    for (let i = 0; i < size[0]; i++) {
      const row = [];
      for (let j = 0; j < size[1]; j++) {
        row.push(configuration[i][j] || ".");
      }
      newBoard.push(row);
    }
    setBoard(newBoard);

    // Find exit position if provided
    if (exit) {
      // Ensure exit position is within board boundaries
      const adjustedExit = [
        Math.min(Math.max(0, exit[0]), size[0] - 1),
        Math.min(Math.max(0, exit[1]), size[1] - 1),
      ];

      setExitPosition(adjustedExit);
      console.log("Setting exit position to:", adjustedExit);

      // Use provided exitDirection if available
      if (propExitDirection) {
        setExitDirection(propExitDirection);
        console.log("Setting exit direction to:", propExitDirection);
      } else {
        // Otherwise determine exit direction (which edge it's on)
        if (adjustedExit[0] === 0) {
          setExitDirection("up");
        } else if (adjustedExit[0] === size[0] - 1) {
          setExitDirection("down");
        } else if (adjustedExit[1] === 0) {
          setExitDirection("left");
        } else if (adjustedExit[1] === size[1] - 1) {
          setExitDirection("right");
        }
      }
    }
  }, [configuration, size, exit, propExitDirection]);

  // Determine if a given position is on the edge of the board
  const isEdgePosition = (row, col) => {
    return row === 0 || row === size[0] - 1 || col === 0 || col === size[1] - 1;
  };

  // Get the current move being animated
  const getCurrentMoveInfo = () => {
    if (
      !moves ||
      currentMove === undefined ||
      currentMove < 0 ||
      currentMove >= moves.length
    ) {
      return null;
    }
    return moves[currentMove];
  };

  // Check if the solution is complete
  const isSolutionComplete = () => {
    if (!exitPosition || !exitDirection) return false;

    // If we have a completed state, check that board
    if (completedState && completedState.board) {
      // Check if primary piece is at the exit position
      return (
        completedState.board[exitPosition[0]][exitPosition[1]] === primaryPiece
      );
    }

    // Otherwise check current board state
    return board[exitPosition[0]]?.[exitPosition[1]] === primaryPiece;
  };

  // Get the position of the K icon (exit marker)
  const getExitMarkerPosition = () => {
    if (!exitPosition || !exitDirection) return null;

    const [exitRow, exitCol] = exitPosition;

    switch (exitDirection) {
      case "up":
        return {
          top: "-16px",
          left: `${exitCol * 12.5 + 6}px`,
          transform: "translateX(-50%)",
        };
      case "right":
        return {
          right: "-16px",
          top: `${exitRow * 12.5 + 6}px`,
          transform: "translateY(-50%)",
        };
      case "down":
        return {
          bottom: "-16px",
          left: `${exitCol * 12.5 + 6}px`,
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          left: "-16px",
          top: `${exitRow * 12.5 + 6}px`,
          transform: "translateY(-50%)",
        };
      default:
        return null;
    }
  };

  return (
    <div className="bg-secondary rounded-xl p-6 shadow-md w-full max-w-xl mx-auto">
      <div className="relative">
        <div
          className="grid gap-0.5 bg-background p-2 rounded-lg"
          style={{
            gridTemplateRows: `repeat(${size[0]}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${size[1]}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isExit =
                exitPosition &&
                exitPosition[0] === rowIndex &&
                exitPosition[1] === colIndex;
              const isComplete = isExit && cell === primaryPiece;

              // Determine which border should have a bright yellow color based on exit direction
              let exitBorderClass = "";
              if (isExit && exitDirection) {
                switch (exitDirection) {
                  case "up":
                    exitBorderClass = "border-t-4 border-t-yellow-400";
                    break;
                  case "right":
                    exitBorderClass = "border-r-4 border-r-yellow-400";
                    break;
                  case "down":
                    exitBorderClass = "border-b-4 border-b-yellow-400";
                    break;
                  case "left":
                    exitBorderClass = "border-l-4 border-l-yellow-400";
                    break;
                }
              }

              // Get the current move being animated
              const currentMoveInfo = getCurrentMoveInfo();
              const isMoving =
                currentMoveInfo && currentMoveInfo.piece === cell;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-12 h-12 flex items-center justify-center relative
                    ${cell === "." ? "bg-gray-200" : ""}
                    ${isEdgePosition(rowIndex, colIndex) ? "rounded-sm" : ""}
                    ${
                      isExit
                        ? isComplete
                          ? "bg-green-100"
                          : "bg-yellow-50"
                        : ""
                    }
                    ${exitBorderClass}
                    ${isComplete ? "ring-2 ring-green-500" : ""}
                    border border-gray-300
                  `}
                >
                  {/* Visual indicator for exit position */}
                  {isExit && exitDirection && !isComplete && (
                    <div
                      className={`absolute pointer-events-none ${
                        exitDirection === "up"
                          ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          : exitDirection === "right"
                            ? "right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
                            : exitDirection === "down"
                              ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                              : "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      } w-3 h-3 rounded-full bg-yellow-400 border border-yellow-600`}
                    />
                  )}

                  {cell !== "." && (
                    <Piece
                      id={cell}
                      isPrimary={cell === primaryPiece}
                      isMoving={isMoving}
                      moveDistance={
                        isMoving ? currentMoveInfo.distance || 1 : 0
                      }
                      moveDirection={
                        isMoving ? currentMoveInfo.direction : null
                      }
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Exit marker (K) - positioned precisely based on exit direction */}
        {exitPosition && exitDirection && (
          <div className="absolute pointer-events-none">
            {exitDirection === "up" && (
              <div
                className="absolute"
                style={{
                  top: "-16px",
                  left: `${exitPosition[1] * 12.5 + 6}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold shadow-lg border-2 border-yellow-600">
                  K
                </div>
              </div>
            )}

            {exitDirection === "right" && (
              <div
                className="absolute"
                style={{
                  right: "-16px",
                  top: `${exitPosition[0] * 12.5 + 6}px`,
                  transform: "translateY(-50%)",
                }}
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold shadow-lg border-2 border-yellow-600">
                  K
                </div>
              </div>
            )}

            {exitDirection === "down" && (
              <div
                className="absolute"
                style={{
                  bottom: "-16px",
                  left: `${exitPosition[1] * 12.5 + 6}px`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold shadow-lg border-2 border-yellow-600">
                  K
                </div>
              </div>
            )}

            {exitDirection === "left" && (
              <div
                className="absolute"
                style={{
                  left: "-16px",
                  top: `${exitPosition[0] * 12.5 + 6}px`,
                  transform: "translateY(-50%)",
                }}
              >
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold shadow-lg border-2 border-yellow-600">
                  K
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-secondary">
        <p>Move the red primary piece (P) to the exit (K)</p>
        {isSolutionComplete() && (
          <p className="text-green-600 font-bold mt-2">
            Congrats! The puzzle has been solved!
          </p>
        )}
      </div>
    </div>
  );
}
