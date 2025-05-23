// Modified Controls.js component with Export Solution button
import React from "react";
import { PrimaryButton, SecondaryButton } from "../Button";

export default function Controls({
  algorithm,
  setAlgorithm,
  heuristic,
  setHeuristic,
  onSolve,
  solving,
  solutionControls,
  onExportSolution, 
}) {
  const algorithms = [
    { id: "greedy", name: "Greedy" },
    { id: "ucs", name: "UCS" },
    { id: "astar", name: "A*" },
  ];

  const heuristics = [
    { id: "manhattan", name: "Manhattan" },
    { id: "blocking", name: "Blocking" },
    { id: "combined", name: "Combined" },
  ];

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="w-full flex flex-col items-center gap-2">
        <h2 className="font-bold text-indigo-300 font-baloo text-center">
          Algorithm
        </h2>
        <div className="flex bg-[#334155] rounded-md p-1 gap-2 w-fit">
          {algorithms.map((algo) => (
            <button
              key={algo.id}
              onClick={() => setAlgorithm(algo.id)}
              className={`
                px-4 py-2 font-bold text-sm rounded-lg font-poppins transition-all duration-150 cursor-pointer
                ${
                  algorithm === algo.id
                    ? "bg-primary text-white border border-primary"
                    : "text-primary"
                }
              `}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Heuristic Selection - only show for relevant algorithms */}
      {(algorithm === "greedy" || algorithm === "astar") && (
        <div className="w-full flex flex-col items-center gap-2">
          <h2 className="font-bold text-indigo-300 font-baloo text-center">
            Heuristic
          </h2>
          <div className="flex bg-[#334155] rounded-md p-1 gap-2 w-fit">
            {heuristics.map((h) => (
              <button
                key={h.id}
                onClick={() => setHeuristic(h.id)}
                className={`
                  px-4 py-2 font-bold text-sm rounded-lg font-poppins transition-all duration-150 cursor-pointer
                  ${
                    heuristic === h.id
                      ? "bg-primary text-white border border-primary"
                      : "text-primary"
                  }
                `}
              >
                {h.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Solve Button */}
      <div className="flex justify-center pt-2">
        <PrimaryButton
          onClick={onSolve}
          label={solving ? "Solving..." : "Solve Puzzle"}
          disabled={solving}
        />
      </div>

      {/* Solution Navigation - only show when solution exists */}
      {solutionControls && (
        <div className="flex flex-col gap-4 mt-4">
          {/* Navigation buttons */}
          <div className="flex justify-center space-x-4">
            <SecondaryButton
              onClick={solutionControls.onPrev}
              label="Previous"
              disabled={
                solutionControls.currentStep === 0 || solutionControls.disabled
              }
            />
            <span className="bg-secondary text-primary px-4 py-2 rounded-lg font-bold">
              {solutionControls.currentStep + 1} / {solutionControls.totalSteps}
            </span>
            <SecondaryButton
              onClick={solutionControls.onNext}
              label="Next"
              disabled={
                solutionControls.currentStep ===
                  solutionControls.totalSteps - 1 || solutionControls.disabled
              }
            />
          </div>

          {/* Export Solution button - new addition */}
          <div className="flex justify-center">
            <SecondaryButton
              onClick={onExportSolution}
              label="Save Solution as .txt"
              disabled={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
