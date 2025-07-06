import { cn } from "@/lib/utils";

interface Room {
  number: string;
  status: "occupied" | "available" | "maintenance";
}

interface RoomPackageCardProps {
  packageNumber: string;
  rooms: Room[];
  className?: string;
}

function RoomButton({ room }: { room: Room }) {
  const statusStyles = {
    occupied: "bg-red-500 text-white",
    available: "bg-gray-600 text-gray-300",
    maintenance: "bg-orange-500 text-white",
  };

  return (
    <div
      className={cn(
        "rounded text-center py-2 px-2 text-base font-montserrat font-normal leading-normal min-w-[40px] h-10 flex items-center justify-center",
        statusStyles[room.status],
      )}
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
          <RoomButton key={index} room={room} />
        ))}
      </div>
    </div>
  );
}
