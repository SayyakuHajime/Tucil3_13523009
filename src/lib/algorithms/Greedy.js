// lib/algorithms/Greedy.js
import { GameState, Board, Piece } from "../models";

/**
 * Implementation of Greedy Best First Search algorithm
 * @param {Board} initialBoard - The starting board configuration
 * @param {Function} heuristicFn - The heuristic function to use
 * @returns {Object} Object containing solution path and statistics
 */
export function greedyBestFirstSearch(initialBoard, heuristicFn) {
  // Create the initial state
  const initialState = new GameState(initialBoard);

  // Priority queue for states, ordered by heuristic value
  const queue = [initialState];

  // Set to keep track of visited states (to avoid cycles)
  const visited = new Set();

  // Statistics
  let nodesVisited = 0;

  while (queue.length > 0) {
    // Sort queue by heuristic value (lowest first)
    queue.sort((a, b) => heuristicFn(a.board) - heuristicFn(b.board));

    // Get the state with the lowest heuristic value
    const currentState = queue.shift();
    const stateHash = currentState.hash();

    // Count visited nodes
    nodesVisited++;

    // Skip if we've already seen this state
    if (visited.has(stateHash)) continue;

    // Mark as visited
    visited.add(stateHash);

    // Check if we've reached the goal
    if (currentState.isGoal()) {
      return {
        path: currentState.getPath(),
        nodesVisited,
        solved: true,
      };
    }

    // Get all possible next states
    const nextStates = currentState.getNextStates();

    // Add unvisited states to the queue
    for (const nextState of nextStates) {
      if (!visited.has(nextState.hash())) {
        queue.push(nextState);
      }
    }
  }

  // If we get here, no solution was found
  return {
    path: [],
    nodesVisited,
    solved: false,
  };
}
