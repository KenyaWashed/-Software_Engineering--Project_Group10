"use client"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import RoomPackageInfo from "@/components/room-package-info"
import { useRoomsDataOnce } from "@/hooks/useRoomsDataStore"

interface Booking {
  reservationId: number
  userEmail: string
  roomTypeId: number
  packageId: number
  roomRumber: string
  checkIn: string
  checkOut: string
  totalForeignGuests: number
  totalLocalGuests: number
  nights: number
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  // Lấy dữ liệu phòng từ zustand store
  const { roomsData, loading: roomsLoading, error: roomsError } = useRoomsDataOnce();
  const [loading, setLoading] = useState(true)

  // Lấy dữ liệu lịch sử đặt phòng
  useEffect(() => {
    fetch('http://localhost:4000/booking/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test1@gmail.com' })
    })
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error('Lỗi:', err))
      .finally(() => setLoading(false));
  }, [])

  // Loading state khi roomsData hoặc bookings đang fetch
  if (loading || roomsLoading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>
  }
  if (roomsError) {
    return <div className="text-center py-10 text-red-600">Lỗi tải dữ liệu phòng: {roomsError}</div>
  }

 // Thêm hàm xử lý hủy phòng
async function handleCancelBooking(reservationId: number) {
  if (window.confirm('Bạn có chắc chắn muốn hủy phòng này?')) {
    try {
      const res = await fetch('http://localhost:4000/booking/cancel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_id: reservationId })
      });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.reservationId !== reservationId));
        alert('Đã hủy phòng thành công!');
      } else {
        alert('Hủy phòng thất bại!');
      }
    } catch (err) {
      alert('Hủy phòng thất bại!');
      console.error('Lỗi:', err);
    }
  }
}

  return (
    <div className="min-h-screen bg-[#f9eed7]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#002346] mb-6">
          Lịch sử đặt phòng
        </h1>
        {bookings.length === 0 ? (
          <div>Bạn chưa có lịch sử đặt phòng nào.</div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const room = roomsData.find(r => r.id === booking.roomTypeId);
              const canCancel = new Date(booking.checkIn) > new Date();
              return (
                <div
                  key={booking.reservationId}
                  className="border rounded-lg p-4 mb-6 bg-white shadow"
                >
                  {/* Sử dụng RoomPackageInfo để show chi tiết phòng/gói */}
                  {room && (
                    <RoomPackageInfo
                      room={room}
                      bookingData={{
                        adults: booking.totalLocalGuests,
                        children: booking.totalForeignGuests,
                        nights: booking.nights,
                      }}
                      selectedPackageId={booking.packageId}
                    />
                  )}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
                    <div className="text-sm text-gray-500">Mã đặt: #{booking.reservationId}</div>
                    <div className="text-xs text-gray-400">Phòng số: {booking.roomRumber} | Email: {booking.userEmail}</div>
                  </div>
                  {canCancel && (
                    <button
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold"
                      onClick={() => handleCancelBooking(booking.reservationId)}
                    >
                      Hủy phòng
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
