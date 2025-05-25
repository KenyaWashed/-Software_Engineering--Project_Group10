-- Tạo cơ sở dữ liệu
CREATE DATABASE hms;
GO

USE hms;
GO

-- Bảng Room
CREATE TABLE Room (
    room_id INT PRIMARY KEY IDENTITY(1,1),
    room_type CHAR(1), -- check room_type in (A, B, C)
    room_price DECIMAL(18,2),-- check (room_price in (150000, 170000, 200000)),-- check đúng loại
    maximum_guests INT check (maximum_guests > 0), 
    room_amenities NVARCHAR(MAX),  
    room_photo VARCHAR(255),
    room_status NVARCHAR(20) check (room_status in (N'Trống', N'Đang sử dụng', N'Đang dọn')),
    room_notes NVARCHAR(MAX)
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
CREATE TABLE app_user (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    user_name NVARCHAR(50),
    user_email NVARCHAR(100),
    phone_number CHAR(10),
    cmnd CHAR(12), -- Số CMND hoặc CCCD
    user_address NVARCHAR(255),
    user_password VARCHAR(100),
    user_role NVARCHAR(20) check (user_role in (N'Khách nội địa', N'Khách ngước ngoài', N'Lễ tân', N'Chủ khách sạn'))
);

-- Bảng Reservation
CREATE TABLE Reservation (
    reservation_id INT PRIMARY KEY IDENTITY(1,1),
    total_guests INT check (total_guests > 0), -- check <= maximum_guests
    reservation_date DATETIME, -- check <= getdate()
    check_in_date DATETIME,-- check (check_in_date >= reservation_date),
    total_days INT check (total_days > 0),
    reservation_status NVARCHAR(20) check (reservation_status in (N'Đã đặt', N'Chờ thanh toán', N'Đã hủy', N'Đã thanh toán')),
    room_id INT FOREIGN KEY REFERENCES Room(room_id)
);

-- Bảng Reservation_detail (nhiều khách cho 1 đơn đặt phòng)
CREATE TABLE Reservation_detail (
    reservation_id INT,
    user_id INT,
    PRIMARY KEY (reservation_id, user_id),
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id),
    FOREIGN KEY (user_id) REFERENCES app_User(user_id)
);

-- Bảng Invoice
CREATE TABLE Invoice (
    invoice_id INT PRIMARY KEY IDENTITY(1,1),
    base_fee DECIMAL(18,2), -- = room_price * total_days * total_guests + tiền phụ thu (khách thứ 3, nước ngoài)
    service_fee DECIMAL(18,2),
    extra_fee DECIMAL(18,2) default 0, -- default = 0
    total_amount DECIMAL(18,2), -- = base_fee + service_fee + extra_fee
    invoice_status NVARCHAR(20) check (invoice_status in (N'Đã thanh toán', N'Đã hủy', N'Chờ thanh toán')),
    reservation_id INT FOREIGN KEY REFERENCES Reservation(reservation_id)
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
    FOREIGN KEY (customer_id) REFERENCES app_User(user_id),
    FOREIGN KEY (staff_id) REFERENCES app_User(user_id)
);

-- Bảng Transaction_history
CREATE TABLE Transaction_history (
    transaction_id INT PRIMARY KEY IDENTITY(1,1),
    transaction_datetime DATETIME, -- <= getdate()
    transaction_type NVARCHAR(50),
    total_amount DECIMAL(18,2) check (total_amount > 0),
    reservation_id INT FOREIGN KEY REFERENCES Reservation(reservation_id),
    user_id INT FOREIGN KEY REFERENCES app_User(user_id)
);

-- Room type A (150,000 VND)
INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('A', 150000.00, 3, N'TV, WiFi, Điều hòa, Phòng tắm riêng', 'room_a1.jpg', N'Trống', N'Phòng hướng ra biển');

INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('A', 150000.00, 3, N'TV, WiFi, Điều hòa, Mini bar', 'room_a2.jpg', N'Đang sử dụng', N'Yêu cầu giường đôi');

-- Room type B (170,000 VND)
INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('B', 170000.00, 3, N'TV, WiFi, Điều hòa, Phòng tắm riêng, Bàn làm việc', 'room_b1.jpg', N'Trống', N'Phòng mới renovate');

INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('B', 170000.00, 3, N'TV, WiFi, Điều hòa, 2 giường đơn', 'room_b2.jpg', N'Đang dọn', N'Cần kiểm tra hệ thống nước');

-- Room type C (200,000 VND)
INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('C', 200000.00, 3, N'TV màn hình phẳng, WiFi tốc độ cao, Điều hòa, Mini bar, Bồn tắm', 'room_c1.jpg', N'Trống', N'Phòng VIP, view thành phố');

INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('C', 200000.00, 3, N'TV màn hình phẳng, WiFi tốc độ cao, Điều hòa, Bàn làm việc rộng', 'room_c2.jpg', N'Đang sử dụng', N'Khách yêu cầu dọn phòng lúc 2PM');

-- Additional rooms with different statuses
INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('A', 150000.00, 3, N'TV, WiFi, Điều hòa', 'room_a3.jpg', N'Đang dọn', N'Vừa trả phòng, cần vệ sinh kỹ');

INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('B', 170000.00, 3, N'TV, WiFi, Điều hòa, Phòng tắm riêng', 'room_b3.jpg', N'Trống', NULL);

INSERT INTO Room (room_type, room_price, maximum_guests, room_amenities, room_photo, room_status, room_notes)
VALUES ('C', 200000.00, 3, N'TV màn hình phẳng, WiFi, Điều hòa, Bồn tắm Jacuzzi', 'room_c3.jpg', N'Đang sử dụng', N'Khách đặt dài hạn');

-------------------------------------------------------------------------------------

insert into policy (policy_name, policy_short_name, policy_value, policy_notes) values (N'Phụ thu khách thứ 3 trở đi', 'KH3', 0.25, null);
insert into policy (policy_name, policy_short_name, policy_value, policy_notes) values (N'Phụ thu khách nước ngoài', 'KNN', 0.50, null);

---------------------------------------------------------------------------------------

-- Domestic guests (Khách nội địa)
INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0912345678', '001123456789', N'Hà Nội', 'password123', N'Khách nội địa');

INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Trần Thị Bình', 'tranthibinh@yahoo.com', '0987654321', '002234567890', N'Đà Nẵng', 'binh123456', N'Khách nội địa');

-- Foreign guests (Khách ngước ngoài)
INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'John Smith', 'john.smith@example.com', '0901112222', 'P123456789', N'New York, USA', 'johnsmith123', N'Khách ngước ngoài');

INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Emma Johnson', 'emma.j@example.com', '0903334444', 'P987654321', N'London, UK', 'emma456789', N'Khách ngước ngoài');

-- Receptionists (Lễ tân)
INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Phạm Thị Lễ', 'lethipham@hotel.com', '0905556666', '003345678901', N'TP.HCM', 'reception@123', N'Lễ tân');

INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Lê Văn Tân', 'tanle@hotel.com', '0907778888', '004456789012', N'Nha Trang', 'tanreception456', N'Lễ tân');

-- Hotel owner (Chủ khách sạn)
INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Trương Văn Chủ', 'owner@hotel.com', '0909990000', '005567890123', N'Phú Quốc', 'ownerpassword789', N'Chủ khách sạn');

-- Additional users
INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Đặng Văn Cường', 'cuongdv@gmail.com', '0911223344', '006678901234', N'Hải Phòng', 'cuong123456', N'Khách nội địa');

INSERT INTO app_user (user_name, user_email, phone_number, cmnd, user_address, user_password, user_role)
VALUES (N'Sarah Miller', 'sarah.m@example.com', '0912333444', 'P456123789', N'Sydney, Australia', 'sarahmiller123', N'Khách ngước ngoài');

----------------------------------------------------------------------------

-- Completed reservation (Đã thanh toán)
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (2, '2023-05-01 10:30:00', '2023-05-05 14:00:00', 3, N'Đã thanh toán', 1);

-- Active reservation (Đã đặt)
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (3, '2023-06-15 11:15:00', '2023-06-20 12:00:00', 5, N'Đã đặt', 3);

-- Pending payment (Chờ thanh toán)
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (2, '2023-06-10 09:45:00', '2023-06-25 15:00:00', 2, N'Chờ thanh toán', 5);

-- Cancelled reservation (Đã hủy)
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (3, '2023-04-20 16:20:00', '2023-05-10 13:00:00', 7, N'Đã hủy', 4);

-- Different date scenarios
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (2, '2023-06-01 14:00:00', '2023-06-03 14:00:00', 1, N'Đã thanh toán', 2);

INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (3, '2023-05-25 08:30:00', '2023-06-15 10:00:00', 4, N'Đã đặt', 6);

-- Weekend stay
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (2, '2023-06-05 12:00:00', '2023-06-09 14:00:00', 2, N'Chờ thanh toán', 1);

-- Long stay
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (2, '2023-05-10 10:00:00', '2023-06-01 12:00:00', 10, N'Đã thanh toán', 5);

-- Last-minute booking
INSERT INTO Reservation (total_guests, reservation_date, check_in_date, total_days, reservation_status, room_id)
VALUES (1, '2023-06-12 18:00:00', '2023-06-12 20:00:00', 1, N'Đã đặt', 2);

-------------------------------------------------------------------------------------------

-- Reservation 1 (2 guests - domestic)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (1, 1);  -- Nguyễn Văn An

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (1, 8);  -- Đặng Văn Cường

-- Reservation 2 (3 guests - mixed)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (2, 3);  -- John Smith (foreigner)

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (2, 1);  -- Nguyễn Văn An

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (2, 2);  -- Trần Thị Bình

-- Reservation 3 (2 guests - foreigners)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (3, 3);  -- John Smith

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (3, 4);  -- Emma Johnson

-- Reservation 4 (4 guests - domestic)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (4, 1);  -- Nguyễn Văn An

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (4, 2);  -- Trần Thị Bình

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (4, 8);  -- Đặng Văn Cường

-- Reservation 5 (2 guests - couple)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (5, 1);  -- Nguyễn Văn An

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (5, 2);  -- Trần Thị Bình

-- Reservation 6 (3 guests - family)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (6, 2);  -- Trần Thị Bình

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (6, 8);  -- Đặng Văn Cường

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (6, 9);  -- Sarah Miller

-- Reservation 7 (2 guests - business partners)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (7, 3);  -- John Smith

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (7, 9);  -- Sarah Miller

-- Reservation 8 (1 guest - solo traveler)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (8, 4);  -- Emma Johnson

-- Reservation 9 (2 guests - friends)
INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (9, 1);  -- Nguyễn Văn An

INSERT INTO Reservation_detail (reservation_id, user_id)
VALUES (9, 8);  -- Đặng Văn Cường

----------------------------------------------------------------------------------------------

-- Invoice for reservation 1 (2 domestic guests, 3 days, room A - 150k/night)
-- No extra fees (2 guests only, all domestic)
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (150000.00 * 3 * 2, 200000.00, 0, (150000.00 * 3 * 2) + 200000.00, N'Đã thanh toán', 1);

-- Invoice for reservation 2 (3 guests - 1 foreign + 2 domestic, 5 days, room B - 170k/night)
-- Extra 25% for 3rd guest + 50% foreigner surcharge (applies to base fee)
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    (170000.00 * 5 * 2) + (170000.00 * 5 * 1 * 0.25) + (170000.00 * 5 * 1.5), -- Base fee with surcharges
    250000.00, -- Service fee
    0, -- No extra fee
    ((170000.00 * 5 * 2) + (170000.00 * 5 * 1 * 0.25) + (170000.00 * 5 * 1.5)) + 250000.00,
    N'Đã thanh toán',
    2
);

-- Invoice for reservation 3 (2 foreign guests, 2 days, room C - 200k/night)
-- 50% foreigner surcharge (both guests are foreign)
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    (200000.00 * 2 * 2 * 1.5), -- 50% surcharge for all guests
    180000.00,
    0,
    (200000.00 * 2 * 2 * 1.5) + 180000.00,
    N'Chờ thanh toán',
    3
);

-- Invoice for reservation 4 (4 domestic guests, 7 days, room B - 170k/night)
-- Extra 25% for 3rd and 4th guests
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    (170000.00 * 7 * 2) + (170000.00 * 7 * 1 * 0.25), -- 2 normal + 2 with 25% surcharge
    300000.00,
    50000.00, -- Late check-out fee
    ((170000.00 * 7 * 2) + (170000.00 * 7 * 1 * 0.25)) + 300000.00 + 50000.00,
    N'Đã thanh toán',
    4
);

-- Invoice for reservation 5 (2 domestic guests, 1 day, room A - 150k/night)
-- No extra fees
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    150000.00 * 1 * 2,
    100000.00,
    0,
    (150000.00 * 1 * 2) + 100000.00,
    N'Đã thanh toán',
    5
);

-- Invoice for reservation 6 (3 guests - 1 foreign + 2 domestic, 4 days, room C - 200k/night)
-- Complex calculation with all surcharges
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    (200000.00 * 4 * 2) + (200000.00 * 4 * 1 * 0.25) + (200000.00 * 4 * 1 * 1.5),
    350000.00,
    0,
    ((200000.00 * 4 * 2) + (200000.00 * 4 * 1 * 0.25) + (200000.00 * 4 * 1 * 1.5)) + 350000.00,
    N'Đã thanh toán',
    6
);

-- Invoice for reservation 7 (2 foreign guests, 2 days, room A - 150k/night)
-- 50% foreigner surcharge
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    150000.00 * 2 * 2 * 1.5,
    150000.00,
    0,
    (150000.00 * 2 * 2 * 1.5) + 150000.00,
    N'Chờ thanh toán',
    7
);

-- Invoice for reservation 8 (1 foreign guest, 10 days, room C - 200k/night)
-- 50% foreigner surcharge
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    200000.00 * 10 * 1 * 1.5,
    500000.00, -- Higher service fee for long stay
    0,
    (200000.00 * 10 * 1 * 1.5) + 500000.00,
    N'Đã thanh toán',
    8
);

-- Invoice for reservation 9 (2 domestic guests, 1 day, room B - 170k/night)
-- No extra fees
INSERT INTO Invoice (base_fee, service_fee, extra_fee, total_amount, invoice_status, reservation_id)
VALUES (
    170000.00 * 1 * 2,
    120000.00,
    0,
    (170000.00 * 1 * 2) + 120000.00,
    N'Đã hủy',
    9
);

-------------------------------------------------------------------------------------------------

-- Payment for invoice 1 (Tiền mặt)
INSERT INTO Payment_detail (invoice_id, payment_datetime, payment_method, payment_account)
VALUES (1, '2023-05-05 14:30:00', N'Tiền mặt', NULL);

-- Payment for invoice 2 (Tài khoản ngân hàng)
INSERT INTO Payment_detail (invoice_id, payment_datetime, payment_method, payment_account)
VALUES (2, '2023-06-20 11:45:00', N'Tài khoản ngân hàng', '9704 2310 1234 5678');

-- Payment for invoice 3 (Chưa thanh toán - không có bản ghi)

-- Payment for invoice 4 (Đã hủy - không có bản ghi)
INSERT INTO Payment_detail (invoice_id, payment_datetime, payment_method, payment_account)
VALUES (4, '2023-06-12 20:15:00', N'Tiền mặt', NULL);

-- Payment for invoice 5 (Momo)
INSERT INTO Payment_detail (invoice_id, payment_datetime, payment_method, payment_account)
VALUES (5, '2023-06-03 16:20:00', N'Momo', '0912345678');

-- Payment for invoice 6 (Tài khoản ngân hàng)
INSERT INTO Payment_detail (invoice_id, payment_datetime, payment_method, payment_account)
VALUES (6, '2023-06-15 09:15:00', N'Tài khoản ngân hàng', '9704 2310 8765 4321');

-- Payment for invoice 7 (Chờ thanh toán - không có bản ghi)

-- Payment for invoice 8 (Momo)
INSERT INTO Payment_detail (invoice_id, payment_datetime, payment_method, payment_account)
VALUES (8, '2023-06-01 18:30:00', N'Momo', '0987654321');

-- Payment for invoice 9 (Đã hủy - không có bản ghi)

-------------------------------------------------------------------------------------------

-- Support case 1: Domestic customer with receptionist
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-05-02 09:15:00', 1, 5); -- Customer Nguyễn Văn An helped by receptionist Phạm Thị Lễ

-- Support case 2: Foreign customer with receptionist
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-05-10 14:30:00', 3, 6); -- Customer John Smith helped by receptionist Lê Văn Tân

-- Support case 3: Domestic customer with hotel owner
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-05-15 11:45:00', 2, 7); -- Customer Trần Thị Bình helped by owner Trương Văn Chủ

-- Support case 4: Foreign customer with receptionist (late night)
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-05-20 22:10:00', 4, 5); -- Customer Emma Johnson helped by receptionist Phạm Thị Lễ

-- Support case 5: Domestic customer with receptionist (multiple requests)
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-06-01 10:30:00', 8, 6); -- Customer Đặng Văn Cường helped by receptionist Lê Văn Tân

INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-06-01 16:45:00', 8, 6); -- Same customer, same day, different issue

-- Support case 6: Foreign customer with receptionist (special request)
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-06-05 15:20:00', 9, 5); -- Customer Sarah Miller helped by receptionist Phạm Thị Lễ

-- Support case 7: Domestic customer with hotel owner (complaint)
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-06-10 13:15:00', 1, 7); -- Customer Nguyễn Văn An escalated to owner Trương Văn Chủ

-- Support case 8: Foreign customer with receptionist (check-out assistance)
INSERT INTO Support_history (support_datetime, customer_id, staff_id)
VALUES ('2023-06-12 08:30:00', 3, 6); -- Customer John Smith helped by receptionist Lê Văn Tân

-----------------------------------------------------------------------------------------------------------------------------------------------------