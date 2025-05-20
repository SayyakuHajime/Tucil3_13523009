// utils.js - Updated exit detection
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { Righteous } from "next/font/google";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Parse Rush Hour puzzle file content with comprehensive edge detection
 * @param {string} content - The content of the puzzle file
 * @returns {Object} Parsed puzzle configuration
 */
export function parseRushHourFile(content) {
  try {
    // Split content into lines
    const lines = content.split("\n");

    // Parse dimensions from first line
    const [rows, cols] = lines[0].trim().split(/\s+/).map(Number);

    if (isNaN(rows) || isNaN(cols)) {
      throw new Error(
        "Invalid dimensions. Both rows and columns must be numbers."
      );
    }

    // Parse vehicle count from second line
    const vehicleCount = parseInt(lines[1].trim());

    if (isNaN(vehicleCount)) {
      throw new Error("Invalid vehicle count. Must be a number.");
    }

    // Initialize variables for board and exit detection
    let boardLines = [];
    let exitRow = -1;
    let exitCol = -1;
    let exitDirection = null;
    let exitIsValid = true;
    let kCount = 0; // Count K occurrences

    // Look for standalone K lines and board lines with K
    let standAloneKIndex = -1;
    let standAloneKCol = -1;

    // First pass - look for standalone K lines
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === "K") {
        kCount++;
        standAloneKIndex = i;
        standAloneKCol = lines[i].indexOf("K"); // Preserve spaces
        break; // Take only the first standalone K
      }
    }

    // Second pass - collect board lines and check for K within them
    let lineWithKIndex = -1;
    let kIndexInLine = -1;

    for (let i = 2; i < lines.length && boardLines.length < rows; i++) {
      const line = lines[i];

      // Skip empty lines and the standalone K line
      if (line.trim() === "" || i === standAloneKIndex) {
        continue;
      }

      // Check if line contains K
      const kIndex = line.indexOf("K");
      if (kIndex !== -1) {
        kCount++;
        lineWithKIndex = boardLines.length; // The current board row index
        kIndexInLine = kIndex;
      }

      // Process the line for the board - remove K if present
      let processedLine = "";
      for (let j = 0; j < line.length; j++) {
        if (line[j] !== "K") {
          processedLine += line[j];
        }
        // Skip 'K' completely
      }

      // Add the processed line to the board
      boardLines.push(processedLine);
    }

    // Determine exit position and direction based on findings
    if (standAloneKIndex !== -1) {
      // Standalone K line found
      if (standAloneKIndex === 2) {
        // K is before the board - top exit
        exitRow = 0;
        exitCol = standAloneKCol;
        exitDirection = "up";
        console.log(
          "Found standalone K at top:",
          exitRow,
          exitCol,
          exitDirection
        );
      } else {
        // K is after or within the board - likely bottom exit
        exitRow = Math.min(rows - 1, boardLines.length);
        exitCol = standAloneKCol;
        exitDirection = "down";
        console.log(
          "Found standalone K at bottom:",
          exitRow,
          exitCol,
          exitDirection
        );
      }
    } else if (lineWithKIndex !== -1) {
      // K found within a board line
      exitRow = lineWithKIndex;

      // Determine exit direction based on K position
      if (kIndexInLine === 0) {
        // Left edge
        exitCol = 0;
        exitDirection = "left";
      } else if (
        kIndexInLine >= cols - 1 ||
        kIndexInLine === lines[lineWithKIndex + 2].length - 1
      ) {
        // Right edge 
        exitCol = cols - 1; 
        exitDirection = "right";
      } else if (lineWithKIndex === 0) {
        // Top edge (but not left or right)
        exitCol = kIndexInLine;
        exitDirection = "up";
      } else if (
        lineWithKIndex === rows - 1 ||
        lineWithKIndex === boardLines.length - 1
      ) {
        // Bottom edge (but not left or right)
        exitCol = kIndexInLine;
        exitDirection = "down";
      } else {
        // K is inside the board
        console.warn("K found inside the board - invalid exit position");
        exitRow = lineWithKIndex;
        exitCol = kIndexInLine;
        exitIsValid = false;
      }

      console.log("Found K in board line:", exitRow, exitCol, exitDirection);
    }

    // If we found multiple K's, the puzzle is invalid
    if (kCount > 1) {
      console.warn(`Found ${kCount} occurrences of K - puzzle is unsolvable`);
      exitIsValid = false;
    } else if (kCount === 0) {
      console.warn("No K found - using default exit");
      // Default to right edge, middle row
      exitRow = Math.floor(rows / 2);
      exitCol = cols - 1;
      exitDirection = "right";
    }

    // Ensure each line has exactly 'cols' characters
    for (let i = 0; i < boardLines.length; i++) {
      let line = boardLines[i];
      if (line.length < cols) {
        // Line is too short - pad with dots
        line = line.padEnd(cols, ".");
      } else if (line.length > cols) {
        // Line is too long - truncate
        line = line.substring(0, cols);
      }
      boardLines[i] = line;
    }

    // Ensure we have exactly rows lines
    while (boardLines.length < rows) {
      boardLines.push(".".repeat(cols));
    }

    // Convert strings to character arrays for the final board
    const board = boardLines.map((line) => line.split(""));

    // Check if exit is valid
    if (!exitIsValid || exitRow === -1 || exitCol === -1 || !exitDirection) {
      // If exit is invalid or not found, set to no solution
      console.warn("Invalid or missing exit (K) - puzzle is unsolvable");
      exitRow = -1;
      exitCol = -1;
      exitDirection = "none";
    }

    console.log(
      "Final exit position:",
      [exitRow, exitCol],
      "direction:",
      exitDirection,
      "valid:",
      exitIsValid
    );

    // Find primary piece positions
    let primaryPositions = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === "P") {
          primaryPositions.push([i, j]);
        }
      }
    }

    // Determine primary piece orientation
    let primaryOrientation = "horizontal"; // Default

    if (primaryPositions.length >= 2) {
      // Check if all pieces are in the same row
      const allSameRow = primaryPositions.every(
        (pos) => pos[0] === primaryPositions[0][0]
      );
      primaryOrientation = allSameRow ? "horizontal" : "vertical";
    }

    // Check if primary orientation is compatible with exit direction
    if (exitIsValid && primaryOrientation && exitDirection) {
      const isCompatible =
        (primaryOrientation === "horizontal" &&
          (exitDirection === "left" || exitDirection === "right")) ||
        (primaryOrientation === "vertical" &&
          (exitDirection === "up" || exitDirection === "down"));

      if (!isCompatible) {
        console.warn(
          "Primary piece orientation is not compatible with exit direction - puzzle is unsolvable"
        );
        exitIsValid = false;
      }
    }

    return {
      size: [rows, cols],
      vehicleCount,
      board,
      exit: [exitRow, exitCol], 
      exitDirection, 
      primaryOrientation,
      solvable: exitIsValid, // Additional flag indicating if the puzzle is solvable
    };
  } catch (error) {
    console.error("Error parsing Rush Hour file:", error);
    throw new Error(`Invalid puzzle format: ${error.message}`);
  }
}

/**
 * Read and parse a file as text
 * @param {File} file - The file to read
 * @returns {Promise<Object>} Parsed puzzle configuration
 */
export function readRushHourFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedData = parseRushHourFile(content);
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate the exit position and direction for a Rush Hour puzzle
 * @param {Object} config - The puzzle configuration
 * @returns {Object} Validation result with valid status and error message if invalid
 */
export function validateExit(config) {
  if (!config || !config.board || !config.exit || !config.exitDirection) {
    return {
      valid: false,
      message:
        "Missing required configuration elements (board, exit, or exitDirection).",
    };
  }

  const { board, exit, exitDirection, primaryOrientation } = config;
  const [exitRow, exitCol] = exit;
  const [rows, cols] = config.size;

  // Check if exit is within board bounds
  if (exitRow < 0 || exitRow >= rows || exitCol < 0) {
    return {
      valid: false,
      message: `Exit position [${exitRow}, ${exitCol}] is outside the board boundaries.`,
    };
  }

  // Check if exit is on the edge
  const isOnEdge =
    exitRow === 0 ||
    exitRow === rows - 1 ||
    exitCol === 0 ||
    (exitCol >= cols - 1 && exitCol <= cols); // Allow column index at or slightly beyond the declared size

  if (!isOnEdge) {
    return {
      valid: false,
      message: "Exit must be positioned on the edge of the board.",
    };
  }

  // Check if exit direction matches its position
  let expectedDirection = null;
  if (exitRow === 0) expectedDirection = "up";
  else if (exitRow === rows - 1) expectedDirection = "down";
  else if (exitCol === 0) expectedDirection = "left";
  else if (exitCol >= cols - 1) expectedDirection = "right";

  if (exitDirection !== expectedDirection) {
    return {
      valid: false,
      message: `Exit direction '${exitDirection}' doesn't match the expected direction '${expectedDirection}' for position [${exitRow}, ${exitCol}].`,
    };
  }

  // Validate that exit aligns with primary piece orientation
  if (primaryOrientation) {
    if (
      primaryOrientation === "horizontal" &&
      (exitDirection === "up" || exitDirection === "down")
    ) {
      return {
        valid: false,
        message:
          "For a horizontal primary piece, the exit must be on the left or right edge.",
      };
    }

    if (
      primaryOrientation === "vertical" &&
      (exitDirection === "left" || exitDirection === "right")
    ) {
      return {
        valid: false,
        message:
          "For a vertical primary piece, the exit must be on the top or bottom edge.",
      };
    }
  }

  // All checks passed
  return {
    valid: true,
    message: "Exit position and direction are valid.",
  };
}

// BOARD UTILITIES FUNCTIONS
/**
 * A utility function to validate that a move is legal
 * This is an additional check to ensure pieces don't overlap
 * @param {Board} board - The board to check
 * @param {string} pieceId - The ID of the piece to move
 * @param {string} direction - The direction to move ('up', 'down', 'left', 'right')
 * @returns {boolean} Whether the move is valid
 */
export function validateMove(board, pieceId, direction) {
  // Get the piece by ID
  const piece = board.getPiece(pieceId);
  if (!piece) return false;

  // Check orientation
  if (
    (piece.orientation === "horizontal" &&
      (direction === "up" || direction === "down")) ||
    (piece.orientation === "vertical" &&
      (direction === "left" || direction === "right"))
  ) {
    return false;
  }

  // Calculate new positions after the move
  const newPositions = piece.positions.map(([row, col]) => {
    switch (direction) {
      case "up":
        return [row - 1, col];
      case "down":
        return [row + 1, col];
      case "left":
        return [row, col - 1];
      case "right":
        return [row, col + 1];
      default:
        return [row, col];
    }
  });

  // Check if any new position is out of bounds
  for (const [row, col] of newPositions) {
    if (row < 0 || row >= board.size[0] || col < 0 || col >= board.size[1]) {
      return false;
    }
  }

  // Check if any new position overlaps with another piece
  for (const [row, col] of newPositions) {
    // Skip positions that are already occupied by this piece
    if (piece.positions.some(([r, c]) => r === row && c === col)) {
      continue;
    }

    // Check if the cell is empty or (if the primary piece) if it's the exit
    const isEmpty = board.grid[row][col] === ".";
    const isExit =
      row === board.exitPosition[0] && col === board.exitPosition[1];
    const canMoveToExit = piece.isPrimary && isExit && isEmpty;

    if (!isEmpty && !canMoveToExit) {
      return false;
    }
  }

  return true;
}

/**
 * Debug helper to print a board state to the console
 * @param {Board} board - The board to print
 */
export function printBoard(board) {
  const grid = board.grid;
  const size = board.size;

  console.log("Board state:");
  for (let i = 0; i < size[0]; i++) {
    let rowStr = "";
    for (let j = 0; j < size[1]; j++) {
      rowStr += grid[i][j] + " ";
    }
    console.log(rowStr);
  }

  console.log("Exit position:", board.exitPosition);
}

/**
 * Debug helper to verify a solution
 * @param {Board} initialBoard - The initial board state
 * @param {Array} moves - Array of moves to apply
 * @returns {boolean} Whether the solution is valid
 */
export function verifySolution(initialBoard, moves) {
  let currentBoard = initialBoard;
  console.log("Verifying solution with", moves.length, "moves");

  for (let i = 0; i < moves.length; i++) {
    const { pieceId, direction, distance = 1 } = moves[i];
    console.log(
      `Move ${i + 1}: Piece ${pieceId} ${direction} (${distance} spaces)`
    );

    // Apply the move
    const newBoard = currentBoard.movePiece(pieceId, direction, distance);
    if (!newBoard) {
      console.error(`Failed to apply move at step ${i + 1}`);
      return false;
    }

    currentBoard = newBoard;
  }

  // Check if the solution is valid (primary piece is at exit)
  const primaryPiece = currentBoard.getPrimaryPiece();
  const [exitRow, exitCol] = currentBoard.exitPosition;

  if (
    !primaryPiece.positions.some(
      ([row, col]) => row === exitRow && col === exitCol
    )
  ) {
    console.error("Invalid solution: Primary piece is not at exit position");
    printBoard(currentBoard);
    return false;
  }

  console.log("Solution verified successfully!");
  return true;
}

/**
 * Find the primary piece and determine its orientation
 * @param {Array<Array<string>>} board - 2D array representing the board
 * @returns {Object} Object containing positions and orientation of primary piece
 */
export function findPrimaryPiece(board) {
  if (!board || !Array.isArray(board) || board.length === 0) {
    return { positions: [], orientation: null };
  }

  // Collect all positions of the primary piece
  const positions = [];
  for (let i = 0; i < board.length; i++) {
    if (!Array.isArray(board[i])) continue;

    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === "P") {
        positions.push([i, j]);
      }
    }
  }

  // If no primary piece found
  if (positions.length === 0) {
    return { positions: [], orientation: null };
  }

  // Sort positions for consistent orientation detection
  positions.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  // Determine orientation
  let orientation = null;
  if (positions.length >= 2) {
    // Check if all positions have the same row (horizontal) or column (vertical)
    const isHorizontal = positions.every((pos) => pos[0] === positions[0][0]);
    orientation = isHorizontal ? "horizontal" : "vertical";
  }

  return { positions, orientation };
}

/**
 * Convert board to string representation
 * @param {Array<Array<string>>} board - 2D array representing the board
 * @param {Array<number>} [exitPosition] - Optional exit position to mark
 * @returns {string} String representation of the board
 */
export function boardToString(board, exitPosition = null) {
  if (!board || !Array.isArray(board) || board.length === 0) {
    return "";
  }

  const lines = board.map((row, rowIndex) => {
    return row
      .map((cell, colIndex) => {
        // Mark exit position with 'K'
        if (
          exitPosition &&
          rowIndex === exitPosition[0] &&
          colIndex === exitPosition[1]
        ) {
          return "K";
        }
        return cell;
      })
      .join("");
  });

  return lines.join("\n");
}

/**
 * Create a formatted string representing a move sequence
 * @param {Object} initialConfig - Initial board configuration
 * @param {Array} moves - Array of moves to apply
 * @returns {string} Formatted string with move sequence
 */
export function formatMoveSequence(initialConfig, moves) {
  if (!initialConfig || !moves || !Array.isArray(moves)) {
    return "Invalid parameters for formatMoveSequence";
  }

  const Board =
    window.Board ||
    (typeof require === "function" ? require("./lib/models").Board : null);
  if (!Board) {
    return "Board class not available";
  }

  let output = "Papan Awal\n";
  output += boardToString(initialConfig.board, initialConfig.exit) + "\n";

  let currentBoard = Board.fromConfig(initialConfig);

  for (let i = 0; i < moves.length; i++) {
    const { pieceId, direction, distance = 1 } = moves[i];

    // Format direction for output
    let directionText = direction;
    switch (direction) {
      case "up":
        directionText = "atas";
        break;
      case "down":
        directionText = "bawah";
        break;
      case "left":
        directionText = "kiri";
        break;
      case "right":
        directionText = "kanan";
        break;
    }

    output += `Gerakan ${i + 1}: ${pieceId}-${directionText}`;
    if (distance > 1) {
      output += ` (${distance} langkah)`;
    }
    output += "\n";

    // Apply the move
    const newBoard = currentBoard.movePiece(pieceId, direction, distance);
    if (!newBoard) {
      output += "Error: Move could not be applied\n";
      break;
    }

    currentBoard = newBoard;

    // Add board state after this move
    output += boardToString(currentBoard.grid, initialConfig.exit) + "\n";
  }

  // Check if solved
  if (currentBoard.isSolved()) {
    output += "Puzzle solved!\n";
  }

  return output;
}
