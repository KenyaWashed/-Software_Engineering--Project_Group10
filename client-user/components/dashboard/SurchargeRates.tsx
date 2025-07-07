export default function SurchargeRates() {
  const rates = [
    { name: "One", percentage: 93, color: "bg-dashboard-cyan" },
    { name: "Two", percentage: 73, color: "bg-dashboard-yellow" },
    { name: "Three", percentage: 73, color: "bg-dashboard-pink" },
  ];

  return (
    <div className="bg-white rounded-md border border-dashboard-border p-5">
      <h3 className="text-xl font-semibold font-montserrat text-dashboard-text uppercase mb-8">
        Tỉ lệ phụ thu
      </h3>
      <div className="border-b border-dashboard-border mb-5"></div>

      <div className="space-y-4">
        {rates.map((rate, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <div className="text-sm text-dashboard-text mb-1">
                {rate.name}
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 h-2 rounded-md">
                  <div
                    className={`h-full rounded-md ${rate.color}`}
                    style={{ width: `${rate.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-sm text-dashboard-text ml-2 min-w-[40px]">
              {rate.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
