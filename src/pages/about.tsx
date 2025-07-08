import React from "react";
import { Header } from "../components/ui/Header";
import ChromaGrid from "../components/ui/ChromaGrid.tsx"; 

export default function About() {
  const aboutPeople = [
    {
      image: "https://i.pravatar.cc/300?img=14",
      title: "Aniket Bhattacharya",
      subtitle: "Cybersecurity Enthusiast",
      handle: "@aniket",
      borderColor: "#0EA5E9",
      gradient: "linear-gradient(145deg,#0EA5E9,#000)",
      url: "https://github.com/aniket",
    },
    {
      image: "https://i.pravatar.cc/300?img=18",
      title: "Vaishnavi Dwivedi",
      subtitle: "Data Scientist",
      handle: "@vaishnavi",
      borderColor: "#F43F5E",
      gradient: "linear-gradient(195deg,#F43F5E,#000)",
      url: "https://linkedin.com/in/vaishnavi",
    },
  ];

  return (
    <div className="relative bg-transparent flex flex-col items-center justify-start min-h-screen py-16 overflow-y-auto space-y-12">
      <Header />
      <p className="text-2xl font-semibold text-white mb-8">Meet the Creators</p>
      <div className="w-full max-w-6xl px-4">
        <ChromaGrid items={aboutPeople} radius={250} />
      </div>
    </div>
  );
}
