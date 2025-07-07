-- Room.sql
-- Bảng Room và RoomType mẫu để phục vụ truy vấn tổng số nội thất theo loại phòng
CREATE TABLE RoomType (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL
);

CREATE TABLE Room (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    type_id INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES RoomType(id)
);
