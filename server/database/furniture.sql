-- furniture.sql
-- Table for furniture (Nội thất)
CREATE TABLE Furniture (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

-- Sample data
INSERT INTO Furniture (name, description) VALUES
(N'Quạt trần', N'Quạt trần cho phòng'),
(N'Bàn', N'Bàn học hoặc bàn làm việc'),
(N'Ghế', N'Ghế ngồi'),
(N'Tủ lạnh', N'Tủ lạnh mini'),
(N'Ấm đun sôi', N'Ấm đun nước siêu tốc'),
(N'Máy lạnh', N'Máy điều hòa không khí');
