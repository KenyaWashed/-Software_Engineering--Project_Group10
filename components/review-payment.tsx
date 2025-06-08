"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Shield, Clock } from "lucide-react"

interface ReviewPaymentProps {
  onProceedPayment: () => void
}

export default function ReviewPayment({ onProceedPayment }: ReviewPaymentProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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
              <h4 className="font-semibold text-blue-800 mb-1">Đến muộn?</h4>
              <p className="text-sm text-blue-700">
                Phòng sẽ được giữ cho bạn đến 23:59 ngày nhận phòng. Nếu đến muộn
                hơn, vui lòng liên hệ trước với khách sạn.
              </p>
            </div>
          </div>
        </div>

        {/* Thông báo xác nhận đặt phòng */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Xác nhận đặt phòng</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Bạn chỉ cần xác nhận để hoàn tất đặt phòng</li>
                <li>• Không cần thanh toán trước, thanh toán tại khách sạn khi nhận phòng</li>
                <li>• Miễn phí hủy đặt phòng trước 24 giờ</li>
                <li>• Giá đã bao gồm thuế và phí dịch vụ</li>
                <li>• Mọi thắc mắc vui lòng liên hệ lễ tân khách sạn</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Điều khoản và xác nhận */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={handleTermsChange} className="mt-1" />
            <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              Tôi đã đọc và đồng ý với{' '}
              <a
                href="#"
                className="text-[#002346] hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  // Open terms modal or page
                }}
              >
                điều khoản và điều kiện
              </a>{' '}
              của Royal Hotel, bao gồm chính sách hủy đặt phòng và quy định lưu trú.
            </label>
          </div>

          {showTermsError && <p className="text-sm text-red-500 ml-6">Bạn cần đồng ý với điều khoản để tiếp tục</p>}
        </div>

        {/* Nút xác nhận đặt phòng */}
        <Button
          onClick={() => setShowSuccessModal(true)}
          className="w-full bg-[#002346] hover:bg-[#002346]/90 text-white font-bold py-4 text-lg"
        >
          Xác nhận đặt phòng
        </Button>
        {/* Modal xác nhận thành công */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Đặt phòng thành công!</h3>
              <p className="mb-6 text-gray-700">Cảm ơn bạn đã đặt phòng tại Royal Hotel. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
              <Button onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '/';
              }} className="bg-green-600 hover:bg-green-700 text-white w-full">Đóng</Button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          Bằng cách nhấn "Xác nhận đặt phòng", bạn xác nhận đã đọc và đồng ý với tất cả các điều khoản
        </p>
      </CardContent>
    </Card>
  )
}
