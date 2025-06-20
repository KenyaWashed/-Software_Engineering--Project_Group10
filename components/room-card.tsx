"use client"
import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Bed, Bath, Wifi, Tv, Coffee, Car, Calculator, Minus, Plus } from "lucide-react"
import { calculatePackagePrice } from "@/components/utils/pricing"
import type { RoomType, RoomPackage } from "@/lib/room.types"
import { useSurchargePoliciesOnce } from "@/hooks/useSurchargePolicyStore";

interface BookingData {
  checkIn: Date | undefined
  checkOut: Date | undefined
  adults: number
  children: number
  nights: number
}

interface RoomCardProps {
  room: RoomType
  onSelectPackage: (
    roomId: number,
    packageData: RoomPackage,
    guestDistribution?: { adults: number; children: number }[],
  ) => void
  selectedPackage?: any
  bookingData: BookingData
}

export default function RoomCard({ room, onSelectPackage, selectedPackage, bookingData }: RoomCardProps) {
  const [guestDistribution, setGuestDistribution] = useState<{ adults: number; children: number }[]>(
    [{ adults: bookingData.adults, children: bookingData.children }],
  )
  const { policies, loading: policyLoading, error: policyError } = useSurchargePoliciesOnce();
  // Lấy giá trị phụ thu từ policies
  const extraSurcharge = policies.find(p => p.policy_short_name === "KH3")?.policy_value ?? 0;
  const foreignSurcharge = policies.find(p => p.policy_short_name === "KNN")?.policy_value ?? 0;
  
  const [currentImage, setCurrentImage] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const totalImages = room.images.length

  useEffect(() => {
    setGuestDistribution([{ adults: bookingData.adults, children: bookingData.children }])
  }, [bookingData.adults, bookingData.children, bookingData.nights, bookingData.checkIn, bookingData.checkOut])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
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

  // Hotel pricing calculation using shared utils
  const getPricing = (basePrice: number) => {
    // Tổng số khách
    const totalGuests = guestDistribution.reduce((sum, room) => sum + room.adults + room.children, 0);
    // Sử dụng utils cho logic chuẩn
    return calculatePackagePrice({
      basePrice,
      nights: bookingData.nights,
      adults: totalGuests - guestDistribution.reduce((sum, room) => sum + room.children, 0),
      children: guestDistribution.reduce((sum, room) => sum + room.children, 0),
      quantity: 1,
    });
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes("Wi-Fi")) return <Wifi className="w-4 h-4" />
    if (amenity.includes("TV")) return <Tv className="w-4 h-4" />
    if (amenity.includes("cà phê")) return <Coffee className="w-4 h-4" />
    if (amenity.includes("Dịch vụ")) return <Car className="w-4 h-4" />
    return <div className="w-4 h-4 bg-[#eac271] rounded-full" />
  }

  const isRoomSuitable = totalGuests <= room.maxGuests

  const handlePrevImage = () => setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages)
  const handleNextImage = () => setCurrentImage((prev) => (prev + 1) % totalImages)

  return (
    <Card className={`overflow-hidden shadow-lg ${!isRoomSuitable ? "opacity-60" : ""}`}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Room Image and Basic Info */}
          <div>
            <div className="h-64 rounded-lg overflow-hidden mb-4 relative group cursor-pointer" onClick={() => setShowModal(true)}>
              {room.images && room.images.length > 0 ? (
                <Image
                // đường dẫn: "/images/typeRoom" + room.id + "/room.images[currentImage]"
                  src={"/images/typeRoom" + room.id + "/" + "1" + ".jpg"}
                  alt={room.name}
                  width={400}
                  height={256}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={currentImage === 0}
                />
              ) : (
                <Image
                  src="/placeholder.svg"
                  alt="No image"
                  width={400}
                  height={256}
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
              {totalImages > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white"
                    onClick={e => { e.stopPropagation(); handlePrevImage(); }}
                    aria-label="Previous image"
                    type="button"
                  >
                    <span className="text-2xl font-bold">&#60;</span>
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white"
                    onClick={e => { e.stopPropagation(); handleNextImage(); }}
                    aria-label="Next image"
                    type="button"
                  >
                    <span className="text-2xl font-bold">&#62;</span>
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {room.images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`inline-block w-2 h-2 rounded-full ${idx === currentImage ? "bg-[#eac271]" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Modal for zoomed image */}
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowModal(false)}>
                <div className="relative max-w-2xl w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                  <Image
                    src={room.images[currentImage]}
                    alt={room.name}
                    width={800}
                    height={500}
                    className="rounded-lg object-contain max-h-[80vh] bg-white"
                    priority
                  />
                  <button
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                    onClick={() => setShowModal(false)}
                    aria-label="Đóng"
                  >
                    <span className="text-xl font-bold">×</span>
                  </button>
                  {totalImages > 1 && (
                    <div className="flex gap-2 mt-4">
                      <button
                        className="bg-white/80 rounded-full p-2 shadow hover:bg-white"
                        onClick={() => setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages)}
                        aria-label="Previous image"
                        type="button"
                      >
                        <span className="text-2xl font-bold">&#60;</span>
                      </button>
                      <button
                        className="bg-white/80 rounded-full p-2 shadow hover:bg-white"
                        onClick={() => setCurrentImage((prev) => (prev + 1) % totalImages)}
                        aria-label="Next image"
                        type="button"
                      >
                        <span className="text-2xl font-bold">&#62;</span>
                      </button>
                    </div>
                  )}
                  <div className="flex gap-1 mt-2">
                    {room.images.map((_, idx) => (
                      <span
                        key={idx}
                        className={`inline-block w-2 h-2 rounded-full ${idx === currentImage ? "bg-[#eac271]" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                  <strong>Lưu ý:</strong> Phòng này chỉ phù
                  hợp với tối đa {room.maxGuests} khách. Bạn đã chọn {totalGuests} khách.
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
            <div className="space-y-4">
              {room.packages.map((pkg) => {
                const pricing = getPricing(pkg.discountPrice)
                const originalPricing = getPricing(pkg.originalPrice)

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

                    {/* Detailed Pricing Breakdown using shared utils */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                      <div className="flex items-center mb-2">
                        <Calculator className="w-4 h-4 mr-2 text-[#002346]" />
                        <span className="font-semibold text-[#002346]">Chi tiết tính giá:</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Giá cơ bản cho 2 khách:</span>
                          <span className="font-medium">{formatPrice(pricing.baseTotal)}</span>
                        </div>
                        {pricing.extraCharge > 0 && (
                          <div className="flex justify-between">
                            <span>Phụ thu khách thứ 3 trở đi ({extraSurcharge * 100}%/khách):</span>
                            <span className="font-medium">{formatPrice(pricing.extraCharge)}</span>
                          </div>
                        )}
                        {pricing.hasForeign && (
                          <div className="flex justify-between">
                            <span>Hệ số khách nước ngoài (x{1 + foreignSurcharge}):</span>
                            <span className="font-medium">x {1 + foreignSurcharge}</span>
                          </div>
                        )}
                        <div className="border-t pt-1 font-semibold">
                          <div className="flex justify-between">
                            <span>Tổng cộng:</span>
                            <span className="text-[#002346]">{formatPrice(pricing.packageTotal)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(originalPricing.packageTotal)}
                          </span>
                          <span className="text-lg font-bold text-[#002346]">{formatPrice(pricing.packageTotal)}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Cho {bookingData.nights} đêm, {bookingData.adults} nội địa
                          {bookingData.children > 0 && `, ${bookingData.children} nước ngoài`}
                        </p>
                      </div>

                      <div>
                        {pkg.available && isRoomSuitable ? (
                          <Button
                            onClick={() => onSelectPackage(room.id, pkg, guestDistribution)}
                            className={`${
                              selectedPackage?.packageId === pkg.id
                                ? "bg-[#002346] text-white"
                                : "bg-[#eac271] text-[#002346] hover:bg-[#d9b05f]"
                            }`}
                            disabled={
                              (!isGuestCountValid) ||
                              (validateRoomGuestCounts.some((v) => !v.valid))
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
                            <Button variant="outline" size="sm" className="text-xs" onClick={() => {
                              if (typeof window !== 'undefined') {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }}>
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
