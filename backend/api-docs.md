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

### POST/calculation
fetch('http://localhost:4000/calculation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
  "room_type_id": 1,
  "room_package_id": 2,
  "n_domestic_guests": 2,
  "n_foreign_guests": 1,
  "total_days": 3
})
});

### POST /booking/create (chưa xong)
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
