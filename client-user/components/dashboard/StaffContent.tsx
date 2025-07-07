import Sidebar from "./Sidebar";

export default function StaffContent() {
  const employees = [
    "Trần Văn A",
    "Nguyễn Thị B",
    "Hồ Văn C",
    "Nguyễn Cao D",
    "Võ Phúc E",
    "Trần Trọng A",
    "Nguyễn Hoàng Mình E",
    "Trương Triều F",
  ];

  const activities = [
    {
      name: "Trần Văn A",
      description: "Làm vỡ bình hoa ở phòng 106 Package 2",
      damage: "VND 500,000",
      date: "12 Nov 2022",
    },
    {
      name: "Nguyễn Thị B",
      description: "Vào ca làm trễ 30 phút",
      damage: "VND 200,000",
      date: "12 Nov 2022",
    },
  ];

  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-6">
          {/* Stats Section */}
          <div className="bg-[#2E2E2E] rounded-[10px] p-6 mb-5">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3 grid grid-cols-2 gap-5">
                <div className="bg-[#111111] rounded-[10px] p-5">
                  <div className="text-white text-base font-montserrat mb-2">
                    Tổng số nhân viên
                  </div>
                  <div className="text-white text-2xl font-medium">356</div>
                </div>
                <div className="bg-[#111111] rounded-[10px] p-5">
                  <div className="text-white text-base font-montserrat mb-2">
                    Online
                  </div>
                  <div className="text-white text-2xl font-medium">156</div>
                </div>
                <div className="bg-[#111111] rounded-[10px] p-5">
                  <div className="text-white text-base font-montserrat mb-2">
                    Tài khoản được cấp
                  </div>
                  <div className="text-white text-2xl font-medium">256</div>
                </div>
                <div className="bg-[#111111] rounded-[10px] p-5">
                  <div className="text-white text-base font-montserrat mb-2">
                    Offline
                  </div>
                  <div className="text-white text-2xl font-medium">200</div>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <button className="bg-black border-2 border-dashboard-cyan rounded-[10px] px-16 py-6 text-dashboard-cyan text-xl font-medium font-montserrat">
                  +Thêm nhân viên
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-2 gap-5">
            {/* Employee List */}
            <div className="bg-[#2E2E2E] rounded-[10px] p-4">
              <h3 className="text-white text-base font-montserrat mb-4">
                Danh sách nhân viên
              </h3>

              {/* Search */}
              <div className="bg-[#111111] rounded-[10px] p-3 mb-5 flex items-center gap-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                    stroke="#B0B0B0"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm ..."
                  className="bg-transparent text-[#B0B0B0] text-base font-montserrat flex-1 outline-none"
                />
              </div>

              {/* Employee List */}
              <div className="space-y-4">
                {employees.map((employee, index) => (
                  <div
                    key={index}
                    className="bg-[#111111] rounded-[10px] p-3 flex items-center gap-3"
                  >
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0084976ad68a07aed1c1a490348b324e19a8dee?placeholderIfAbsent=true"
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-white font-montserrat flex-1">
                      {employee}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Reports */}
            <div className="bg-[#2E2E2E] rounded-[10px] p-4">
              <h3 className="text-white text-base font-montserrat mb-4">
                Báo cáo hoạt động
              </h3>

              {/* Search and Add */}
              <div className="flex gap-4 mb-5">
                <div className="bg-[#111111] rounded-[10px] p-3 flex items-center gap-6 flex-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                      stroke="#B0B0B0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search ..."
                    className="bg-transparent text-[#B0B0B0] text-base font-montserrat flex-1 outline-none"
                  />
                </div>
                <button className="bg-dashboard-cyan rounded-[10px] px-8 py-3 text-black font-medium font-montserrat">
                  +Thêm
                </button>
              </div>

              {/* Activity Cards */}
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="bg-[#111111] rounded-[10px] p-4">
                    <div className="flex items-center gap-3 mb-8">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0084976ad68a07aed1c1a490348b324e19a8dee?placeholderIfAbsent=true"
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-white font-montserrat">
                        {activity.name}
                      </span>
                    </div>

                    <div className="text-white font-montserrat mb-8">
                      {activity.description}
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-[#111111] border border-[#2E2E2E] rounded-[10px] px-3 py-2 text-[#B5B5B5] text-sm">
                        Thiệt hại : {activity.damage}
                      </div>
                      <div className="bg-[#111111] border border-[#2E2E2E] rounded-[10px] px-3 py-2 text-[#B5B5B5] text-sm flex items-center gap-3">
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                        >
                          <path
                            d="M12.6667 2.66667H11.3333V2C11.3333 1.46957 11.1226 0.960859 10.7475 0.585786C10.3725 0.210714 9.86377 0 9.33333 0H4.66667C4.13623 0 3.62753 0.210714 3.25245 0.585786C2.87738 0.960859 2.66667 1.46957 2.66667 2V2.66667H1.33333C0.979711 2.66667 0.640573 2.80714 0.390524 3.05719C0.140476 3.30724 0 3.64638 0 4C0 4.35362 0.140476 4.69276 0.390524 4.94281C0.640573 5.19286 0.979711 5.33333 1.33333 5.33333H2V14C2 14.3536 2.14048 14.6928 2.39052 14.9428C2.64057 15.1929 2.97971 15.3333 3.33333 15.3333H10.6667C11.0203 15.3333 11.3594 15.1929 11.6095 14.9428C11.8595 14.6928 12 14.3536 12 14V5.33333H12.6667C13.0203 5.33333 13.3594 5.19286 13.6095 4.94281C13.8595 4.69276 14 4.35362 14 4C14 3.64638 13.8595 3.30724 13.6095 3.05719C13.3594 2.80714 13.0203 2.66667 12.6667 2.66667ZM4 2C4 1.82319 4.07024 1.65362 4.19526 1.52859C4.32029 1.40357 4.48986 1.33333 4.66667 1.33333H9.33333C9.51014 1.33333 9.67971 1.40357 9.80474 1.52859C9.92976 1.65362 10 1.82319 10 2V2.66667H4V2ZM9.33333 12.6667H4.66667C4.48986 12.6667 4.32029 12.5964 4.19526 12.4714C4.07024 12.3464 4 12.1768 4 12V6.66667C4 6.48986 4.07024 6.32029 4.19526 6.19526C4.32029 6.07024 4.48986 6 4.66667 6C4.84348 6 5.01305 6.07024 5.13807 6.19526C5.2631 6.32029 5.33333 6.48986 5.33333 6.66667V11.3333H8.66667V6.66667C8.66667 6.48986 8.7369 6.32029 8.86193 6.19526C8.98695 6.07024 9.15652 6 9.33333 6C9.51014 6 9.67971 6.07024 9.80474 6.19526C9.92976 6.32029 10 6.48986 10 6.66667V12C10 12.1768 9.92976 12.3464 9.80474 12.4714C9.67971 12.5964 9.51014 12.6667 9.33333 12.6667Z"
                            fill="#B5B5B5"
                          />
                        </svg>
                        {activity.date}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="bg-[#111111] border border-[#FF1010] rounded-[10px] px-11 py-2 text-[#FF1010] text-sm font-montserrat flex-1">
                        Gửi thông báo
                      </button>
                      <button className="bg-[#111111] border border-dashboard-cyan rounded-[10px] px-13 py-2 text-dashboard-cyan text-sm font-montserrat flex-1">
                        Gửi hóa đơn
                      </button>
                    </div>
                  </div>
                ))}

                {/* Last Employee Card */}
                <div className="bg-[#111111] rounded-[10px] p-4 flex items-center gap-3">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e0084976ad68a07aed1c1a490348b324e19a8dee?placeholderIfAbsent=true"
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white font-montserrat flex-1">
                    Abhinav Srivastva
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
