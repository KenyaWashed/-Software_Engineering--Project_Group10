import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
}

interface FurnitureItemProps {
  name: string;
  count: number;
}

interface RoomTypeCardProps {
  roomType: string;
  totalRooms: number;
  available: number;
  rentPrice: string;
  furnitureCount: number;
  revenuePercent: number;
  expectedRevenue: string;
  collectedRevenue: string;
  furnitureItems: FurnitureItemProps[];
  className?: string;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-black rounded-2xl p-5 min-w-[150px]">
      <div className="text-white font-montserrat text-base font-normal leading-normal mb-2.5">
        {title}
      </div>
      <div className="text-white font-montserrat text-2xl font-normal leading-normal">
        {value}
      </div>
    </div>
  );
}

function FurnitureItem({ name, count }: FurnitureItemProps) {
  return (
    <div className="bg-neutral-800 rounded-2xl p-2.5 px-4 flex items-center justify-between h-9">
      <div className="text-white font-montserrat text-sm font-normal leading-normal flex-1">
        {name}
      </div>
      <div className="text-white font-montserrat text-sm font-normal leading-normal mr-2.5">
        {count}
      </div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.83366 15L6.66699 13.8333L10.5003 10L6.66699 6.16667L7.83366 5L12.8337 10L7.83366 15Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

export default function RoomTypeCard({
  roomType,
  totalRooms,
  available,
  rentPrice,
  furnitureCount,
  revenuePercent,
  expectedRevenue,
  collectedRevenue,
  furnitureItems,
  className,
}: RoomTypeCardProps) {
  // Lấy dữ liệu stats theo roomType
  const stats = roomTypeStats[roomType] || {};
  // Calculate stroke dasharray for pie chart
  const circumference = 2 * Math.PI * 70;
  const strokeDasharray = `${
    (revenuePercent / 100) * circumference
  } ${circumference}`;

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-neutral-800 p-5 relative",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.5 28.5C4.075 28.5 3.719 28.356 3.432 28.068C3.144 27.781 3 27.425 3 27V19.5C3 18.825 3.1375 18.2125 3.4125 17.6625C3.6875 17.1125 4.05 16.625 4.5 16.2V12C4.5 10.75 4.9375 9.6875 5.8125 8.8125C6.6875 7.9375 7.75 7.5 9 7.5H15C15.575 7.5 16.1125 7.6065 16.6125 7.8195C17.1125 8.0315 17.575 8.325 18 8.7C18.425 8.325 18.8875 8.0315 19.3875 7.8195C19.8875 7.6065 20.425 7.5 21 7.5H27C28.25 7.5 29.3125 7.9375 30.1875 8.8125C31.0625 9.6875 31.5 10.75 31.5 12V16.2C31.95 16.625 32.3125 17.1125 32.5875 17.6625C32.8625 18.2125 33 18.825 33 19.5V27C33 27.425 32.856 27.781 32.568 28.068C32.281 28.356 31.925 28.5 31.5 28.5C31.075 28.5 30.719 28.356 30.432 28.068C30.144 27.781 30 27.425 30 27V25.5H6V27C6 27.425 5.8565 27.781 5.5695 28.068C5.2815 28.356 4.925 28.5 4.5 28.5ZM19.5 15H28.5V12C28.5 11.575 28.356 11.2185 28.068 10.9305C27.781 10.6435 27.425 10.5 27 10.5H21C20.575 10.5 20.219 10.6435 19.932 10.9305C19.644 11.2185 19.5 11.575 19.5 12V15ZM7.5 15H16.5V12C16.5 11.575 16.3565 11.2185 16.0695 10.9305C15.7815 10.6435 15.425 10.5 15 10.5H9C8.575 10.5 8.2185 10.6435 7.9305 10.9305C7.6435 11.2185 7.5 11.575 7.5 12V15ZM6 22.5H30V19.5C30 19.075 29.856 18.7185 29.568 18.4305C29.281 18.1435 28.925 18 28.5 18H7.5C7.075 18 6.7185 18.1435 6.4305 18.4305C6.1435 18.7185 6 19.075 6 19.5V22.5Z"
            fill="white"
          />
        </svg>
        <div className="text-white font-montserrat text-lg font-bold leading-normal">
          {roomType}
        </div>
        <div className="ml-auto w-21 h-8.5 rounded border border-zinc-600 bg-neutral-800 flex items-center gap-2 px-4">
          <button
            className="text-white font-montserrat text-base font-normal leading-normal hover:bg-zinc-700 px-4 py-1 rounded transition-colors"
            type="button"
            // onClick={() => ...} // Thêm logic khi cần
          >
            Sửa
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-8 mb-8">
        <StatCard title="Tổng số phòng" value={totalRooms} />
        <StatCard title="Đã thuê" value={totalRooms - available} />
        <StatCard title="Giá thuê" value={rentPrice} />
        <StatCard title="Số lượng khách" value={stats.currentGuests ?? furnitureCount} />
        <StatCard title="Số khách tối đa" value={stats.maxGuests ?? (roomType === 'Phòng đơn' ? 2 : roomType === 'Phòng đôi' ? 4 : 6)} />
      </div>

      {/* Revenue and Furniture - Side by side horizontally */}
      <div className="flex gap-6">
        {/* Revenue Chart */}
        <div className="bg-black rounded-2xl p-5 flex-1">
          <div className="text-white font-montserrat text-base font-normal leading-normal mb-5">
            Doanh thu
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg
                className="w-24 h-24 -rotate-90"
                viewBox="0 0 158 158"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background circle */}
                <circle
                  cx="79"
                  cy="79"
                  r="70"
                  fill="none"
                  stroke="#111"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="79"
                  cy="79"
                  r="70"
                  fill="none"
                  stroke="#FFE605"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-montserrat text-lg font-bold leading-normal">
                  {revenuePercent}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="text-white font-montserrat text-sm font-normal leading-normal">
                  Dự kiến
                </div>
                <div className="text-dashboard-yellow font-montserrat text-sm font-bold leading-normal">
                  {expectedRevenue}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-white font-montserrat text-sm font-normal leading-normal">
                  Đã thu
                </div>
                <div className="text-dashboard-yellow font-montserrat text-sm font-bold leading-normal">
                  {collectedRevenue}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Furniture List */}
        <div className="bg-black rounded-2xl p-5 flex-1">
          <div className="text-white font-montserrat text-base font-normal leading-normal mb-5">
            Tổng số nội thất hiện có
          </div>
          <div className="text-dashboard-yellow font-montserrat text-2xl font-bold leading-normal mb-2">
            {furnitureCount}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {furnitureItems.map((item, index) => (
              <FurnitureItem key={index} name={item.name} count={item.count} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Thông tin mẫu cho các loại phòng (có thể lấy từ API hoặc props thực tế)
const roomTypeStats = {
  'Phòng đơn': {
    totalRooms: 10,
    rented: 6,
    currentGuests: 8,
    rentPrice: '500,000đ',
    furnitureCount: 5,
    maxGuests: 2,
    revenues: ['5,000,000đ', '6,000,000đ'],
  },
  'Phòng đôi': {
    totalRooms: 8,
    rented: 5,
    currentGuests: 10,
    rentPrice: '800,000đ',
    furnitureCount: 7,
    maxGuests: 4,
    revenues: ['7,000,000đ', '8,000,000đ'],
  },
  'Phòng gia đình': {
    totalRooms: 6,
    rented: 3,
    currentGuests: 12,
    rentPrice: '1,200,000đ',
    furnitureCount: 10,
    maxGuests: 6,
    revenues: ['10,000,000đ', '12,000,000đ'],
  },
};