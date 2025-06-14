"use client"
import { useContext } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, Users, Moon } from "lucide-react"
import { BookingContext } from "@/app/phong/page"

interface SelectedPackage {
  roomId: number
  roomName: string
  packageId: number
  packageName: string
  basePrice: number
}

interface BookingSummaryProps {
  selectedPackages: SelectedPackage[]
  onRemovePackage: (roomId: number) => void
}

export default function BookingSummary({ selectedPackages, onRemovePackage }: BookingSummaryProps) {
  const { bookingData } = useContext(BookingContext)
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Chưa chọn"
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Calculate pricing for each package based on new hotel policy
  const calculatePackagePrice = (basePrice: number) => {
    const { adults, children, nights } = bookingData
    const totalGuests = adults + children
    let price = basePrice * nights // Giá cho 2 khách đầu tiên
    let extraCharge = 0
    if (totalGuests > 2) {
      extraCharge = basePrice * 0.25 * (totalGuests - 2) * nights
      price += extraCharge
    }
    if (children > 0) {
      price *= 1.5
    }
    return {
      baseTotal: basePrice * nights,
      extraCharge,
      hasForeign: children > 0,
      packageTotal: price,
    }
  }

  const packagePrices = selectedPackages.map((pkg) => ({
    ...pkg,
    pricing: calculatePackagePrice(pkg.basePrice),
  }))

  const subtotal = packagePrices.reduce((sum, pkg) => sum + pkg.pricing.packageTotal, 0)
  const taxAndFees = subtotal * 0.1 // 10% tax and service fees
  const total = subtotal + taxAndFees
  const deposit = total * 0.3 // 30% deposit

  // Function to create booking URL with all data
  const createBookingURL = () => {
    const params = new URLSearchParams()

    if (bookingData.checkIn) {
      params.set("checkIn", bookingData.checkIn.toISOString())
    }
    if (bookingData.checkOut) {
      params.set("checkOut", bookingData.checkOut.toISOString())
    }
    params.set("adults", bookingData.adults.toString())
    params.set("children", bookingData.children.toString())
    params.set("nights", bookingData.nights.toString())

    // Add selected packages to URL
    selectedPackages.forEach((pkg, index) => {
      params.set(`package_${index}_roomId`, pkg.roomId.toString())
      params.set(`package_${index}_packageId`, pkg.packageId.toString())
      params.set(`package_${index}_basePrice`, pkg.basePrice.toString())
    })

    return `/dat-phong?${params.toString()}`
  }

  const handleBookNow = () => {
    if (selectedPackages.length === 0) {
      alert("Vui lòng chọn ít nhất một phòng để đặt!")
      return
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Vui lòng chọn ngày nhận phòng và trả phòng!")
      return
    }

    // Kiểm tra ngày trả phòng phải sau ngày nhận phòng
    if (
      bookingData.checkIn &&
      bookingData.checkOut &&
      bookingData.checkOut <= bookingData.checkIn
    ) {
      alert("Ngày trả phòng phải sau ngày nhận phòng!")
      return
    }

    const bookingURL = createBookingURL()
    console.log("Navigating to booking page with URL:", bookingURL)
    console.log("Booking data:", {
      bookingData,
      selectedPackages,
      total: formatPrice(total),
      deposit: formatPrice(deposit),
    })

    router.push(bookingURL)
  }

  if (selectedPackages.length === 0) {
    return (
      <Card className="sticky top-4">
        <CardHeader>
          <CardTitle className="text-[#002346] flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Tóm tắt đặt phòng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto mb-2" />
            </div>
            <p className="text-gray-500">Chưa có phòng nào được chọn</p>
            <p className="text-sm text-gray-400 mt-2">Vui lòng chọn gói phòng để xem tóm tắt đặt phòng</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-[#002346] flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Tóm tắt đặt phòng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Details - Using Saved Variables */}
        <div className="bg-[#f9eed7] p-4 rounded-lg">
          <h4 className="font-semibold text-[#002346] mb-3 flex items-center">
            <Moon className="w-4 h-4 mr-2" />
            Thông tin đặt phòng
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Nhận phòng:</p>
              <p className="text-[#002346]">{formatDate(bookingData.checkIn)}</p>
              <p className="text-xs text-gray-500">12:30 trưa</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Trả phòng:</p>
              <p className="text-[#002346]">{formatDate(bookingData.checkOut)}</p>
              <p className="text-xs text-gray-500">12:00 trưa</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Số đêm:</p>
              <p className="text-[#002346] font-bold">{bookingData.nights} đêm</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Số khách:</p>
              <p className="text-[#002346]">{bookingData.adults + bookingData.children} người</p>
              <p className="text-xs text-gray-600">
                {bookingData.adults} nội địa
                {bookingData.children > 0 && `, ${bookingData.children} nước ngoài`}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Policy */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-semibold text-sm text-blue-800 mb-2">Chính sách tính giá:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>
              • Đơn giá phòng cho 2 khách: Giá phòng × {bookingData.nights} đêm
            </li>
            <li>
              • Khách thứ 3 phụ thu thêm 25%: Giá phòng × 25% × {bookingData.nights} đêm
            </li>
            <li>
              • Khách Nước ngoài ( chỉ cần có 1 trong phòng ): Tổng giá × 1.5
            </li>
          </ul>
        </div>

        {/* Selected Packages with Detailed Pricing */}
        <div>
          <h4 className="font-semibold text-[#002346] mb-3">Phòng đã chọn:</h4>
          <div className="space-y-3">
            {packagePrices.map((pkg, idx) => (
              <div key={pkg.roomId} className="border rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-[#002346]">
                      {pkg.roomName} {packagePrices.length > 1 && `- Phòng ${idx + 1}`}
                    </h5>
                    <p className="text-xs text-gray-600 mb-2">{pkg.packageName}</p>

                    {/* Detailed Price Breakdown for each room */}
                    <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Giá cơ bản cho 2 khách:</span>
                        <span className="font-medium">{formatPrice(pkg.pricing.baseTotal)}</span>
                      </div>
                      {(bookingData.adults + bookingData.children) > 2 && (
                        <div className="flex justify-between">
                          <span>Phụ thu khách thứ 3 trở đi (25%/khách):</span>
                          <span className="font-medium">{formatPrice(pkg.pricing.extraCharge)}</span>
                        </div>
                      )}
                      {pkg.pricing.hasForeign && (
                        <div className="flex justify-between">
                          <span>Hệ số nước ngoài (1.5x):</span>
                          <span className="font-medium">x 1.5</span>
                        </div>
                      )}
                      <div className="border-t pt-1 flex justify-between font-semibold">
                        <span>Tổng giá phòng này:</span>
                        <span className="text-[#002346]">{formatPrice(pkg.pricing.packageTotal)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePackage(pkg.roomId)}
                    className="text-red-500 hover:text-red-700 p-1 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tổng phụ ({bookingData.nights} đêm):</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế và phí dịch vụ (10%):</span>
              <span className="font-medium">{formatPrice(taxAndFees)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 text-[#002346]">
              <span>Tổng cộng:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>


            {/* Tạm thời bỏ qua thanh toán */}
        {/* Deposit Info */}
        {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-yellow-800">💰 Tiền cọc cần thanh toán:</p>
          <p className="text-lg font-bold text-[#002346]">{formatPrice(deposit)}</p>
          <p className="text-xs text-gray-600 mt-1">(30% tổng giá trị đơn hàng)</p>
        </div> */}

        {/* Book Button - Updated to navigate to booking page */}
        <Button
          onClick={handleBookNow}
          className="w-full bg-[#eac271] hover:bg-[#d9b05f] text-[#002346] font-bold py-3 text-lg"
        >
          ĐẶT NGAY
        </Button>

        <p className="text-xs text-gray-500 text-center">
          * Giá đã bao gồm thuế và phí dịch vụ
          <br />* Thanh toán cọc 30%, còn lại thanh toán khi nhận phòng
        </p>
      </CardContent>
    </Card>
  )
}
