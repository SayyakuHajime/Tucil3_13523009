// components/RushHour/PuzzleInput.js - Compact version
import React, { useState } from "react";
import FileInput from "./FileInput";
import PuzzleSelect from "./PuzzleSelect";
import TextInput from "./TextInput";

export default function PuzzleInput({ onPuzzleLoad }) {
  const [inputMode, setInputMode] = useState("file");

  return (
    <div>
      {/* Input mode selector - Compact tabs */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-[#334155] rounded-md p-1 gap-1 w-full">
          <button
            onClick={() => setInputMode("file")}
            className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all
              ${inputMode === "file" ? "bg-indigo-500 text-white" : "text-gray-300"}`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputMode("visual")}
            className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all
              ${inputMode === "visual" ? "bg-indigo-500 text-white" : "text-gray-300"}`}
          >
            Visual Editor
          </button>
          <button
            onClick={() => setInputMode("matrix")}
            className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-all
              ${inputMode === "matrix" ? "bg-indigo-500 text-white" : "text-gray-300"}`}
          >
            Text Input
          </button>
        </div>
      </div>

      {/* Render the appropriate input component */}
      <div className="mt-3">
        {inputMode === "file" && <FileInput onFileLoad={onPuzzleLoad} />}
        {inputMode === "visual" && (
          <PuzzleSelect onCreatePuzzle={onPuzzleLoad} />
        )}
        {inputMode === "matrix" && <TextInput onCreatePuzzle={onPuzzleLoad} />}
      </div>
    </div>
  );
}
