import { cn } from "@/lib/utils";

interface RevenuePieChartProps {
  percentage: number;
  className?: string;
}

export default function RevenuePieChart({
  percentage = 85,
  className,
}: RevenuePieChartProps) {
  const radius = 86.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  return (
    <div
      className={cn(
        "w-full h-96 bg-white rounded border border-dashboard-border relative",
        className,
      )}
    >
      {/* Header */}
      <div className="p-9 pb-6">
        <h3 className="text-black font-montserrat font-bold text-sm leading-normal tracking-wide uppercase">
          TỈ LỆ DOANH THU
        </h3>
      </div>

      {/* Divider */}
      <div className="w-full h-px border-t border-dashboard-border"></div>

      {/* Chart */}
      <div className="flex items-center justify-center pt-16 pb-9">
        <div className="relative w-44 h-44">
          <svg
            className="w-44 h-44 -rotate-90"
            viewBox="0 0 173 179"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background circle */}
            <ellipse
              cx="86.5"
              cy="89.5"
              rx="84.5"
              ry="87.1"
              fill="white"
              stroke="#EAEAEA"
              strokeWidth="4"
            />

            {/* Progress arc */}
            <ellipse
              cx="86.5"
              cy="89.5"
              rx="84.5"
              ry="87.1"
              fill="none"
              stroke="#0079FF"
              strokeWidth="6"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-dashboard-text font-bold text-3xl font-lato">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
