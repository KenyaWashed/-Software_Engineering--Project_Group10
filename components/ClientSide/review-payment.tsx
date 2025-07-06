"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

interface ReviewPaymentProps {
  onProceedPayment: () => void
  depositAmount: number // vẫn giữ prop để không lỗi, nhưng không dùng nữa
  email: string // vẫn giữ prop để không lỗi, nhưng không dùng nữa
}

export default function ReviewPayment({ onProceedPayment }: ReviewPaymentProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-[#002346] flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Xác nhận đặt phòng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Thông báo xác nhận */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Bạn xác nhận đặt phòng với thông tin đã nhập</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sau khi xác nhận, đơn đặt phòng sẽ được gửi đi và chờ xác nhận từ khách sạn.</li>
                <li>• Bạn sẽ nhận được email xác nhận đặt phòng (nếu có).</li>
                <li>• Nếu cần thay đổi, vui lòng liên hệ bộ phận lễ tân.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nút xác nhận đặt phòng */}
        <Button
          onClick={onProceedPayment}
          className="w-full bg-[#002346] hover:bg-[#002346]/90 text-white font-bold py-4 text-lg"
        >
          Xác nhận đặt phòng
        </Button>
        <p className="text-xs text-gray-500 text-center">
          Bằng cách nhấn "Xác nhận đặt phòng", bạn đồng ý với các điều khoản của Royal Hotel.
        </p>
      </CardContent>
    </Card>
  )
}
