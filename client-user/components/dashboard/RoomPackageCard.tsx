"use client"
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Room {
  number: string;
  status: "occupied" | "available" | "maintenance";
}

interface RoomPackageCardProps {
  packageNumber: string;
  rooms: Room[];
  className?: string;
}

function RoomButton({ room, onClick }: { room: Room; onClick: () => void }) {
  const statusStyles = {
    occupied: "bg-red-500 text-white",
    available: "bg-gray-600 text-gray-300",
    maintenance: "bg-orange-500 text-white",
  };

  return (
    <div
      className={cn(
        "rounded text-center py-2 px-2 text-base font-montserrat font-normal leading-normal min-w-[40px] h-10 flex items-center justify-center cursor-pointer",
        statusStyles[room.status],
      )}
      onClick={onClick}
    >
      {room.number}
    </div>
  );
}

export default function RoomPackageCard({
  packageNumber,
  rooms,
  className,
}: RoomPackageCardProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: '',
    status: 'unknown',
    type: 'unknown',
    checkin: '',
    checkout: '',
  });

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  return (
    <div
      className={cn(
        "bg-neutral-800 rounded-2xl p-7 font-montserrat text-white",
        className,
      )}
    >
      {/* Package Header */}
      <div className="bg-black rounded px-3 py-2 inline-flex items-center gap-1 text-base font-bold mb-6">
        <span className="flex-1">Package No.</span>
        <span>{packageNumber}</span>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-7 gap-2.5">
        {rooms.map((room, index) => (
          <RoomButton key={index} room={room} onClick={() => handleRoomClick(room)} />
        ))}
      </div>

      {/* Popup Modal */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8 min-w-[320px] max-w-[90vw] text-black relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-black"
              onClick={handleClose}
            >
              ×
            </button>
            <div className="mb-4">
              <div className="font-bold mb-2">Thông tin phòng</div>
              {(() => {
                // Loại phòng gồm 3 loại
                const roomTypes = ["Phòng loại 1", "Phòng loại 2", "Phòng loại 3"];
                // Sinh loại phòng giả dựa trên số phòng
                const fakeType = roomTypes[parseInt(selectedRoom.number) % 3] || roomTypes[0];
                // Nếu phòng available thì không có ngày checkin/checkout
                let checkin = '', checkout = '';
                if (selectedRoom.status === 'occupied' || selectedRoom.status === 'maintenance') {
                  // maintenance = đã được book (màu cam), occupied = đang ở (màu đỏ)
                  // checkin: random từ ngày mai đến 10 ngày sau hôm nay
                  const today = new Date();
                  const checkinDate = new Date(today);
                  checkinDate.setDate(today.getDate() + 1 + Math.floor(Math.random() * 10));
                  // checkout: random từ checkin+1 đến checkin+10
                  const checkoutDate = new Date(checkinDate);
                  checkoutDate.setDate(checkinDate.getDate() + 1 + Math.floor(Math.random() * 10));
                  const format = (d: Date) => d.toLocaleDateString('vi-VN');
                  checkin = format(checkinDate);
                  checkout = format(checkoutDate);
                }
                return (
                  <>
                    <div><b>Số phòng:</b> {selectedRoom.number}</div>
                    <div><b>Gói phòng:</b> {packageNumber}</div>
                    <div><b>Trạng thái:</b> {selectedRoom.status === 'maintenance' ? 'Đã được book' : selectedRoom.status === 'occupied' ? 'Đang ở' : 'Trống'}</div>
                    <div><b>Loại phòng:</b> {fakeType}</div>
                    <div><b>Ngày check-in:</b> {checkin || '-'}</div>
                    <div><b>Ngày check-out:</b> {checkout || '-'}</div>
                  </>
                );
              })()}
            </div>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleClose}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}