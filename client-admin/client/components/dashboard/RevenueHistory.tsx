export default function RevenueHistory() {
  const historyItems = [
    { date: "21/06/2025", amount: "VND 10,560,000" },
    { date: "20/06/2025", amount: "VND 19,120,000" },
    { date: "19/06/2025", amount: "VND 7,231,000" },
    { date: "18/06/2025", amount: "VND 11,560,000" },
    { date: "17/06/2025", amount: "VND 12,209,000" },
    { date: "16/06/2025", amount: "VND 15,121,502" },
  ];

  return (
    <div className="bg-[#202020] rounded-md p-4 text-white">
      <h3 className="text-xl font-semibold font-montserrat mb-6">
        Lịch sử doanh thu
      </h3>

      <div className="space-y-5">
        {historyItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#111111] rounded-md p-4"
          >
            <span className="text-base">{item.date}</span>
            <div className="flex items-center gap-4">
              <span className="text-base">{item.amount}</span>
              <button className="w-16 h-6 bg-[#111111] rounded-md flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="4" r="1" fill="currentColor" />
                  <circle cx="8" cy="8" r="1" fill="currentColor" />
                  <circle cx="8" cy="12" r="1" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
