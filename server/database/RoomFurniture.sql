-- RoomFurniture.sql
-- Bảng liên kết phòng và nội thất, lưu số lượng từng loại nội thất trong từng phòng
CREATE TABLE RoomFurniture (
    id INT IDENTITY(1,1) PRIMARY KEY,
    room_id INT NOT NULL,
    furniture_id INT NOT NULL,
    amount INT NOT NULL DEFAULT 0,
    FOREIGN KEY (furniture_id) REFERENCES Furniture(id)
    -- FOREIGN KEY (room_id) REFERENCES Room(id) -- nếu có bảng Room
);
