import { cn } from "@/lib/utils";

interface CircularProgressProps {
  percentage: number;
  title: string;
  color: "cyan" | "yellow" | "pink";
  className?: string;
}

const colorMap = {
  cyan: "#00FFF5",
  yellow: "#FFE605",
  pink: "#FF05C8",
};

export default function CircularProgress({
  percentage,
  title,
  color,
  className,
}: CircularProgressProps) {
  const strokeColor = colorMap[color];
  const strokeDasharray = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset =
    strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div
      className={cn(
        "w-full max-w-sm h-80 bg-dashboard-gray rounded-2xl p-6 flex flex-col items-center",
        className,
      )}
    >
      <h3 className="text-black font-montserrat font-semibold text-lg leading-normal mb-8">
        {title}
      </h3>

      <div className="relative w-52 h-52 flex items-center justify-center">
        {/* Background circle */}
        <svg
          className="w-52 h-52 absolute"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#292929"
            strokeWidth="10"
          />
        </svg>

        {/* Progress circle */}
        <svg
          className="w-52 h-52 absolute -rotate-90"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Percentage text */}
        <div className="text-black font-montserrat font-semibold text-3xl leading-normal">
          {percentage}%
        </div>
      </div>
    </div>
  );
}