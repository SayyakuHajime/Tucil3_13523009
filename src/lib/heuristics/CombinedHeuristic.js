// lib/heuristics/CombinedHeuristic.js
import { manhattanDistance } from "./ManhattanDistance";
import { blockingPieces } from "./BlockingPieces";

/**
 * Combined heuristic for Rush Hour
 * Uses both Manhattan distance and blocking pieces count
 * @param {Board} board - The current board state
 * @returns {number} The heuristic value (lower is better)
 */
export function combinedHeuristic(board) {
  const distance = manhattanDistance(board);
  const blocking = blockingPieces(board);

  // Combine both heuristics with weights
  return distance + blocking;
}
