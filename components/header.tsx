"use client"
import { Button } from "@/components/ui/button"
import { Users, LogOut } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) setUser(JSON.parse(userStr))
      else setUser(null)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.reload()
  }

  return (
    <header className="bg-[#eac271] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#002346]">
          {user ? (
            <>
              
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center space-x-1 text-xs text-[#002346] hover:underline focus:outline-none bg-transparent border-0 shadow-none"
                style={{ fontWeight: 500 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
              <span className="flex items-center space-x-1 font-semibold">
                <Users className="w-4 h-4" />
                <span>{user.fullName || user.username}</span>
              </span>
            </>
          ) : (
            <Link href="/dang-nhap" className="flex items-center space-x-1 hover:text-[#002346]/80">
              <Users className="w-4 h-4" />
              <span>ĐĂNG NHẬP</span>
            </Link>
          )}
          <Link href="/phong" className="hover:text-[#002346]/80">
            PHÒNG
          </Link>
          <Link href="#" className="hover:text-[#002346]/80">
            NHÀ HÀNG & ẨM THỰC
          </Link>
        </nav>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="w-12 h-12 bg-[#002346] rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-[#eac271] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#002346] rounded-full"></div>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#002346]">
          <Link href="#" className="hover:text-[#002346]/80">
            TIỆN ÍCH
          </Link>
          <Link href="#" className="hover:text-[#002346]/80">
            ƯU ĐÃI
          </Link>
          <Link href="/phong">
            <Button className="bg-[#002346] text-white hover:bg-[#002346]/90 px-6">ĐẶT NGAY</Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
