"use client"
import { useState, createContext, useCallback, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BookingWidget from "@/components/booking-widget"
import RoomCard from "@/components/room-card"
import BookingSummary from "@/components/booking-summary"
import BackButton from "@/components/back-button"

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

// Sample room data
const roomsData = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    images: [
      "/images/phongloai1/1.jpg",
      "/images/phongloai1/2.jpg",
      "/images/phongloai1/3.jpg",
      "/images/phongloai1/4.jpeg",
      "/images/phongloai1/5.jpeg",
    ],
    area: "45m²",
    view: "Hướng biển",
    maxGuests: 3,
    beds: 1,
    bathrooms: 1,
    description: "Phòng sang trọng với view biển tuyệt đẹp, nội thất cao cấp và đầy đủ tiện nghi hiện đại.",
    amenities: ["Wi-Fi miễn phí", "TV 55 inch", "Bồn tắm", "Dịch vụ phòng 24/24", "Mini bar", "Máy pha cà phê"],
    packages: [
      {
        id: 1,
        name: "Special Offer - Royal Privilege Package",
        benefits: ["Free cancellation", "Pay today"],
        originalPrice: 3200000,
        discountPrice: 2522880,
        available: true,
      },
      {
        id: 2,
        name: "Standard Package",
        benefits: ["Free cancellation"],
        originalPrice: 2800000,
        discountPrice: 2520000,
        available: false,
      },
    ],
  },
  {
    id: 2,
    name: "Executive Suite",
    images: [
      "/images/phongloai1/1.jpg",
      "/images/phongloai1/2.jpg",
      "/images/phongloai1/3.jpg",
      "/images/phongloai1/4.jpeg",
      "/images/phongloai1/5.jpeg",
    ],
    area: "65m²",
    view: "Hướng thành phố",
    maxGuests: 4,
    beds: 2,
    bathrooms: 2,
    description: "Suite cao cấp với không gian rộng rãi, phòng khách riêng biệt và tầm nhìn panorama thành phố.",
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
        id: 3,
        name: "Executive Privilege Package",
        benefits: ["Free cancellation", "Pay today", "Complimentary breakfast"],
        originalPrice: 4500000,
        discountPrice: 3850000,
        available: true,
      },
    ],
  },
  {
    id: 3,
    name: "Presidential Suite",
    images: [
      "/images/room3-1.jpg",
      "/images/room3-2.jpg",
      "/images/room3-3.jpg",
      "/placeholder.svg?height=300&width=400",
    ],
    area: "120m²",
    view: "Hướng biển và thành phố",
    maxGuests: 6,
    beds: 3,
    bathrooms: 3,
    description: "Suite tổng thống với thiết kế xa hoa, phòng khách rộng lớn và tầm nhìn 360 độ tuyệt đẹp.",
    amenities: [
      "Wi-Fi miễn phí",
      "TV 75 inch",
      "Jacuzzi riêng",
      "Dịch vụ phòng 24/24",
      "Mini bar cao cấp",
      "Máy pha cà phê",
      "Phòng làm việc riêng",
      "Ban công riêng",
    ],
    packages: [
      {
        id: 4,
        name: "Presidential Experience Package",
        benefits: ["Free cancellation", "Pay today", "Complimentary breakfast", "Airport transfer"],
        originalPrice: 8000000,
        discountPrice: 6500000,
        available: true,
      },
      {
        id: 5,
        name: "Luxury Package",
        benefits: ["Free cancellation"],
        originalPrice: 7200000,
        discountPrice: 6480000,
        available: false,
      },
    ],
  },
]

function RoomsPageContent() {
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

  const handleSelectPackage = useCallback((roomId: number, packageData: any) => {
    const newSelection = {
      roomId,
      roomName: roomsData.find((room) => room.id === roomId)?.name,
      packageId: packageData.id,
      packageName: packageData.name,
      basePrice: packageData.discountPrice,
    }

    setSelectedPackages((prev) => {
      const filtered = prev.filter((item) => item.roomId !== roomId)
      return [...filtered, newSelection]
    })
  }, [])

  const handleRemovePackage = useCallback((roomId: number) => {
    setSelectedPackages((prev) => prev.filter((item) => item.roomId !== roomId))
  }, [])

  const handleBookingDataChange = useCallback((data: BookingData) => {
    console.log("Booking data changed:", data)
    setBookingData(data)
    setSelectedPackages([]) // Reset các lựa chọn gói/phòng khi thay đổi dữ liệu booking
  }, [])

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData: handleBookingDataChange }}>
      <div className="min-h-screen bg-[#f9eed7]">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-4">
          <BackButton className="border-[#002346] text-[#002346] hover:bg-[#002346] hover:text-white" />
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
                  selectedPackage={selectedPackages.find((item) => item.roomId === room.id)}
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
