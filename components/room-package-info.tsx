"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Bath, Maximize, Eye } from "lucide-react"
import { useState } from "react"
import { calculatePackagePrice } from "@/components/utils/pricing"

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
  images?: string[] // Chỉ dùng images, bỏ image
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
  bookingData: {
    adults: number
    children: number
    nights: number
  }
  selectedPackageId?: number // thêm prop này để chỉ hiển thị package đã chọn
}

export default function RoomPackageInfo({
  room,
  bookingData,
  selectedPackageId,
}: RoomPackageInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0)
  const images = room.images && room.images.length > 0 ? room.images : ["/placeholder.svg"]

  const handlePrev = () => setGalleryIndex((prev) => (prev - 1 + images.length) % images.length)
  const handleNext = () => setGalleryIndex((prev) => (prev + 1) % images.length)

  return (
    <Card className="bg-[#f9eed7] border-none shadow-lg">
      <CardContent className="p-6">
        {/* Room Header */}
        <div className="mb-6">
          {/* Gallery ảnh */}
          <div className="relative h-56 rounded-lg overflow-hidden mb-4 bg-gray-200">
            <img
              src={images[galleryIndex] || "/placeholder.svg"}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow"
                  onClick={handlePrev}
                  type="button"
                  aria-label="Previous image"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#002346" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 shadow"
                  onClick={handleNext}
                  type="button"
                  aria-label="Next image"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#002346" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {/* Dot indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`inline-block w-2 h-2 rounded-full ${galleryIndex === idx ? 'bg-[#002346]' : 'bg-white/70 border border-[#002346]'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <h3 className="text-xl font-bold text-[#002346] mb-3">{room.name}</h3>

          {/* Room Icons */}
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
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

          <p className="text-sm text-gray-600 mb-2">{room.description}</p>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-2">
            {room.amenities.map((amenity, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Package Options */}
        <div className="space-y-4">
          <h4 className="font-semibold text-[#002346] text-lg">Gói dịch vụ bạn chọn:</h4>

          {room.packages
            .filter(pkg => !selectedPackageId || pkg.id === selectedPackageId)
            .map((pkg) => {
              const pricing = calculatePackagePrice({
                basePrice: pkg.discountPrice,
                nights: bookingData.nights,
                adults: bookingData.adults,
                children: bookingData.children,
                quantity: 1,
              })
              const originalPricing = calculatePackagePrice({
                basePrice: pkg.originalPrice,
                nights: bookingData.nights,
                adults: bookingData.adults,
                children: bookingData.children,
                quantity: 1,
              })

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
                      <span className="text-sm text-gray-500 line-through">{formatPrice(originalPricing.packageTotal)}</span>
                      <span className="text-xl font-bold text-[#002346]">{formatPrice(pricing.packageTotal)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Cho {bookingData.nights} đêm, {bookingData.adults} nội địa
                      {bookingData.children > 0 && `, ${bookingData.children} nước ngoài`}
                    </p>
                  </div>
                </div>
              )
            })}
        </div>
      </CardContent>
    </Card>
  )
}
