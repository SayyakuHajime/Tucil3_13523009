"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { PrimaryButton } from "@/components/Button";
import { Heading, Paragraph } from "@/components/Typography";

export default function Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-8 text-foreground">
      <NavBar />

      <div className="flex flex-col items-center justify-center mt-32 mb-8">
        <Image
          src="/images/rushhour_logo.png"
          alt="Rush Hour Solver Logo"
          width={300}
          height={300}
          priority
        />

        <Heading className="mt-8 mb-4">Rush Hour Puzzle Solver</Heading>

        <Paragraph className="max-w-lg mb-8 text-secondary">
          Solve Rush Hour puzzles automatically using pathfinding algorithms
          like Greedy Best First Search, Uniform Cost Search (UCS), and A*
          Search. Get optimal solutions with step-by-step visualization.
        </Paragraph>

        <div className="flex gap-4">
          <PrimaryButton
            onClick={() => router.push("/game")}
            label="Start Solving"
          />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <FeatureCard
          icon="🚗"
          title="Multiple Algorithms"
          description="Compare the effectiveness of different pathfinding algorithms in solving puzzles."
        />
        <FeatureCard
          icon="🧠"
          title="Custom Heuristics"
          description="Experiment with different heuristic functions to guide the search process."
        />
        <FeatureCard
          icon="📊"
          title="Performance Analysis"
          description="See detailed statistics about nodes explored, execution time, and solution steps."
        />
      </div>
    </main>
  );
}

// Simple feature card component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-secondary rounded-xl p-6 shadow-md border border-primary">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-primary mb-2 font-baloo">{title}</h3>
      <p className="text-sm text-secondary-foreground font-poppins">
        {description}
      </p>
    </div>
  );
}
