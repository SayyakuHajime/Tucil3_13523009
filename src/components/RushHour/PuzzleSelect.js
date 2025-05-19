// components/RushHour/PuzzleSelect.js
import React, { useState, useEffect, useRef } from "react";
import { SubheadingRed } from "../Typography";
import { PrimaryButton } from "../Button";

// Possible piece types
const PIECE_TYPES = {
  EMPTY: '.',
  PRIMARY: 'P',
  EXIT: 'K',
  VEHICLE: 'vehicle',
  BORDER: 'border'
};

// Vehicle letters (A-Z excluding P and K)
const VEHICLE_LETTERS = Array.from({ length: 26 }, (_, i) => {
  const char = String.fromCharCode(65 + i);
  return char !== 'P' && char !== 'K' ? char : null;
}).filter(Boolean);

export default function PuzzleSelect({ onCreatePuzzle }) {
  const [size, setSize] = useState({ rows: 6, cols: 6 });
  const [selectedTool, setSelectedTool] = useState(PIECE_TYPES.EMPTY);
  const [selectedVehicle, setSelectedVehicle] = useState('A');
  const [board, setBoard] = useState([]);
  const [primaryInfo, setPrimaryInfo] = useState({ positions: [], orientation: null });
  const [selectedPiece, setSelectedPiece] = useState(null); // Track currently selected piece
  
  // Use ref to maintain focus for keyboard events
  const containerRef = useRef(null);
  
  // Initialize board when size changes
  useEffect(() => {
    // Create a (rows+2) x (cols+2) grid to include border cells for exits
    const newBoard = Array(size.rows + 2).fill().map((_, rowIndex) => 
      Array(size.cols + 2).fill().map((_, colIndex) => {
        // If this is a border cell, mark it as BORDER
        if (rowIndex === 0 || rowIndex === size.rows + 1 || 
            colIndex === 0 || colIndex === size.cols + 1) {
          return PIECE_TYPES.BORDER;
        }
        return PIECE_TYPES.EMPTY;
      })
    );
    
    setBoard(newBoard);
    setPrimaryInfo({ positions: [], orientation: null });
    setSelectedPiece(null);
  }, [size]);
  
  // Set up keyboard event listener for the 'R' key and 'Delete' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPiece) {
        // 'R' key for rotation
        if (e.key === 'r' || e.key === 'R') {
          rotatePiece(selectedPiece);
        }
        // 'Delete' key or 'Backspace' key for deleting pieces
        else if (e.key === 'Delete' || e.key === 'Backspace') {
          deletePiece(selectedPiece);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPiece, board]);
  
  // Delete a piece from the board
  const deletePiece = (pieceChar) => {
    if (pieceChar === PIECE_TYPES.BORDER) return;
    
    const newBoard = [...board.map(row => [...row])];
    
    // If deleting primary piece, clear primaryInfo
    if (pieceChar === PIECE_TYPES.PRIMARY) {
      setPrimaryInfo({ positions: [], orientation: null });
    }
    
    // Clear all instances of the piece
    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] === pieceChar) {
          newBoard[i][j] = isBorderCell(i, j) ? PIECE_TYPES.BORDER : PIECE_TYPES.EMPTY;
        }
      }
    }
    
    setBoard(newBoard);
    setSelectedPiece(null); // Unselect piece after deletion
  };
  
  // Find all positions of a specific piece on the board
  const findPiecePositions = (pieceChar) => {
    const positions = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === pieceChar) {
          positions.push([i, j]);
        }
      }
    }
    return positions;
  };
  
  // Determine if a piece can be rotated (has enough space)
  const canRotatePiece = (piecePositions) => {
    if (piecePositions.length <= 1) return false;
    
    // Check if piece is currently horizontal or vertical
    const isHorizontal = piecePositions.every(pos => pos[0] === piecePositions[0][0]);
    
    // For rotation, we need to check if there's space in the perpendicular direction
    if (isHorizontal) {
      // Horizontal to vertical rotation
      // Need space below for each column
      const sortedPositions = [...piecePositions].sort((a, b) => a[1] - b[1]);
      const minCol = sortedPositions[0][1];
      const row = sortedPositions[0][0];
      
      // Check if there's enough vertical space starting from the leftmost cell
      for (let i = 1; i < piecePositions.length; i++) {
        if (row + i >= board.length) return false;
        if (board[row + i][minCol] !== PIECE_TYPES.EMPTY) return false;
      }
      
      return true;
    } else {
      // Vertical to horizontal rotation
      // Need space to the right for each row
      const sortedPositions = [...piecePositions].sort((a, b) => a[0] - b[0]);
      const minRow = sortedPositions[0][0];
      const col = sortedPositions[0][1];
      
      // Check if there's enough horizontal space starting from the topmost cell
      for (let i = 1; i < piecePositions.length; i++) {
        if (col + i >= board[0].length) return false;
        if (board[minRow][col + i] !== PIECE_TYPES.EMPTY) return false;
      }
      
      return true;
    }
  };
  
  // Rotate a piece (change orientation between horizontal and vertical)
  const rotatePiece = (pieceChar) => {
    if (pieceChar === PIECE_TYPES.EMPTY || pieceChar === PIECE_TYPES.BORDER || 
        pieceChar === PIECE_TYPES.EXIT) return;
    
    const positions = findPiecePositions(pieceChar);
    
    // Need at least 2 cells to determine orientation
    if (positions.length < 2) return;
    
    // Check if rotation is possible
    if (!canRotatePiece(positions)) {
      alert("Not enough space to rotate this piece");
      return;
    }
    
    // Create a new board for rotation
    const newBoard = board.map(row => [...row]);
    
    // Clear current piece positions
    positions.forEach(([r, c]) => {
      newBoard[r][c] = isBorderCell(r, c) ? PIECE_TYPES.BORDER : PIECE_TYPES.EMPTY;
    });
    
    // Determine current orientation and place in new orientation
    const isHorizontal = positions.every(pos => pos[0] === positions[0][0]);
    
    if (isHorizontal) {
      // Horizontal to vertical
      const sortedPositions = [...positions].sort((a, b) => a[1] - b[1]);
      const minCol = sortedPositions[0][1];
      const row = sortedPositions[0][0];
      
      // Place vertically from the leftmost position
      for (let i = 0; i < positions.length; i++) {
        newBoard[row + i][minCol] = pieceChar;
      }
      
      // If this is the primary piece, update primaryInfo
      if (pieceChar === PIECE_TYPES.PRIMARY) {
        const newPositions = [];
        for (let i = 0; i < positions.length; i++) {
          newPositions.push([row + i, minCol]);
        }
        setPrimaryInfo({
          positions: newPositions,
          orientation: 'vertical'
        });
      }
    } else {
      // Vertical to horizontal
      const sortedPositions = [...positions].sort((a, b) => a[0] - b[0]);
      const minRow = sortedPositions[0][0];
      const col = sortedPositions[0][1];
      
      // Place horizontally from the topmost position
      for (let i = 0; i < positions.length; i++) {
        newBoard[minRow][col + i] = pieceChar;
      }
      
      // If this is the primary piece, update primaryInfo
      if (pieceChar === PIECE_TYPES.PRIMARY) {
        const newPositions = [];
        for (let i = 0; i < positions.length; i++) {
          newPositions.push([minRow, col + i]);
        }
        setPrimaryInfo({
          positions: newPositions,
          orientation: 'horizontal'
        });
      }
    }
    
    setBoard(newBoard);
  };
  
  // Calculate valid exit positions based on primary piece
  const getValidExitPositions = () => {
    if (!primaryInfo.positions.length) return [];
    
    const validPositions = [];
    const { positions, orientation } = primaryInfo;
    
    if (orientation === 'horizontal') {
      // For horizontal primary, exits can be on left or right edge
      const row = positions[0][0]; // Primary piece row (adjusted for border)
      
      // Check if primary is already on left edge
      const minCol = Math.min(...positions.map(pos => pos[1]));
      if (minCol > 1) {
        validPositions.push([row, 0]); // Left edge
      }
      
      // Check if primary is already on right edge
      const maxCol = Math.max(...positions.map(pos => pos[1]));
      if (maxCol < size.cols) {
        validPositions.push([row, size.cols + 1]); // Right edge
      }
    } else if (orientation === 'vertical') {
      // For vertical primary, exits can be on top or bottom edge
      const col = positions[0][1]; // Primary piece column (adjusted for border)
      
      // Check if primary is already on top edge
      const minRow = Math.min(...positions.map(pos => pos[0]));
      if (minRow > 1) {
        validPositions.push([0, col]); // Top edge
      }
      
      // Check if primary is already on bottom edge
      const maxRow = Math.max(...positions.map(pos => pos[0]));
      if (maxRow < size.rows) {
        validPositions.push([size.rows + 1, col]); // Bottom edge
      }
    }
    
    return validPositions;
  };
  
  // Is position a valid exit position?
  const isValidExit = (row, col) => {
    if (!primaryInfo.positions.length) return false;
    
    const validPositions = getValidExitPositions();
    return validPositions.some(pos => pos[0] === row && pos[1] === col);
  };
  
  // Is position a border cell?
  const isBorderCell = (row, col) => {
    return row === 0 || row === size.rows + 1 || col === 0 || col === size.cols + 1;
  };
  
  // Handle cell click
  const handleCellClick = (row, col) => {
    // If it's a border cell, only allow exit placement
    if (isBorderCell(row, col)) {
      if (selectedTool === PIECE_TYPES.EXIT) {
        if (!isValidExit(row, col)) {
          alert("Exit must align with primary piece orientation");
          return;
        }
        
        const newBoard = [...board.map(r => [...r])];
        
        // Clear any existing exit
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (newBoard[i][j] === PIECE_TYPES.EXIT) {
              newBoard[i][j] = isBorderCell(i, j) ? PIECE_TYPES.BORDER : PIECE_TYPES.EMPTY;
            }
          }
        }
        
        newBoard[row][col] = PIECE_TYPES.EXIT;
        setBoard(newBoard);
      }
      return;
    }
    
    // Check if user selected a piece to highlight
    const cell = board[row][col];
    if (cell !== PIECE_TYPES.EMPTY && cell !== PIECE_TYPES.BORDER) {
      setSelectedPiece(cell);
      return;
    }
    
    // For non-border cells, handle as before
    const newBoard = [...board.map(r => [...r])];
    
    // Handle different tools
    if (selectedTool === PIECE_TYPES.PRIMARY) {
      // Place primary piece (always 2 cells)
      // First, clear any existing primary
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (newBoard[i][j] === PIECE_TYPES.PRIMARY) {
            newBoard[i][j] = isBorderCell(i, j) ? PIECE_TYPES.BORDER : PIECE_TYPES.EMPTY;
          }
        }
      }
      
      // Determine orientation based on where user clicks
      // Try horizontal first (primary piece 2 cells wide)
      if (col < size.cols && newBoard[row][col + 1] === PIECE_TYPES.EMPTY) {
        newBoard[row][col] = PIECE_TYPES.PRIMARY;
        newBoard[row][col + 1] = PIECE_TYPES.PRIMARY;
        setPrimaryInfo({
          positions: [[row, col], [row, col + 1]],
          orientation: 'horizontal'
        });
      } 
      // Otherwise try vertical
      else if (row < size.rows && newBoard[row + 1][col] === PIECE_TYPES.EMPTY) {
        newBoard[row][col] = PIECE_TYPES.PRIMARY;
        newBoard[row + 1][col] = PIECE_TYPES.PRIMARY;
        setPrimaryInfo({
          positions: [[row, col], [row + 1, col]],
          orientation: 'vertical'
        });
      }
      // Cannot place primary if no space
      else {
        alert("Cannot place primary piece here - need 2 adjacent empty cells");
        return;
      }
      
      setSelectedPiece(PIECE_TYPES.PRIMARY);
      
    } else if (selectedTool === PIECE_TYPES.VEHICLE) {
      // Place vehicle piece (must be 2 or 3 cells)
      // First, check if this letter already exists
      const existingPositions = [];
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (newBoard[i][j] === selectedVehicle) {
            existingPositions.push([i, j]);
          }
        }
      }
      
      if (existingPositions.length === 0) {
        // New vehicle - just place one cell for now
        newBoard[row][col] = selectedVehicle;
      } else if (existingPositions.length === 1) {
        // We have one cell, try to make it a 2-cell vehicle
        const [existingRow, existingCol] = existingPositions[0];
        
        // Check if new cell is adjacent to existing cell
        const isAdjacent = 
          (Math.abs(row - existingRow) === 1 && col === existingCol) || 
          (Math.abs(col - existingCol) === 1 && row === existingRow);
          
        if (isAdjacent) {
          newBoard[row][col] = selectedVehicle;
        } else {
          alert("Vehicle cells must be adjacent");
          return;
        }
      } else if (existingPositions.length === 2) {
        // We have two cells, try to make it a 3-cell vehicle
        // Determine current orientation
        const sameRow = existingPositions[0][0] === existingPositions[1][0];
        const targetRow = existingPositions[0][0];
        const targetCol = existingPositions[0][1];
        
        if (sameRow) {
          // Horizontal vehicle
          const minCol = Math.min(existingPositions[0][1], existingPositions[1][1]);
          const maxCol = Math.max(existingPositions[0][1], existingPositions[1][1]);
          
          // New cell must be in same row, and adjacent to min or max
          if (row === targetRow && (col === minCol - 1 || col === maxCol + 1)) {
            newBoard[row][col] = selectedVehicle;
          } else {
            alert("Third cell must extend the vehicle in the same direction");
            return;
          }
        } else {
          // Vertical vehicle
          const minRow = Math.min(existingPositions[0][0], existingPositions[1][0]);
          const maxRow = Math.max(existingPositions[0][0], existingPositions[1][0]);
          
          // New cell must be in same column, and adjacent to min or max
          if (col === targetCol && (row === minRow - 1 || row === maxRow + 1)) {
            newBoard[row][col] = selectedVehicle;
          } else {
            alert("Third cell must extend the vehicle in the same direction");
            return;
          }
        }
      } else {
        alert("Vehicles can only be 2 or 3 cells long");
        return;
      }
      
      setSelectedPiece(selectedVehicle);
      
    } else if (selectedTool === PIECE_TYPES.EMPTY) {
      // Clear cell - check if this affects primary piece
      if (newBoard[row][col] === PIECE_TYPES.PRIMARY) {
        setPrimaryInfo({ positions: [], orientation: null });
      }
      
      newBoard[row][col] = PIECE_TYPES.EMPTY;
      setSelectedPiece(null);
    }
    
    setBoard(newBoard);
  };
  
  // Count vehicles in actual play area (excluding border)
  const countVehicles = () => {
    const uniqueVehicles = new Set();
    for (let i = 1; i <= size.rows; i++) {
      for (let j = 1; j <= size.cols; j++) {
        const cell = board[i][j];
        if (cell !== PIECE_TYPES.EMPTY && cell !== PIECE_TYPES.PRIMARY && 
            cell !== PIECE_TYPES.EXIT && cell !== PIECE_TYPES.BORDER) {
          uniqueVehicles.add(cell);
        }
      }
    }
    return uniqueVehicles.size;
  };
  
  // Create puzzle - strip border from final board
  const createPuzzle = () => {
    // Validate board
    const hasPrimary = board.some(row => row.includes(PIECE_TYPES.PRIMARY));
    const hasExit = board.some(row => row.includes(PIECE_TYPES.EXIT));
    
    if (!hasPrimary) {
      alert("Puzzle must have a primary piece (P)");
      return;
    }
    
    if (!hasExit) {
      alert("Puzzle must have an exit (K)");
      return;
    }
    
    // Validate vehicle count
    if (countVehicles() > 24) {
      alert("Maximum 24 different vehicle pieces allowed");
      return;
    }
    
    // Create actual board without border
    const actualBoard = [];
    for (let i = 1; i <= size.rows; i++) {
      const row = [];
      for (let j = 1; j <= size.cols; j++) {
        row.push(board[i][j]);
      }
      actualBoard.push(row);
    }
    
    // Find exit position
    let exitPosition = null;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === PIECE_TYPES.EXIT) {
          // Convert to coordinates relative to the actual board
          // This gets tricky with the border
          let actualRow, actualCol;
          
          if (i === 0) actualRow = 0;
          else if (i === size.rows + 1) actualRow = size.rows - 1;
          else actualRow = i - 1;
          
          if (j === 0) actualCol = 0;
          else if (j === size.cols + 1) actualCol = size.cols - 1;
          else actualCol = j - 1;
          
          exitPosition = [actualRow, actualCol];
          
          // Place exit in actual board if it's on the edge
          if (i === 0 || i === size.rows + 1 || j === 0 || j === size.cols + 1) {
            if (i === 0) actualRow = 0;
            else if (i === size.rows + 1) actualRow = size.rows - 1;
            else actualRow = i - 1;
            
            if (j === 0) actualCol = 0;
            else if (j === size.cols + 1) actualCol = size.cols - 1;
            else actualCol = j - 1;
            
            if (actualRow >= 0 && actualRow < size.rows && 
                actualCol >= 0 && actualCol < size.cols) {
              actualBoard[actualRow][actualCol] = PIECE_TYPES.EXIT;
            }
          }
        }
      }
    }
    
    // Create config object
    const puzzleConfig = {
      size: [size.rows, size.cols],
      vehicleCount: countVehicles(),
      board: actualBoard,
      pieces: [], // This would be generated from the actual board
      exit: exitPosition
    };
    
    onCreatePuzzle(puzzleConfig);
  };
  
  return (
    <div 
      className="flex flex-col items-center gap-4" 
      ref={containerRef} 
      tabIndex={0} // Make div focusable for keyboard events
    >
      <SubheadingRed>Create Puzzle Visually</SubheadingRed>
      
      {/* Rotation and deletion instruction */}
      <p className="text-center text-sm text-secondary">
        Click a piece to select it, then press <kbd className="bg-secondary text-primary px-2 py-1 rounded">R</kbd> to rotate 
        or <kbd className="bg-secondary text-primary px-2 py-1 rounded">Delete</kbd> to remove
      </p>
      
      {/* Size controls */}
      <div className="flex gap-4">
        <div>
          <label className="block text-primary font-bold mb-1">Rows:</label>
          <input 
            type="number" 
            min="4" 
            max="7"
            value={size.rows}
            onChange={(e) => setSize({...size, rows: parseInt(e.target.value) || 6})}
            className="w-16 border-2 border-primary rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-primary font-bold mb-1">Columns:</label>
          <input 
            type="number" 
            min="4" 
            max="7"
            value={size.cols}
            onChange={(e) => setSize({...size, cols: parseInt(e.target.value) || 6})}
            className="w-16 border-2 border-primary rounded px-2 py-1"
          />
        </div>
      </div>
      
      {/* Tool selection */}
      <div className="bg-secondary p-4 rounded-lg w-full">
        <p className="text-center text-primary font-bold mb-2">Select tool:</p>
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={() => setSelectedTool(PIECE_TYPES.EMPTY)}
            className={`w-12 h-12 rounded-md flex items-center justify-center bg-gray-200
              ${selectedTool === PIECE_TYPES.EMPTY ? 'ring-2 ring-primary' : ''}`}
          >
            Erase
          </button>
          <button
            onClick={() => setSelectedTool(PIECE_TYPES.PRIMARY)}
            className={`w-12 h-12 rounded-md flex items-center justify-center bg-red-600 text-black font-bold
              ${selectedTool === PIECE_TYPES.PRIMARY ? 'ring-2 ring-primary' : ''}`}
          >
            P
          </button>
          <button
            onClick={() => setSelectedTool(PIECE_TYPES.EXIT)}
            className={`w-12 h-12 rounded-md flex items-center justify-center bg-yellow-300 text-black font-bold
              ${selectedTool === PIECE_TYPES.EXIT ? 'ring-2 ring-primary' : ''}`}
          >
            K
          </button>
          <button
            onClick={() => setSelectedTool(PIECE_TYPES.VEHICLE)}
            className={`w-12 h-12 rounded-md flex items-center justify-center bg-blue-500 text-black font-bold
              ${selectedTool === PIECE_TYPES.VEHICLE ? 'ring-2 ring-primary' : ''}`}
          >
            {selectedVehicle}
          </button>
        </div>
        
        {/* Vehicle letter selection - only show when vehicle tool selected */}
        {selectedTool === PIECE_TYPES.VEHICLE && (
          <div className="mb-4">
            <p className="text-center text-primary font-bold mb-2">Select vehicle:</p>
            <div className="flex flex-wrap justify-center gap-1">
              {VEHICLE_LETTERS.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedVehicle(letter)}
                  className={`w-8 h-8 rounded-md flex items-center justify-center 
                    bg-blue-500 text-white text-sm
                    ${selectedVehicle === letter ? 'ring-2 ring-primary' : ''}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Currently selected piece indicator */}
      {selectedPiece && (
        <div className="text-center text-sm text-secondary bg-gray-100 p-2 rounded-lg">
          <span className="font-bold">Selected piece: </span>
          <span className={`inline-block w-6 h-6 align-middle rounded 
            ${selectedPiece === PIECE_TYPES.PRIMARY ? 'bg-red-600 text-white' : 'bg-blue-500 text-white'}`}>
            {selectedPiece}
          </span>
          <div className="text-xs mt-1">
            <span className="mr-2">Press <kbd className="bg-secondary text-primary px-1 rounded">R</kbd> to rotate</span>
            <span>Press <kbd className="bg-secondary text-primary px-1 rounded">Delete</kbd> to remove</span>
          </div>
        </div>
      )}
      
      {/* Board visualization - now with border for exit placement */}
      <div 
        className="grid gap-1 bg-secondary p-4 rounded-lg"
        style={{ 
          gridTemplateRows: `repeat(${size.rows + 2}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${size.cols + 2}, minmax(0, 1fr))`
        }}
      >
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => {
            // Determine if this is a valid exit position
            const validExit = isValidExit(rowIndex, colIndex);
            const isBorder = isBorderCell(rowIndex, colIndex);
            const isSelected = cell === selectedPiece;
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`
                  w-10 h-10 flex items-center justify-center rounded cursor-pointer
                  ${cell === PIECE_TYPES.EMPTY ? 'bg-gray-200' : ''}
                  ${cell === PIECE_TYPES.PRIMARY ? 'bg-red-600 text-white' : ''}
                  ${cell === PIECE_TYPES.EXIT ? 'bg-yellow-300 text-black font-bold' : ''}
                  ${cell === PIECE_TYPES.BORDER ? 'bg-gray-300' : ''}
                  ${cell !== PIECE_TYPES.EMPTY && cell !== PIECE_TYPES.PRIMARY && 
                    cell !== PIECE_TYPES.EXIT && cell !== PIECE_TYPES.BORDER 
                    ? 'bg-blue-500 text-white' : ''}
                  ${isBorder && cell === PIECE_TYPES.BORDER ? 'opacity-50' : ''}
                  ${validExit && cell === PIECE_TYPES.BORDER ? 'bg-yellow-200 border-2 border-yellow-400' : ''}
                  ${isSelected ? 'ring-2 ring-white' : ''}
                `}
              >
                {cell !== PIECE_TYPES.EMPTY && cell !== PIECE_TYPES.BORDER ? cell : ''}
              </div>
            );
          })
        )}
      </div>
      
      <PrimaryButton onClick={createPuzzle} label="Create Puzzle" />
    </div>
  );
}