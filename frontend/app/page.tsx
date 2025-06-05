import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingWidget from "@/components/booking-widget"
import ImageGallery from "@/components/image-gallery"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] bg-[#f9eed7] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <BookingWidget />
      </section>

      {/* Royal Hotel Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#002346] mb-6">ROYAL HOTEL</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Sự hòa hợp giữa kiến trúc cổ điển, sang trọng và phong cách hiện đại của Royal Hotel không chỉ là điểm nhấn
            thương hiệu mà còng góp phần tạo nên một không gian sống sang trọng và đẳng cấp, đánh thức mọi giác quan.
          </p>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#f9eed7] p-8 flex items-center">
            <div>
              <p className="text-gray-700 leading-relaxed">
                Tự hào là khách sạn 5 sao đẳng cấp số một khu vực tại VT, The Royal Hotel mang đến cho khách hàng dịch
                vụ tốt nhất từ nghỉ dưỡng đến ẩm thực phong cách và những trải nghiệm nghỉ dưỡng tuyệt vời.
              </p>
            </div>
          </div>
          <div className="h-64 lg:h-auto">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Royal Hotel Interior"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#002346] mb-12">TIỆN ÍCH NỔI BẬT</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#eac271] p-4 rounded-lg">
                <h3 className="font-bold text-[#002346] mb-2">ẨM THỰC</h3>
                <p className="text-sm text-[#002346]">
                  Hệ thống nhà hàng và quán bar được đầu tư chỉn chu với đội ngũ đầu bếp chuyên nghiệp, thực đơn đa
                  dạng, sang trọng.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="Swimming Pool"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#eac271] p-4 rounded-lg">
                <h3 className="font-bold text-[#002346] mb-2">HỒ BƠI</h3>
                <p className="text-sm text-[#002346]">
                  Hệ thống nhà hàng và quán bar được đầu tư chỉn chu với đội ngũ đầu bếp chuyên nghiệp, thực đơn đa
                  dạng, sang trọng.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=200&width=300"
                  alt="Spa & Wellness"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#eac271] p-4 rounded-lg">
                <h3 className="font-bold text-[#002346] mb-2">CHĂM SÓC SỨC KHỎE</h3>
                <p className="text-sm text-[#002346]">
                  Hệ thống nhà hàng và quán bar được đầu tư chỉn chu với đội ngũ đầu bếp chuyên nghiệp, thực đơn đa
                  dạng, sang trọng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resort Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#002346] mb-6">
              KHÔNG GIAN NGHỈ DƯỠNG
              <br />
              ĐẲNG CẤP - TẦN HƯỞNG
              <br />
              SỰ THƯ GIÃN ĐỈNH CAO
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Từ không gian nghỉ ngơi yên bình đến dịch vụ tận tâm tung phút giây - Sự lựa chọn hoàn hảo cho kỳ nghỉ
              đích thực.
              <br />
              <br />
              Dù là chuyến đi thư giãn hay công tác, đều mang đến trải nghiệm vượt xa sự mong đợi - đẳng cấp, tinh tế và
              đầm chất riêng.
            </p>
            <Button className="bg-[#002346] text-white hover:bg-[#002346]/90 w-fit">ĐẶT NGAY</Button>
          </div>
          <div className="h-64 lg:h-auto">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Resort Room"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#002346] mb-12">HÌNH ẢNH</h2>
          <ImageGallery />
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
