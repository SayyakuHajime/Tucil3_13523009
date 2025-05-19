// components/RushHour/MatrixInput.js
import React, { useState } from "react";
import { SubheadingRed } from "../Typography";
import { PrimaryButton } from "../Button";
import { parseRushHourFile } from "@/utils";

export default function MatrixInput({ onCreatePuzzle }) {
  const [inputText, setInputText] = useState(
    "6 6\n12\nAAB..F\n..BCDF\nGPPCDFK\nGH.III\nGHJ...\nLLJMM."
  );
  
  const handleSubmit = () => {
    try {
      // Use the same parsing function as for file input
      const puzzleData = parseRushHourFile(inputText);
      onCreatePuzzle(puzzleData);
    } catch (error) {
      alert("Invalid puzzle format: " + error.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <SubheadingRed>Manual Input</SubheadingRed>
      <p className="text-center text-sm text-primary mb-2">
        Enter your puzzle configuration following this format:
        <br/>
        <code className="bg-secondary px-2 py-1 rounded">
          rows cols<br/>
          vehicleCount<br/>
          board configuration
        </code>
      </p>
      
      <textarea 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full bg-secondary text-primary border-2 border-primary rounded-lg p-4 font-mono h-48"
        placeholder="Enter puzzle configuration here..."
      />
      
      <PrimaryButton onClick={handleSubmit} label="Create Puzzle" />
    </div>
  );
}