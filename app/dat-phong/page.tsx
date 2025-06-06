"use client"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BackButton from "@/components/back-button"
import RoomPackageInfo from "@/components/room-package-info"
import EnhancedBookingSummary from "@/components/enhanced-booking-summary"
import GuestDetailsForm from "@/components/guest-details-form"
import ReviewPayment from "@/components/review-payment"

// Sample room data (same as rooms page)
const roomsData = [
  {
    id: 1,
    name: "Deluxe Ocean View",
    image: "/images/phongloai1/1.jpg",
    images: [
      "/images/phongloai1/1.jpg",
      "/images/phongloai1/2.jpg",
      "/images/phongloai1/3.jpg",
      "/images/phongloai1/4.jpg"
    ],
    area: "38m²",
    view: "Hướng vườn",
    maxGuests: 2,
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
        available: true,
      },
    ],
  },
  {
    id: 2,
    name: "Executive Suite",
    image: "/images/phongloai1/2.jpg",
    images: [
      "/images/phongloai1/2.jpg",
      "/images/phongloai1/3.jpg",
      "/images/phongloai1/4.jpeg",
      "/images/phongloai1/1.jpg"
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
    image: "/images/phongloai1/4.jpeg",
    images: [
      "/images/phongloai1/4.jpeg",
      "/images/phongloai1/5.jpeg",
      "/images/phongloai1/1.jpg",
      "/images/phongloai1/3.jpg",
      "/images/phongloai1/2.jpg"
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

type BookingStep = "select" | "details" | "review"

interface SelectedPackage {
  packageId: number
  roomName: string
  packageName: string
  basePrice: number
  quantity: number
}

function BookingPageContent() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<BookingStep>("select")
  const [selectedPackages, setSelectedPackages] = useState<{ [packageId: number]: number }>(() => {
    // Initialize selected packages from URL parameters
    const packages: { [packageId: number]: number } = {}
    let index = 0

    while (searchParams.get(`package_${index}_packageId`)) {
      const packageId = Number.parseInt(searchParams.get(`package_${index}_packageId`) || "0")
      if (packageId) {
        packages[packageId] = 1 // Default quantity of 1
      }
      index++
    }

    return packages
  })
  const [guestData, setGuestData] = useState(null)

  // Initialize booking data from URL parameters
  const [bookingData] = useState(() => {
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

    console.log("Booking page initialized with data:", initialData)
    return initialData
  })

  const handlePackageSelect = (packageId: number, quantity: number) => {
    setSelectedPackages((prev) => ({
      ...prev,
      [packageId]: quantity,
    }))
  }

  const getSelectedPackagesArray = (): SelectedPackage[] => {
    const packages: SelectedPackage[] = []

    Object.entries(selectedPackages).forEach(([packageIdStr, quantity]) => {
      if (quantity > 0) {
        const packageId = Number.parseInt(packageIdStr)

        // Find the package in rooms data
        for (const room of roomsData) {
          const pkg = room.packages.find((p) => p.id === packageId)
          if (pkg) {
            packages.push({
              packageId,
              roomName: room.name,
              packageName: pkg.name,
              basePrice: pkg.discountPrice,
              quantity,
            })
            break
          }
        }
      }
    })

    return packages
  }

  const handleProceedToDetails = () => {
    setCurrentStep("details")
  }

  const handleGuestDetailsSubmit = (data: any) => {
    setGuestData(data)
    setCurrentStep("review")
  }

  const handleProceedPayment = () => {
    // Here you would integrate with payment gateway
    console.log("Proceeding to payment with:", {
      bookingData,
      selectedPackages: getSelectedPackagesArray(),
      guestData,
    })
    alert("Chuyển đến trang thanh toán...")
  }

  const selectedPackagesArray = getSelectedPackagesArray()

  return (
    <div className="min-h-screen bg-[#f9eed7]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <BackButton className="border-[#002346] text-[#002346] hover:bg-[#002346] hover:text-white" />
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#002346] mb-2">ĐẶT PHÒNG ROYAL HOTEL</h1>
          <p className="text-gray-600">Hoàn tất thông tin để xác nhận đặt phòng của bạn</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep === "select" ? "text-[#002346]" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "select" ? "bg-[#002346] text-white" : "bg-gray-300"}`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Chọn phòng</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === "details" ? "text-[#002346]" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "details" ? "bg-[#002346] text-white" : "bg-gray-300"}`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Thông tin</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === "review" ? "text-[#002346]" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "review" ? "bg-[#002346] text-white" : "bg-gray-300"}`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Xác nhận</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === "select" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Show only the selected room/package info and images */}
            <div className="lg:col-span-2 space-y-6">
              {selectedPackagesArray[0] ? (
                <RoomPackageInfo
                  room={roomsData.find(room => room.packages.some(pkg => pkg.id === selectedPackagesArray[0].packageId)) as any}
                  selectedPackages={selectedPackages}
                  onPackageSelect={handlePackageSelect}
                  bookingData={bookingData}
                  selectedPackageId={selectedPackagesArray[0].packageId}
                />
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-6 text-center text-yellow-800">
                  Không có phòng nào được chọn. Vui lòng quay lại để chọn phòng trước khi tiếp tục.
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <EnhancedBookingSummary
                selectedPackages={selectedPackagesArray}
                bookingData={bookingData}
                onProceedToDetails={handleProceedToDetails}
              />
            </div>
          </div>
        )}

        {currentStep === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GuestDetailsForm
                onContinue={handleGuestDetailsSubmit}
                isLoggedIn={false} // You can check actual login status here
              />
            </div>
            <div className="lg:col-span-1">
              <EnhancedBookingSummary
                selectedPackages={selectedPackagesArray}
                bookingData={bookingData}
                onProceedToDetails={() => {}}
              />
            </div>
          </div>
        )}

        {currentStep === "review" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReviewPayment onProceedPayment={handleProceedPayment} />
            </div>
            <div className="lg:col-span-1">
              <EnhancedBookingSummary
                selectedPackages={selectedPackagesArray}
                bookingData={bookingData}
                onProceedToDetails={() => {}}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f9eed7] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002346] mx-auto mb-4"></div>
            <p className="text-[#002346]">Đang tải thông tin đặt phòng...</p>
          </div>
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  )
}
