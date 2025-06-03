"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, Clock, MessageSquare } from "lucide-react"

interface GuestDetailsFormProps {
  onContinue: (guestData: GuestData) => void
  isLoggedIn?: boolean
  userData?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
}

interface GuestData {
  firstName: string
  lastName: string
  email: string
  confirmEmail: string
  phone: string
  arrivalTime: string
  specialRequests: string
}

export default function GuestDetailsForm({ onContinue, isLoggedIn = false, userData }: GuestDetailsFormProps) {
  const [formData, setFormData] = useState<GuestData>({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    confirmEmail: userData?.email || "",
    phone: userData?.phone || "",
    arrivalTime: "",
    specialRequests: "",
  })

  const [errors, setErrors] = useState<Partial<GuestData>>({})

  const handleInputChange = (field: keyof GuestData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<GuestData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "This field is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "This field is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "This field is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = "This field is required"
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Email addresses do not match"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "This field is required"
    }

    if (!formData.arrivalTime) {
      newErrors.arrivalTime = "This field is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onContinue(formData)
    }
  }

  const arrivalTimes = [
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
    "21:00 - 22:00",
    "22:00 - 23:00",
    "Sau 23:00",
  ]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-[#002346] flex items-center">
          <User className="w-5 h-5 mr-2" />
          Your details
        </CardTitle>
        {isLoggedIn && <p className="text-sm text-green-600">✅ Thông tin được tự động điền từ tài khoản của bạn</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Tên <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="firstName"
                  placeholder="Nhập tên"
                  className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={isLoggedIn}
                />
              </div>
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Họ <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="lastName"
                  placeholder="Nhập họ"
                  className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={isLoggedIn}
                />
              </div>
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email Fields */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoggedIn}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmEmail">
              Xác nhận email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="confirmEmail"
                type="email"
                placeholder="Nhập lại email"
                className={`pl-10 ${errors.confirmEmail ? "border-red-500" : ""}`}
                value={formData.confirmEmail}
                onChange={(e) => handleInputChange("confirmEmail", e.target.value)}
                disabled={isLoggedIn}
              />
            </div>
            {errors.confirmEmail && <p className="text-sm text-red-500">{errors.confirmEmail}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="phone"
                placeholder="0987654321"
                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={isLoggedIn}
              />
            </div>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Arrival Time */}
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">
              Giờ dự kiến đến <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.arrivalTime} onValueChange={(value) => handleInputChange("arrivalTime", value)}>
              <SelectTrigger className={`${errors.arrivalTime ? "border-red-500" : ""}`}>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Chọn giờ đến" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {arrivalTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.arrivalTime && <p className="text-sm text-red-500">{errors.arrivalTime}</p>}
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Yêu cầu đặc biệt
              </div>
            </Label>
            <Textarea
              id="specialRequests"
              placeholder="Ví dụ: Giường đôi, tầng cao, gần thang máy..."
              className="min-h-[100px]"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange("specialRequests", e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Chúng tôi sẽ cố gắng đáp ứng yêu cầu của bạn tùy theo tình trạng phòng trống
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-[#002346] hover:bg-[#002346]/90 text-white font-bold py-3 text-lg mt-6"
          >
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
