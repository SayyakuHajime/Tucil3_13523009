// utils.js
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Parse Rush Hour puzzle file content
 * @param {string} content - The content of the puzzle file
 * @returns {Object} Parsed puzzle configuration
 */
export function parseRushHourFile(content) {
  try {
    const lines = content.split('\n');
    const [rows, cols] = lines[0].split(' ').map(Number);
    const vehicleCount = parseInt(lines[1]);
    const board = lines.slice(2, 2 + rows);
    
    // Find primary piece and exit
    let primaryPiece = { id: 'P', orientation: null, position: [] };
    let exit = { position: null };
    
    // Process the board to identify pieces, their orientations and positions
    const pieces = new Map();
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = board[i][j];
        if (cell === '.') continue;
        
        if (cell === 'K') {
          exit.position = [i, j];
          continue;
        }
        
        if (!pieces.has(cell)) {
          pieces.set(cell, {
            id: cell,
            positions: [[i, j]],
            isPrimary: cell === 'P'
          });
        } else {
          pieces.get(cell).positions.push([i, j]);
        }
      }
    }
    
    // Determine orientation for each piece
    for (const piece of pieces.values()) {
      if (piece.positions.length > 1) {
        // Check if all X coordinates are the same (vertical orientation)
        const isVertical = piece.positions.every(pos => pos[1] === piece.positions[0][1]);
        piece.orientation = isVertical ? 'vertical' : 'horizontal';
      } else {
        // Single cell piece (assume default orientation)
        piece.orientation = 'horizontal';
      }
    }
    
    return {
      size: [rows, cols],
      vehicleCount,
      board,
      pieces: Array.from(pieces.values()),
      exit: exit.position
    };
  } catch (error) {
    console.error("Error parsing file:", error);
    throw new Error("Invalid file format. Please check the file and try again.");
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


// VALIDATION FUNCTIONS FOR RUSH HOUR PUZZLE
/**
 * Validate if a puzzle configuration is valid
 * @param {Object} config - The puzzle configuration to validate
 * @returns {boolean} Whether the configuration is valid
 */
export function validatePuzzleConfig(config) {
  const { size, board, vehicleCount } = config;
  
  // Check if size is valid
  if (!size || size.length !== 2 || size[0] <= 0 || size[1] <= 0) {
    return false;
  }
  
  // Check if board has the correct dimensions
  if (!board || board.length !== size[0]) {
    return false;
  }
  
  for (const row of board) {
    if (row.length !== size[1]) {
      return false;
    }
  }
  
  // Check if the primary piece exists
  const hasPrimaryPiece = board.some(row => row.includes('P'));
  if (!hasPrimaryPiece) {
    return false;
  }
  
  // Check if exit exists
  const hasExit = board.some(row => row.includes('K'));
  if (!hasExit) {
    return false;
  }
  
  // Additional validation for exit position
  if (!validateExitPosition(config)) {
    return false;
  }

  // Count unique pieces (excluding empty cells, primary piece, and exit)
  const uniquePieces = new Set();
  for (const row of board) {
    for (const cell of row) {
      if (cell !== '.' && cell !== 'P' && cell !== 'K') {
        uniquePieces.add(cell);
      }
    }
  }
  
  // Validate against the specified vehicle count or the number of unique pieces is over the limit
  if (uniquePieces.size !== vehicleCount || vehicleCount > 24) {
    return false;
  }

    // Check for unsolvable configurations
  if (!isPieceBetweenPrimaryAndExit(config)) {
    return false;
  }
  
  return true;
}

/**
 * Validates that the exit is properly positioned on the board edge
 * and aligned with the primary piece's orientation
 * @param {Object} config - The puzzle configuration to validate
 * @returns {boolean} Whether the exit is valid
 */
export function validateExitPosition(config) {
  const { board, size } = config;
  const [rows, cols] = size;
  
  // Find primary piece and determine orientation
  let primaryPositions = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 'P') {
        primaryPositions.push([i, j]);
      }
    }
  }
  
  if (primaryPositions.length < 2) {
    return false; // Cannot determine orientation with less than 2 positions
  }
  
  // Determine primary piece orientation
  const isPrimaryHorizontal = primaryPositions[0][0] === primaryPositions[1][0];
  
  // Find exit position
  let exitPosition = null;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 'K') {
        exitPosition = [i, j];
        break;
      }
    }
    if (exitPosition) break;
  }
  
  if (!exitPosition) {
    return false; // No exit found
  }
  
  // Check if exit is on a wall
  const [exitRow, exitCol] = exitPosition;
  const isOnWall = exitRow === 0 || exitRow === rows - 1 || exitCol === 0 || exitCol === cols - 1;
  
  if (!isOnWall) {
    return false; // Exit is not on a wall
  }
  
  // Check if exit orientation aligns with primary piece
  // If primary is horizontal, exit should be on left or right edge
  // If primary is vertical, exit should be on top or bottom edge
  const isExitHorizontal = exitRow === 0 || exitRow === rows - 1;
  const isExitVertical = exitCol === 0 || exitCol === cols - 1;
  
  // The exit orientation should be opposite to the primary piece orientation
  return (isPrimaryHorizontal && isExitVertical) || (!isPrimaryHorizontal && isExitHorizontal);
}

/**
 * Checks if the puzzle is unsolvable due to same-orientation vehicles
 * blocking the path between the primary piece and exit
 * @param {Object} config - The puzzle configuration
 * @returns {boolean} Returns true if puzzle is solvable, false if unsolvable
 */
export function isPieceBetweenPrimaryAndExit(config) {
  const { board, size } = config;
  const [rows, cols] = size;
  
  // Find primary piece positions
  let primaryPositions = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 'P') {
        primaryPositions.push([i, j]);
      }
    }
  }
  
  if (primaryPositions.length < 1) {
    return false; // No primary piece found, unsolvable
  }
  
  // Determine primary piece orientation and range
  const isPrimaryHorizontal = primaryPositions.length > 1 && 
                              primaryPositions[0][0] === primaryPositions[1][0];
  
  // Sort primary positions
  primaryPositions.sort((a, b) => {
    if (isPrimaryHorizontal) {
      return a[1] - b[1]; // Sort by column if horizontal
    } else {
      return a[0] - b[0]; // Sort by row if vertical
    }
  });
  
  // Get primary piece extremes
  const primaryRow = primaryPositions[0][0];
  const primaryStartCol = primaryPositions[0][1];
  const primaryEndCol = primaryPositions[primaryPositions.length - 1][1];
  
  const primaryCol = primaryPositions[0][1];
  const primaryStartRow = primaryPositions[0][0];
  const primaryEndRow = primaryPositions[primaryPositions.length - 1][0];
  
  // Find exit position
  let exitPosition = null;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j] === 'K') {
        exitPosition = [i, j];
        break;
      }
    }
    if (exitPosition) break;
  }
  
  if (!exitPosition) {
    return false; // No exit found, unsolvable
  }
  
  const [exitRow, exitCol] = exitPosition;
  
  // Check for vehicles between primary piece and exit
  if (isPrimaryHorizontal) {
    // For horizontal primary piece, check if exit is on the left or right
    if (exitCol < primaryStartCol) {
      // Exit is to the left of the primary piece
      for (let j = exitCol + 1; j < primaryStartCol; j++) {
        const cell = board[primaryRow][j];
        if (cell !== '.' && cell !== 'K') {
          // Found a vehicle, now check if it has the same orientation (horizontal)
          const vehiclePositions = [];
          for (let k = 0; k < cols; k++) {
            if (board[primaryRow][k] === cell) {
              vehiclePositions.push([primaryRow, k]);
            }
          }
          
          // If we found more than one position in the same row, it's horizontal
          if (vehiclePositions.length > 1) {
            return false; // Found a horizontal vehicle blocking the path, unsolvable
          }
        }
      }
    } else {
      // Exit is to the right of the primary piece
      for (let j = primaryEndCol + 1; j < exitCol; j++) {
        const cell = board[primaryRow][j];
        if (cell !== '.' && cell !== 'K') {
          // Found a vehicle, now check if it has the same orientation (horizontal)
          const vehiclePositions = [];
          for (let k = 0; k < cols; k++) {
            if (board[primaryRow][k] === cell) {
              vehiclePositions.push([primaryRow, k]);
            }
          }
          
          // If we found more than one position in the same row, it's horizontal
          if (vehiclePositions.length > 1) {
            return false; // Found a horizontal vehicle blocking the path, unsolvable
          }
        }
      }
    }
  } else {
    // For vertical primary piece, check if exit is above or below
    if (exitRow < primaryStartRow) {
      // Exit is above the primary piece
      for (let i = exitRow + 1; i < primaryStartRow; i++) {
        const cell = board[i][primaryCol];
        if (cell !== '.' && cell !== 'K') {
          // Found a vehicle, now check if it has the same orientation (vertical)
          const vehiclePositions = [];
          for (let k = 0; k < rows; k++) {
            if (board[k][primaryCol] === cell) {
              vehiclePositions.push([k, primaryCol]);
            }
          }
          
          // If we found more than one position in the same column, it's vertical
          if (vehiclePositions.length > 1) {
            return false; // Found a vertical vehicle blocking the path, unsolvable
          }
        }
      }
    } else {
      // Exit is below the primary piece
      for (let i = primaryEndRow + 1; i < exitRow; i++) {
        const cell = board[i][primaryCol];
        if (cell !== '.' && cell !== 'K') {
          // Found a vehicle, now check if it has the same orientation (vertical)
          const vehiclePositions = [];
          for (let k = 0; k < rows; k++) {
            if (board[k][primaryCol] === cell) {
              vehiclePositions.push([k, primaryCol]);
            }
          }
          
          // If we found more than one position in the same column, it's vertical
          if (vehiclePositions.length > 1) {
            return false; // Found a vertical vehicle blocking the path, unsolvable
          }
        }
      }
    }
  }
  
  return true;
}