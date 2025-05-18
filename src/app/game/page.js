// app/game/page.js
"use client";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import { Heading, Paragraph } from "@/components/Typography";
import { Board, Controls, Stats, FileInput } from "@/components/RushHour";

export default function GamePage() {
  const [boardConfig, setBoardConfig] = useState(null);
  const [algorithm, setAlgorithm] = useState("astar");
  const [heuristic, setHeuristic] = useState("manhattan");
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stats, setStats] = useState(null);
  
  const handleFileLoad = (data) => {
    setBoardConfig(data);
    setSolution(null);
    setCurrentStep(0);
    setStats(null);
  };
  
  const solvePuzzle = async () => {
    if (!boardConfig) return;
    
    setSolving(true);
    
    // Simulate backend call
    setTimeout(() => {
      // Mock solution
      const mockSolution = {
        moves: [
          { piece: 'A', direction: 'right' },
          { piece: 'P', direction: 'up' },
          { piece: 'B', direction: 'left' },
        ],
        stats: {
          moves: 3,
          nodesVisited: 42,
          executionTime: 120
        }
      };
      
      setSolution(mockSolution);
      setStats(mockSolution.stats);
      setCurrentStep(0);
      setSolving(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background pt-20 pb-10 px-4">
      <NavBar />
      
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center space-y-4">
          <Heading>Rush Hour Puzzle Solver</Heading>
          <Paragraph className="text-secondary">
            Upload a puzzle file and select an algorithm to find the optimal solution
          </Paragraph>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FileInput onFileLoad={handleFileLoad} />
            
            <Controls 
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              heuristic={heuristic}
              setHeuristic={setHeuristic}
              onSolve={solvePuzzle}
              solving={solving}
              solutionControls={solution ? {
                onNext: () => setCurrentStep(Math.min(currentStep + 1, solution.moves.length - 1)),
                onPrev: () => setCurrentStep(Math.max(currentStep - 1, 0)),
                currentStep,
                totalSteps: solution.moves.length
              } : null}
            />
            
            {stats && <Stats stats={stats} />}
          </div>
          
          <div>
            {boardConfig && (
              <Board 
                size={boardConfig.size} 
                configuration={boardConfig.board}
                moves={solution?.moves || []}
                currentStep={currentStep}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}