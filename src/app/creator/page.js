"use client";
import Image from "next/image";
import { NavBar } from "@/components/NavBar";
import { Heading, Paragraph, SubheadingRed } from "@/components/Typography";

export default function CreatorsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-8 text-foreground">
      <NavBar />

      <div className="max-w-4xl mx-auto mt-24 mb-16">
        <Heading className="mb-8">The Person Behind This Project</Heading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CreatorCard
            name="Hajime"
            nim="13523009"
            image="/images/car.png"
            role="Creator"
            description="ngerjain tubes terus sampe jam 4 pagi ini ciri khasnya ni 
            tubes yeyeye tubes tucil tubes tucil tubes tucil tubes tucil, 
            woi magrib magrib oke shalat,
            tubes tucil tubes tucil isya ok,
            makan woo makan cepet dirumah aja
            breeet secepat kilat
            ngerjain tubes ngerjain tucil
            wlu wlu wlu wlu buk buk wlu wlu wlu,
            subuh baru tidur... ngejerjain tubes dari magrib, sampe subuh... stroke.
            "
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto my-8 p-6 bg-secondary rounded-xl shadow-md">
        <SubheadingRed className="mb-4 text-xl">
          About the Project
        </SubheadingRed>
        <Paragraph className="text-center italic">
          This project was developed as part of the IF2211 Strategi Algoritma
          course at Institut Teknologi Bandung. 
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
            <p className="text-sm text-secondary-foreground font-poppins">
              {nim}
            </p>
            <p className="text-xs text-primary-foreground font-poppins">
              {role}
            </p>
          </div>
        </div>
        <p className="text-sm text-secondary-foreground font-poppins">
          {description}
        </p>
      </div>
    </div>
  );
}
