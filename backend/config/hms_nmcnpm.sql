ALTER DATABASE hms SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
use master
go
DROP DATABASE hms;

-- Tạo cơ sở dữ liệu
CREATE DATABASE hms;
GO

USE hms;
GO

-- Bảng Room
CREATE TABLE Rooms (
    room_id INT PRIMARY KEY IDENTITY(1,1),
	room_number char(3),
    room_type_id int,
	room_package_id int,
    room_status NVARCHAR(20) check (room_status in (N'Trống', N'Đã đặt')),
    room_notes NVARCHAR(MAX)
);

create table room_types (
	room_type_id INT PRIMARY KEY IDENTITY(1,1),
	room_type_name NVARCHAR(100),
	max_guests int check (max_guests > 0),
	room_type_beds int check (room_type_beds >= 0),
	room_type_bathrooms int check (room_type_bathrooms >= 0),
	room_type_description nvarchar(255),
	room_type_area int check (room_type_area > 0),
	view_direction nvarchar(255),
);

create table room_type_photos (
	room_type_id int, ----
	room_type_photo varchar(255),
	primary key(room_type_id, room_type_photo)
);

create table room_type_amenities (
	room_type_id int,-----
	room_type_amenity nvarchar(255),
	primary key(room_type_id, room_type_amenity)
);

create table room_packages (
	room_package_id int primary key identity(1,1),
	room_type_id int,------
	room_package_name nvarchar(100),
	room_package_description nvarchar(255),
	list_price float,
	sale_price float,
	room_package_status int check (room_package_status in (0,1)) -- hết hàng = 0, còn hàng = 1
);

create table room_package_offers (
	room_package_id int,-----
	room_package_offer nvarchar(100),
	primary key(room_package_id, room_package_offer)
);

-- Bảng Policy
CREATE TABLE Policy (
    policy_id INT PRIMARY KEY IDENTITY(1,1),
    policy_name NVARCHAR(100),
	policy_short_name CHAR(3),
    policy_value DECIMAL(18,2),
    policy_notes NVARCHAR(MAX)
);

-- Bảng User
CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
	user_name nvarchar(50),
    full_name NVARCHAR(50),
    user_email VARCHAR(100) not null,
    phone_number CHAR(10) not null,
    user_password VARCHAR(100),
    user_role NVARCHAR(20) check (user_role in ('guest', 'receptionist', 'admin')),
	constraint UQ_User_Email_Phone unique(user_email, phone_number)
);


-- Bảng Reservation_detail (nhiều khách cho 1 đơn đặt phòng)
CREATE TABLE Reservation_detail (
    reservation_id INT,
	guest_full_name nvarchar(50),
    guest_email varchar(100) not null,
	guest_phone_number char(10),
	primary key(reservation_id, guest_phone_number)
);
-- Bảng Reservation
CREATE TABLE Reservations (
    reservation_id INT PRIMARY KEY IDENTITY(1,1),
    total_local_guests INT check (total_local_guests >= 0), -- check <= maximum_guests
	total_foreign_guests int check (total_foreign_guests >= 0),
    reservation_date DATETIME, -- check <= getdate()
    check_in_date DATETIME,-- check (check_in_date >= reservation_date),
    check_out_date datetime, -- check (check_out_date >= check_in_date),
    reservation_status NVARCHAR(20), -- check (reservation_status in (N'Đã đặt', N'Chờ thanh toán', N'Đã hủy', N'Đã thanh toán')),
    room_id INT FOREIGN KEY REFERENCES Rooms(room_id)
);

-- Bảng Invoice
CREATE TABLE Invoice (
    invoice_id INT PRIMARY KEY IDENTITY(1,1),
    base_fee DECIMAL(18,2), -- = room_price * total_days * total_guests + tiền phụ thu (khách thứ 3, nước ngoài)
    service_fee DECIMAL(18,2),
    extra_fee DECIMAL(18,2) default 0, -- default = 0
    total_amount DECIMAL(18,2), -- = base_fee + service_fee + extra_fee
    invoice_status NVARCHAR(20) check (invoice_status in (N'Đã thanh toán', N'Đã hủy', N'Chờ thanh toán')),
    reservation_id INT FOREIGN KEY REFERENCES Reservations(reservation_id)
);

-- Bảng Payment_detail
CREATE TABLE Payment_detail (
    invoice_id INT PRIMARY KEY,
    payment_datetime DATETIME, -- <= getdate()
    payment_method NVARCHAR(50) check (payment_method in (N'Tiền mặt', N'Momo', N'Tài khoản ngân hàng')),
    payment_account NVARCHAR(100),
    FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
);

-- Bảng Support_history
CREATE TABLE Support_history (
    support_id INT PRIMARY KEY IDENTITY(1,1),
    support_datetime DATETIME, -- <= getdate()
    customer_id INT,
    staff_id INT,
    FOREIGN KEY (customer_id) REFERENCES Users(user_id),
    FOREIGN KEY (staff_id) REFERENCES Users(user_id)
);

-- Bảng Transaction_history
CREATE TABLE Transaction_history (
    transaction_id INT PRIMARY KEY IDENTITY(1,1),
    transaction_datetime DATETIME, -- <= getdate()
    transaction_type NVARCHAR(50),
    total_amount DECIMAL(18,2) check (total_amount > 0),
    reservation_id INT FOREIGN KEY REFERENCES Reservations(reservation_id),
    user_id INT FOREIGN KEY REFERENCES Users(user_id)
);

create table user_login_history (
    login_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    login_datetime DATETIME DEFAULT GETDATE(),
    logout_datetime DATETIME NULL, -- NULL nếu chưa đăng xuất
    ip_address VARCHAR(50)
);

CREATE TABLE Furniture (
    room_package_id INT PRIMARY KEY,
    ceiling_fan INT,
    table_count INT,
    chair_count INT,
    fridge_count INT,
    kettle_count INT,
    air_conditioner_count INT
);

	

alter table Rooms add constraint fk_room_room_type foreign key (room_type_id) references room_types(room_type_id);
alter table Rooms add constraint fk_room_room_package foreign key (room_package_id) references room_packages(room_package_id);
alter table room_type_photos add constraint fk_room_type_photos foreign key (room_type_id) references room_types(room_type_id);
alter table room_type_amenities add constraint fk_room_type_amenities foreign key (room_type_id) references room_types(room_type_id);
alter table room_packages add constraint fk_room_package_room_type foreign key (room_type_id) references room_types(room_type_id);
alter table room_package_offers add constraint fk_room_package_offers foreign key (room_package_id) references room_packages(room_package_id);

INSERT INTO room_types (
	room_type_name, max_guests, room_type_beds, room_type_bathrooms,
	room_type_description, room_type_area, view_direction
)
VALUES
('Deluxe Ocean View', 3, 1, 1,
 N'Phòng sang trọng với view biển tuyệt đẹp, nội thất cao cấp và đầy đủ tiện nghi hiện đại.',
 38, N'Hướng vườn'),

('Executive Suite', 3, 1, 1,
 N'Suite cao cấp với không gian rộng rãi, phòng khách riêng biệt và tầm nhìn panorama thành phố.',
 65, N'Hướng thành phố'),
 
 ('Presidential Suite', 3, 1, 1,
 N'Suite tổng thống với thiết kế xa hoa, phòng khách rộng lớn và tầm nhìn 360 độ tuyệt đẹp.',
 120, N'Hướng biển và thành phố');

 INSERT INTO room_type_photos (room_type_id, room_type_photo)
VALUES
(1, '/khachsan/khonggian1.png'),
(1, '/images/phongloai1/2.jpg'),
(1, '/images/phongloai1/3.jpg'),
(1, '/images/phongloai1/4.jpeg'),
(1, '/images/phongloai1/5.jpeg'),

-- Thêm ảnh mới cho room_type_id = 2
(2, '/khachsan/khonggian1.png'),
(2, '/images/phongloai1/2.jpg'),
(2, '/images/phongloai1/3.jpg'),
(2, '/images/phongloai1/4.jpeg'),
(2, '/images/phongloai1/5.jpeg'),

-- Thêm ảnh mới cho room_type_id = 3
(3, '/khachsan/khonggian1.png'),
(3, '/images/phongloai1/2.jpg'),
(3, '/images/phongloai1/3.jpg'),
(3, '/images/phongloai1/4.jpeg'),
(3, '/images/phongloai1/5.jpeg');

INSERT INTO room_type_amenities (room_type_id, room_type_amenity)
VALUES
(1, N'Wi-Fi miễn phí'),
(1, N'TV 55 inch'),
(1, N'Bồn tắm'),
(1, N'Dịch vụ phòng 24/24'),
(1, N'Mini bar'),
(1, N'Máy pha cà phê'),

(2, N'Wi-Fi miễn phí'),
(2, N'TV 65 inch'),
(2, N'Jacuzzi'),
(2, N'Dịch vụ phòng 24/24'),
(2, N'Mini bar'),
(2, N'Máy pha cà phê'),
(2, N'Bàn làm việc'),

(3, N'Wi-Fi miễn phí'),
(3, N'TV 65 inch'),
(3, N'Jacuzzi'),
(3, N'Dịch vụ phòng 24/24'),
(3, N'Mini bar'),
(3, N'Máy pha cà phê'),
(3, N'Bàn làm việc'),
(3, N'Ban công riêng');

INSERT INTO room_packages (
	room_type_id, room_package_name, room_package_description,
	list_price, sale_price, room_package_status
)
VALUES
(1, N'Special Offer - Royal Privilege Package', N'Gói ưu đãi đặc biệt với nhiều quyền lợi.', 200000, 150000, 1),
(1, N'Standard Package', N'Gói tiêu chuẩn với giá tốt.', 200000, 150000, 1),
(2, N'Executive Privilege Package', N'Gói đặc quyền cho Executive Suite.', 250000, 170000, 1),
(3, N'Presidential Experience Package', N'Gói ưu đãi cao cấp', 300000, 200000, 1),
(3, N'Luxury Package', N'Gói cao cấp nhất', 300000, 200000, 1);


INSERT INTO room_package_offers (room_package_id, room_package_offer)
VALUES
-- Package ID 1
(1, N'Free cancellation'),
(1, N'Pay today'),

-- Package ID 2
(2, N'Free cancellation'),

-- Package ID 3
(3, N'Free cancellation'),
(3, N'Pay today'),
(3, N'Complimentary breakfast'),

-- Package ID 4
(4, N'Free cancellation'),
(4, N'Pay today'),
(4, N'Complimentary breakfast'),
(4, N'Airport transfer'),

-- Package ID 5
(5, N'Free cancellation');
-------------------------------------------------------------------------------------

insert into policy (policy_name, policy_short_name, policy_value, policy_notes) values (N'Phụ thu khách thứ 3 trở đi', 'KH3', 0.25, null);
insert into policy (policy_name, policy_short_name, policy_value, policy_notes) values (N'Phụ thu khách nước ngoài', 'KNN', 0.50, null);

---------------------------------------------------------------------------------------

INSERT INTO users (user_name, full_name, user_email, phone_number, user_password, user_role)
VALUES 
    ('admin', N'Quản trị viên', 'admin@royalhotel.com', '0900000001', 'admin123', 'admin'),
    ('user1', N'Nguyễn Văn A', 'user1@gmail.com', '0900000002', 'user123', 'guest');

----------

INSERT INTO Rooms (room_number, room_type_id, room_package_id, room_status, room_notes)
VALUES
-- Loại 1 (room_type_id = 1)
('101', 1, 1, N'Trống', NULL),
('102', 1, 1, N'Đã đặt', NULL),
('103', 1, 2, N'Trống', NULL),
('104', 1, 2, N'Đã đặt', NULL),

-- Loại 2 (room_type_id = 2)
('201', 2, 3, N'Trống', NULL),
('202', 2, 3, N'Đã đặt', NULL),
('203', 2, 3, N'Trống', NULL),
('204', 2, 3, N'Đã đặt', NULL),

-- Loại 3 (room_type_id = 3)
('301', 3, 4, N'Trống', NULL),
('302', 3, 4, N'Đã đặt', NULL),
('303', 3, 5, N'Trống', NULL),
('304', 3, 5, N'Đã đặt', NULL);
GO

------------------------

INSERT INTO Furniture (
    room_package_id, ceiling_fan, table_count, chair_count,
    fridge_count, kettle_count, air_conditioner_count
)
VALUES
(1, 10, 10, 20, 5, 5, 10),
(2, 5, 8, 12, 3, 3, 6),
(3, 0, 6, 10, 0, 2, 4),
(4, 12, 12, 24, 8, 8, 12),
(5, 2, 4, 6, 1, 1, 2);

-----------------------

CREATE FUNCTION dbo.checkAvailableRoom (
    @check_in_date DATETIME,
    @check_out_date DATETIME
)
RETURNS TABLE
AS
RETURN
(
    SELECT room_number, room_type_id, room_package_id
    FROM Rooms
    WHERE room_id NOT IN (
        SELECT room_id
        FROM Reservations
        WHERE 
            (check_in_date <= @check_in_date AND @check_out_date <= check_out_date) 
            OR (check_out_date > @check_in_date AND check_out_date <= @check_out_date)
            OR (check_in_date >= @check_in_date AND check_out_date > @check_in_date)
    )
);
GO
