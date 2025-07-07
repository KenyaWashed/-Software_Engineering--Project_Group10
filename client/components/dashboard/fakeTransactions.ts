// Fake data for transaction history table (for client usage)
// Fields: Tên, Số tiền, Ngày, Hình thức, Phòng, Tỉ lệ phụ thu, Số điện thoại

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const today = new Date();
const oneYearAgo = new Date();
oneYearAgo.setFullYear(today.getFullYear() - 1);

const names = [
  "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E", "Vũ Thị F", "Đặng Văn G", "Bùi Thị H", "Phan Văn I", "Đỗ Thị K"
];
const paymentMethods = ["Tiền mặt", "Chuyển khoản", "Thẻ", "Ví điện tử"];
const surchargeRates = ["0%", "5%", "10%", "15%", "20%"];
const roomTypes = ["Phòng đơn", "Phòng đôi", "Phòng gia đình"];

function pad(n) { return n < 10 ? '0' + n : n; }

function formatDate(date) {
  return pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + date.getFullYear();
}

function randomPhone() {
  return '0' + Math.floor(100000000 + Math.random() * 900000000);
}

const fakeTransactions = Array.from({ length: 100 }).map((_, i) => {
  const date = randomDate(oneYearAgo, today);
  return {
    name: names[Math.floor(Math.random() * names.length)],
    amount: `VND ${Math.floor(Math.random() * 10000000 + 200000).toLocaleString()}`,
    date: formatDate(date),
    method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    room: `${roomTypes[Math.floor(Math.random() * roomTypes.length)]} ${Math.floor(Math.random() * 400 + 100)}`,
    surcharge: surchargeRates[Math.floor(Math.random() * surchargeRates.length)],
    phone: randomPhone(),
  };
});

// Thêm 1 dòng dữ liệu năm 2024
fakeTransactions.push({
  name: "Nguyễn Thị 2024",
  amount: "VND 2,024,000",
  date: "15/07/2024",
  method: "Tiền mặt",
  room: "Phòng đôi 202",
  surcharge: "10%",
  phone: "0912345678",
});

export default fakeTransactions;
