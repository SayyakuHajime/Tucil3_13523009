// app/game/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import NavBar from "@/components/NavBar";
import { Heading, Paragraph } from "@/components/Typography";
import { Board, Controls, Stats, PuzzleInput } from "@/components/RushHour";
import { solvePuzzle, applyMovesToConfig } from "@/lib/services/gameService";

export default function GamePage() {
  const [boardConfig, setBoardConfig] = useState(null);
  const [algorithm, setAlgorithm] = useState("astar");
  const [heuristic, setHeuristic] = useState("manhattan");
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [nextStep, setNextStep] = useState(null); // Tracks the next step to apply
  const [currentBoardState, setCurrentBoardState] = useState(null);
  const [completedBoardState, setCompletedBoardState] = useState(null);
  const [animating, setAnimating] = useState(false);

  // Use refs to track animation timers
  const animationTimerRef = useRef(null);

  // Handle cleanup of timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const handlePuzzleLoad = (data) => {
    console.log("Raw puzzle data:", data);

    // Find the exit position if it's not provided
    let updatedData = { ...data };

    // If no exit position or direction, attempt to find them
    if (!updatedData.exit || !updatedData.exitDirection) {
      console.log(
        "Exit position or direction not found in loaded data, searching for 'K'"
      );

      // Search for 'K' in the board
      const board = updatedData.board;
      let exitPosition = null;
      let exitDirection = null;

      if (Array.isArray(board)) {
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            // Handle both string rows and array rows
            const cell = Array.isArray(board[i])
              ? board[i][j]
              : board[i].charAt(j);

            if (cell === "K") {
              // The 'K' represents the exit, determine position and direction

              // Determine which cell is adjacent to the exit based on position
              const rows = updatedData.size[0];
              const cols = updatedData.size[1];

              if (i === 0) {
                // 'K' at top edge
                exitDirection = "top";
                exitPosition = [0, j];
              } else if (i === rows - 1) {
                // 'K' at bottom edge
                exitDirection = "bottom";
                exitPosition = [rows - 1, j];
              } else if (j === 0) {
                // 'K' at left edge
                exitDirection = "left";
                exitPosition = [i, 0];
              } else if (j === cols - 1) {
                // 'K' at right edge
                exitDirection = "right";
                exitPosition = [i, cols - 1];
              }

              // Replace 'K' with an empty cell in the board
              if (Array.isArray(board[i])) {
                board[i][j] = ".";
              } else {
                let rowArray = board[i].split("");
                rowArray[j] = ".";
                board[i] = rowArray.join("");
              }

              console.log("Found exit marker at:", [i, j]);
              console.log(
                "Setting exit position to:",
                exitPosition,
                "with direction:",
                exitDirection
              );
              break;
            }
          }
          if (exitPosition) break;
        }
      }

      // If exit was found, add it to the data
      if (exitPosition) {
        updatedData.exit = exitPosition;
        updatedData.exitDirection = exitDirection;
      } else if (!updatedData.exit) {
        console.warn(
          "Could not find exit (K) in board, using default position"
        );
        // Default to right edge center
        updatedData.exit = [
          Math.floor(updatedData.size[0] / 2),
          updatedData.size[1] - 1,
        ];
        updatedData.exitDirection = "right";
      }
    }

    console.log(
      "Final board config with exit at:",
      updatedData.exit,
      "direction:",
      updatedData.exitDirection
    );

    setBoardConfig(updatedData);
    setCurrentBoardState(updatedData);
    setCompletedBoardState(null);
    setSolution(null);
    setCurrentStep(0);
    setNextStep(null);
    setStats(null);
  };

  const [stats, setStats] = useState(null);

  const solvePuzzleHandler = async () => {
    if (!boardConfig) {
      console.error("No board configuration available");
      return;
    }

    setSolving(true);

    try {
      // Use setTimeout to ensure UI updates before processing begins
      setTimeout(() => {
        try {
          console.log("Solving puzzle with:", {
            algorithm,
            heuristic,
            boardConfig,
          });
          const result = solvePuzzle(boardConfig, algorithm, heuristic);
          console.log("Solve result:", result);

          if (result.solved) {
            // Debug: Log the solution moves
            console.log("Solution moves:", result.moves);
            result.moves.forEach((move, index) => {
              console.log(
                `Move ${index + 1}: ${move.piece} ${move.direction} ${
                  move.distance || 1
                } spaces`
              );
            });

            // Calculate the final board state after all moves
            let finalBoardState = { ...boardConfig };
            for (const move of result.moves) {
              finalBoardState = applyMovesToConfig(
                { ...finalBoardState },
                [move],
                0
              );
            }

            setSolution({
              moves: result.moves,
            });
            setCompletedBoardState(finalBoardState);
            setStats(result.stats);
            setCurrentStep(0); // Start at step 0 (initial state)
          } else {
            alert("No solution found!");
            setStats({
              moves: 0,
              nodesVisited: result.stats.nodesVisited,
              executionTime: parseFloat(result.stats.executionTime),
              algorithm,
              heuristic,
            });
          }
        } catch (error) {
          console.error("Error in solving process:", error);
          alert(`Error solving puzzle: ${error.message}`);
        } finally {
          setSolving(false);
        }
      }, 50);
    } catch (error) {
      console.error("Error setting up solving process:", error);
      alert(`Error solving puzzle: ${error.message}`);
      setSolving(false);
    }
  };

  // Function to calculate animation duration based on move distance
  const calculateAnimationDuration = (move) => {
    if (!move) return 300; // Default animation duration
    const distance = move.distance || 1;
    return Math.min(300 + distance * 100, 800); // Between 300ms and 800ms
  };

  // Handle going to next step with animation
  const handleNextStep = () => {
    if (animating || !solution || currentStep >= solution.moves.length) return;

    setAnimating(true);

    // Set the next step (to show current animation)
    setNextStep(currentStep);

    // Schedule the board update after animation completes
    const currentMove = solution.moves[currentStep];
    const duration = calculateAnimationDuration(currentMove);

    animationTimerRef.current = setTimeout(() => {
      // Update to the next board state after animation completes
      setCurrentStep(currentStep + 1);
      setNextStep(null);
      setAnimating(false);
    }, duration);
  };

  // Handle going to previous step
  const handlePrevStep = () => {
    if (animating || currentStep <= 0) return;
    setAnimating(true);

    // For previous, we immediately update the state
    setCurrentStep(currentStep - 1);

    // And schedule the animation completion
    const prevMove = solution.moves[currentStep - 1];
    const duration = calculateAnimationDuration(prevMove);

    animationTimerRef.current = setTimeout(() => {
      setAnimating(false);
    }, duration);
  };

  // Get the current move for animation
  const getCurrentMove = () => {
    if (
      !solution ||
      !solution.moves ||
      nextStep === null ||
      nextStep < 0 ||
      nextStep >= solution.moves.length
    ) {
      return -1;
    }
    return nextStep;
  };

  // Calculate the current board state whenever step changes
  useEffect(() => {
    if (!boardConfig) {
      setCurrentBoardState(null);
      return;
    }

    // If we don't have a solution yet or we're at step 0, just show the initial board
    if (!solution || !solution.moves || currentStep === 0) {
      setCurrentBoardState(boardConfig);
      return;
    }

    // Apply moves up to the current step (for display)
    let newState = { ...boardConfig };
    for (let i = 0; i < currentStep; i++) {
      newState = applyMovesToConfig({ ...newState }, [solution.moves[i]], 0);
    }

    setCurrentBoardState(newState);
  }, [boardConfig, solution, currentStep]);

  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      {/* Main heading */}
      <div className="flex flex-col items-center pt-14">
        <Heading>Rush Hour Solver</Heading>
        <Paragraph>
          Choose a puzzle from the left, select an algorithm, and watch the
          solution unfold step by step.
        </Paragraph>
      </div>
      {/* Divider line */}

      {/* Main content area with three columns */}
      <div className="flex flex-row min-h-[calc(100vh-3rem)] pt-12">
        {/* Left column - Puzzle Input (20%) */}
        <div className="w-[20%] bg-[#0f172a] p-2">
          <div className="bg-[#1e293b] p-3 rounded-xl h-full overflow-y-auto">
            <h2 className="text-indigo-300 font-bold text-lg mb-4 text-center">
              Choose Your Puzzle
            </h2>

            <PuzzleInput onPuzzleLoad={handlePuzzleLoad} />
          </div>
        </div>
        {/* Middle column - Algorithm Controls and Stats (20%) */}
        <div className="w-[20%] bg-[#0f172a] p-2 ">
          <div className="bg-[#1e293b] p-3 rounded-xl h-full overflow-y-auto flex flex-col">
            {/* Algorithm selection */}
            <div className="space-y-6">
              <div className="flex justify-center gap-1">
                {[
                  { display: "Greedy", value: "greedy" },
                  { display: "UCS", value: "ucs" },
                  { display: "A*", value: "astar" },
                ].map((algo) => (
                  <button
                    key={algo.display}
                    onClick={() => setAlgorithm(algo.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium 
      ${
        algorithm === algo.value
          ? "bg-indigo-600 text-white"
          : "bg-indigo-100 text-indigo-800"
      }`}
                  >
                    {algo.display}
                  </button>
                ))}
              </div>

              {/* Heuristic selection - only show for relevant algorithms */}
              {(algorithm === "greedy" || algorithm === "astar") && (
                <div className="flex justify-center gap-1">
                  {["Manhattan", "Blocking", "Combined"].map((h) => (
                    <button
                      key={h}
                      onClick={() => setHeuristic(h.toLowerCase())}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium
                ${
                  heuristic === h.toLowerCase()
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-800"
                }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              )}

              {/* Solve button */}
              <div className="flex justify-center">
                <button
                  onClick={solvePuzzleHandler}
                  disabled={solving}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-xs hover:bg-indigo-700 disabled:opacity-50 w-[80%]"
                >
                  {solving ? "Solving..." : "Solve Puzzle"}
                </button>
              </div>
            </div>

            {/* Solution navigation */}
            {solution && (
              <div className="flex justify-center items-center gap-1 my-4">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 0 || animating}
                  className="bg-white text-indigo-800 px-3 py-1 rounded-lg font-medium text-xs disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-2 py-1 bg-white rounded-lg text-indigo-800 font-medium text-xs">
                  {currentStep + 1} / {solution.moves.length + 1}
                </span>
                <button
                  onClick={handleNextStep}
                  disabled={currentStep === solution.moves.length || animating}
                  className="bg-white text-indigo-800 px-3 py-1 rounded-lg font-medium text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Stats display - using our compact Stats component */}
            {stats && (
              <div className="mt-auto mb-2">
                <Stats
                  stats={stats}
                  currentMove={
                    currentStep > 0 && solution?.moves
                      ? {
                          step: currentStep,
                          piece: solution.moves[currentStep - 1].piece,
                          direction: solution.moves[currentStep - 1].direction,
                          distance:
                            solution.moves[currentStep - 1].distance || 1,
                        }
                      : null
                  }
                />
              </div>
            )}

            {/* Steps info at bottom when there's a current move */}
            {solution &&
              currentStep > 0 &&
              solution.moves &&
              solution.moves[currentStep - 1] && (
                <div className="text-center text-xs font-medium text-indigo-800 mt-2 p-2 bg-white rounded-lg shadow-sm mx-auto max-w-[80%]">
                  <p>
                    Step {currentStep}: {solution.moves[currentStep - 1].piece}{" "}
                    {solution.moves[currentStep - 1].direction}
                    {solution.moves[currentStep - 1].distance > 1
                      ? ` (${solution.moves[currentStep - 1].distance} spaces)`
                      : ""}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Right column - Game board (60%) */}
        <div className="w-[60%] p-3 flex items-center justify-center overflow-hidden relative">
          {/* Background image absolutely positioned at the very back */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/images/game_background.jpeg')",
              backgroundPosition: "center",
              backgroundSize: "140%",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#0f172a",
              backgroundBlendMode: "overlay",
              opacity: 0.12,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          />
          <div className="bg-indigo-200 p-4 rounded-xl max-w-3xl">
            {currentBoardState ? (
              <div>
                <Board
                  size={currentBoardState.size}
                  configuration={currentBoardState.board}
                  primaryPiece="P"
                  exit={currentBoardState.exit}
                  exitDirection={currentBoardState.exitDirection}
                  moves={solution?.moves || []}
                  currentMove={getCurrentMove()}
                  completedState={completedBoardState}
                />

                {/* Solution status message */}
                {completedBoardState &&
                  completedBoardState.isSolutionComplete && (
                    <p className="text-green-600 font-bold text-center mt-2">
                      Solution complete! Primary piece has reached the exit.
                    </p>
                  )}
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="text-indigo-800 font-bold">No puzzle loaded</p>
                <p className="text-indigo-600 text-sm mt-2">
                  Choose a puzzle from the left panel to begin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
