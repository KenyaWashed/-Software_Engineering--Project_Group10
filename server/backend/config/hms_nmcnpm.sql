﻿ALTER DATABASE hms SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
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
    invoice_status NVARCHAR(20), --check (invoice_status in (N'Đã thanh toán', N'Đã hủy', N'Chờ thanh toán')),
    reservation_id INT FOREIGN KEY REFERENCES Reservations(reservation_id)
);

-- Bảng Payment_detail
CREATE TABLE Payment_detail (
    invoice_id INT PRIMARY KEY,
    payment_datetime DATETIME, -- <= getdate()
    payment_method NVARCHAR(50) check (payment_method in (N'Tiền mặt', N'Momo', N'Tài khoản ngân hàng')),
    payment_account NVARCHAR(100)
    --FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
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
    room_type_id INT PRIMARY KEY,
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



-- Dữ liệu cho bảng Reservations
INSERT INTO Reservations (total_local_guests, total_foreign_guests, reservation_date, check_in_date, check_out_date, reservation_status, room_id)
VALUES
-- Phòng loại 1 (room_type_id = 1)
(2, 0, '2023-11-01 10:15:00', '2023-11-05', '2023-11-07', N'Đã thanh toán', 1),
(1, 1, '2023-11-03 14:30:00', '2023-11-10', '2023-11-12', N'Đã hủy', 3),
(4, 0, '2023-11-05 09:00:00', '2023-11-15', '2023-11-18', N'Đã thanh toán', 1),

-- Phòng loại 2 (room_type_id = 2)
(2, 2, '2023-11-02 11:20:00', '2023-11-08', '2023-11-10', N'Đã thanh toán', 5),
(3, 0, '2023-11-04 16:45:00', '2023-11-12', '2023-11-15', N'Chờ thanh toán', 7),
(1, 0, '2023-11-06 13:10:00', '2023-11-20', '2023-11-22', N'Đã đặt', 5),
(2, 1, '2023-11-08 10:30:00', '2023-11-25', '2023-11-28', N'Đã thanh toán', 6),

-- Phòng loại 3 (room_type_id = 3)
(1, 3, '2023-11-01 15:00:00', '2023-11-03', '2023-11-07', N'Đã thanh toán', 9),
(2, 2, '2023-11-05 12:00:00', '2023-11-10', '2023-11-15', N'Đã thanh toán', 11),
(1, 0, '2023-11-07 17:30:00', '2023-11-18', '2023-11-20', N'Đã hủy', 10),
(4, 0, '2023-11-10 09:45:00', '2023-11-22', '2023-11-25', N'Đã đặt', 9),
(2, 1, '2023-11-12 14:20:00', '2023-11-25', '2023-11-30', N'Chờ thanh toán', 11),
(3, 2, '2023-11-15 11:10:00', '2023-11-28', '2023-12-02', N'Đã đặt', 12);

-- Dữ liệu cho bảng Reservation_detail
-- Lưu ý: reservation_id phải khớp với ID được tạo tự động ở bảng Reservations
INSERT INTO Reservation_detail (reservation_id, guest_full_name, guest_email, guest_phone_number)
VALUES
-- Chi tiết cho reservation_id 1 (phòng 101)
(1, N'Nguyễn Văn A', 'nguyenvana@gmail.com', '0912345678'),
(1, N'Trần Thị B', 'tranthib@gmail.com', '0987654321'),

-- Chi tiết cho reservation_id 2 (phòng 103)
(2, N'Lê Văn C', 'levanc@gmail.com', '0978123456'),
(2, N'John Smith', 'john.smith@example.com', '0901122334'),

-- Chi tiết cho reservation_id 3 (phòng 101)
(3, N'Phạm Thị D', 'phamthid@gmail.com', '0911222333'),
(3, N'Hoàng Văn E', 'hoangve@gmail.com', '0988777666'),
(3, N'Nguyễn Thị F', 'nguyenthif@gmail.com', '0966555444'),
(3, N'Trần Văn G', 'tranvang@gmail.com', '0977888999'),

-- Chi tiết cho reservation_id 4 (phòng 201)
(4, N'Đặng Thị H', 'dangthih@gmail.com', '0912345000'),
(4, N'Vũ Văn I', 'vuvani@gmail.com', '0988000111'),
(4, N'Michael Johnson', 'm.johnson@example.com', '0901234567'),
(4, N'Sarah Williams', 's.williams@example.com', '0977333444'),

-- Chi tiết cho reservation_id 5 (phòng 203)
(5, N'Lý Thị K', 'lythik@gmail.com', '0911000222'),
(5, N'Ngô Văn L', 'ngovanl@gmail.com', '0988111333'),
(5, N'Phan Thị M', 'phanthim@gmail.com', '0966222555'),

-- Chi tiết cho reservation_id 6 (phòng 201)
(6, N'Bùi Văn N', 'buivann@gmail.com', '0911333444'),

-- Chi tiết cho reservation_id 7 (phòng 202)
(7, N'Đinh Thị O', 'dinhthio@gmail.com', '0988444555'),
(7, N'Robert Brown', 'r.brown@example.com', '0909876543'),

-- Chi tiết cho reservation_id 8 (phòng 301)
(8, N'Mai Văn P', 'maivanp@gmail.com', '0911555666'),
(8, N'David Wilson', 'd.wilson@example.com', '0977666888'),
(8, N'Emily Davis', 'e.davis@example.com', '0966999777'),
(8, N'James Miller', 'j.miller@example.com', '0988999000'),

-- Chi tiết cho reservation_id 9 (phòng 303)
(9, N'Trương Thị Q', 'truongthiq@gmail.com', '0911777888'),
(9, N'Nguyễn Văn R', 'nguyenvanr@gmail.com', '0988222111'),
(9, N'Jennifer Lee', 'j.lee@example.com', '0904455666'),
(9, N'Thomas Taylor', 't.taylor@example.com', '0977555333'),

-- Chi tiết cho reservation_id 10 (phòng 302)
(10, N'Lê Thị S', 'lethis@gmail.com', '0911888999'),

-- Chi tiết cho reservation_id 11 (phòng 301)
(11, N'Võ Văn T', 'vovant@gmail.com', '0988333444'),
(11, N'Phùng Thị U', 'phungthiu@gmail.com', '0966444555'),
(11, N'Hồ Văn V', 'hovanv@gmail.com', '0977111222'),
(11, N'Đỗ Thị X', 'dothix@gmail.com', '0905566778'),

-- Chi tiết cho reservation_id 12 (phòng 304)
(12, N'Nguyễn Thị Y', 'nguyenthiy@gmail.com', '0911999888'),
(12, N'Trần Văn Z', 'tranvanz@gmail.com', '0988000999'),
(12, N'Jessica White', 'j.white@example.com', '0977444111'),
(12, N'Daniel Harris', 'd.harris@example.com', '0966333222'),
(12, N'Elizabeth Clark', 'e.clark@example.com', '0907788990');

-- Dữ liệu cho bảng Reservations (tháng trước)
INSERT INTO Reservations (total_local_guests, total_foreign_guests, reservation_date, check_in_date, check_out_date, reservation_status, room_id)
VALUES
-- Phòng loại 1 (room_type_id = 1) - 2 đặt phòng
(3, 0, '2023-10-05 11:20:00', '2023-10-10', '2023-10-12', N'Đã thanh toán', 2),
(1, 1, '2023-10-12 15:45:00', '2023-10-18', '2023-10-20', N'Đã hủy', 4),

-- Phòng loại 2 (room_type_id = 2) - 3 đặt phòng
(2, 0, '2023-10-03 09:30:00', '2023-10-08', '2023-10-10', N'Đã thanh toán', 6),
(1, 2, '2023-10-08 14:15:00', '2023-10-15', '2023-10-18', N'Đã thanh toán', 5),
(4, 0, '2023-10-20 10:00:00', '2023-10-25', '2023-10-28', N'Chờ thanh toán', 8),

-- Phòng loại 3 (room_type_id = 3) - 3 đặt phòng
(2, 1, '2023-10-02 16:20:00', '2023-10-05', '2023-10-09', N'Đã thanh toán', 10),
(0, 3, '2023-10-10 13:10:00', '2023-10-12', '2023-10-15', N'Đã thanh toán', 11),
(1, 0, '2023-10-25 17:30:00', '2023-10-28', '2023-10-31', N'Đã đặt', 9);

-- Dữ liệu cho bảng Reservation_detail (tháng trước)
INSERT INTO Reservation_detail (reservation_id, guest_full_name, guest_email, guest_phone_number)
VALUES
-- Chi tiết cho reservation_id 13 (phòng 102)
(13, N'Nguyễn Thị Hương', 'nguyenthihuong@gmail.com', '0912345001'),
(13, N'Trần Văn Nam', 'tranvannam@gmail.com', '0987654322'),
(13, N'Lê Thị Mai', 'lethimai@gmail.com', '0978123457'),

-- Chi tiết cho reservation_id 14 (phòng 104)
(14, N'Phạm Văn Đức', 'phamvanduc@gmail.com', '0911222334'),
(14, N'Anna Petrova', 'a.petrova@example.com', '0901122335'),

-- Chi tiết cho reservation_id 15 (phòng 203)
(15, N'Hoàng Thị Lan', 'hoangthilan@gmail.com', '0988000112'),
(15, N'Vũ Văn Tùng', 'vuvantung@gmail.com', '0966555445'),

-- Chi tiết cho reservation_id 16 (phòng 201)
(16, N'Đặng Văn Minh', 'dangvanminh@gmail.com', '0911000223'),
(16, N'Maria Garcia', 'm.garcia@example.com', '0977333445'),
(16, N'Carlos Rodriguez', 'c.rodriguez@example.com', '0901234568'),

-- Chi tiết cho reservation_id 17 (phòng 204)
(17, N'Lý Văn Hải', 'lyvanhai@gmail.com', '0988111334'),
(17, N'Ngô Thị Thu', 'ngothithu@gmail.com', '0966222556'),
(17, N'Phan Văn Long', 'phanvanlong@gmail.com', '0911333445'),
(17, N'Bùi Thị Hoa', 'buithihoa@gmail.com', '0977111223'),

-- Chi tiết cho reservation_id 18 (phòng 302)
(18, N'Mai Văn Tuấn', 'maivantuan@gmail.com', '0911555667'),
(18, N'Sophie Martin', 's.martin@example.com', '0977666889'),

-- Chi tiết cho reservation_id 19 (phòng 303)
(19, N'Paul Wilson', 'p.wilson@example.com', '0966999778'),
(19, N'Emma Johnson', 'e.johnson@example.com', '0988999001'),
(19, N'Thomas Brown', 't.brown@example.com', '0907788991'),

-- Chi tiết cho reservation_id 20 (phòng 301)
(20, N'Trương Văn Khánh', 'truongvankhanh@gmail.com', '0911777889');

-- Dữ liệu cho bảng Invoice (tương ứng với các reservation từ tháng trước và tháng hiện tại)
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES
-- Tháng hiện tại (reservation_id 1-12)
-- Phòng loại 1
(1200000, 200000, 0, 1400000, N'Đã thanh toán', 1),
(800000, 150000, 50000, 1000000, N'Đã hủy', 2),
(2400000, 300000, 0, 2700000, N'Đã thanh toán', 3),

-- Phòng loại 2
(1800000, 250000, 100000, 2150000, N'Đã thanh toán', 4),
(1500000, 200000, 0, 1700000, N'Chờ thanh toán', 5),
(900000, 100000, 0, 1000000, N'Đã đặt', 6),
(2100000, 300000, 150000, 2550000, N'Đã thanh toán', 7),

-- Phòng loại 3
(3500000, 500000, 200000, 4200000, N'Đã thanh toán', 8),
(5000000, 600000, 300000, 5900000, N'Đã thanh toán', 9),
(1200000, 200000, 0, 1400000, N'Đã hủy', 10),
(3600000, 400000, 0, 4000000, N'Đã đặt', 11),
(4500000, 550000, 250000, 5300000, N'Đã đặt', 12),

-- Tháng trước (reservation_id 13-20)
-- Phòng loại 1
(1350000, 180000, 0, 1530000, N'Đã thanh toán', 13),
(900000, 120000, 50000, 1070000, N'Đã hủy', 14),

-- Phòng loại 2
(1200000, 150000, 0, 1350000, N'Đã thanh toán', 15),
(2100000, 250000, 100000, 2450000, N'Đã thanh toán', 16),
(2700000, 300000, 0, 3000000, N'Chờ thanh toán', 17),

-- Phòng loại 3
(2800000, 350000, 150000, 3300000, N'Đã thanh toán', 18),
(4200000, 500000, 200000, 4900000, N'Đã thanh toán', 19),
(1500000, 200000, 0, 1700000, N'Đã đặt', 20);

-- Dữ liệu cho bảng Payment_detail (chỉ cho các invoice có status 'Đã thanh toán')
INSERT INTO Payment_detail (invoice_id, payment_datetime, payment_method, payment_account)
VALUES
-- Tháng hiện tại
(1, '2023-11-05 14:30:00', N'Momo', 'momo_nguyenvana_0912345678'),
(3, '2023-11-15 10:45:00', N'Tài khoản ngân hàng', 'VCB_1234567890'),
(4, '2023-11-08 16:20:00', N'Tiền mặt', NULL),
(7, '2023-11-25 11:15:00', N'Tài khoản ngân hàng', 'MB_9876543210'),
(8, '2023-11-03 18:00:00', N'Momo', 'momo_maivanp_0911555666'),
(9, '2023-11-10 14:45:00', N'Tài khoản ngân hàng', 'ACB_4567890123'),

-- Tháng trước
(13, '2023-10-10 09:30:00', N'Tiền mặt', NULL),
(15, '2023-10-08 15:20:00', N'Momo', 'momo_hoangthilan_0988000112'),
(16, '2023-10-15 17:45:00', N'Tài khoản ngân hàng', 'TCB_7890123456'),
(18, '2023-10-05 19:10:00', N'Tiền mặt', NULL),
(19, '2023-10-12 13:15:00', N'Tài khoản ngân hàng', 'VIB_3456789012');


------------------------

INSERT INTO Furniture (
    room_type_id, ceiling_fan, table_count, chair_count,
    fridge_count, kettle_count, air_conditioner_count
)
VALUES
(1, 10, 10, 20, 5, 5, 10),
(2, 5, 8, 12, 3, 3, 6),
(3, 0, 6, 10, 0, 2, 4)
GO

-----------------------
DROP FUNCTION IF EXISTS dbo.checkAvailableRoom;
GO
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