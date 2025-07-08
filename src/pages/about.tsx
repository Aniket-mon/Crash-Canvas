import React from "react";
import { Header } from "../components/ui/Header";
import ChromaGrid from "../components/ui/ChromaGrid.tsx"; 
import "../components/ui/button.css"; 

export default function About() {
  const aboutPeople = [
    {
      image: "../../assets/aniket.jpg",
      title: "Aniket Bhattacharya",
      tagline: "You don’t get what you deserve - you get what you DEMAND.",
      handle: "@aniket",
      borderColor: "#0EA5E9",
      gradient: "linear-gradient(145deg,#0EA5E9,#000)",
      url: "https://aniket-mon.github.io/Personal-Portfolio-Website/",
      github: "https://github.com/aniket-mon",
      linkedin: "https://www.linkedin.com/in/aniket-bhattacharya-b6938a200/",
    },
    {
      image: "../../assets/vaishnavi.jpg",
      title: "Vaishnavi Dwivedi",
      tagline: "Work with passion. Evolve with purpose. Lead with intention.",
      handle: "@vaishnavi",
      borderColor: "#F43F5E",
      gradient: "linear-gradient(195deg,#F43F5E,#000)",
      url: "https://linkedin.com/in/vaishnavi",
      github: "https://github.com/Vaishnavi231104",
      linkedin: "https://www.linkedin.com/in/vaishnavi-dwivedi-34068a229/",
    },
  ];

  return (
    <div className="relative bg-transparent flex flex-col items-center justify-start min-h-screen py-16 overflow-y-auto space-y-12">
      <Header />
      <p className="text-2xl font-semibold text-white mb-8">Meet the Creators</p>
      <div className="w-full max-w-6xl px-4">
        <ChromaGrid items={aboutPeople} radius={350} />
        <div className="mt-6 flex flex-wrap justify-center gap-x-40 gap-y-8">
            {aboutPeople.map((person, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                {person.github && (
                    <button
                    onClick={() => window.open(person.github, "_blank", "noopener,noreferrer")}
                    className="glass-btn github-btn"
                    type="button"
                    >
                    GitHub
                    </button>
                )}
                {person.linkedin && (
                    <button
                    onClick={() => window.open(person.linkedin, "_blank", "noopener,noreferrer")}
                    className="glass-btn linkedin-btn"
                    type="button"
                    >
                    LinkedIn
                    </button>
                )}
                </div>
            ))}
            </div>
        </div>
      </div>
  );
}
