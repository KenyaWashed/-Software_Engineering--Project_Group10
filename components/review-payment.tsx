"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CreditCard, Shield, Clock } from "lucide-react"

interface ReviewPaymentProps {
  onProceedPayment: () => void
}

export default function ReviewPayment({ onProceedPayment }: ReviewPaymentProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)

  const handleProceedPayment = () => {
    if (!agreedToTerms) {
      setShowTermsError(true)
      return
    }

    setShowTermsError(false)
    onProceedPayment()
  }

  const handleTermsChange = (checked: boolean) => {
    setAgreedToTerms(checked)
    if (checked && showTermsError) {
      setShowTermsError(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-[#002346] flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Late Arrival Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Arriving late?</h4>
              <p className="text-sm text-blue-700">
                Booking guaranteed on day of arrival. Phòng sẽ được giữ cho bạn đến 23:59 ngày nhận phòng. Nếu đến muộn
                hơn, vui lòng liên hệ trước với khách sạn.
              </p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Thông tin quan trọng:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Thanh toán cọc 50% để xác nhận đặt phòng</li>
                <li>• Số tiền còn lại thanh toán khi nhận phòng</li>
                <li>• Miễn phí hủy đặt phòng trước 24 giờ</li>
                <li>• Giá đã bao gồm thuế và phí dịch vụ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-800">Phương thức thanh toán:</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-xs font-medium">Visa</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-xs font-medium">Mastercard</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-xs font-medium">VNPay</div>
            </div>
            <div className="bg-white p-3 rounded border text-center">
              <div className="text-xs font-medium">MoMo</div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={handleTermsChange} className="mt-1" />
            <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              Tôi đã đọc và đồng ý với{" "}
              <a
                href="#"
                className="text-[#002346] hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  // Open terms modal or page
                }}
              >
                điều khoản và điều kiện
              </a>{" "}
              của Royal Hotel, bao gồm chính sách hủy đặt phòng và quy định thanh toán.
            </label>
          </div>

          {showTermsError && <p className="text-sm text-red-500 ml-6">This field is required</p>}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800 mb-1">Bảo mật thanh toán</h4>
              <p className="text-sm text-green-700">
                Thông tin thanh toán của bạn được mã hóa và bảo mật bằng công nghệ SSL 256-bit. Chúng tôi không lưu trữ
                thông tin thẻ tín dụng của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Proceed Payment Button */}
        <Button
          onClick={handleProceedPayment}
          className="w-full bg-[#002346] hover:bg-[#002346]/90 text-white font-bold py-4 text-lg"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Proceed Payment
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Bằng cách nhấn "Proceed Payment", bạn xác nhận đã đọc và đồng ý với tất cả các điều khoản
        </p>
      </CardContent>
    </Card>
  )
}
