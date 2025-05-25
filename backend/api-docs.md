### GET /room
- Description: Xem danh sách tất cả phòng
- Body: trả về json danh sách: thông tin từng phòng
- Có thể lọc với 3 điều kiện: trạng thái, giá thấp nhất, giá cáo nhất (mỗi điều kiện là riêng lẽ có thể không bắt buôc nhưng phải đúng thứ tự)
- ví dụ: http://localhost:3000/room?status=Trống&priceMin=170000&priceMax=200000
