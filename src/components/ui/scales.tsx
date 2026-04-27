import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export interface ScalesProps {
  size?: number;
  className?: string;
  color?: string;
  side?: "left" | "right" | "both";
  gap?: number;
}

export const Scales = ({
  size = 6,
  className,
  color,
  side = "both",
  gap = 16,
}: ScalesProps) => {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const showLeft = side === "left" || side === "both";
  const showRight = side === "right" || side === "both";
  
  const bgColor = color || (darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)');

  return (
    <>
      {showLeft && (
        <div
          className={cn("fixed top-0 bottom-0 w-2 z-[60] pointer-events-none", className)}
          style={{
            left: `calc(50% - 340px - ${gap}px)`,
            background: `repeating-linear-gradient(315deg, ${bgColor} 0px, ${bgColor} 1px, transparent 1px, transparent ${size}px)`,
          }}
        />
      )}
      {showRight && (
        <div
          className={cn("fixed top-0 bottom-0 w-2 z-[60] pointer-events-none", className)}
          style={{
            right: `calc(50% - 340px - ${gap}px)`,
            background: `repeating-linear-gradient(315deg, ${bgColor} 0px, ${bgColor} 1px, transparent 1px, transparent ${size}px)`,
          }}
        />
      )}
    </>
  );
};

export const SCALES_BORDER = "calc(50% - 340px - 16px)";

export default Scales;