import Sidebar from "./Sidebar";

export default function ReportsContent() {
  const reportData = [
    {
      name: "Ramakant Sharma",
      amount: "VND 1,560,000",
      date: "23/06/2025",
      method: "CK",
      room: "415",
      surcharge: "25%",
      phone: "+91 52345 64545",
    },
    {
      name: "Ramakant Sharma",
      amount: "VND 2,560,000",
      date: "21/06/2025",
      method: "TT",
      room: "121",
      surcharge: "12%",
      phone: "+91 52345 64545",
    },
    {
      name: "Ramakant Sharma",
      amount: "VND 9,056,000",
      date: "19/06/2025",
      method: "TT",
      room: "112",
      surcharge: "0%",
      phone: "+91 52345 64545",
    },
    {
      name: "Ramakant Sharma",
      amount: "VND 9,056,000",
      date: "19/06/2025",
      method: "CK",
      room: "212",
      surcharge: "10%",
      phone: "+91 52345 64545",
    },
    {
      name: "Ramakant Sharma",
      amount: "VND 2,560,000",
      date: "18/06.2025",
      method: "TT",
      room: "127",
      surcharge: "15%",
      phone: "+91 52345 64545",
    },
    {
      name: "Ramakant Sharma",
      amount: "VND 1,560,000",
      date: "17/06/2025",
      method: "CK",
      room: "223",
      surcharge: "0%",
      phone: "+91 52345 64545",
    },
    {
      name: "Ramakant Sharma",
      amount: "VND 4,160,000",
      date: "16/06/2025",
      method: "CK",
      room: "112",
      surcharge: "20%",
      phone: "+91 52345 64545",
    },
    {
      name: "Ramakant Sharma",
      amount: "VND 1,563,341",
      date: "16/06/2025",
      method: "TT",
      room: "112",
      surcharge: "0%",
      phone: "+91 52345 64545",
    },
  ];

  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="bg-[#202020] rounded-md m-4 p-5 text-white">
          <div className="px-3">
            {/* Header */}
            <div className="flex justify-between items-center mb-7">
              <h1 className="text-xl font-semibold font-montserrat text-white">
                Credit History
              </h1>

              <div className="flex items-center gap-6">
                {/* Export Buttons */}
                <div className="flex gap-3">
                  <button className="bg-[#20744A] rounded-md px-5 py-2 flex items-center gap-3 text-white font-medium">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        fill="#1D6F42"
                      />
                      <polyline points="14,2 14,8 20,8" fill="#ffffff" />
                      <line
                        x1="16"
                        y1="13"
                        x2="8"
                        y2="13"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="17"
                        x2="8"
                        y2="17"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <polyline
                        points="10,9 9,9 8,9"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </svg>
                    Export to Excel
                  </button>

                  <button className="bg-[#DC2626] rounded-md px-5 py-2 flex items-center gap-3 text-white font-medium">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        fill="#DC2626"
                      />
                      <polyline points="14,2 14,8 20,8" fill="#ffffff" />
                      <line
                        x1="16"
                        y1="13"
                        x2="8"
                        y2="13"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <line
                        x1="16"
                        y1="17"
                        x2="8"
                        y2="17"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <polyline
                        points="10,9 9,9 8,9"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </svg>
                    Export to PDF
                  </button>
                </div>

                {/* Entries per page */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-montserrat">
                    Entries /Page
                  </span>
                  <div className="bg-[#111111] rounded-md px-3 py-1 min-w-[72px] h-8 flex items-center justify-center">
                    <span className="text-white text-sm">10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 mb-5 text-white font-semibold font-montserrat">
              <div>Tên</div>
              <div>Số tiền</div>
              <div>Ngày</div>
              <div>Hình thức</div>
              <div>Phòng</div>
              <div>Tỉ lệ phụ thu</div>
              <div>Số điện thoại</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-5">
              {reportData.map((row, index) => (
                <div
                  key={index}
                  className="bg-[#111111] rounded-md p-6 grid grid-cols-7 gap-4 text-white font-montserrat"
                >
                  <div>{row.name}</div>
                  <div>{row.amount}</div>
                  <div>{row.date}</div>
                  <div>{row.method}</div>
                  <div>{row.room}</div>
                  <div>{row.surcharge}</div>
                  <div>{row.phone}</div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-5 mt-8 text-white font-montserrat">
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Prev.</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="bg-[#111111] rounded-md w-9 h-9 flex items-center justify-center">
                  1
                </div>
                <div className="bg-[#202020] rounded-md w-9 h-9 flex items-center justify-center">
                  2
                </div>
                <div className="bg-[#202020] rounded-md w-9 h-9 flex items-center justify-center">
                  3
                </div>
                <div className="bg-[#202020] rounded-md w-9 h-9 flex items-center justify-center">
                  4
                </div>
                <div className="bg-[#202020] rounded-md w-9 h-9 flex items-center justify-center">
                  5
                </div>
                <div className="bg-[#202020] rounded-md px-2 h-9 flex items-center justify-center text-sm">
                  . . .
                </div>
                <div className="bg-[#202020] rounded-md w-9 h-9 flex items-center justify-center">
                  97
                </div>
                <div className="bg-[#202020] rounded-md w-9 h-9 flex items-center justify-center">
                  98
                </div>
                <div className="bg-[#202020] rounded-md w-9 h-9 flex items-center justify-center">
                  99
                </div>
                <div className="bg-[#202020] rounded-md w-10 h-9 flex items-center justify-center">
                  100
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span>Next</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
