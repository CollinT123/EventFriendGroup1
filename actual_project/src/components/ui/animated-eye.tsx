import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedEyeProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function AnimatedEye({ isOpen, onClick, className }: AnimatedEyeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "flex items-center justify-center h-12 w-16 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
          className,
        )}
        aria-label={isOpen ? "Hide password" : "Show password"}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="transition-all duration-300 ease-in-out"
        >
          {/* Eye outline */}
          <path
            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "transition-all duration-300 ease-in-out",
              isOpen ? "opacity-100" : "opacity-60",
            )}
          />

          {/* Pupil - scales and moves with animation */}
          <circle
            cx="12"
            cy="12"
            r="3"
            fill="currentColor"
            className={cn(
              "transition-all duration-300 ease-in-out origin-center",
              isOpen
                ? "opacity-100 transform scale-100"
                : "opacity-30 transform scale-75",
            )}
          />

          {/* Upper eyelid - animated */}
          <path
            d="M3 12c0 0 4-8 9-8s9 8 9 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className={cn(
              "transition-all duration-300 ease-in-out",
              isOpen
                ? "transform translate-y-0 opacity-0"
                : "transform translate-y-1 opacity-100",
            )}
          />

          {/* Lower eyelid - animated */}
          <path
            d="M3 12c0 0 4 8 9 8s9-8 9-8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className={cn(
              "transition-all duration-300 ease-in-out",
              isOpen
                ? "transform translate-y-0 opacity-0"
                : "transform -translate-y-1 opacity-100",
            )}
          />

          {/* Eyelashes - appear when eye is open */}
          <g
            className={cn(
              "transition-all duration-300 ease-in-out",
              isOpen ? "opacity-100" : "opacity-0",
            )}
          >
            <path
              d="M8 8l-1-2M12 7l0-3M16 8l1-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-10 animate-in fade-in-0 zoom-in-95 duration-200">
          {isOpen ? "Hide password" : "Show password"}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
