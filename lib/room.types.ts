// Kiểu dữ liệu cho RoomPackage và RoomType
export interface RoomPackage {
  id: number;
  name: string;
  benefits: string[];
  originalPrice: number;
  discountPrice: number;
  available: boolean;
}

export interface RoomType {
  id: number;
  name: string;
  images: string[];
  area: string;
  view: string;
  maxGuests: number;
  beds: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  packages: RoomPackage[];
}
