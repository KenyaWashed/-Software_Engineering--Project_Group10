export default function TrendsChart() {
  return (
    <div className="bg-white rounded-md p-6 h-full">
      <div className="h-64 relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="trendGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ff4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff4444" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <path
            d="M 0,40 Q 50,30 80,50 T 160,70 Q 200,80 240,90 T 320,120 Q 360,130 400,140 L 400,200 L 0,200 Z"
            fill="url(#trendGradient)"
            stroke="none"
          />

          <path
            d="M 0,40 Q 50,30 80,50 T 160,70 Q 200,80 240,90 T 320,120 Q 360,130 400,140"
            fill="none"
            stroke="#ff4444"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-[#819cb5] font-medium">
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
      </div>
    </div>
  );
}
