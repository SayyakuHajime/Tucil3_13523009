// lib/algorithms/UCS.js
import { GameState, Board, Piece } from "../models";

/**
 * Implementation of Uniform Cost Search (UCS) algorithm
 * @param {Board} initialBoard - The starting board configuration
 * @returns {Object} Object containing solution path and statistics
 */
export function uniformCostSearch(initialBoard) {
  // Create the initial state
  const initialState = new GameState(initialBoard);

  // Priority queue for states, ordered by cost (number of moves)
  const queue = [initialState];

  // Set to keep track of visited states (to avoid cycles)
  const visited = new Set();

  // Statistics
  let nodesVisited = 0;

  while (queue.length > 0) {
    // Sort queue by cost (lowest cost first)
    queue.sort((a, b) => a.cost - b.cost);

    // Get the state with the lowest cost
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

  // No solution found
  return {
    path: [],
    nodesVisited,
    solved: false,
  };
}
