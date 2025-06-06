"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react"
import Link from "next/link"
import BackButton from "@/components/back-button"
import { users } from "@/lib/mock-database"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (!agreeTerms) {
      setError("Vui lòng đồng ý với điều khoản dịch vụ")
      return
    }

    setIsLoading(true)

    try {
      // Kiểm tra trùng email hoặc phone trong mock database
      const emailExists = users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())
      const phoneExists = users.some(u => u.phone === formData.phone)
      await new Promise((resolve) => setTimeout(resolve, 800))
      if (emailExists) {
        setError("Email đã được sử dụng")
        setIsLoading(false)
        return
      }
      if (phoneExists) {
        setError("Số điện thoại đã được sử dụng")
        setIsLoading(false)
        return
      }
      // Thêm user mới vào mock database (chỉ trên RAM, reload sẽ mất)
      users.push({
        id: users.length + 1,
        username: formData.email.split("@")[0],
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: "user"
      })
      console.log("User list after register:", users)
      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...")
      setTimeout(() => {
        router.push("/dang-nhap")
      }, 1500)
      return
    } catch (err) {
      setError("Đăng ký thất bại. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f9eed7]">
      <Header />

      <div className="max-w-7xl mx-auto w-full px-4 py-4">
        <div className="absolute top-20 left-4 md:left-8 z-10">
          <BackButton className="border-[#002346] text-[#002346] hover:bg-[#002346] hover:text-white" />
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center bg-[#002346] text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">ĐĂNG KÝ TÀI KHOẢN</CardTitle>
            <CardDescription className="text-gray-300">
              Tạo tài khoản để trải nghiệm dịch vụ của Royal Hotel
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
              {success && <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">{success}</div>}

              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Nguyễn Văn A"
                    className="pl-10 rounded-full"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10 rounded-full"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="0987654321"
                    className="pl-10 rounded-full"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 rounded-full"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 rounded-full"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-[#002346] hover:underline">
                    điều khoản dịch vụ
                  </a>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#eac271] hover:bg-[#d9b05f] text-[#002346] font-bold rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-0">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link href="/dang-nhap" className="text-[#002346] font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
