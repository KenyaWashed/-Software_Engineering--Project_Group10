export default function RevenueChart() {
  return (
    <div className="bg-[#202020] rounded-[10px] p-5 text-white">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold font-montserrat">Doanh thu</h2>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-dashboard-cyan rounded-full"></div>
            <span>Phòng loại 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-dashboard-yellow rounded-full"></div>
            <span>Phòng loại 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-dashboard-pink rounded-full"></div>
            <span>Phòng loại 3</span>
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        <div className="flex-1">
          <div className="relative w-52 h-52 mx-auto">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#292929"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#00FFF5"
                strokeWidth="8"
                strokeDasharray="80 251.2"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FFE605"
                strokeWidth="8"
                strokeDasharray="40 251.2"
                strokeDashoffset="-80"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#FF05C8"
                strokeWidth="8"
                strokeDasharray="31.4 251.2"
                strokeDashoffset="-120"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-semibold">50%</span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="bg-[#111111] rounded-[10px] p-5">
            <div className="text-base text-white mb-2">Dự kiến</div>
            <div className="text-2xl font-medium">VND 52,000,000</div>
          </div>
          <div className="bg-[#111111] rounded-[10px] p-5">
            <div className="text-base text-white mb-2">Đã thu</div>
            <div className="text-2xl font-medium">VND 26,000,000</div>
          </div>
        </div>
      </div>
    </div>
  );
}
