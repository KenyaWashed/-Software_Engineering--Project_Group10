// controllers/room.js

// Dữ liệu giả lập
const rooms = [
    { id: 1, name: "Phòng A101", available: true },
    { id: 2, name: "Phòng B102", available: false },
    { id: 3, name: "Phòng C103", available: true }
];

// Controller xử lý logic lấy danh sách phòng trống
const getAvailableRooms = (req, res) => {
    const availableRooms = rooms.filter(room => room.available);
    res.json(availableRooms); // Trả về dữ liệu dưới dạng JSON
};

module.exports = { getAvailableRooms };
