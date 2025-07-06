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
import { register } from "@/lib/auth/register"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: ""
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    if (!form.fullName) return "Vui lòng nhập họ và tên"
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "Email không hợp lệ"
    if (!form.phone) return "Vui lòng nhập số điện thoại"
    if (!/^\d+$/.test(form.phone)) return "Số điện thoại chỉ được chứa các chữ số"
    if (form.phone.length !== 10) return "Số điện thoại phải có đúng 10 chữ số"
    if (!form.password) return "Vui lòng nhập mật khẩu"
    if (form.password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự"
    if (!/\d/.test(form.password)) return "Mật khẩu phải chứa ít nhất 1 số"
    if (form.password !== form.confirmPassword) return "Mật khẩu xác nhận không khớp!"
    return null
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }
    try {
      const data = await register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phone: form.phone
      })
      console.log('Kết quả đăng ký:', data);
      if (data && !data.error && !data.errors) {
        setSuccess("Đăng ký thành công! Bạn có thể đăng nhập.")
        setError("")
        await new Promise((resolve) => setTimeout(resolve, 800))
        setTimeout(() => {
          router.push("/ClientSide/login")
        }, 1500)
      } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        setError(data.errors[0].msg || "Đăng ký thất bại!")
        setSuccess("")
      } else {
        setError(data.error || data.message || "Đăng ký thất bại!")
        setSuccess("")
      }
    } catch (err) {
      setError("Lỗi kết nối server!")
      setSuccess("")
    } finally {
      setLoading(false)
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
                    value={form.fullName}
                    onChange={handleChange}
                    disabled={loading}
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
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
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
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loading}
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
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
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
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
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
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-0">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link href="/ClientSide/login" className="text-[#002346] font-medium hover:underline">
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
