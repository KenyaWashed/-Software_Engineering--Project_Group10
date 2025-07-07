-- RoomPackage.sql
-- Bảng package cho phòng
CREATE TABLE RoomPackage (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL
);

-- Sample data
INSERT INTO RoomPackage (name) VALUES
(N'Gói phòng 1'),
(N'Gói phòng 2'),
(N'Gói phòng 3'),
(N'Gói phòng 4');
