import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './ana.css';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./navigation-menu";

export const Header = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);


   // Check login state on mount and when localStorage changes
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");

    // Optional: Listen to storage changes from other tabs
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navigationItems = [
    { label: "Main", href: "/" },
    { label: "Analysis", href: "/analysis" },
    { label: "About", href: "/about" },
    { label: "Feedback", href: "/feedback" },
  ];

  return (
    <>
      {/* Combined Nav + Buttons Container */}
      <div className="absolute top-[47px] left-[498px] z-20 flex items-center gap-20">
        {/* Navigation Menu */}
        <NavigationMenu>
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
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                  className="relative inline-block px-2 py-1 font-['Montserrat'] font-medium text-black text-xl transition-colors duration-300 hover:text-gray-600"
                >
                  <span className={item.label === "Analysis" ? "analysis-default" : ""}>
                    {item.label}
                  </span>
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

        {/* Three Buttons */}
        <div className="flex items-center gap-6">
          <a
            className="button github flex items-center gap-2 px-6 py-3 rounded-lg shadow transition hover:bg-gray-100"
            aria-label="Login with GitHub"
            href="https://github.com/Aniket-mon/Crash-Canvas"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          {!isLoggedIn ? (
            <>
              <button
                className="button login flex items-center gap-2 px-6 py-3 rounded-lg shadow transition hover:bg-gray-100"
                aria-label="Login to your account"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="button register flex items-center gap-2 px-6 py-3 rounded-lg shadow transition hover:bg-gray-100"
                aria-label="Register a new account"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          ) : (
            <button
              className="button logout flex items-center gap-2 px-6 py-3 rounded-lg shadow transition hover:bg-gray-100"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" 
                  strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default Header;
