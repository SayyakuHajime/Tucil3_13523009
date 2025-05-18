"use client";
import Image from "next/image";
import { NavBar } from "@/components/NavBar";
import { Heading, Paragraph } from "@/components/Typography";

export default function CreatorsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-8 text-foreground">
      <NavBar />
      
      <div className="max-w-4xl mx-auto mt-24 mb-16">
        <Heading className="mb-8">
          The Team Behind Rush Hour Solver
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CreatorCard 
            name="Your Name"
            nim="13523009"
            image="/images/profile.jpg" // Add your profile image
            role="Developer"
            description="Responsible for implementing the pathfinding algorithms and developing the web interface."
          />
          
          {/* Add more team members if needed */}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto my-8 p-6 bg-secondary rounded-xl shadow-md">
        <Heading className="mb-4 text-xl">About the Project</Heading>
        <Paragraph className="text-left">
          This project was developed as part of the IF2211 Algorithm Strategies course at Institut Teknologi Bandung.
          The goal was to implement various pathfinding algorithms to solve the Rush Hour puzzle game and compare
          their effectiveness and efficiency. The project features a web-based interface built with Next.js and React,
          allowing users to visualize how different algorithms find solutions.
        </Paragraph>
      </div>
    </main>
  );
}

function CreatorCard({ name, nim, image, role, description }) {
  return (
    <div className="bg-secondary rounded-xl overflow-hidden shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image 
              src={image} 
              alt={name} 
              width={80} 
              height={80}
              className="object-cover w-full h-full" 
            />
          </div>
          <div>
            <h3 className="font-bold text-primary font-baloo">{name}</h3>
            <p className="text-sm text-secondary-foreground font-poppins">{nim}</p>
            <p className="text-xs text-primary-foreground font-poppins">{role}</p>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground font-poppins">{description}</p>
      </div>
    </div>
  );
}