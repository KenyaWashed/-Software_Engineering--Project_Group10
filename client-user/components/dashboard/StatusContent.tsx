import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import RoomPackageCard from "./RoomPackageCard";

interface StatusContentProps {
  className?: string;
}

// Sample room data based on the Figma design
const package01Rooms = [
  { number: "101", status: "occupied" as const },
  { number: "102", status: "occupied" as const },
  { number: "103", status: "occupied" as const },
  { number: "104", status: "available" as const },
  { number: "105", status: "occupied" as const },
  { number: "106", status: "occupied" as const },
  { number: "107", status: "occupied" as const },
  { number: "108", status: "available" as const },
  { number: "109", status: "available" as const },
  { number: "110", status: "occupied" as const },
  { number: "111", status: "occupied" as const },
  { number: "112", status: "available" as const },
  { number: "113", status: "occupied" as const },
  { number: "114", status: "available" as const },
  { number: "115", status: "occupied" as const },
  { number: "116", status: "available" as const },
  { number: "117", status: "occupied" as const },
  { number: "118", status: "available" as const },
  { number: "119", status: "occupied" as const },
  { number: "120", status: "available" as const },
  { number: "121", status: "occupied" as const },
  { number: "122", status: "available" as const },
  { number: "123", status: "available" as const },
  { number: "124", status: "available" as const },
  { number: "125", status: "available" as const },
  { number: "126", status: "available" as const },
  { number: "127", status: "maintenance" as const },
  { number: "128", status: "maintenance" as const },
];

const package02Rooms = [
  { number: "201", status: "occupied" as const },
  { number: "202", status: "occupied" as const },
  { number: "203", status: "occupied" as const },
  { number: "204", status: "available" as const },
  { number: "205", status: "occupied" as const },
  { number: "206", status: "occupied" as const },
  { number: "207", status: "occupied" as const },
  { number: "208", status: "available" as const },
  { number: "209", status: "available" as const },
  { number: "210", status: "occupied" as const },
  { number: "211", status: "occupied" as const },
  { number: "212", status: "available" as const },
  { number: "213", status: "occupied" as const },
  { number: "214", status: "available" as const },
  { number: "215", status: "occupied" as const },
  { number: "216", status: "available" as const },
  { number: "217", status: "occupied" as const },
  { number: "218", status: "available" as const },
  { number: "219", status: "occupied" as const },
  { number: "220", status: "available" as const },
  { number: "221", status: "occupied" as const },
  { number: "222", status: "available" as const },
  { number: "223", status: "available" as const },
  { number: "224", status: "available" as const },
  { number: "225", status: "available" as const },
  { number: "226", status: "available" as const },
  { number: "227", status: "maintenance" as const },
  { number: "228", status: "maintenance" as const },
];

const package03Rooms = [
  { number: "301", status: "occupied" as const },
  { number: "302", status: "occupied" as const },
  { number: "303", status: "occupied" as const },
  { number: "304", status: "available" as const },
  { number: "305", status: "occupied" as const },
  { number: "306", status: "occupied" as const },
  { number: "307", status: "occupied" as const },
  { number: "308", status: "available" as const },
  { number: "309", status: "available" as const },
  { number: "310", status: "occupied" as const },
  { number: "311", status: "occupied" as const },
  { number: "312", status: "available" as const },
  { number: "313", status: "occupied" as const },
  { number: "314", status: "available" as const },
  { number: "315", status: "occupied" as const },
  { number: "316", status: "available" as const },
  { number: "317", status: "occupied" as const },
  { number: "318", status: "available" as const },
  { number: "319", status: "occupied" as const },
  { number: "320", status: "available" as const },
  { number: "321", status: "occupied" as const },
  { number: "322", status: "available" as const },
  { number: "323", status: "available" as const },
  { number: "324", status: "available" as const },
  { number: "325", status: "available" as const },
  { number: "326", status: "available" as const },
  { number: "327", status: "maintenance" as const },
  { number: "328", status: "maintenance" as const },
];

const package04Rooms = [
  { number: "401", status: "occupied" as const },
  { number: "402", status: "occupied" as const },
  { number: "403", status: "occupied" as const },
  { number: "404", status: "available" as const },
  { number: "405", status: "occupied" as const },
  { number: "406", status: "occupied" as const },
  { number: "407", status: "occupied" as const },
  { number: "408", status: "available" as const },
  { number: "409", status: "available" as const },
  { number: "410", status: "occupied" as const },
  { number: "411", status: "occupied" as const },
  { number: "412", status: "available" as const },
  { number: "413", status: "occupied" as const },
  { number: "414", status: "available" as const },
  { number: "415", status: "occupied" as const },
  { number: "416", status: "available" as const },
  { number: "417", status: "occupied" as const },
];

export default function StatusContent({ className }: StatusContentProps) {
  return (
    <div className={cn("min-h-screen bg-dashboard-bg font-lato", className)}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-60 pt-4 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="w-full h-18 bg-gray-200 rounded-2xl relative mb-8">
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
            <div className="absolute left-16 top-6 text-gray-400 font-montserrat text-lg font-normal leading-normal">
              Tìm kiếm...
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex gap-5 mb-8">
            <div className="bg-black rounded px-4 py-2 flex items-center gap-4">
              <span className="text-gray-400 font-montserrat text-lg font-normal">
                Room Types
              </span>
              <span className="text-white font-montserrat text-lg font-normal">
                All
              </span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="bg-black rounded px-4 py-2 flex items-center gap-4">
              <span className="text-gray-400 font-montserrat text-lg font-normal">
                Package
              </span>
              <span className="text-white font-montserrat text-lg font-normal">
                All
              </span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Room Package Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 gap-y-8">
            <RoomPackageCard packageNumber="01" rooms={package01Rooms} />
            <RoomPackageCard packageNumber="02" rooms={package02Rooms} />
            <RoomPackageCard packageNumber="03" rooms={package03Rooms} />
            <RoomPackageCard packageNumber="04" rooms={package04Rooms} />
          </div>
        </div>
      </div>
    </div>
  );
}
