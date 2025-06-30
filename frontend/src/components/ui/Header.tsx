import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./navigation-menu";

export const Header = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

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
        </div>
      </div>
    </>
  );
};
export default Header;
