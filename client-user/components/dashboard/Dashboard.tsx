"use client";

import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import CircularProgress from "./CircularProgress";
import RevenueCards from "./RevenueCards";
import RevenuePieChart from "./RevenuePieChart";
import TrendsChart from "./TrendsChart";

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className }: DashboardProps) {
  return (
    <div className={cn("min-h-screen bg-dashboard-bg font-lato", className)}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-60 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Room Booking Rate Section */}
          <div className="bg-white rounded-2xl p-6 lg:p-8">
            <h1 className="text-black font-montserrat font-semibold text-xl lg:text-2xl leading-normal mb-8">
              TỈ LỆ ĐẶT PHÒNG
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16">
              <CircularProgress
                percentage={50}
                title="Phòng loại 1"
                color="cyan"
              />
              <CircularProgress
                percentage={75}
                title="Phòng loại 2"
                color="yellow"
              />
              <CircularProgress
                percentage={95}
                title="Phòng loại 3"
                color="pink"
              />
            </div>
          </div>

          {/* Revenue Section */}
          <RevenueCards />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Revenue Pie Chart */}
            <div className="lg:col-span-4">
              <RevenuePieChart
              percentage={0} />
            </div>

            {/* Trends Chart */}
            <div className="lg:col-span-8">
              <TrendsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
