### GET /room
- Mô tả: Xem danh sách tất cả phòng
- Bộ lọc (bỏ qua để xem tất cả phòng):
  - status: trạng thái phòng (Trống, Đang sử dụng, Đang dọn)
  - priceMin: giá thấp nhất
  - priceMax: giá cao nhất
- Lưu ý: Các điều kiện lọc không bắt buộc, nhưng nếu dùng thì phải theo đúng thứ tự: status → priceMin → priceMax
- Trả về: JSON danh sách các phòng
- Ví dụ:\
  http://localhost:3000/room\
  http://localhost:3000/room?status=Trống&priceMin=170000&priceMax=200000
  


### POST /booking/create
- Mô tả: Gọi để tiến hành đặt phòng
- Body: JSON chứa thông tin đặt phòng
- Trả về: Thông báo kết quả thành công hoặc thất bại kèm theo lỗi (nếu có)
- Ví dụ:
  http://localhost:3000/booking/create

- Body:
```json
{
  "room_id": 8,
  "total_guests": 2,
  "check_in_date": "2025-06-01",
  "check_out_date": "2025-06-05"
}
