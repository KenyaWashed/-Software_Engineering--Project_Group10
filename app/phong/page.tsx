"use client"
import { useState, createContext, useCallback, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingWidget from "@/components/booking-widget"
import RoomCard from "@/components/room-card"
import BookingSummary from "@/components/booking-summary"
import BackButton from "@/components/back-button"
import { useRoomsDataOnce, useRoomsDataStore } from "@/hooks/useRoomsDataStore"

// Booking Context
interface BookingData {
  checkIn: Date | undefined
  checkOut: Date | undefined
  adults: number
  children: number
  nights: number
}

const BookingContext = createContext<{
  bookingData: BookingData
  setBookingData: (data: BookingData) => void
}>({
  bookingData: {
    checkIn: undefined,
    checkOut: undefined,
    adults: 2,
    children: 0,
    nights: 1,
  },
  setBookingData: () => {},
})

function RoomsPageContent() {
  // Lấy roomsData từ zustand store
  const { roomsData, loading, error } = useRoomsDataOnce();
  const setRoomsData = useRoomsDataStore(state => state.setRoomsData);
  const searchParams = useSearchParams()
  const [selectedPackages, setSelectedPackages] = useState<any[]>([])

  // Initialize booking data from URL parameters
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")
    const adultsParam = searchParams.get("adults")
    const childrenParam = searchParams.get("children")
    const nightsParam = searchParams.get("nights")

    const initialData = {
      checkIn: checkInParam ? new Date(checkInParam) : undefined,
      checkOut: checkOutParam ? new Date(checkOutParam) : undefined,
      adults: adultsParam ? Number.parseInt(adultsParam) : 2,
      children: childrenParam ? Number.parseInt(childrenParam) : 0,
      nights: nightsParam ? Number.parseInt(nightsParam) : 1,
    }

    console.log("Initialized booking data from URL:", initialData)
    return initialData
  })

  // Calculate nights if dates are available but nights param is missing
  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut && !searchParams.get("nights")) {
      const checkInTime = new Date(bookingData.checkIn)
      checkInTime.setHours(12, 30, 0, 0)

      const checkOutTime = new Date(bookingData.checkOut)
      checkOutTime.setHours(12, 0, 0, 0)

      const timeDiff = checkOutTime.getTime() - checkInTime.getTime()
      const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (calculatedNights > 0 && calculatedNights !== bookingData.nights) {
        setBookingData((prev) => ({ ...prev, nights: calculatedNights }))
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.nights, searchParams])

  // 2. Cập nhật trạng thái available khi ngày thay đổi và đã có dữ liệu phòng
  useEffect(() => {
    if (roomsData.length > 0 && bookingData.checkIn && bookingData.checkOut) {
      fetch('http://localhost:4000/room/available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkin_date: bookingData.checkIn.toISOString().slice(0, 10),
          checkout_date: bookingData.checkOut.toISOString().slice(0, 10)
        })
      })
        .then(response => response.json())
        .then(data => {
          const availableIds = new Set(data.availableRoom.map((item: any) => item.room_package_id));
          setRoomsData(
            roomsData.map(room => ({
              ...room,
              packages: room.packages.map(pkg => ({
                ...pkg,
                available: availableIds.has(pkg.id)
              }))
            }))
          );
        })
        .catch(error => {
          console.error('Lỗi:', error);
        });
    }
  }, [roomsData, bookingData.checkIn, bookingData.checkOut, setRoomsData]);

  const handleSelectPackage = useCallback((roomId: number, packageData: any) => {
    const newSelection = {
      roomId,
      roomName: roomsData.find((room) => room.id === roomId)?.name,
      packageId: packageData.id,
      packageName: packageData.name,
      basePrice: packageData.discountPrice,
    }
    // Only allow one room/package selection at a time
    setSelectedPackages([newSelection])
  }, [])

  const handleRemovePackage = useCallback((roomId: number) => {
    setSelectedPackages([])
  }, [])

  const handleBookingDataChange = useCallback((data: BookingData) => {
    console.log("Booking data changed:", data)
    setBookingData(data)
    setSelectedPackages([]) // Reset các lựa chọn gói/phòng khi thay đổi dữ liệu booking
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9eed7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002346] mx-auto mb-4"></div>
          <p className="text-[#002346]">Đang tải thông tin phòng...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#f9eed7] flex items-center justify-center">
        <div className="text-center text-red-600">Lỗi tải dữ liệu phòng: {error}</div>
      </div>
    )
  }

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData: handleBookingDataChange }}>
      <div className="min-h-screen bg-[#f9eed7]">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-4">
           <BackButton
            to=""
            className="border-[#002346] text-[#002346] hover:bg-[#002346] hover:text-white"
          />
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Section */}
          <section className="mb-12">
            <h1 className="text-3xl font-bold text-[#002346] text-center mb-8">DANH SÁCH PHÒNG</h1>
            <div className="flex justify-center">
              <BookingWidget onBookingChange={handleBookingDataChange} initialData={bookingData} />
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room List */}
            <div className="lg:col-span-2 space-y-8">
              {roomsData.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onSelectPackage={handleSelectPackage}
                  selectedPackage={selectedPackages[0]}
                  bookingData={bookingData}
                />
              ))}
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <BookingSummary selectedPackages={selectedPackages} onRemovePackage={handleRemovePackage} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </BookingContext.Provider>
  )
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f9eed7] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002346] mx-auto mb-4"></div>
            <p className="text-[#002346]">Đang tải thông tin phòng...</p>
          </div>
        </div>
      }
    >
      <RoomsPageContent />
    </Suspense>
  )
}

export { BookingContext }
