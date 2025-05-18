// components/RushHour/FileInput.js
import React from "react";
import { SubheadingRed } from "../Typography";
import { readRushHourFile } from "@/utils";

export default function FileInput({ onFileLoad }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const puzzleData = await readRushHourFile(file);
      onFileLoad(puzzleData);
    } catch (error) {
      console.error("Error reading file:", error);
      alert(error.message || "Failed to load the puzzle file.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <SubheadingRed>Upload Puzzle File</SubheadingRed>
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