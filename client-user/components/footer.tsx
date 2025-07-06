import { Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#f9eed7] py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-[#002346] rounded-full flex items-center justify-center mr-4">
            <div className="w-10 h-10 bg-[#eac271] rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-[#002346] rounded-full"></div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-[#002346] mb-4">Về chúng tôi</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-[#002346]">
                Giới thiệu & Sứ mệnh
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#002346]">
                Đội ngũ quản lý
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#002346]">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#002346]">
                Điều khoản thanh toán
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#002346] mb-4">Dịch vụ</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="#" className="hover:text-[#002346]">
                Đặt phòng trực tuyến
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#002346]">
                Dịch vụ đưa đón sân bay
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#002346]">
                Tổ chức sự kiện
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#002346] mb-4">Liên hệ</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>0987 654 321</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>info@royalhotel.vn</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
