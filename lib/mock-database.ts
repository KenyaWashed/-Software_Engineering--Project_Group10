// Mock database for Royal Hotel
// Bảng User, loaiPhong, packagePhong, Danhsachphong

export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface LoaiPhong {
  id: number;
  tenLoai: string;
  moTa: string;
  hinhAnh: string[];
  dienTich: string;
  huongNhin: string;
  tienNghi: string[];
}

export interface PackagePhong {
  id: number;
  loaiPhongId: number;
  tenGoi: string;
  moTa: string;
  giaGoc: number;
  giaKhuyenMai: number;
  uuDai: string[];
  conHang: boolean;
}

export interface DanhSachPhong {
  id: number;
  soPhong: string;
  loaiPhongId: number;
  packageId: number;
  trangThai: 'trong' | 'daCoc' | 'daDat';
  ngayNhan?: string; // ISO date string
  ngayTra?: string;  // ISO date string
}

// Dữ liệu mẫu
export const reusers: User[] = [
  { id: 1, username: 'admin', password: 'admin123', fullName: 'Quản trị viên', email: 'admin@royalhotel.com', phone: '0900000001', role: 'admin' },
  { id: 2, username: 'user1', password: 'user123', fullName: 'Nguyễn Văn A', email: 'user1@gmail.com', phone: '0900000002', role: 'user' },
];

export const loaiPhongs: LoaiPhong[] = [
  {
    id: 1,
    tenLoai: 'Deluxe Ocean View',
    moTa: 'Phòng sang trọng với view biển tuyệt đẹp, nội thất cao cấp và đầy đủ tiện nghi hiện đại.',
    hinhAnh: ['/images/phongloai1/1.jpg', '/images/phongloai1/2.jpg', '/images/phongloai1/3.jpg'],
    dienTich: '38m²',
    huongNhin: 'Hướng vườn',
    tienNghi: ['Wi-Fi miễn phí', 'TV 55 inch', 'Bồn tắm', 'Dịch vụ phòng 24/24', 'Mini bar', 'Máy pha cà phê'],
  },
  {
    id: 2,
    tenLoai: 'Executive Suite',
    moTa: 'Suite cao cấp với không gian rộng rãi, phòng khách riêng biệt và tầm nhìn panorama thành phố.',
    hinhAnh: ['/images/phongloai1/2.jpg', '/images/phongloai1/3.jpg', '/images/phongloai1/4.jpeg'],
    dienTich: '65m²',
    huongNhin: 'Hướng thành phố',
    tienNghi: ['Wi-Fi miễn phí', 'TV 65 inch', 'Jacuzzi', 'Dịch vụ phòng 24/24', 'Mini bar', 'Máy pha cà phê', 'Bàn làm việc'],
  },
];

export const packagePhongs: PackagePhong[] = [
  {
    id: 1,
    loaiPhongId: 1,
    tenGoi: 'Special Offer - Royal Privilege Package',
    moTa: 'Gói ưu đãi đặc biệt với nhiều quyền lợi.',
    giaGoc: 3200000,
    giaKhuyenMai: 2522880,
    uuDai: ['Free cancellation', 'Pay today'],
    conHang: true,
  },
  {
    id: 2,
    loaiPhongId: 1,
    tenGoi: 'Standard Package',
    moTa: 'Gói tiêu chuẩn với giá tốt.',
    giaGoc: 2800000,
    giaKhuyenMai: 2520000,
    uuDai: ['Free cancellation'],
    conHang: true,
  },
  {
    id: 3,
    loaiPhongId: 2,
    tenGoi: 'Executive Privilege Package',
    moTa: 'Gói đặc quyền cho Executive Suite.',
    giaGoc: 4500000,
    giaKhuyenMai: 3850000,
    uuDai: ['Free cancellation', 'Pay today', 'Complimentary breakfast'],
    conHang: true,
  },
];

export const danhSachPhongs: DanhSachPhong[] = [
  { id: 1, soPhong: '101', loaiPhongId: 1,packageId: 1, trangThai: 'trong', ngayNhan: '', ngayTra: ''},
  { id: 2, soPhong: '102', loaiPhongId: 1,packageId: 1, trangThai: 'daDat', ngayNhan: '2025-06-10', ngayTra: '2025-06-12' },
  { id: 3, soPhong: '201', loaiPhongId: 2,packageId: 1, trangThai: 'daCoc', ngayNhan: '2025-06-15', ngayTra: '2025-06-18' },
  { id: 4, soPhong: '202', loaiPhongId: 2,packageId: 1,trangThai: 'trong', ngayNhan: '', ngayTra: '' },
];
