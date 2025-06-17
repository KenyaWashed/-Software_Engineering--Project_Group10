"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ImageGallery() {
  // Sample gallery images - you can replace with actual hotel images
  const galleryImages = [
    {
      id: 1,
      src: "images/hinhanh/sanhcho.png?height=300&width=400",
      alt: "Royal Hotel Lobby",
      title: "Sảnh khách sạn sang trọng",
    },
    {
      id: 2,
      src: "images/hinhanh/phongviewbien.png?height=300&width=400",
      alt: "Deluxe Room",
      title: "Phòng Deluxe",
    },
    {
      id: 3,
      src: "images/khachsan/hoboi.jpg?height=300&width=400",
      alt: "Swimming Pool",
      title: "Hồ bơi ngoài trời",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const imagesPerPage = 3

  // Calculate total pages
  const totalPages = Math.ceil(galleryImages.length / imagesPerPage)

  // Get current images to display
  const getCurrentImages = () => {
    const startIndex = currentIndex * imagesPerPage
    const endIndex = startIndex + imagesPerPage
    return galleryImages.slice(startIndex, endIndex)
  }

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  // Check if navigation buttons should be shown
  const showNavigation = galleryImages.length > imagesPerPage

  return (
    <div className="relative">
      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {getCurrentImages().map((image) => (
          <div key={image.id} className="group cursor-pointer">
            <div className="h-64 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2 font-medium">{image.title}</p>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showNavigation && (
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="border-[#eac271] text-[#002346] hover:bg-[#eac271] hover:text-white"
            disabled={currentIndex === 0 && totalPages === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Trước
          </Button>

          {/* Page Indicators */}
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-[#eac271]" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Đi đến trang ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="border-[#eac271] text-[#002346] hover:bg-[#eac271] hover:text-white"
            disabled={currentIndex === totalPages - 1 && totalPages === 1}
          >
            Tiếp
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Image Counter */}
      {showNavigation && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Hiển thị {currentIndex * imagesPerPage + 1}-
            {Math.min((currentIndex + 1) * imagesPerPage, galleryImages.length)} trong tổng số {galleryImages.length}{" "}
            ảnh
          </span>
        </div>
      )}
    </div>
  )
}
