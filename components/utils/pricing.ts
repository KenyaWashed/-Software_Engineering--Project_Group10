// Hàm chuẩn hóa tính giá gói phòng khách sạn
// basePrice: giá cơ bản cho 2 khách/đêm
// options: { adults, children, nights, quantity }
export function calculatePackagePrice(
  basePrice: number,
  options: {
    adults: number;
    children: number;
    nights: number;
    quantity?: number; // số lượng phòng, mặc định 1
  }
) {
  const { adults, children, nights, quantity = 1 } = options;
  const totalGuests = adults + children;
  let price = basePrice * nights; // Giá cho 2 khách đầu tiên/1 phòng

  // Phụ thu khách thứ 3 trở đi (tính trên tổng số khách)
  if (totalGuests > 2) {
    const extraGuests = totalGuests - 2;
    price += basePrice * 0.25 * extraGuests * nights;
  }

  // Nếu có ít nhất 1 khách nước ngoài (children > 0), nhân hệ số 1.5
  if (children > 0) {
    price *= 1.5;
  }

  // Tổng cho nhiều phòng
  price *= quantity;

  return price;
}
