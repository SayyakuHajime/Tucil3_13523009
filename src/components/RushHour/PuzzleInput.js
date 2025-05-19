// components/RushHour/PuzzleInput.js
import React, { useState } from "react";
import FileInput from "./FileInput";
import PuzzleSelect from "./PuzzleSelect";
import TextInput from "./TextInput";
import { Heading } from "../Typography";

export default function PuzzleInput({ onPuzzleLoad }) {
  const [inputMode, setInputMode] = useState("file"); // "file", "visual", or "matrix"
  
  return (
    <div className="bg-background p-6 rounded-xl">
      <Heading className="mb-6">Choose Your Puzzle</Heading>
      
      {/* Input mode selector */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-secondary rounded-lg p-1 gap-1">
          <button
            onClick={() => setInputMode("file")}
            className={`px-4 py-2 rounded-lg font-bold text-sm font-poppins transition-all duration-150
              ${inputMode === "file" ? "bg-primary text-secondary" : "text-primary"}`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputMode("visual")}
            className={`px-4 py-2 rounded-lg font-bold text-sm font-poppins transition-all duration-150
              ${inputMode === "visual" ? "bg-primary text-secondary" : "text-primary"}`}
          >
            Visual Editor
          </button>
          <button
            onClick={() => setInputMode("matrix")}
            className={`px-4 py-2 rounded-lg font-bold text-sm font-poppins transition-all duration-150
              ${inputMode === "matrix" ? "bg-primary text-secondary" : "text-primary"}`}
          >
            Text Input
          </button>
        </div>
      </div>
      
      {/* Render the appropriate input component */}
      <div className="mt-6">
        {inputMode === "file" && <FileInput onFileLoad={onPuzzleLoad} />}
        {inputMode === "visual" && <PuzzleSelect onCreatePuzzle={onPuzzleLoad} />}
        {inputMode === "matrix" && <TextInput onCreatePuzzle={onPuzzleLoad} />}
      </div>
    </div>
  );
}