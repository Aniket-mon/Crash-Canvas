import React from "react";
import { Header } from "../components/ui/Header";
import ChromaGrid from "../components/ui/ChromaGrid.tsx"; 
import "../components/ui/button.css"; 
import "./about.css";

export default function About() {
  const aboutPeople1 = [
    {
      image: "../../assets/aniket.jpg",
      title: "Aniket Bhattacharya",
      tagline: "",
      handle: "@aniket",
      borderColor: "#0EA5E9",
      gradient: "linear-gradient(145deg,#53fa32,#000)",
      url: "https://www.linkedin.com/in/aniket-bhattacharya-b6938a200/",
      github: "https://github.com/aniket-mon",
      linkedin: "https://www.linkedin.com/in/aniket-bhattacharya-b6938a200/",
    }
  ];

  const aboutPeople2= [
    {
      image: "../../assets/vaishnavi.jpg",
      title: "Vaishnavi Dwivedi",
      tagline: "",
      handle: "@vaishnavi",
      borderColor: "#F43F5E",
      gradient: "linear-gradient(195deg,#ff08b1,#000)",
      url: "https://linkedin.com/in/vaishnavi",
      github: "https://github.com/Vaishnavi231104",
      linkedin: "https://www.linkedin.com/in/vaishnavi-dwivedi-34068a229/",
    },
  ];

  return (
    <div className="w-screen h-screen overflow-y-auto bg-[#EDC58C]">
      <div className="relative bg-transparent flex flex-col items-center justify-start min-h-screen py-16  space-y-12">
        <Header />
        <div className="relative min-h-screen flex flex-col py-12" style={{ marginLeft: "-15px", marginTop: "200px" }}>
                <h1
                  className="kameron-font"
                  style={{
                    fontSize: "8.5rem",
                    fontWeight: 100,
                    marginTop: "2rem",
                    marginLeft: "1rem",
                    color: "#191919",
                    textAlign: "left",
                    lineHeight: "1.1",
                    letterSpacing: "-1px",
                    maxWidth: "2500px"
                  }}
                >
                  Meet our team
                </h1>
          </div>
                  
          <div className="w-full max-w-6xl px-4" style={{ marginTop: "-100px", marginLeft: "600px" }}>
          <ChromaGrid items={aboutPeople1} radius={350} />
          <div style={{ marginTop: "-250px", marginLeft: "-280px" }}>
            <h1 className= "jua-font" style={{ fontSize: "2.2rem"}}>
              "You don’t get what you deserve - you <br/>get what you DEMAND."</h1>
          
          <div className="flex items-start justify-center gap-12 mt-[245px] ml-[-1150px] px-4" >
            <ChromaGrid items={aboutPeople2} radius={350} />
          </div>
          <div className="max-w-[650px] leading-snug mt-[-270px] ml-[350px]">
            <h1 className="jua-font text-[2.2rem]  "  >
              "Work with passion. Evolve with purpose.<br/> Lead with intention."
            </h1>
          </div>
          </div>

          </div>



        </div>
      </div>
  );
}
