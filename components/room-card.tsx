"use client"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Bath, Wifi, Tv, Coffee, Car, Calculator, Minus, Plus } from "lucide-react"

interface Package {
  id: number
  name: string
  benefits: string[]
  originalPrice: number
  discountPrice: number
  available: boolean
}

interface Room {
  id: number
  name: string
  image: string
  area: string
  view: string
  maxGuests: number
  beds: number
  bathrooms: number
  description: string
  amenities: string[]
  packages: Package[]
}

interface BookingData {
  checkIn: Date | undefined
  checkOut: Date | undefined
  adults: number
  children: number
  nights: number
}

interface RoomCardProps {
  room: Room
  onSelectPackage: (
    roomId: number,
    packageData: Package,
    quantity: number,
    guestDistribution?: { adults: number; children: number }[],
  ) => void
  selectedPackage?: any
  bookingData: BookingData
}

export default function RoomCard({ room, onSelectPackage, selectedPackage, bookingData }: RoomCardProps) {
  const [roomQuantity, setRoomQuantity] = useState(1)
  const [guestDistribution, setGuestDistribution] = useState<{ adults: number; children: number }[]>([
    { adults: bookingData.adults, children: bookingData.children },
  ])

  // Reset state when bookingData changes
  useEffect(() => {
    setRoomQuantity(1)
    setGuestDistribution([{ adults: bookingData.adults, children: bookingData.children }])
  }, [bookingData.adults, bookingData.children, bookingData.nights, bookingData.checkIn, bookingData.checkOut])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Update guest distribution when room quantity changes
  const updateGuestDistribution = (newQuantity: number) => {
    if (newQuantity > guestDistribution.length) {
      // Add new rooms with 0 guests
      const newDistribution = []
      for (let i = 0; i < newQuantity; i++) {
        newDistribution.push({ adults: 0, children: 0 })
      }
      setGuestDistribution(newDistribution)
    } else if (newQuantity < guestDistribution.length) {
      // Remove rooms
      setGuestDistribution(guestDistribution.slice(0, newQuantity))
    }
  }

  // Handle room quantity change
  const handleRoomQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, roomQuantity + change)
    setRoomQuantity(newQuantity)
    updateGuestDistribution(newQuantity)
  }

  // Update guest count for a specific room
  const updateGuestCount = (roomIndex: number, type: "adults" | "children", change: number) => {
    const newDistribution = [...guestDistribution]
    const currentValue = newDistribution[roomIndex][type]
    const newValue = Math.max(0, currentValue + change)

    // Check if the new value exceeds max guests per room
    const otherType = type === "adults" ? "children" : "adults"
    const otherValue = newDistribution[roomIndex][otherType]

    if (newValue + otherValue <= room.maxGuests) {
      newDistribution[roomIndex][type] = newValue
      setGuestDistribution(newDistribution)
    }
  }

  // Add a new function to check if each room's guest count is valid
  const validateRoomGuestCounts = useMemo(() => {
    return guestDistribution.map((roomGuests) => {
      const total = roomGuests.adults + roomGuests.children
      return {
        valid: total > 0 && total <= room.maxGuests,
        total,
        message: total === 0 ? "Phòng trống" : total > room.maxGuests ? "Quá số lượng cho phép" : "",
      }
    })
  }, [guestDistribution, room.maxGuests])

  // Calculate total guests across all rooms
  const totalGuests = useMemo(() => {
    return guestDistribution.reduce((sum, room) => sum + room.adults + room.children, 0)
  }, [guestDistribution])

  // Check if total guests matches booking data
  const isGuestCountValid = useMemo(() => {
    const totalAdults = guestDistribution.reduce((sum, room) => sum + room.adults, 0)
    const totalChildren = guestDistribution.reduce((sum, room) => sum + room.children, 0)
    return totalAdults === bookingData.adults && totalChildren === bookingData.children
  }, [guestDistribution, bookingData.adults, bookingData.children])

  // Hotel pricing calculation using saved variables
  const calculateTotalPrice = useMemo(() => {
    return (basePrice: number) => {
      const { nights } = bookingData

      // Calculate price for each room based on its guest distribution
      let totalPrice = 0
      let adultTotalPrice = 0
      let childTotalPrice = 0

      guestDistribution.forEach((room) => {
        const adultPricePerNight = basePrice * room.adults
        const childPricePerNight = basePrice * room.children * 0.5 // 50% for children

        adultTotalPrice += adultPricePerNight * nights
        childTotalPrice += childPricePerNight * nights
        totalPrice += (adultPricePerNight + childPricePerNight) * nights
      })

      return {
        adultTotalPrice,
        childTotalPrice,
        totalPrice,
        totalPricePerNight: totalPrice / nights,
      }
    }
  }, [bookingData, guestDistribution])

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("Wi-Fi")) return <Wifi className="w-4 h-4" />
    if (amenity.includes("TV")) return <Tv className="w-4 h-4" />
    if (amenity.includes("cà phê")) return <Coffee className="w-4 h-4" />
    if (amenity.includes("Dịch vụ")) return <Car className="w-4 h-4" />
    return <div className="w-4 h-4 bg-[#eac271] rounded-full" />
  }

  const isRoomSuitable = totalGuests <= room.maxGuests * roomQuantity

  return (
    <Card className={`overflow-hidden shadow-lg ${!isRoomSuitable ? "opacity-60" : ""}`}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Room Image and Basic Info - Keep this section unchanged */}
          <div>
            <div className="h-64 rounded-lg overflow-hidden mb-4">
              <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-full object-cover" />
            </div>

            <h3 className="text-xl font-bold text-[#002346] mb-2">{room.name}</h3>

            {/* Room Stats */}
            <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Tối đa {room.maxGuests} khách</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bed className="w-4 h-4" />
                <span>{room.beds} giường</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-4 h-4" />
                <span>{room.bathrooms} phòng tắm</span>
              </div>
            </div>

            {!isRoomSuitable && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-600">
                  <strong>Lưu ý:</strong> {roomQuantity > 1 ? `${roomQuantity} phòng loại này` : "Phòng này"} chỉ phù
                  hợp với tối đa {room.maxGuests * roomQuantity} khách. Bạn đã chọn {totalGuests} khách.
                </p>
              </div>
            )}

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p>
                <strong>Diện tích:</strong> {room.area}
              </p>
              <p>
                <strong>Hướng nhìn:</strong> {room.view}
              </p>
              <p>{room.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-[#002346] mb-2">Tiện ích:</h4>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Packages */}
          <div>
            <h4 className="font-semibold text-[#002346] mb-4">Gói dịch vụ:</h4>

            {/* Room Quantity Selector */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h5 className="font-semibold text-[#002346]">Số lượng phòng:</h5>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoomQuantityChange(-1)}
                    className="h-8 w-8 p-0 rounded-full"
                    disabled={roomQuantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[30px] text-center">{roomQuantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRoomQuantityChange(1)}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {roomQuantity > 1 && (
                <div className="space-y-3">
                  <h6 className="font-medium text-sm text-[#002346]">Phân bổ khách:</h6>
                  {guestDistribution.map((roomGuests, index) => {
                    const validation = validateRoomGuestCounts[index]
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${!validation.valid ? "border-red-300 bg-red-50" : "bg-white"}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">Phòng {index + 1}:</span>
                          <span
                            className={`text-xs ${!validation.valid ? "text-red-600 font-medium" : "text-gray-500"}`}
                          >
                            {roomGuests.adults + roomGuests.children}/{room.maxGuests} khách
                            {validation.message && ` - ${validation.message}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-xs mb-1">Người lớn:</div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-md px-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateGuestCount(index, "adults", -1)}
                                className="h-6 w-6 p-0"
                                disabled={roomGuests.adults <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium">{roomGuests.adults}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateGuestCount(index, "adults", 1)}
                                className="h-6 w-6 p-0"
                                disabled={roomGuests.adults + roomGuests.children >= room.maxGuests} 
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs mb-1">Trẻ em:</div>
                            <div className="flex items-center justify-between bg-gray-50 rounded-md px-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateGuestCount(index, "children", -1)}
                                className="h-6 w-6 p-0"
                                disabled={roomGuests.children <= 0}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium">{roomGuests.children}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateGuestCount(index, "children", 1)}
                                className="h-6 w-6 p-0"
                                disabled={roomGuests.adults + roomGuests.children >= room.maxGuests}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {!isGuestCountValid && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                      <p className="text-xs text-yellow-700">
                        <strong>Lưu ý:</strong> Số khách phân bổ cho từng phòng không khớp với số khách đã chọn.
                        (Phân bổ: {guestDistribution.reduce((sum, r) => sum + r.adults, 0)} người lớn,{" "}
                        {guestDistribution.reduce((sum, r) => sum + r.children, 0)} trẻ em. Đã chọn: {bookingData.adults} người lớn, {bookingData.children} trẻ em)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {room.packages.map((pkg) => {
                const pricing = calculateTotalPrice(pkg.discountPrice)
                const originalPricing = calculateTotalPrice(pkg.originalPrice)

                return (
                  <div
                    key={pkg.id}
                    className={`border rounded-lg p-4 ${
                      selectedPackage?.packageId === pkg.id ? "border-[#eac271] bg-[#eac271]/10" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-semibold text-[#002346] mb-1">{pkg.name}</h5>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {pkg.benefits.map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Pricing Breakdown using saved variables */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                      <div className="flex items-center mb-2">
                        <Calculator className="w-4 h-4 mr-2 text-[#002346]" />
                        <span className="font-semibold text-[#002346]">Chi tiết tính giá:</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Người lớn:</span>
                          <span className="font-medium">{formatPrice(pricing.adultTotalPrice)}</span>
                        </div>
                        {bookingData.children > 0 && (
                          <div className="flex justify-between">
                            <span>Trẻ em:</span>
                            <span className="font-medium">{formatPrice(pricing.childTotalPrice)}</span>
                          </div>
                        )}
                        <div className="border-t pt-1 font-semibold">
                          <div className="flex justify-between">
                            <span>
                              Tổng cộng ({roomQuantity} phòng, {bookingData.nights} đêm):
                            </span>
                            <span className="text-[#002346]">{formatPrice(pricing.totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(originalPricing.totalPrice)}
                          </span>
                          <span className="text-lg font-bold text-[#002346]">{formatPrice(pricing.totalPrice)}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Cho {roomQuantity} phòng, {bookingData.nights} đêm, {bookingData.adults} người lớn
                          {bookingData.children > 0 && `, ${bookingData.children} trẻ em`}
                        </p>
                      </div>

                      <div>
                        {pkg.available && isRoomSuitable ? (
                          <Button
                            onClick={() => onSelectPackage(room.id, pkg, roomQuantity, guestDistribution)}
                            className={`${
                              selectedPackage?.packageId === pkg.id
                                ? "bg-[#002346] text-white"
                                : "bg-[#eac271] text-[#002346] hover:bg-[#d9b05f]"
                            }`}
                            disabled={
                              
                              (roomQuantity >= 1 && !isGuestCountValid) ||
                              (roomQuantity > 1 && validateRoomGuestCounts.some((v) => !v.valid))
                            }
                          >
                            {selectedPackage?.packageId === pkg.id ? "Selected" : "Select"}
                          </Button>
                        ) : !isRoomSuitable ? (
                          <Button disabled variant="outline" size="sm">
                            Không phù hợp
                          </Button>
                        ) : (
                          <div className="text-center">
                            <p className="text-sm text-red-600 font-semibold mb-2">Sold out</p>
                            <Button variant="outline" size="sm" className="text-xs">
                              Find Available Day
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
