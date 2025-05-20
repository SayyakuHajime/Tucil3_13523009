// lib/models.js

/**
 * Class representing a piece on the Rush Hour board
 */
export class Piece {
  /**
   * Create a new piece
   * @param {string} id - The character identifying this piece
   * @param {Array<Array<number>>} positions - Array of [row, col] positions
   * @param {boolean} isPrimary - Whether this is the primary piece to move to the exit
   */
  constructor(id, positions, isPrimary = false) {
    this.id = id;
    this.positions = positions;
    this.isPrimary = isPrimary;

    // Determine orientation based on positions
    if (positions.length <= 1) {
      this.orientation = "unknown"; // Can't determine with just one cell
    } else {
      // If all row values are the same, it's horizontal
      const isHorizontal = positions.every((pos) => pos[0] === positions[0][0]);
      this.orientation = isHorizontal ? "horizontal" : "vertical";
    }

    // Calculate length
    this.length = positions.length;
  }

  /**
   * Get the top-left position of the piece
   * @returns {Array<number>} [row, col] position
   */
  getTopLeft() {
    return this.positions.reduce((min, pos) => {
      if (pos[0] < min[0] || (pos[0] === min[0] && pos[1] < min[1])) {
        return pos;
      }
      return min;
    }, this.positions[0]);
  }

  /**
   * Create a new piece with updated positions after moving
   * @param {string} direction - 'up', 'down', 'left', or 'right'
   * @returns {Piece} A new piece with updated positions
   */
  move(direction, distance = 1) {
    // Create new positions array based on direction
    const newPositions = this.positions.map(([row, col]) => {
      switch (direction) {
        case "up":
          return [row - distance, col];
        case "down":
          return [row + distance, col];
        case "left":
          return [row, col - distance];
        case "right":
          return [row, col + distance];
        default:
          return [row, col];
      }
    });

    // Return a new piece with updated positions
    return new Piece(this.id, newPositions, this.isPrimary);
  }
}

/**
 * Class representing the Rush Hour game board
 */
export class Board {
  /**
   * Create a new board
   * @param {Array<number>} size - [rows, cols] dimensions of the board
   * @param {Array<Array<string>>} grid - 2D array representing the board state
   * @param {Array<number>} exitPosition - [row, col] position of the exit
   * @param {string} exitDirection - Direction of the exit ('up', 'down', 'left', 'right')
   */
  constructor(size, grid, exitPosition, exitDirection) {
    this.size = size;
    this.grid = grid;

    // Handle missing exit position
    if (!exitPosition) {
      console.warn("No exit position provided to Board constructor");
      // Default to the right edge
      this.exitPosition = [Math.floor(size[0] / 2), size[1] - 1];
    } else {
      this.exitPosition = exitPosition;
    }

    // Set the exit direction - very important to store this properly!
    this.exitDirection = exitDirection || "right"; // Only default to 'right' if not provided

    // Log to confirm values are set correctly
    console.log(
      "Board constructor: exit position =",
      this.exitPosition,
      "exit direction =",
      this.exitDirection
    );

    this.pieces = this.identifyPieces();
  }

  /**
   * Create a Board object from a parsed puzzle configuration
   * @param {Object} config - The parsed puzzle configuration
   * @returns {Board} A new Board instance
   */
  static fromConfig(config) {
    const { size, board, exit, exitDirection } = config;

    // Ensure board rows are arrays, not strings
    const normalizedBoard = board.map((row) =>
      Array.isArray(row) ? row : row.split("")
    );

    // Explicitly log values being passed to the constructor
    console.log(
      "Board.fromConfig: creating board with exit =",
      exit,
      "direction =",
      exitDirection
    );

    // Create the board with exit position and direction
    // Make sure to pass both exit and exitDirection!
    return new Board(size, normalizedBoard, exit, exitDirection);
  }

  /**
   * Check if the puzzle is solved
   * @returns {boolean} Whether the puzzle is solved
   */
  isSolved() {
    const primaryPiece = this.getPrimaryPiece();
    if (!primaryPiece) return false;

    // Get the exit position and direction - use this.exitDirection!
    const [exitRow, exitCol] = this.exitPosition;
    const exitDirection = this.exitDirection;

    console.log("isSolved: checking with exit direction =", exitDirection);

    // Check based on exit direction
    if (exitDirection === "up") {
      // For top exit, check if primary piece is at top edge
      const solved = primaryPiece.positions.some(
        ([row, col]) => row === 0 && col === exitCol
      );
      if (solved) console.log("PUZZLE SOLVED! Exit direction:", exitDirection);
      return solved;
    } else if (exitDirection === "down") {
      // For bottom exit, check if primary piece is at bottom edge
      const solved = primaryPiece.positions.some(
        ([row, col]) => row === this.size[0] - 1 && col === exitCol
      );
      if (solved) console.log("PUZZLE SOLVED! Exit direction:", exitDirection);
      return solved;
    } else if (exitDirection === "left") {
      // For left exit, check if primary piece is at left edge
      const solved = primaryPiece.positions.some(
        ([row, col]) => col === 0 && row === exitRow
      );
      if (solved) console.log("PUZZLE SOLVED! Exit direction:", exitDirection);
      return solved;
    } else if (exitDirection === "right") {
      // For right exit, check if primary piece is at right edge
      const solved = primaryPiece.positions.some(
        ([row, col]) => col === this.size[1] - 1 && row === exitRow
      );
      if (solved) console.log("PUZZLE SOLVED! Exit direction:", exitDirection);
      return solved;
    }

    return false;
  }

  /**
   * Check if a cell is empty
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether the cell is empty
   */
  isCellEmpty(row, col) {
    // Check bounds
    if (row < 0 || row >= this.size[0] || col < 0 || col >= this.size[1]) {
      return false;
    }

    return this.grid[row][col] === ".";
  }

  /**
   * Check if a cell is the exit
   * @param {number} row - Row index
   * @param {number} col - Column index
   * @returns {boolean} Whether the cell is the exit
   */
  isExit(row, col) {
    return row === this.exitPosition[0] && col === this.exitPosition[1];
  }

  /**
   * Extract all pieces from the grid
   * @returns {Array<Piece>} Array of pieces
   */
  identifyPieces() {
    const piecesMap = new Map();

    // Scan the board and collect positions for each piece
    for (let row = 0; row < this.size[0]; row++) {
      for (let col = 0; col < this.size[1]; col++) {
        const cell = this.grid[row][col];
        if (cell !== "." && cell !== "K") {
          if (!piecesMap.has(cell)) {
            piecesMap.set(cell, {
              id: cell,
              positions: [[row, col]],
              isPrimary: cell === "P",
            });
          } else {
            piecesMap.get(cell).positions.push([row, col]);
          }
        }
      }
    }

    // Convert map to array of Piece objects
    return Array.from(piecesMap.values()).map(
      ({ id, positions, isPrimary }) => new Piece(id, positions, isPrimary)
    );
  }

  /**
   * Find a piece by its ID
   * @param {string} id - The piece ID to find
   * @returns {Piece|null} The found piece or null
   */
  getPiece(id) {
    return this.pieces.find((piece) => piece.id === id) || null;
  }

  /**
   * Get the primary piece
   * @returns {Piece|null} The primary piece or null
   */
  getPrimaryPiece() {
    return this.pieces.find((piece) => piece.isPrimary) || null;
  }

  /**
   * Check if a piece can move a specific distance in a direction
   * @param {Piece} piece - The piece to check
   * @param {string} direction - 'up', 'down', 'left', or 'right'
   * @param {number} distance - How far to check
   * @returns {boolean} Whether the move is valid
   * @private
   */
  _canMoveStep(piece, direction, distance) {
    // First, check if the direction is compatible with the piece orientation
    if (
      (piece.orientation === "horizontal" &&
        (direction === "up" || direction === "down")) ||
      (piece.orientation === "vertical" &&
        (direction === "left" || direction === "right"))
    ) {
      return false;
    }

    const [rows, cols] = this.size;
    const [exitRow, exitCol] = this.exitPosition;
    const exitDirection = this.exitDirection;

    // Check the path based on direction
    switch (direction) {
      case "up": {
        // Can only move up if the piece is vertical
        if (piece.orientation !== "vertical") return false;

        // Get the top-most position of the piece
        let topRow = Infinity;
        let topCol = 0;
        for (const [row, col] of piece.positions) {
          if (row < topRow) {
            topRow = row;
            topCol = col;
          }
        }

        // Check each step one at a time
        const checkRow = topRow - distance;

        // Check if out of bounds
        if (checkRow < 0) {
          // Special case: Allow primary piece to exit through the top
          if (
            piece.isPrimary &&
            exitDirection === "up" &&
            topCol === exitCol &&
            distance <= topRow + 1
          ) {
            return true;
          }
          return false;
        }

        // Check if the cell is occupied by another piece
        for (const pos of piece.positions) {
          if (pos[0] === topRow) {
            // Check only for top row cells
            const col = pos[1];
            if (
              this.grid[checkRow][col] !== "." &&
              !piece.positions.some(([r, c]) => r === checkRow && c === col)
            ) {
              return false;
            }
          }
        }

        return true;
      }

      case "down": {
        // Can only move down if the piece is vertical
        if (piece.orientation !== "vertical") return false;

        // Get the bottom-most position of the piece
        let bottomRow = -Infinity;
        let bottomCol = 0;
        for (const [row, col] of piece.positions) {
          if (row > bottomRow) {
            bottomRow = row;
            bottomCol = col;
          }
        }

        // Check the specific distance
        const checkRow = bottomRow + distance;

        // Check if out of bounds
        if (checkRow >= rows) {
          // Special case: Allow primary piece to exit through the bottom
          if (
            piece.isPrimary &&
            exitDirection === "down" &&
            bottomCol === exitCol &&
            distance <= rows - bottomRow
          ) {
            return true;
          }
          return false;
        }

        // Check if the cells are occupied
        for (const pos of piece.positions) {
          if (pos[0] === bottomRow) {
            // Check only for bottom row
            const col = pos[1];
            if (
              this.grid[checkRow][col] !== "." &&
              !piece.positions.some(([r, c]) => r === checkRow && c === col)
            ) {
              return false;
            }
          }
        }

        return true;
      }

      case "left": {
        // Can only move left if the piece is horizontal
        if (piece.orientation !== "horizontal") return false;

        // Get the left-most position of the piece
        let leftCol = Infinity;
        let leftRow = 0;
        for (const [row, col] of piece.positions) {
          if (col < leftCol) {
            leftCol = col;
            leftRow = row;
          }
        }

        // Check the specific distance
        const checkCol = leftCol - distance;

        // Check if out of bounds
        if (checkCol < 0) {
          // Special case: Allow primary piece to exit through the left
          if (
            piece.isPrimary &&
            exitDirection === "left" &&
            leftRow === exitRow &&
            distance <= leftCol + 1
          ) {
            return true;
          }
          return false;
        }

        // Check if the cells are occupied
        for (const pos of piece.positions) {
          if (pos[1] === leftCol) {
            // Check only for leftmost column
            const row = pos[0];
            if (
              this.grid[row][checkCol] !== "." &&
              !piece.positions.some(([r, c]) => r === row && c === checkCol)
            ) {
              return false;
            }
          }
        }

        return true;
      }

      case "right": {
        // Can only move right if the piece is horizontal
        if (piece.orientation !== "horizontal") return false;

        // Get the right-most position of the piece
        let rightCol = -Infinity;
        let rightRow = 0;
        for (const [row, col] of piece.positions) {
          if (col > rightCol) {
            rightCol = col;
            rightRow = row;
          }
        }

        // Check the specific distance
        const checkCol = rightCol + distance;

        // Check if out of bounds
        if (checkCol >= cols) {
          // Special case: Allow primary piece to exit through the right
          if (
            piece.isPrimary &&
            exitDirection === "right" &&
            rightRow === exitRow &&
            distance <= cols - rightCol
          ) {
            return true;
          }
          return false;
        }

        // Check if the cells are occupied
        for (const pos of piece.positions) {
          if (pos[1] === rightCol) {
            // Check only for rightmost column
            const row = pos[0];
            if (
              this.grid[row][checkCol] !== "." &&
              !piece.positions.some(([r, c]) => r === row && c === checkCol)
            ) {
              return false;
            }
          }
        }

        return true;
      }

      default:
        return false;
    }
  }

  /**
   * Create a new board with a piece moved in the specified direction
   * @param {string} pieceId - The ID of the piece to move
   * @param {string} direction - 'up', 'down', 'left', or 'right'
   * @param {number} distance - How many cells to move the piece (default: 1)
   * @returns {Board|null} A new board with the updated state, or null if move is invalid
   */
  movePiece(pieceId, direction, distance = 1) {
    const piece = this.getPiece(pieceId);
    if (!piece) return null;

    // Check if the piece can move in this direction based on orientation
    if (
      (piece.orientation === "horizontal" &&
        (direction === "up" || direction === "down")) ||
      (piece.orientation === "vertical" &&
        (direction === "left" || direction === "right"))
    ) {
      return null;
    }

    // Check if the move is valid
    if (!this._canMoveStep(piece, direction, distance)) {
      return null;
    }

    // Create a new grid with the piece moved
    const newGrid = this.grid.map((row) => [...row]);

    // Remove the piece from its current position
    piece.positions.forEach(([row, col]) => {
      newGrid[row][col] = ".";
    });

    // Calculate new positions after moving
    const newPositions = piece.positions.map(([row, col]) => {
      switch (direction) {
        case "up":
          return [row - distance, col];
        case "down":
          return [row + distance, col];
        case "left":
          return [row, col - distance];
        case "right":
          return [row, col + distance];
        default:
          return [row, col];
      }
    });

    // Place the piece in its new position
    for (const [row, col] of newPositions) {
      // Skip positions outside the board
      if (row < 0 || row >= this.size[0] || col < 0 || col >= this.size[1]) {
        continue;
      }

      newGrid[row][col] = pieceId;
    }

    // Return a new board with the updated grid AND PRESERVE EXIT DIRECTION!
    return new Board(this.size, newGrid, this.exitPosition, this.exitDirection);
  }

  /**
   * Get all possible moves from this board state
   * @returns {Array<{pieceId: string, direction: string, distance: number, board: Board}>} Array of possible moves
   */
  getPossibleMoves() {
    const moves = [];
    const directions = ["up", "down", "left", "right"];

    for (const piece of this.pieces) {
      for (const direction of directions) {
        // Skip invalid directions based on piece orientation
        if (
          (piece.orientation === "horizontal" &&
            (direction === "up" || direction === "down")) ||
          (piece.orientation === "vertical" &&
            (direction === "left" || direction === "right"))
        ) {
          continue;
        }

        // Find all valid distances for this piece and direction
        const maxBoardDimension = Math.max(this.size[0], this.size[1]);
        const validDistances = [];

        // Check each distance individually
        for (let distance = 1; distance <= maxBoardDimension; distance++) {
          if (this._canMoveStep(piece, direction, distance)) {
            validDistances.push(distance);
          } else {
            // Once we find an invalid distance, we stop checking further
            break;
          }
        }

        // Add a move for each valid distance
        for (const distance of validDistances) {
          const newBoard = this.movePiece(piece.id, direction, distance);

          if (newBoard) {
            moves.push({
              pieceId: piece.id,
              direction,
              distance,
              board: newBoard,
            });
          }
        }
      }
    }

    return moves;
  }

  /**
   * Generate a unique hash representing this board state
   * Used for detecting duplicate states during search
   * @returns {string} A unique string representing this board state
   */
  hash() {
    return this.grid
      .map((row) => {
        // Check if row is an array
        if (!Array.isArray(row)) {
          console.error("Invalid row in board grid:", row);
          return String(row); // Convert non-array row to string
        }
        return row.join("");
      })
      .join("");
  }
}

/**
 * Class representing a state in the search algorithm
 */
export class GameState {
  /**
   * Create a new game state
   * @param {Board} board - The current board state
   * @param {GameState|null} parent - The parent state that led to this state
   * @param {string|null} pieceId - The piece that was moved to reach this state
   * @param {string|null} direction - The direction the piece was moved
   * @param {number} distance - The distance the piece was moved
   * @param {number} cost - The cost to reach this state (number of moves)
   */
  constructor(
    board,
    parent = null,
    pieceId = null,
    direction = null,
    distance = 1,
    cost = 0
  ) {
    this.board = board;
    this.parent = parent;
    this.pieceId = pieceId;
    this.direction = direction;
    this.distance = distance;
    this.cost = cost;
  }

  /**
   * Check if this state is a goal state (puzzle solved)
   * @returns {boolean} Whether the puzzle is solved
   */
  isGoal() {
    // Make sure we're using the board's isSolved method correctly
    const solved = this.board.isSolved();

    // Add debugging to see if we're identifying goal states correctly
    if (solved) {
      console.log("FOUND GOAL STATE");
      console.log("- Exit direction:", this.board.exitDirection);
      console.log(
        "- Primary piece positions:",
        this.board.getPrimaryPiece().positions
      );
      console.log("- Exit position:", this.board.exitPosition);
    }

    return solved;
  }
  /**
   * Get all possible next states from this state
   * @returns {Array<GameState>} Array of possible next states
   */
  getNextStates() {
    const possibleMoves = this.board.getPossibleMoves();

    return possibleMoves.map(
      ({ pieceId, direction, distance, board }) =>
        new GameState(board, this, pieceId, direction, distance, this.cost + 1)
    );
  }

  /**
   * Get the path from the initial state to this state
   * @returns {Array<{pieceId: string, direction: string, distance: number}>} The sequence of moves
   */
  getPath() {
    const path = [];
    let current = this;

    while (current.parent) {
      path.unshift({
        pieceId: current.pieceId,
        direction: current.direction,
        distance: current.distance || 1,
      });
      current = current.parent;
    }

    return path;
  }

  /**
   * Generate a unique hash representing this state
   * Used for detecting duplicate states during search
   * @returns {string} A unique string representing this state
   */
  hash() {
    return this.board.hash();
  }
}
