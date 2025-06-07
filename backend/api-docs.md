### POST /room
fetch('http://localhost:4000/room', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    checkin_date: '2025-06-10',
    checkout_date: '2025-06-15'
  })
});


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
