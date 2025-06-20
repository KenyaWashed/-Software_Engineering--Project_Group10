"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon, Minus, Plus, Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BookingData {
  checkIn: Date | undefined
  checkOut: Date | undefined
  adults: number
  children: number
  nights: number
}

interface BookingWidgetProps {
  onBookingChange?: (data: BookingData) => void
  initialData?: Partial<BookingData>
}

export default function BookingWidget({ onBookingChange, initialData }: BookingWidgetProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Add this state variable at the top of the component:
  const [isDataUpdating, setIsDataUpdating] = useState(false)

  // Initialize state with URL params or initial data
  const [checkInDate, setCheckInDate] = useState<Date>(() => {
    if (initialData?.checkIn) return initialData.checkIn
    const checkInParam = searchParams.get("checkIn")
    return checkInParam ? new Date(checkInParam) : undefined
  })

  const [checkOutDate, setCheckOutDate] = useState<Date>(() => {
    if (initialData?.checkOut) return initialData.checkOut
    const checkOutParam = searchParams.get("checkOut")
    return checkOutParam ? new Date(checkOutParam) : undefined
  })

  const [adults, setAdults] = useState(() => {
    if (initialData?.adults) return initialData.adults
    const adultsParam = searchParams.get("adults")
    return adultsParam ? Number.parseInt(adultsParam) : 2
  })

  const [children, setChildren] = useState(() => {
    if (initialData?.children) return initialData.children
    const childrenParam = searchParams.get("children")
    return childrenParam ? Number.parseInt(childrenParam) : 0
  })

  // Function to format date to Vietnamese format
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Calculate number of nights based on hotel policy
  const calculateNights = useCallback((checkIn: Date | undefined, checkOut: Date | undefined) => {
    if (!checkIn || !checkOut) return 1

    const checkInTime = new Date(checkIn)
    checkInTime.setHours(12, 30, 0, 0) // 12:30 PM

    const checkOutTime = new Date(checkOut)
    checkOutTime.setHours(12, 0, 0, 0) // 12:00 PM

    const timeDiff = checkOutTime.getTime() - checkInTime.getTime()
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

    return nights > 0 ? nights : 1
  }, [])

  const nights = calculateNights(checkInDate, checkOutDate)

  // Add this useEffect after the existing useEffect for onBookingChange
  useEffect(() => {
    // Real-time validation and data sync
    if (checkInDate && checkOutDate) {
      const calculatedNights = calculateNights(checkInDate, checkOutDate)
      if (calculatedNights !== nights) {
        // Update nights if dates changed
        console.log("Nights updated from", nights, "to", calculatedNights)
      }
    }
  }, [checkInDate, checkOutDate, adults, children])

  // Function to create URL with booking parameters
  const createBookingURL = () => {
    const params = new URLSearchParams()

    if (checkInDate) {
      params.set("checkIn", checkInDate.toISOString())
    }
    if (checkOutDate) {
      params.set("checkOut", checkOutDate.toISOString())
    }
    params.set("adults", adults.toString())
    params.set("children", children.toString())
    params.set("nights", nights.toString())

    return `/phong?${params.toString()}`
  }

  // Function to handle booking submission and navigation
  const handleBookingSubmit = () => {
    if (adults == 0 &&  children == 0) {
      alert("Vui lòng chọn ít nhất 1 khách!")
      return
    }

    if (!checkInDate || !checkOutDate) {
      alert("Vui lòng chọn ngày nhận phòng và trả phòng!")
      return
    }
    if (checkOutDate <= checkInDate) {
      alert("Ngày trả phòng phải sau ngày nhận phòng!")
      return
    }
    const bookingData = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults,
      children,
      nights,
      totalGuests: adults + children,
    }

    console.log("Navigating to rooms page with data:", bookingData)

    // Update parent component only when search button is clicked
    if (onBookingChange) {
      onBookingChange(bookingData)
      console.log("Booking data updated on search:", bookingData)
    }

    // Navigate to rooms page with URL parameters
    const bookingURL = createBookingURL()
    console.log("Navigation URL:", bookingURL)

    // First navigate to the rooms page
    router.push(bookingURL)
  }

  // Function to reset all booking data
  const resetBookingData = useCallback(() => {
    setCheckInDate(undefined)
    setCheckOutDate(undefined)
    setAdults(2)
    setChildren(0)
  }, [])

  return (
    <Card className="relative z-10 bg-[#002346] text-white p-6 rounded-lg shadow-xl max-w-6xl mx-4">
      {/* Add a warning message at the top of the card */}
      <div className="absolute -top-10 left-0 right-0 text-center">
        <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full inline-block shadow-sm">
          Lưu ý: Thay đổi thông tin và ấn "TÌM PHÒNG" để cập nhật
        </div>
      </div>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Check-in Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">NGÀY NHẬN PHÒNG</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal bg-white text-black hover:bg-gray-50 rounded-full",
                    !checkInDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? formatDate(checkInDate) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-300 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Từ 12:30 trưa
            </p>
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium block">NGÀY TRẢ PHÒNG</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal bg-white text-black hover:bg-gray-50 rounded-full",
                    !checkOutDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? formatDate(checkOutDate) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => date < (checkInDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-300 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Trước 12:00 trưa
            </p>
          </div>

          {/* Adults */}
          <div className="space-y-2">
            <label className="text-sm font-medium block text-center w-full">NỘI ĐỊA</label>
            <div className="flex items-center justify-between bg-white text-black h-12 px-3 rounded-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAdults(Math.max(0, adults - 1))}
                className="h-6 w-6 p-0 text-black hover:bg-gray-100 rounded-full"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium min-w-[20px] text-center">{adults}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAdults(adults + 1)}
                className="h-6 w-6 p-0 text-black hover:bg-gray-100 rounded-full"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-4"></div>
          </div>

          {/* Children */}
          <div className="space-y-2">
            <label className="text-sm font-medium block text-center w-full">NƯỚC NGOÀI</label>
            <div className="flex items-center justify-between bg-white text-black h-12 px-3 rounded-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="h-6 w-6 p-0 text-black hover:bg-gray-100 rounded-full"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-sm font-medium min-w-[20px] text-center">{children}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChildren(children + 1)}
                className="h-6 w-6 p-0 text-black hover:bg-gray-100 rounded-full"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="h-4"></div>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <div className="h-6"></div>
            <Button
              onClick={handleBookingSubmit}
              className="w-full h-12 bg-white text-[#002346] hover:bg-gray-100 rounded-full font-medium transition-colors"
            >
              TÌM PHÒNG
            </Button>
            <div className="flex justify-center">
              <button
                onClick={resetBookingData}
                className="text-xs text-gray-300 hover:text-white underline mt-1"
                type="button"
              >
                Làm mới thông tin
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Booking Summary Display with Real-time Updates */}
        {checkInDate && checkOutDate && (
          <div className="mt-6 text-center">
            <div className="bg-white/10 px-4 py-3 rounded-full inline-block">
              <div className="text-sm space-y-1">
                <div className="font-semibold">
                  {nights} đêm • {adults + children} khách
                </div>
                <div className="text-xs opacity-90">
                  {adults} nội địa{children > 0 && `, ${children} nước ngoài`}
                </div>
                <div className="text-xs opacity-75">
                  Từ {formatDate(checkInDate)} 12:30 → {formatDate(checkOutDate)} 12:00
                </div>
                <div className="text-xs opacity-60 mt-1">Ấn 'TÌM PHÒNG' để cập nhật</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
