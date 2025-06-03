"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Bath, Maximize, Eye, Minus, Plus } from "lucide-react"

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

interface RoomPackageInfoProps {
  room: Room
  selectedPackages: { [packageId: number]: number } // packageId -> quantity
  onPackageSelect: (packageId: number, quantity: number) => void
  bookingData: {
    adults: number
    children: number
    nights: number
  }
}

export default function RoomPackageInfo({
  room,
  selectedPackages,
  onPackageSelect,
  bookingData,
}: RoomPackageInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const calculatePackagePrice = (basePrice: number) => {
    const { adults, children, nights } = bookingData
    const adultPrice = basePrice * adults * nights
    const childPrice = basePrice * children * 0.5 * nights
    return adultPrice + childPrice
  }

  return (
    <Card className="bg-[#f9eed7] border-none shadow-lg">
      <CardContent className="p-6">
        {/* Room Header */}
        <div className="mb-6">
          <div className="h-48 rounded-lg overflow-hidden mb-4">
            <img src={room.image || "/placeholder.svg"} alt={room.name} className="w-full h-full object-cover" />
          </div>

          <h3 className="text-xl font-bold text-[#002346] mb-3">{room.name}</h3>

          {/* Room Icons */}
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{room.maxGuests}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{room.beds}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-4 h-4" />
              <span>{room.bathrooms}</span>
            </div>
          </div>

          {/* Room Details */}
          <div className="space-y-1 text-sm text-gray-700 mb-4">
            <div className="flex items-center space-x-2">
              <Maximize className="w-4 h-4" />
              <span>Diện tích: {room.area}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Hướng nhìn: {room.view}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600">{room.description}</p>
        </div>

        {/* Package Options */}
        <div className="space-y-4">
          <h4 className="font-semibold text-[#002346] text-lg">Gói dịch vụ:</h4>

          {room.packages.map((pkg) => {
            const totalPrice = calculatePackagePrice(pkg.discountPrice)
            const originalTotalPrice = calculatePackagePrice(pkg.originalPrice)
            const currentQuantity = selectedPackages[pkg.id] || 0

            return (
              <div key={pkg.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="mb-3">
                  <h5 className="font-semibold text-[#002346] mb-2">{pkg.name}</h5>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pkg.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-500 line-through">{formatPrice(originalTotalPrice)}</span>
                    <span className="text-xl font-bold text-[#002346]">{formatPrice(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Cho {bookingData.nights} đêm, {bookingData.adults} người lớn
                    {bookingData.children > 0 && `, ${bookingData.children} trẻ em`}
                  </p>
                </div>

                {/* Quantity Selector */}
                {pkg.available ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Số lượng phòng:</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPackageSelect(pkg.id, Math.max(0, currentQuantity - 1))}
                        className="h-8 w-8 p-0 rounded-full"
                        disabled={currentQuantity === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="text-lg font-semibold min-w-[30px] text-center">{currentQuantity}</span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPackageSelect(pkg.id, currentQuantity + 1)}
                        className="h-8 w-8 p-0 rounded-full"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-red-600 font-semibold mb-2">Hết phòng</p>
                    <Button variant="outline" size="sm" className="text-xs">
                      Tìm ngày khác
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
