import Sidebar from "./Sidebar";
import RevenueChart from "./RevenueChart";
import SurchargeRates from "./SurchargeRates";
import RevenueHistory from "./RevenueHistory";
import TrendsChart from "./TrendsChart";

export default function RevenueContent() {
  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-6 max-w-[1200px]">
          <div className="grid grid-cols-3 gap-10 mb-6">
            <div className="col-span-2">
              <RevenueChart />
            </div>
            <div className="col-span-1">
              <SurchargeRates />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <RevenueHistory />
            </div>
            <div>
              <TrendsChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
