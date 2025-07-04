import { useState } from "react";
import "./Main.css";
import { Header } from "../components/ui/Header";



export const Main = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="bg-transparent flex flex-row justify-center w-full min-h-screen">
      <div className="bg-transparent flex flex-row justify-center w-full min-h-screen">
        <div className="w-full max-w-[1440px] min-h-screen relative">
          <div
            className={`fixed inset-0 transition-all duration-200 z-10 ${
              isHovered
                ? "bg-[url('/assets/DM3.png')] bg-fixed bg-cover bg-center"
                : "opacity-0 pointer-events-none"
            }`}
          ></div>
          {/* Title container */}
          <div
            className="absolute top-[161px] left-[485px] cursor-pointer transition-all duration-500"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Main title container */}
            <div className="relative w-[230px] h-[300px] flex items-center justify-center">
              <div
                className={`absolute top-14 left-[-35px] [font-family:'Irish_Grover',Helvetica] font-normal ${
                  isHovered ? "TT21 opacity-100" : "text-black opacity-100"
                } text-[230px] tracking-[0] leading-[0.8] transition-all duration-500 z-10 text-center w-full`}
              >
                C
              </div>

              <div
                className={`absolute top-[85px] left-[135px] [font-family:'Irish_Grover',Helvetica] font-normal ${
                  isHovered ? "TT22 opacity-100" : "text-black opacity-100"
                } text-[75.5px] tracking-[0] leading-[0.8] transition-all duration-500 z-10 text-center w-full`}
              >
                RASH
              </div>

              <div
                className={`absolute top-[165px] left-[145px] [font-family:'Irish_Grover',Helvetica] font-normal ${
                  isHovered ? "TT22 opacity-100" : "text-black opacity-100"
                } text-[75.5px] tracking-[0] leading-[0.8] transition-all duration-500 z-10 text-center w-full`}
              >
                ANVAS
              </div>

              {/* Subtitle container */}
              <div className="absolute top-[245px] left-[-90px] w-[680px] h-[70px] flex items-center justify-center">
                <div
                  className={`[font-family:'High_Tower_Text-Regular',Helvetica] font-normal ${
                    isHovered
                      ? "TT23 bg-clip-text text-transparent"
                      : "text-black opacity-100"
                  } text-[40px] tracking-[0] leading-[1.1] transition-all duration-500 whitespace-nowrap z-10 text-center w-full`}
                >
                  Road Accident Analysis System
                </div>
              </div>
            </div>
          </div>
          <Header />
          </div>
        </div>
      </div>
  );
};

