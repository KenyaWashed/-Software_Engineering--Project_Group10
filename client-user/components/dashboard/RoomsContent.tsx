"use client";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import RoomStatsCard from "./RoomStatsCard";
import RoomTypeCard from "./RoomTypeCard";
import { use, useEffect, useState } from "react";
import { useFurnitureWithTotals } from "@/hooks/useFurnitureWithTotals";

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

  const [showAddRoom, setShowAddRoom] = useState(false);
  const roomTypeOptions = [
    "Phòng loại 1",
    "Phòng loại 2",
    "Phòng loại 3",
  ];
  // Map các gói phòng cho từng loại phòng
  const roomTypeToPackages = {
    "Phòng loại 1": ["Gói phòng 1", "Gói phòng 2"],
    "Phòng loại 2": ["Gói phòng 3", "Gói phòng 4"],
    "Phòng loại 3": ["Gói phòng 1", "Gói phòng 3", "Gói phòng 4"],
  };
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypeOptions[0]);
  const [selectedRoomPackage, setSelectedRoomPackage] = useState(roomTypeToPackages[roomTypeOptions[0]][0]);
  const [note, setNote] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // Danh sách nội thất cố định lấy từ sample data furniture.sql
  const staticFurniture = [
    { id: 1, name: "Quạt trần" },
    { id: 2, name: "Bàn" },
    { id: 3, name: "Ghế" },
    { id: 4, name: "Tủ lạnh" },
    { id: 5, name: "Ấm đun sôi" },
    { id: 6, name: "Máy lạnh" },
  ];
  const [furnitureAmounts, setFurnitureAmounts] = useState(() => ({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
  }));
  const { furniture, loading: furnitureLoading } = useFurnitureWithTotals(selectedRoomType);

  // Map room type to package id (giả định)
  const roomTypeToPackageId = {
    "Phòng loại 1": 1,
    "Phòng loại 2": 2,
    "Phòng loại 3": 3,
  };
  const [furnitureByPackage, setFurnitureByPackage] = useState({});

  useEffect(() => {
    async function fetchFurniture() {
      const result = {};
      for (const type of roomTypeOptions) {
        try {
          // Đổi sang GET, truyền room_package_id qua query string
          const res = await fetch(`http://localhost:4000/report/get-furniture?room_package_id=1`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await res.json();
          // Đảm bảo luôn là mảng
          result[type] = Array.isArray(data?.data) ? data.data : [];
        } catch (err) {
          result[type] = [];
        }
      }
      setFurnitureByPackage(result);
    }
    fetchFurniture();
  }, []);

  return (
    <div className={cn("min-h-screen bg-dashboard-bg font-lato", className)}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-60 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Action Buttons - below search bar, stretched layout */}
          <div className="flex gap-8 mb-8">
            <div className="flex-[1.2] h-16 bg-dashboard-primary rounded-2xl flex items-center justify-between px-12 min-w-[320px]">
              <div className="text-white font-inter text-lg font-normal leading-normal">
                Tổng số phòng
              </div>
              <div className="text-white font-montserrat text-lg font-bold leading-normal">
                456
              </div>
            </div>
            <div className="flex-[1.2] h-16 bg-teal-600 rounded-2xl flex items-center justify-center px-12 min-w-[320px]">
              <button
                className="text-white font-inter text-lg font-bold leading-normal focus:outline-none focus:ring-2 focus:ring-white/50 px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 transition-colors duration-150"
                type="button"
                onClick={() => setShowAddRoom(true)}
              >
                + Thêm phòng
              </button>
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
            {roomTypeOptions.map((type, idx) => (
              <RoomTypeCard
                key={type}
                roomType={type}
                totalRooms={15}
                available={658}
                rentPrice="VND 5,000,000"
                furnitureCount={furnitureByPackage[type]?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0}
                revenuePercent={25}
                expectedRevenue="VND 60,580,000"
                collectedRevenue="VND 10,540,000"
                furnitureItems={furnitureByPackage[type]?.map(item => ({ name: item.name, count: item.amount })) || []}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[350px] w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowAddRoom(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-center">
              Thêm phòng mới
            </h2>
            <form
              onSubmit={async e => {
                e.preventDefault();
                // Gọi API thêm phòng mới
                const packageId = Object.values(roomTypeToPackages).flat().indexOf(selectedRoomPackage) + 1;
                try {
                  await fetch('http://localhost:4000/room/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      room_package_id: packageId,
                      room_notes: note
                    })
                  });
                  setShowAddRoom(false);
                  setSuccessMessage("Thêm phòng thành công!");
                  setTimeout(() => setSuccessMessage(""), 3000);
                } catch (err) {
                  setSuccessMessage("Thêm phòng thất bại!");
                  setTimeout(() => setSuccessMessage(""), 3000);
                }
              }}
            >
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-semibold">
                  Loại phòng
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={selectedRoomType}
                  onChange={(e) => {
                    setSelectedRoomType(e.target.value);
                    // Reset package khi đổi loại phòng
                    setSelectedRoomPackage(roomTypeToPackages[e.target.value][0]);
                  }}
                >
                  {roomTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-semibold">
                  Gói phòng
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  value={selectedRoomPackage}
                  onChange={(e) => setSelectedRoomPackage(e.target.value)}
                >
                  {(roomTypeToPackages[selectedRoomType] || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-semibold">
                  Ghi chú
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                  rows={3}
                  placeholder="Nhập ghi chú cho phòng mới..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
              {/* ...các trường khác nếu cần */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowAddRoom(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-fade-in">
          {successMessage}
        </div>
      )}
    </div>
  );
}