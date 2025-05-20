// lib/algorithms/AStar.js
import { GameState, Board, Piece } from "../models";

/**
 * Implementation of A* Search algorithm
 * @param {Board} initialBoard - The starting board configuration
 * @param {Function} heuristicFn - The heuristic function to use
 * @returns {Object} Object containing solution path and statistics
 */
export function aStarSearch(initialBoard, heuristicFn) {
  // Create the initial state
  const initialState = new GameState(initialBoard);

  // Priority queue for states
  const openSet = [initialState];

  // Set to keep track of visited states (to avoid cycles)
  const closedSet = new Set();

  // Statistics
  let nodesVisited = 0;

  while (openSet.length > 0) {
    // Sort queue by f(n) = g(n) + h(n) where g(n) is the cost so far (number of moves)
    // and h(n) is the heuristic estimate to the goal
    openSet.sort((a, b) => {
      const aScore = a.cost + heuristicFn(a.board);
      const bScore = b.cost + heuristicFn(b.board);
      return aScore - bScore;
    });

    // Get the state with the lowest f(n) value
    const currentState = openSet.shift();
    const stateHash = currentState.hash();

    // Count visited nodes
    nodesVisited++;

    // Skip if we've already seen this state
    if (closedSet.has(stateHash)) continue;

    // Mark as visited
    closedSet.add(stateHash);

    // Check if we've reached the goal
    if (currentState.isGoal()) {
      console.log("A* found solution with", nodesVisited, "nodes visited");
      const path = currentState.getPath();
      console.log(
        "Solution path:",
        path
          .map(
            (move) =>
              `${move.pieceId} ${move.direction} ${move.distance || 1} spaces`
          )
          .join(", ")
      );
      return {
        path,
        nodesVisited,
        solved: true,
      };
    }

    // Get all possible next states
    const nextStates = currentState.getNextStates();

    for (const nextState of nextStates) {
      const nextHash = nextState.hash();

      // Skip states we've already visited
      if (closedSet.has(nextHash)) continue;

      // Add to open set if not already there
      if (!openSet.some((state) => state.hash() === nextHash)) {
        openSet.push(nextState);
      }
    }
  }

  // No solution found
  console.log(
    "A* failed to find solution after",
    nodesVisited,
    "nodes visited"
  );
  return {
    path: [],
    nodesVisited,
    solved: false,
  };
}
