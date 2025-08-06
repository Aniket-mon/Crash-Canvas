import { useState, useEffect, useRef } from "react";
import "./Main.css";
import { Header } from "../components/ui/Header";
import { Toaster } from 'react-hot-toast';
import CountUp from "./load1";
import { FeaturePanel } from "./FeaturePanel"; 

export const Main = (): JSX.Element => {
  const [showLoader, setShowLoader] = useState(true);
  const [hideLoader, setHideLoader] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const featurePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideLoader(true);
      setTimeout(() => setShowLoader(false), 1000);
    }, 7500);

    const handleClickOutside = (event: MouseEvent) => {
      if (featurePanelRef.current && !featurePanelRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFeatureClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const toggleAllFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
    if (activeIndex !== null) setActiveIndex(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const backgroundClass = isDarkMode 
    ? "bg-[url('/assets/DM3.png')]" 
    : "bg-[url('../../assets/D1.png')]";

  return (
    <div className={`w-screen min-h-screen overflow-y-auto bg-cover bg-center ${backgroundClass}`}>
      {/* Theme Toggle Switch */}
      <div className="theme-switch-wrapper">
        <label className="theme-switch" htmlFor="checkbox">
          <input type="checkbox" id="checkbox" onChange={toggleTheme} checked={!isDarkMode} />
          <div className="slider">
            <div className="sun-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707zm-2.12-10.607a1 1 0 011.414 0l.706.707a1 1 0 11-1.414 1.414l-.706-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="moon-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </div>
          </div>
        </label>
      </div>

      {/*Loading Overlay */}
      {showLoader && (
        <div className={`fixed top-0 left-0 w-screen h-screen bg-black z-50 flex items-center justify-center transition-transform duration-1000 ${ hideLoader ? "-translate-x-full" : "translate-x-0"}`}>
          <h1 className="text-white text-5xl font-bold"><CountUp from={0} to={100} separator="" direction="up" duration={5} className="count-up-text" />%</h1>
        </div>
      )}
      <div className="relative bg-transparent flex flex-col items-center justify-start min-h-screen ml-[-95px]">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <div className="bg-transparent flex flex-row justify-center w-full min-h-screen">
          <div className="w-full max-w-[1440px] min-h-screen relative">
            
            {/* Title container */}
            <div
              className={`absolute top-[161px] ${ activeIndex !== null ? 'left-[450px]' : 'left-[550px]' } cursor-pointer transition-all duration-500`}
            >
              {/* Main title container */}
              <div className="relative w-[230px] h-[300px] flex items-center justify-center">
                <div className={`absolute top-14 left-[-35px] [font-family:'Irish_Grover',Helvetica] font-normal ${isDarkMode ? "TT21" : "text-black"} text-[230px] tracking-[0] leading-[0.8] transition-all duration-500 z-10 text-center w-full`}>
                  C
                </div>
                <div className={`absolute top-[85px] left-[135px] [font-family:'Irish_Grover',Helvetica] font-normal ${isDarkMode ? "TT22" : "text-black"} text-[75.5px] tracking-[0] leading-[0.8] transition-all duration-500 z-10 text-center w-full`}>
                  RASH
                </div>
                <div className={`absolute top-[165px] left-[145px] [font-family:'Irish_Grover',Helvetica] font-normal ${isDarkMode ? "TT22" : "text-black"} text-[75.5px] tracking-[0] leading-[0.8] transition-all duration-500 z-10 text-center w-full`}>
                  ANVAS
                </div>
                <div className="absolute top-[245px] left-[-120px] w-[680px] h-[70px] flex items-center justify-center">
                  <div className={`[font-family:'High_Tower_Text-Regular',Helvetica] font-normal ${isDarkMode ? "TT23 bg-clip-text text-transparent" : "text-black"} text-[40px] tracking-[0] leading-[1.1] transition-all duration-500 whitespace-nowrap z-10 text-center w-full`}>
                    Road Accident Analysis System
                  </div>
                </div>
              </div>
            </div>

            <FeaturePanel 
              showAllFeatures={showAllFeatures}
              activeIndex={activeIndex}
              toggleAllFeatures={toggleAllFeatures}
              handleFeatureClick={handleFeatureClick}
              featurePanelRef={featurePanelRef}
            />
            
            <Header />
          </div>
        </div>
      </div>
    </div>
  );
};
