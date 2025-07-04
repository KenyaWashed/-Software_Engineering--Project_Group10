import { cn } from "@/lib/utils";

interface TrendsChartProps {
  className?: string;
}

const legendItems = [
  { color: "#00DD4B", label: "Phòng loại 1" },
  { color: "#1F90FA", label: "Phòng loại 2" },
  { color: "#FFBD00", label: "Phòng loại 3" },
];

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];

export default function TrendsChart({ className }: TrendsChartProps) {
  return (
    <div
      className={cn(
        "w-full h-96 bg-white rounded border border-dashboard-border relative",
        className,
      )}
    >
      {/* Header with Legend */}
      <div className="flex justify-between items-center p-9 pb-6">
        <div className="text-black font-montserrat font-bold text-sm leading-normal tracking-wide uppercase">
          TRENDS
        </div>
        <div className="flex gap-14">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-dashboard-text font-lato text-xs font-normal leading-6">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px border-t border-dashboard-border"></div>

      {/* Chart Area */}
      <div className="relative pt-8 pb-6 px-7">
        {/* Month labels */}
        <div className="absolute bottom-6 left-7 right-7">
          <div className="flex justify-between">
            {months.map((month, index) => (
              <span
                key={index}
                className="text-dashboard-text-secondary font-lato text-xs font-normal leading-6 uppercase"
              >
                {month}
              </span>
            ))}
          </div>
        </div>

        {/* Chart SVG */}
        <div className="w-full h-52 relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 777 215"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Yellow line (Variable 3) */}
            <path
              d="M1 212.616L154 152.865L273 50.8774L389.298 38.8903L517.826 68.9688L644 58.0887L775.598 1.42871"
              stroke="#FFBD00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Blue line (Variable 2) */}
            <path
              d="M1 213.646L153.802 182.257L272.712 106.71L389.298 91.2572L517.826 164.197L643.707 141.037L775.598 23.6403"
              stroke="#0079FF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
