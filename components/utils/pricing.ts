// Hàm tính giá cho từng package/phòng
export function calculatePackagePrice({
  basePrice,
  nights,
  adults,
  children,
  quantity = 1,
}: {
  basePrice: number
  nights: number
  adults: number
  children: number
  quantity?: number
}) {
  const totalGuests = adults + children
  let price = basePrice * nights // Giá cho 2 khách đầu tiên
  let extraCharge = 0
  if (totalGuests > 2) {
    extraCharge = basePrice * 0.25 * (totalGuests - 2) * nights
    price += extraCharge
  }
  let hasForeign = false
  if (children > 0) {
    price *= 1.5
    hasForeign = true
  }
  return {
    baseTotal: basePrice * nights * quantity,
    extraCharge: extraCharge * quantity,
    hasForeign,
    packageTotal: price * quantity,
  }
}

// Hàm tổng hợp tính tổng tiền, thuế/phí, deposit
export function calculateBookingTotals({
  selectedPackages,
  bookingData,
  taxRate = 0.1, // 10% mặc định
  depositRate = 0.5, // 50% mặc định
}: {
  selectedPackages: Array<{
    basePrice: number
    quantity?: number
  }>
  bookingData: {
    nights: number
    adults: number
    children: number
  }
  taxRate?: number
  depositRate?: number
}) {
  // Tính tổng từng package
  const packagePrices = selectedPackages.map(pkg =>
    calculatePackagePrice({
      basePrice: pkg.basePrice,
      nights: bookingData.nights,
      adults: bookingData.adults,
      children: bookingData.children,
      quantity: pkg.quantity || 1,
    })
  )
  const subtotal = packagePrices.reduce((sum, pkg) => sum + pkg.packageTotal, 0)
  const taxAndFees = subtotal * taxRate
  const total = subtotal + taxAndFees
  const deposit = total * depositRate
  return {
    subtotal,
    taxAndFees,
    total,
    deposit,
    packagePrices,
  }
}
