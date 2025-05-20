// lib/services/gameService.js
import { Board } from "../models";
import {
  uniformCostSearch,
  greedyBestFirstSearch,
  aStarSearch,
} from "../algorithms";
import {
  manhattanDistance,
  blockingPieces,
  combinedHeuristic,
} from "../heuristics";

/**
 * Solve a Rush Hour puzzle using the specified algorithm
 * @param {Object} puzzleConfig - The parsed puzzle configuration
 * @param {string} algorithm - 'ucs', 'greedy', or 'astar'
 * @param {string} heuristic - Name of the heuristic to use
 * @returns {Object} The solution data including moves, statistics, etc.
 */
export function solvePuzzle(
  puzzleConfig,
  algorithm = "astar",
  heuristic = "manhattan"
) {
  // Start timing
  const startTime = performance.now();

  // Validate inputs
  if (!puzzleConfig || !puzzleConfig.board) {
    throw new Error("Invalid puzzle configuration");
  }

  console.log("Solving puzzle with configuration:", puzzleConfig);
  console.log("- Exit position:", puzzleConfig.exit);
  console.log("- Exit direction:", puzzleConfig.exitDirection);

  // Ensure exitDirection is provided
  if (!puzzleConfig.exitDirection) {
    // Determine direction based on exit position
    const [rows, cols] = puzzleConfig.size;
    const [exitRow, exitCol] = puzzleConfig.exit;

    let exitDirection;
    if (exitRow === 0) exitDirection = "up";
    else if (exitRow === rows - 1) exitDirection = "down";
    else if (exitCol === 0) exitDirection = "left";
    else exitDirection = "right";

    puzzleConfig.exitDirection = exitDirection;
  }

  // Create a board from the puzzle configuration
  const initialBoard = Board.fromConfig(puzzleConfig);

  // Make sure the Board has the exitDirection property
  if (puzzleConfig.exitDirection && !initialBoard.exitDirection) {
    initialBoard.exitDirection = puzzleConfig.exitDirection;
  }

  const heuristicFn = getHeuristicFunction(heuristic);
  console.log("Initial heuristic value:", heuristicFn(initialBoard));

  // Run the selected algorithm
  let result;
  switch (algorithm) {
    case "ucs":
      result = uniformCostSearch(initialBoard);
      break;
    case "greedy":
      result = greedyBestFirstSearch(initialBoard, heuristicFn);
      break;
    case "astar":
      result = aStarSearch(initialBoard, heuristicFn);
      break;
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }

  // End timing
  const endTime = performance.now();
  const executionTime = parseFloat((endTime - startTime).toFixed(2));

  // Format the result for the UI
  return {
    solved: result.solved,
    moves: result.path.map((move) => ({
      piece: move.pieceId,
      direction: move.direction,
      distance: move.distance || 1,
    })),
    stats: {
      moves: result.path.length,
      nodesVisited: result.nodesVisited,
      executionTime,
      algorithm,
      heuristic,
    },
  };
}

/**
 * Apply a sequence of moves to a board configuration
 * @param {Object} config - The original puzzle configuration
 * @param {Array} moves - Array of move objects
 * @param {number} upToStep - Apply moves up to this index (inclusive)
 * @returns {Object} The updated configuration after applying moves
 */
export function applyMovesToConfig(config, moves, upToStep) {
  // Validate inputs
  if (!config || !config.board) return config;
  if (!moves || !Array.isArray(moves)) return config;
  if (upToStep < 0 || upToStep >= moves.length) return config;

  try {
    // Ensure exitDirection is provided
    if (!config.exitDirection) {
      // Determine direction based on exit position
      const [rows, cols] = config.size;
      const [exitRow, exitCol] = config.exit;

      let exitDirection;
      if (exitRow === 0) exitDirection = "up";
      else if (exitRow === rows - 1) exitDirection = "down";
      else if (exitCol === 0) exitDirection = "left";
      else exitDirection = "right";

      config.exitDirection = exitDirection;
    }

    // Convert the config to a Board instance
    let board = Board.fromConfig(config);

    // Apply moves one by one
    for (let i = 0; i <= upToStep; i++) {
      const { piece, direction, distance = 1 } = moves[i];

      // Skip invalid moves
      if (!piece || !direction) {
        console.warn(
          `Invalid move at step ${i + 1}: missing piece or direction`
        );
        continue;
      }

      // Apply the move
      const newBoard = board.movePiece(piece, direction, distance);

      // If move couldn't be applied, keep the current board
      if (!newBoard) {
        console.warn(
          `Move failed at step ${i + 1}: ${piece} ${direction} ${distance}`
        );
        continue;
      }

      board = newBoard;
    }

    // Check if the solution is complete
    let isSolutionComplete = false;
    const primaryPiece = board.getPrimaryPiece();
    if (primaryPiece && board.exitPosition) {
      const [exitRow, exitCol] = board.exitPosition;
      isSolutionComplete = primaryPiece.positions.some(
        ([row, col]) => row === exitRow && col === exitCol
      );
    }

    // Return the updated configuration
    return {
      size: board.size,
      board: board.grid,
      exit: board.exitPosition,
      exitDirection: config.exitDirection, // Maintain the exit direction
      isSolutionComplete,
    };
  } catch (error) {
    console.error("Error applying moves:", error);
    return config;
  }
}

// Helper function to get the heuristic function
function getHeuristicFunction(heuristic) {
  switch (heuristic) {
    case "manhattan":
      return manhattanDistance;
    case "blocking":
      return blockingPieces;
    case "combined":
      return combinedHeuristic;
    default:
      console.warn(`Unknown heuristic: ${heuristic}, using manhattan distance`);
      return manhattanDistance;
  }
}
