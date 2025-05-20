// components/RushHour/TextInput.js - Updated for exit requirements
import React, { useState } from "react";
import { SubheadingRed } from "../Typography";
import { PrimaryButton } from "../Button";
import { parseRushHourFile } from "@/utils";

export default function TextInput({ onCreatePuzzle }) {
  const [inputText, setInputText] = useState(
    "6 6\n12\nAAB..F\n..BCDF\nGPPCDFK\nGH.III\nGHJ...\nLLJMM."
  );

  const handleSubmit = () => {
    try {
      // Use the improved parsing function from utils.js
      const puzzleData = parseRushHourFile(inputText);

      // If parsing is successful, validate exit position and orientation
      if (!puzzleData.exit || !puzzleData.exitDirection) {
        alert(
          "Could not detect the exit position. Make sure the exit is marked with 'K' on the edge of the board."
        );
        return;
      }

      // Validate that the primary piece orientation matches the exit position
      if (
        puzzleData.primaryOrientation === "horizontal" &&
        (puzzleData.exitDirection === "top" ||
          puzzleData.exitDirection === "bottom")
      ) {
        alert(
          "For a horizontal primary piece, the exit must be on the left or right edge."
        );
        return;
      }

      if (
        puzzleData.primaryOrientation === "vertical" &&
        (puzzleData.exitDirection === "left" ||
          puzzleData.exitDirection === "right")
      ) {
        alert(
          "For a vertical primary piece, the exit must be on the top or bottom edge."
        );
        return;
      }

      console.log(
        "Created puzzle with exit at:",
        puzzleData.exit,
        "direction:",
        puzzleData.exitDirection
      );
      onCreatePuzzle(puzzleData);
    } catch (error) {
      console.error("Error parsing input:", error);
      alert("Invalid puzzle format: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-indigo-300 text-sm font-medium">Manual Input</h3>

      <p className="text-center text-xs text-gray-300 mb-1">
        Format:{" "}
        <code className="bg-[#334155] px-1 rounded text-[10px]">rows cols</code>
        <br />
        <code className="bg-[#334155] px-1 rounded text-[10px]">
          vehicleCount
        </code>
        <br />
        <code className="bg-[#334155] px-1 rounded text-[10px]">
          board config
        </code>
      </p>

      <div className="w-full text-[10px] text-gray-300 mb-1">
        <ul className="list-disc list-inside">
          <li>Primary piece = 'P'</li>
          <li>Exit = 'K' (on edge)</li>
          <li>Empty cells = '.'</li>
        </ul>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full bg-[#334155] text-gray-200 border border-indigo-400 rounded-md p-2 font-mono text-xs h-32"
        placeholder="Enter puzzle configuration here..."
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-indigo-600 w-full"
      >
        Create Puzzle
      </button>
    </div>
  );
}
