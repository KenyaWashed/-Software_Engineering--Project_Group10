"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Moon, Receipt, CreditCard } from "lucide-react"

interface SelectedPackage {
  packageId: number
  roomName: string
  packageName: string
  basePrice: number
  quantity: number
}

interface EnhancedBookingSummaryProps {
  selectedPackages: SelectedPackage[]
  bookingData: {
    checkIn: Date | undefined
    checkOut: Date | undefined
    adults: number
    children: number
    nights: number
  }
  onProceedToDetails: () => void
}

export default function EnhancedBookingSummary({
  selectedPackages,
  bookingData,
  onProceedToDetails,
}: EnhancedBookingSummaryProps) {
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

  // Calculate pricing theo chính sách mới
  const calculatePackagePrice = (basePrice: number, quantity: number) => {
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
    return price * quantity
  }

  const packagePrices = selectedPackages.map((pkg) => ({
    ...pkg,
    totalPrice: calculatePackagePrice(pkg.basePrice, pkg.quantity),
  }))

  const subtotal = packagePrices.reduce((sum, pkg) => sum + pkg.totalPrice, 0)
  const serviceCharge = subtotal * 0.02 // 5% service charge
  const vat = subtotal * 0.08 // 8% VAT
  const total = subtotal + serviceCharge + vat
  const deposit = total * 0.5 // 50% deposit

  const totalRooms = selectedPackages.reduce((sum, pkg) => sum + pkg.quantity, 0)
  const totalGuests = bookingData.adults + bookingData.children

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
          <Receipt className="w-5 h-5 mr-2" />
          Tóm tắt đặt phòng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Booking Details */}
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
              <p className="font-semibold text-gray-700">Tổng quan:</p>
              <p className="text-[#002346]">
                {totalRooms} phòng, {totalGuests} khách
              </p>
            </div>
          </div>
        </div>

        {/* Selected Packages */}
        <div>
          <h4 className="font-semibold text-[#002346] mb-3">Phòng đã chọn:</h4>
          <div className="space-y-3">
            {packagePrices.map((pkg, index) => (
              <div key={index} className="border rounded-lg p-3 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-[#002346]">{pkg.roomName}</h5>
                    <p className="text-xs text-gray-600 mb-1">{pkg.packageName}</p>
                    <p className="text-xs text-gray-500">Số lượng: {pkg.quantity} phòng</p>
                    <p className="font-semibold text-[#002346] mt-1">{formatPrice(pkg.totalPrice)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tổng tiền phòng:</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế và phí dịch vụ (10%):</span>
              <span className="font-medium">{formatPrice(vat + serviceCharge)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 text-[#002346]">
              <span>Tổng cộng:</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        {/* Summary Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-blue-800">📋 Tổng tiền: {formatPrice(total)}</p>
          <p className="text-xs text-blue-700 mt-1">
            ({totalRooms} phòng, {totalGuests} khách, {bookingData.nights} đêm)
          </p>
          <div className="mt-2 text-xs text-blue-600">
            <p>✅ Free cancellation</p>
            <p>💰 Thuế và phí dịch vụ đã bao gồm</p>
          </div>
        </div>

        {/* Deposit Info
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <CreditCard className="w-4 h-4 mr-2 text-yellow-600" />
            <p className="text-sm font-semibold text-yellow-800">Số tiền đặt cọc:</p>
          </div>
          <p className="text-lg font-bold text-[#002346]">{formatPrice(deposit)}</p>
          <p className="text-xs text-gray-600 mt-1">(50% tổng giá trị đơn hàng)</p>
        </div> */}

        {/* Continue Button */}
        <Button
          onClick={onProceedToDetails}
          className="w-full bg-[#002346] hover:bg-[#002346]/90 text-white font-bold py-3 text-lg"
        >
          Tiếp tục
        </Button>

        <p className="text-xs text-gray-500 text-center">
          * Giá đã bao gồm thuế và phí dịch vụ
          <br />* Thanh toán cọc 50%, còn lại thanh toán khi nhận phòng
        </p>
      </CardContent>
    </Card>
  )
}
