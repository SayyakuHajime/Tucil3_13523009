/**
 * Manhattan distance heuristic for Rush Hour
 * Calculates the distance between the primary piece and the exit
 * @param {Board} board - The current board state
 * @returns {number} The heuristic value (lower is better)
 */
export function manhattanDistance(board) {
  const primaryPiece = board.getPrimaryPiece();
  if (!primaryPiece) return Infinity;

  // Get the exit position and direction
  const [exitRow, exitCol] = board.exitPosition;
  const exitDirection = board.exitDirection;

  // Find the closest position of the primary piece to consider
  let relevantPosition = null;

  // Choose the correct position based on exit direction
  if (exitDirection === "up") {
    // For top exit, we care about the top-most position
    relevantPosition = primaryPiece.positions.reduce(
      (min, pos) => (pos[0] < min[0] ? pos : min),
      primaryPiece.positions[0]
    );
  } else if (exitDirection === "down") {
    // For bottom exit, we care about the bottom-most position
    relevantPosition = primaryPiece.positions.reduce(
      (max, pos) => (pos[0] > max[0] ? pos : max),
      primaryPiece.positions[0]
    );
  } else if (exitDirection === "left") {
    // For left exit, we care about the left-most position
    relevantPosition = primaryPiece.positions.reduce(
      (min, pos) => (pos[1] < min[1] ? pos : min),
      primaryPiece.positions[0]
    );
  } else if (exitDirection === "right") {
    // For right exit, we care about the right-most position
    relevantPosition = primaryPiece.positions.reduce(
      (max, pos) => (pos[1] > max[1] ? pos : max),
      primaryPiece.positions[0]
    );
  } else {
    // Default fallback - use the first position
    relevantPosition = primaryPiece.positions[0];
  }

  // Calculate distance to exit based on direction
  let distance = 0;

  if (exitDirection === "up") {
    // Top exit - measure vertical distance to top edge
    distance = relevantPosition[0]; // Distance to top edge (row 0)
  } else if (exitDirection === "down") {
    // Bottom exit - measure vertical distance to bottom edge
    distance = board.size[0] - 1 - relevantPosition[0]; // Distance to bottom edge
  } else if (exitDirection === "left") {
    // Left exit - measure horizontal distance to left edge
    distance = relevantPosition[1]; // Distance to left edge (col 0)
  } else if (exitDirection === "right") {
    // Right exit - measure horizontal distance to right edge
    distance = board.size[1] - 1 - relevantPosition[1]; // Distance to right edge
  } else {
    // Default to Manhattan distance to exit coords if direction is unknown
    distance =
      Math.abs(relevantPosition[0] - exitRow) +
      Math.abs(relevantPosition[1] - exitCol);
  }

  return distance;
}
