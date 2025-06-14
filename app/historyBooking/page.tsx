"use client"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import RoomPackageInfo from "@/components/room-package-info"

interface Booking {
  id: number
  userEmail: string
  room: any // Thông tin phòng (giống Room trong room-package-info)
  packageId: number
  checkIn: string
  checkOut: string
  adults: number
  children: number
  nights: number
}

export default function BookingHistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) setUser(JSON.parse(userStr))
    }
  }, [])

  useEffect(() => {
    if (user?.email) {
      // Dữ liệu giả để test hiển thị
      setBookings([
        {
          id: 1,
          userEmail: user.email,
          room: {
            id: 1,
            name: "Deluxe Ocean View",
            image: "/khachsan/khonggian1.png",
            images: [
              "/khachsan/khonggian1.png",
              "/images/phongloai1/2.jpg",
              "/images/phongloai1/3.jpg",
            ],
            area: "45m²",
            view: "Hướng biển",
            maxGuests: 3,
            beds: 1,
            bathrooms: 1,
            description:
              "Phòng sang trọng với view biển tuyệt đẹp, nội thất cao cấp và đầy đủ tiện nghi hiện đại.",
            amenities: [
              "Wi-Fi miễn phí",
              "TV 55 inch",
              "Bồn tắm",
              "Dịch vụ phòng 24/24",
              "Mini bar",
              "Máy pha cà phê",
            ],
            packages: [
              {
                id: 1,
                name: "Special Offer - Royal Privilege Package",
                benefits: ["Free cancellation", "Pay today"],
                originalPrice: 250000,
                discountPrice: 150000,
                available: true,
              },
            ],
          },
          packageId: 1,
          checkIn: "2025-06-20",
          checkOut: "2025-06-22",
          adults: 2,
          children: 1,
          nights: 2,
        },
        {
          id: 2,
          userEmail: user.email,
          room: {
            id: 2,
            name: "Executive Suite",
            image: "/khachsan/khonggian2.png",
            images: [
              "/khachsan/khonggian2.png",
              "/images/phongloai2/1.jpg",
              "/images/phongloai2/2.jpg",
            ],
            area: "65m²",
            view: "Hướng thành phố",
            maxGuests: 4,
            beds: 2,
            bathrooms: 1,
            description:
              "Suite cao cấp với không gian rộng rãi, phòng khách riêng biệt và tầm nhìn panorama thành phố.",
            amenities: [
              "Wi-Fi miễn phí",
              "TV 65 inch",
              "Jacuzzi",
              "Dịch vụ phòng 24/24",
              "Mini bar",
              "Máy pha cà phê",
              "Bàn làm việc",
            ],
            packages: [
              {
                id: 2,
                name: "Executive Privilege Package",
                benefits: ["Free cancellation", "Pay today", "Complimentary breakfast"],
                originalPrice: 250000,
                discountPrice: 150000,
                available: true,
              },
            ],
          },
          packageId: 2,
          checkIn: "2025-07-01",
          checkOut: "2025-07-05",
          adults: 3,
          children: 1,
          nights: 4,
        },
      ])
      setLoading(false)
      // ...bỏ fetch API thật để test
      return
    } else {
      setLoading(false)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-[#f9eed7]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#002346] mb-6">
          Lịch sử đặt phòng
        </h1>
        {loading ? (
          <div>Đang tải...</div>
        ) : bookings.length === 0 ? (
          <div>Bạn chưa có lịch sử đặt phòng nào.</div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="mb-2 flex flex-wrap gap-4 text-sm text-gray-700">
                  <div>
                    <strong>Check-in:</strong> {booking.checkIn}
                  </div>
                  <div>
                    <strong>Check-out:</strong> {booking.checkOut}
                  </div>
                  <div>
                    <strong>Số đêm:</strong> {booking.nights}
                  </div>
                  <div>
                    <strong>Nội địa:</strong> {booking.adults}
                  </div>
                  <div>
                    <strong>Nước ngoài:</strong> {booking.children}
                  </div>
                </div>
                <RoomPackageInfo
                  room={booking.room}
                  selectedPackages={{ [booking.packageId]: 1 }}
                  onPackageSelect={() => {}}
                  bookingData={{
                    adults: booking.adults,
                    children: booking.children,
                    nights: booking.nights,
                  }}
                  selectedPackageId={booking.packageId}
                />
                {/* Nút hủy phòng nếu check-in > ngày hiện tại */}
                {new Date(booking.checkIn) > new Date() && (
                  <button
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                    onClick={() => alert('Bạn đã yêu cầu hủy phòng! (Demo)')}
                  >
                    Hủy phòng
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
