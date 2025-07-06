import { cn } from "@/lib/utils";

interface RevenueCardProps {
  title: string;
  amount: string;
  className?: string;
}

function RevenueCard({ title, amount, className }: RevenueCardProps) {
  return (
    <div
      className={cn(
        "w-64 h-20 bg-white rounded-2xl p-3 px-5 box-border",
        className,
      )}
    >
      <div className="text-black font-montserrat text-sm font-normal leading-normal mb-2">
        {title}
      </div>
      <div className="text-black font-montserrat text-xl font-normal leading-normal">
        {amount}
      </div>
    </div>
  );
}

interface RevenueCardsProps {
  className?: string;
}

export default function RevenueCards({ className }: RevenueCardsProps) {
  return (
    <div className={cn("", className)}>
      <h2 className="text-black font-montserrat font-semibold text-xl leading-normal mb-6">
        DOANH THU
      </h2>
      <div className="flex gap-14">
        <RevenueCard title="Dự kiến" amount="VND 52,000,000" />
        <RevenueCard title="Đã thu" amount="VND 26,000,000" />
      </div>
    </div>
  );
}
