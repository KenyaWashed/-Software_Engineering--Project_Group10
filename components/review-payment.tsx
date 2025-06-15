"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Shield } from "lucide-react"

interface ReviewPaymentProps {
  onProceedPayment: () => void
  depositAmount: number // thêm prop số tiền cọc
}

export default function ReviewPayment({depositAmount }: ReviewPaymentProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQRUrl] = useState("");

  const handleProceedPayment = () => {
    if (!agreedToTerms) {
      setShowTermsError(true)
      return
    }
    setShowTermsError(false)
    let email = '';
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          email = user.email || '';
        } catch {}
      }
    }
    // Sử dụng prop depositAmount
    const qrUrl = `https://apiqr.web2m.com/api/generate/ACB/41298627/DUONG%20DUC%20HUY?amount=${depositAmount}&memo=hotel%20${encodeURIComponent(email)}&is_mask=0&bg=3`;
    setShowQR(true);
    setQRUrl(qrUrl);
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
          Thanh toán tiền cọc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thông báo tiền cọc */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Bạn cần thanh toán tiền cọc để giữ phòng</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Số tiền cọc: <span className="font-bold text-[#002346]">{depositAmount.toLocaleString('vi-VN')} VNĐ</span> (hoặc tuỳ theo chính sách phòng)</li>
                <li>• Tiền cọc sẽ được trừ vào tổng hóa đơn khi nhận phòng</li>
                <li>• Nếu hủy trước 24h, tiền cọc sẽ được hoàn lại</li>
                <li>• Nếu không đến nhận phòng, tiền cọc sẽ không được hoàn lại</li>
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

        {/* Nút thanh toán tiền cọc */}
        <Button
          onClick={handleProceedPayment}
          className="w-full bg-[#002346] hover:bg-[#002346]/90 text-white font-bold py-4 text-lg"
        >
          Thanh toán tiền cọc
        </Button>
        {/* Modal thanh toán thành công */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-4">Thanh toán thành công!</h3>
              <p className="mb-6 text-gray-700">Cảm ơn bạn đã thanh toán tiền cọc. Đơn đặt phòng của bạn đã được giữ chỗ thành công.</p>
              <Button onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '/';
              }} className="bg-green-600 hover:bg-green-700 text-white w-full">Đóng</Button>
            </div>
          </div>
        )}

        {/* Modal QR Code */}
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold text-[#002346] mb-4">Quét mã QR để thanh toán tiền cọc</h3>
              <img src={qrUrl} alt="QR Code Thanh Toán" width={200} height={230} style={{ borderRadius: 12, margin: '0 auto' }} />
              <Button onClick={() => setShowQR(false)} className="mt-6 bg-[#002346] text-white w-full">Đóng</Button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          Bằng cách nhấn "Thanh toán tiền cọc", bạn xác nhận đã đọc và đồng ý với tất cả các điều khoản
        </p>
      </CardContent>
    </Card>
  )
}
