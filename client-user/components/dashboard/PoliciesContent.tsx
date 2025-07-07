import Sidebar from "./Sidebar";

export default function PoliciesContent() {
  const policies = [
    {
      title: "Check-in & Check-out",
      content: [
        "Check-in: từ 14:00",
        "Check-out: trước 12:00 trưa ngày rời đi",
        "Nhận phòng sớm hoặc trả phòng muộn có thể tính thêm phí (tùy tình trạng phòng trống)",
      ],
    },
    {
      title: "Đồ đạc cá nhân",
      content: [
        "Khách hàng tự bảo quản tài sản cá nhân",
        "Khách sạn không chịu trách nhiệm với tài sản thất lạc nếu không gửi tại quầy lễ tân",
      ],
    },
    {
      title: "Thanh toán",
      content: [
        "Chấp nhận tiền mặt, thẻ tín dụng, ví điện tử",
        "Thanh toán đầy đủ khi nhận phòng, hoặc đặt cọc tùy theo loại phòng",
      ],
    },
    {
      title: "Chính sách phụ thu",
      content: [
        "Phụ thu 10% đối với khách ở thêm người so với số lượng quy định của phòng",
        "Phụ thu 20% đối với yêu cầu phòng trong dịp Lễ/Tết",
        "Khách nước ngoài: áp dụng phụ thu 15% trên tổng giá trị đơn đặt phòng để hỗ trợ chi phí quản lý, phiên dịch, và các thủ tục liên quan",
        "Mọi mức phụ thu được thông báo rõ ràng tại thời điểm đặt phòng và khi nhận phòng",
      ],
    },
  ];

  const formatPolicyContent = (content: string) => {
    // Highlight percentages in bold
    return content.replace(
      /(\d+%)/g,
      '<span style="font-weight: 900;">$1</span>',
    );
  };

  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-6 font-montserrat">
          {/* Header */}
          <div className="flex justify-between items-start mb-17">
            <h1 className="text-4xl font-bold text-black">
              Chính sách khách sạn
            </h1>
            <button className="bg-[#00868D] text-white px-12 py-4 rounded-md font-medium text-base mt-2">
              +Thêm chính sách
            </button>
          </div>

          {/* Policy Sections */}
          <div className="space-y-7">
            {policies.map((policy, index) => (
              <div key={index} className="bg-[#202020] rounded-md p-5">
                <div className="flex justify-between items-start gap-20">
                  <div className="flex-1">
                    <div className="flex gap-25">
                      <h3 className="text-white font-bold text-base min-w-[200px] shrink-0">
                        {policy.title}
                      </h3>
                      <div className="flex-1">
                        {policy.content.map((line, lineIndex) => (
                          <div
                            key={lineIndex}
                            className="text-white font-normal text-base mb-1"
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: formatPolicyContent(line),
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button className="bg-[#111111] border border-[#FF1010] rounded-[10px] px-16 py-2 text-[#FF1010] font-normal text-base">
                    Sửa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
