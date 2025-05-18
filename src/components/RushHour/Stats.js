// components/RushHour/Stats.js
import React from "react";
import { Subheading, DescriptionRed } from "../Typography";

export default function Stats({ stats }) {
  if (!stats) return null;
  
  const statItems = [
    { label: "Moves", value: stats.moves, icon: "🚗" },
    { label: "Nodes Visited", value: stats.nodesVisited, icon: "🔍" },
    { label: "Time", value: `${stats.executionTime}ms`, icon: "⏱️" }
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className="bg-secondary rounded-xl p-4 w-[130px] text-center shadow-md border border-secondary"
        >
          <Subheading className="text-secondary mb-2">{item.label}</Subheading>
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="w-full h-[2px] bg-primary mb-2" />
          <DescriptionRed>{item.value}</DescriptionRed>
        </div>
      ))}
    </div>
  );
}