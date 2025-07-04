import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ReactNode | null;
  label: string;
  active?: boolean;
}

const menuItems: MenuItem[] = [
  {
    icon: null,
    label: "Trang chủ",
    active: true,
  },
  {
    icon: null,
    label: "Phòng",
  },
  {
    icon: null,
    label: "Trạng thái",
  },
  {
    icon: null,
    label: "Doanh thu",
  },
  {
    icon: null,
    label: "Nhân viên",
  },
  {
    icon: null,
    label: "Báo cáo",
  },
  {
    icon: null,
    label: "Chính sách",
  },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <div
      className={cn(
        "w-60 bg-white h-screen fixed left-0 top-0 z-40",
        className,
      )}
    >
      {/* Profile Section */}
      <div className="pt-14 px-8 pb-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
          </div>
          <div className="text-center">
            <div className="text-dashboard-text font-bold text-sm leading-6 font-lato">
              Admin
            </div>
            <div className="text-dashboard-primary font-bold text-sm leading-6 font-lato">
              Profile
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-7 border-t border-gray-300 opacity-20 mb-10"></div>

      {/* Navigation Menu */}
      <nav className="px-7">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div key={index} className="relative">
              {/* Active indicator */}
              {item.active && (
                <div className="absolute left-[-28px] top-2 w-1.5 h-10 bg-dashboard-primary rounded-r-full"></div>
              )}

              <div
                className={cn(
                  "flex items-center py-2 px-0 text-sm font-lato",
                  item.active
                    ? "text-dashboard-primary"
                    : "text-dashboard-text hover:text-dashboard-primary",
                )}
              >
                <span className="font-normal leading-6">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-10 left-7 right-7">
        <button className="w-full h-9 bg-dashboard-primary text-white text-sm font-bold font-lato rounded text-center flex items-center justify-center leading-6">
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
