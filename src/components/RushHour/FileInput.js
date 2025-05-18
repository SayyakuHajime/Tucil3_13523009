// components/RushHour/FileInput.js
import React from "react";
import { SubheadingRed } from "../Typography";

export default function FileInput({ onFileLoad }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        // Parse the file content
        const lines = content.split('\n');
        const [rows, cols] = lines[0].split(' ').map(Number);
        const vehicleCount = parseInt(lines[1]);
        const board = lines.slice(2, 2 + rows);
        
        onFileLoad({
          size: [rows, cols],
          vehicleCount,
          board
        });
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Invalid file format. Please check the file and try again.");
      }
    };
    reader.readAsText(file);
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