// components/RushHour/FileInput.js - Updated for better exit detection
import React from "react";
import { SubheadingRed } from "../Typography";
import { parseRushHourFile } from "@/utils";

export default function FileInput({ onFileLoad }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target.result;

          // Use the improved parsing function from utils.js
          const puzzleData = parseRushHourFile(content);

          // At this point, the exit position and direction should be determined
          if (!puzzleData.exit || !puzzleData.exitDirection) {
            console.error("Exit position or direction not found");
            alert(
              "Could not detect the exit position. Make sure the exit is marked with 'K' on the edge of the board."
            );
            return;
          }

          console.log(
            "Loaded puzzle with exit at:",
            puzzleData.exit,
            "direction:",
            puzzleData.exitDirection
          );
          onFileLoad(puzzleData);
        } catch (error) {
          console.error("Error parsing file content:", error);
          alert(error.message || "Failed to parse the puzzle file.");
        }
      };

      reader.onerror = () => {
        alert("Failed to read the file.");
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error reading file:", error);
      alert(error.message || "Failed to load the puzzle file.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <SubheadingRed>Upload Puzzle File</SubheadingRed>
      <div className="text-center mb-4 text-sm text-secondary">
        <p>Make sure your puzzle file follows these rules:</p>
        <ul className="list-disc list-inside text-xs mt-2">
          <li>The exit (K) must be on the edge of the board</li>
          <li>The exit must align with the primary piece (P) orientation</li>
          <li>
            For horizontal primary pieces, exit must be on left or right edge
          </li>
          <li>
            For vertical primary pieces, exit must be on top or bottom edge
          </li>
        </ul>
      </div>
      <label className="bg-secondary text-primary border-2 border-primary px-7 py-2 rounded-lg font-bold tracking-widest uppercase font-baloo cursor-pointer hover:bg-secondary-hover active:scale-95 transition-all duration-150">
        Choose File
        <input
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
