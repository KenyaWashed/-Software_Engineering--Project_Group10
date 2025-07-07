import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const [todayRevenue, setTodayRevenue] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const viewDate = `${yyyy}-${mm}-${dd}`;
    fetch(`http://localhost:4000/report/get-revenue?period=day&viewDate=${viewDate}`)
      .then(res => res.json())
      .then(data => {
        setTodayRevenue(data?.data?.revenue ?? 0);
      })
      .catch(() => setTodayRevenue(null));
  }, []);

  return (
    <div className={cn("", className)}>
      <h2 className="text-black font-montserrat font-semibold text-xl leading-normal mb-6">
        DOANH THU
      </h2>
      <div className="flex gap-14">
        <RevenueCard title="Đã thu" amount={todayRevenue !== null ? `VND ${todayRevenue.toLocaleString()}` : "Đang tải..."} />
      </div>
    </div>
  );
}
