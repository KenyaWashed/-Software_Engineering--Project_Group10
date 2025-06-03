"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
}

export default function BackButton({ className = "", variant = "outline" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Button onClick={handleBack} variant={variant} className={`flex items-center space-x-2 ${className}`}>
      <ArrowLeft className="h-4 w-4" />
      <span>Quay lại</span>
    </Button>
  )
}
