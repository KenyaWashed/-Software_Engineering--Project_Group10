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
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import BackButton from "@/components/back-button"
import { login } from "@/lib/auth/login"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    setIsLoading(true)

    try {
      console.log('Đăng nhập với:', { email, password, rememberMe });
      const result = await login({ email, password, rememberMe });
      console.log('Kết quả trả về:', result);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Kiểm tra lỗi trả về từ API
      if (!result || result.error || (Array.isArray(result.errors) && result.errors.length > 0)) {
        // Nếu có mảng errors, lấy thông báo đầu tiên
        if (Array.isArray(result.errors) && result.errors.length > 0) {
          setError(result.errors[0].msg || "Email hoặc mật khẩu không đúng");
        } else {
          setError(result.error || "Email hoặc mật khẩu không đúng");
        }
        setIsLoading(false);
        return;
      }

      if (result.user && result.user.role === "admin") {
        router.push("/admin/dashboard"); // chuyển sang dashboard admin nội bộ
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
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
            <CardTitle className="text-2xl font-bold">ĐĂNG NHẬP</CardTitle>
            <CardDescription className="text-gray-300">
              Đăng nhập để trải nghiệm dịch vụ của Royal Hotel
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10 rounded-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <a href="#" className="text-sm text-[#002346] hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 rounded-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#eac271] hover:bg-[#d9b05f] text-[#002346] font-bold rounded-full"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-[#002346] text-[#002346] hover:bg-[#002346] hover:text-white rounded-full"
              onClick={() => router.push("/ClientSide/register")}
            >
              Tạo tài khoản mới
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
