"use client";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import RoomStatsCard from "./RoomStatsCard";
import RoomTypeCard from "./RoomTypeCard";

interface RoomsContentProps {
  className?: string;
}

export default function RoomsContent({ className }: RoomsContentProps) {
  const room1FurnitureItems = [
    { name: "Quạt trần", count: 50 },
    { name: "Bàn", count: 12 },
    { name: "Ghế", count: 123 },
    { name: "Tủ lạnh", count: 6 },
    { name: "Ấm đun sôi", count: 12 },
    { name: "Máy lạnh", count: 48 },
  ];

  const room2FurnitureItems = [
    { name: "Quạt trần", count: 45 },
    { name: "Bàn", count: 30 },
    { name: "Ghế", count: 90 },
  ];

  return (
    <div className={cn("min-h-screen bg-dashboard-bg font-lato", className)}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-60 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="w-full h-18 bg-gray-200 rounded-2xl relative mb-5">
            <svg
              className="absolute left-4 top-5 w-7 h-7"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.75 2.5C19.96 2.5 25 7.54 25 13.75C25 19.96 19.96 25 13.75 25C7.54 25 2.5 19.96 2.5 13.75C2.5 7.54 7.54 2.5 13.75 2.5ZM13.75 22.5C18.5837 22.5 22.5 18.5837 22.5 13.75C22.5 8.915 18.5837 5 13.75 5C8.915 5 5 8.915 5 13.75C5 18.5837 8.915 22.5 13.75 22.5ZM24.3563 22.5887L27.8925 26.1238L26.1238 27.8925L22.5887 24.3563L24.3563 22.5887Z"
                fill="#B0B0B0"
              />
            </svg>
            <div className="absolute left-16 top-6 text-gray-400 font-inter text-lg font-normal leading-normal">
              Tìm kiếm...
            </div>
          </div>

          {/* Action Buttons - Moved below search */}
          <div className="flex gap-8 mb-6">
            <div className="w-53 h-16 bg-dashboard-primary rounded-2xl flex items-center justify-between px-4">
              <div className="text-white font-inter text-lg font-normal leading-normal">
                Tổng số phòng
              </div>
              <div className="text-white font-montserrat text-lg font-bold leading-normal">
                456
              </div>
            </div>
            <div className="w-53 h-16 bg-teal-600 rounded-2xl flex items-center justify-center">
              <div className="text-white font-inter text-lg font-bold leading-normal">
                +Thêm phòng
              </div>
            </div>
          </div>

          {/* Stats Cards - Made smaller */}
          <div className="flex gap-6 mb-10">
            <div className="w-40 h-24 bg-black rounded-2xl p-3">
              <div className="text-white font-montserrat text-sm font-normal leading-normal mb-1">
                Đã thuê
              </div>
              <div className="text-dashboard-cyan font-montserrat text-4xl font-bold leading-normal">
                35
              </div>
            </div>
            <div className="w-40 h-24 bg-black rounded-2xl p-3">
              <div className="text-white font-montserrat text-sm font-normal leading-normal mb-1">
                Trống
              </div>
              <div className="text-dashboard-yellow font-montserrat text-4xl font-bold leading-normal">
                12
              </div>
            </div>
            <div className="w-40 h-24 bg-black rounded-2xl p-3">
              <div className="text-white font-montserrat text-sm font-normal leading-normal mb-1">
                Loại phòng
              </div>
              <div className="text-white font-montserrat text-4xl font-bold leading-normal">
                6
              </div>
            </div>
            <div className="w-40 h-24 bg-black rounded-2xl p-3">
              <div className="text-white font-montserrat text-sm font-normal leading-normal mb-1">
                Số lượng khách
              </div>
              <div className="text-white font-montserrat text-4xl font-bold leading-normal">
                75
              </div>
            </div>
          </div>

          {/* Room Type Cards */}
          <div className="space-y-5">
            <RoomTypeCard
              roomType="Phòng loại 1"
              totalRooms={15}
              available={658}
              rentPrice="VND 5,000,000"
              furnitureCount={270}
              revenuePercent={25}
              expectedRevenue="VND 60,580,000"
              collectedRevenue="VND 10,540,000"
              furnitureItems={room1FurnitureItems}
            />
            <RoomTypeCard
              roomType="Phòng loại 2"
              totalRooms={15}
              available={658}
              rentPrice="VND 5,000,000"
              furnitureCount={270}
              revenuePercent={25}
              expectedRevenue="VND 60,580,000"
              collectedRevenue="VND 10,540,000"
              furnitureItems={room2FurnitureItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
