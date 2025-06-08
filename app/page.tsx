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
      <section className="relative h-[60vh] bg-[#f9eed7] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="khachsan/homepage.jpg"
          alt="Royal Hotel Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10"></div>
        {/* Booking Widget */}
        <div className="relative z-20">
          <BookingWidget />
        </div>
      </section>

      {/* Royal Hotel Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#002346] mb-6">ROYAL HOTEL</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Royal Hotel là khách sạn 5 sao đẳng cấp tại Vũng Tàu, nổi bật với sự kết hợp hài hòa giữa kiến trúc cổ điển sang trọng và phong cách hiện đại. Chúng tôi cam kết mang đến cho khách hàng không gian nghỉ dưỡng lý tưởng, dịch vụ tận tâm và trải nghiệm đáng nhớ.
          </p>
        </div>
      </section>

      {/* Two Column Section - Giới thiệu */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#f9eed7] p-8 flex items-center">
            <div>
              <h2 className="text-2xl font-bold text-[#002346] mb-4">Không gian nghỉ dưỡng lý tưởng</h2>
              <p className="text-gray-700 leading-relaxed">
                Royal Hotel sở hữu hệ thống phòng nghỉ đa dạng, thiết kế tinh tế, trang bị hiện đại cùng tầm nhìn hướng biển tuyệt đẹp. Mỗi phòng đều mang lại cảm giác ấm cúng, riêng tư và tiện nghi tối đa cho khách hàng.
              </p>
            </div>
          </div>
          <div className="h-64 lg:h-auto">
            <img
              src="khachsan/khonggian1.png"
              alt="Phòng nghỉ Royal Hotel"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Amenities Section - Tiện nghi nổi bật */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#002346] mb-12">TIỆN NGHI NỔI BẬT</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src="khachsan/amthuc.png"
                  alt="Nhà hàng & Ẩm thực"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#eac271] p-4 rounded-lg">
                <h3 className="font-bold text-[#002346] mb-2">Nhà hàng & Ẩm thực</h3>
                <p className="text-sm text-[#002346]">
                  Thưởng thức ẩm thực đa dạng từ Á đến Âu tại hệ thống nhà hàng sang trọng, quầy bar hiện đại cùng đội ngũ đầu bếp chuyên nghiệp.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="h-48 mb-4 rounded-lg overflow-hidden">
                <img
                   src="khachsan/hoboi.jpg"
                  alt="Hồ bơi vô cực"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#eac271] p-4 rounded-lg">
                <h3 className="font-bold text-[#002346] mb-2">Hồ bơi vô cực</h3>
                <p className="text-sm text-[#002346]">
                  Hồ bơi ngoài trời rộng rãi, thiết kế hiện đại, view hướng biển tuyệt đẹp, mang lại trải nghiệm thư giãn đỉnh cao.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="h-48 mb-4 rounded-lg overflow-hidden">
                <img
                   src="khachsan/spa.jpg"
                  alt="Spa & Chăm sóc sức khỏe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#eac271] p-4 rounded-lg">
                <h3 className="font-bold text-[#002346] mb-2">Spa & Chăm sóc sức khỏe</h3>
                <p className="text-sm text-[#002346]">
                  Dịch vụ spa, massage, phòng gym hiện đại giúp tái tạo năng lượng và chăm sóc sức khỏe toàn diện cho khách hàng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resort Section - Đẳng cấp nghỉ dưỡng */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#002346] mb-6">
              ĐẲNG CẤP NGHỈ DƯỠNG - TẬN HƯỞNG SỰ THƯ GIÃN ĐỈNH CAO
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Royal Hotel là điểm đến lý tưởng cho cả kỳ nghỉ dưỡng và công tác, với dịch vụ chuyên nghiệp, không gian sang trọng và tiện nghi hiện đại. Chúng tôi luôn sẵn sàng phục vụ để mang đến cho bạn trải nghiệm hoàn hảo nhất.
            </p>
            <Button className="bg-[#002346] text-white hover:bg-[#002346]/90 w-fit">ĐẶT NGAY</Button>
          </div>
          <div className="h-64 lg:h-auto">
            <img
              src="khachsan/khonggian2.jpg"
              alt="Không gian nghỉ dưỡng Royal Hotel"
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
