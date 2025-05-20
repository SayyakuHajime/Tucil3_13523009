/**
 * Blocking pieces heuristic for Rush Hour
 * Counts the number of pieces blocking the path between the primary piece and the exit
 * @param {Board} board - The current board state
 * @returns {number} The heuristic value (lower is better)
 */
export function blockingPieces(board) {
  const primaryPiece = board.getPrimaryPiece();
  if (!primaryPiece) return Infinity;

  const exitPosition = board.exitPosition;
  const exitDirection = board.exitDirection;
  const grid = board.grid;

  // Count blocking pieces
  let blockingCount = 0;
  const blockers = new Set();

  // Find the relevant position of the primary piece based on exit direction
  let relevantRow = 0;
  let relevantCol = 0;

  if (exitDirection === "up") {
    // For top exit, find the topmost position
    let minRow = Infinity;
    for (const [row, col] of primaryPiece.positions) {
      if (row < minRow) {
        minRow = row;
        relevantCol = col;
      }
    }
    relevantRow = minRow;
  } else if (exitDirection === "down") {
    // For bottom exit, find the bottommost position
    let maxRow = -Infinity;
    for (const [row, col] of primaryPiece.positions) {
      if (row > maxRow) {
        maxRow = row;
        relevantCol = col;
      }
    }
    relevantRow = maxRow;
  } else if (exitDirection === "left") {
    // For left exit, find the leftmost position
    let minCol = Infinity;
    for (const [row, col] of primaryPiece.positions) {
      if (col < minCol) {
        minCol = col;
        relevantRow = row;
      }
    }
    relevantCol = minCol;
  } else if (exitDirection === "right") {
    // For right exit, find the rightmost position
    let maxCol = -Infinity;
    for (const [row, col] of primaryPiece.positions) {
      if (col > maxCol) {
        maxCol = col;
        relevantRow = row;
      }
    }
    relevantCol = maxCol;
  } else {
    // Default to first position
    [relevantRow, relevantCol] = primaryPiece.positions[0];
  }

  // Count blocking pieces based on exit direction
  if (exitDirection === "up") {
    // Count pieces from primary to top edge
    for (let row = relevantRow - 1; row >= 0; row--) {
      const cell = grid[row][relevantCol];
      if (cell !== "." && cell !== "P" && !blockers.has(cell)) {
        blockingCount++;
        blockers.add(cell);
      }
    }
  } else if (exitDirection === "down") {
    // Count pieces from primary to bottom edge
    for (let row = relevantRow + 1; row < board.size[0]; row++) {
      const cell = grid[row][relevantCol];
      if (cell !== "." && cell !== "P" && !blockers.has(cell)) {
        blockingCount++;
        blockers.add(cell);
      }
    }
  } else if (exitDirection === "left") {
    // Count pieces from primary to left edge
    for (let col = relevantCol - 1; col >= 0; col--) {
      const cell = grid[relevantRow][col];
      if (cell !== "." && cell !== "P" && !blockers.has(cell)) {
        blockingCount++;
        blockers.add(cell);
      }
    }
  } else if (exitDirection === "right") {
    // Count pieces from primary to right edge
    for (let col = relevantCol + 1; col < board.size[1]; col++) {
      const cell = grid[relevantRow][col];
      if (cell !== "." && cell !== "P" && !blockers.has(cell)) {
        blockingCount++;
        blockers.add(cell);
      }
    }
  }

  // Multiply by 2 to give more weight to blocking pieces
  return blockingCount * 2;
}
