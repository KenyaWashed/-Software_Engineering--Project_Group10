import { cn } from "@/lib/utils";

interface RoomStatsCardProps {
  title: string;
  value: string | number;
  color?: "cyan" | "yellow" | "default";
  className?: string;
}

export default function RoomStatsCard({
  title,
  value,
  color = "default",
  className,
}: RoomStatsCardProps) {
  const colorClasses = {
    cyan: "text-dashboard-cyan",
    yellow: "text-dashboard-yellow",
    default: "text-white",
  };

  return (
    <div className={cn("w-53 h-31 bg-black rounded-2xl p-5", className)}>
      <div className="text-white font-montserrat text-lg font-normal leading-normal mb-2">
        {title}
      </div>
      <div
        className={cn(
          "font-montserrat text-8xl font-bold leading-normal",
          colorClasses[color],
        )}
      >
        {value}
      </div>
    </div>
  );
}
