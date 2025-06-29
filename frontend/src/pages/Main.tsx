import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/ui/navigation-menu";


export const Main = (): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();


  const navigationItems = [
    { label: "Main", href: "/" },
    { label: "Analysis", href: "/analysis" },
    { label: "About", href: "/about" },
    { label: "Feedback", href: "/feedback" },
  ];

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="bg-transparent flex flex-row justify-center w-full min-h-screen">
      <div className="bg-transparent flex flex-row justify-center w-full min-h-screen">
        <div className="w-full max-w-[1440px] min-h-screen relative">
          <div
            className={`fixed inset-0 transition-all duration-200 z-10 ${
              isHovered
                ? "bg-[url(../../../assets/DM3.png)] bg-fixed bg-cover bg-center"
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

          <NavigationMenu className="absolute top-[47px] left-[450px] z-20">
            <NavigationMenuList className="flex items-center gap-10">
              {navigationItems.map((item, index) => (
                <NavigationMenuItem 
                  key={index} 
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  >
                  <NavigationMenuLink                 
                    href={item.href}
                    onClick={e => {
                      e.preventDefault();
                      navigate(item.href);
                    }}
                    className="
                      relative inline-block
                      px-2 py-1
                      font-['Montserrat'] font-medium text-black text-xl
                      transition-colors duration-300
                      hover:text-gray-600
                    "
                  >
                    {item.label}
                    <span
                      className={`
                        absolute bottom-0 left-0
                        h-[2px] bg-current
                        transition-all duration-300 ease-in-out
                        ${hoveredIndex === index ? "w-full" : "w-0"}
                      `}
                    />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>


          <div
            className="bg-transparent button-container flex flex-row gap-6 justify-start items-center absolute top-[15px] left-[1000px] z-20"
          >
            {/* GitHub Button */}
            <a
              className="button github flex items-center gap-2 px-6 py-3 rounded-lg shadow transition hover:bg-gray-100"
              aria-label="Login with GitHub"
              href="https://github.com/Aniket-mon/Crash-Canvas"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* ...SVG... */}
              GitHub
            </a>

            {/* Login Button */}
            <button
              className="button login flex items-center gap-2 px-6 py-3 rounded-lg shadow transition hover:bg-gray-100"
              aria-label="Login to your account"
              onClick={() => navigate("/login")}
            >
              {/* ...SVG... */}
              Login
            </button>

            {/* Register Button */}
            <button
              className="button register flex items-center gap-2 px-6 py-3 rounded-lg shadow transition hover:bg-gray-100"
              aria-label="Register a new account"
              onClick={() => navigate("/register")}
            >
              {/* ...SVG... */}
              Register
            </button>
          </div>
          </div>
        </div>
      </div>
  );
};

