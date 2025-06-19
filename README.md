Front end
BƯỚC 1: CÀI ĐẶT MÔI TRƯỜNGAdd commentMore actions
1.1. Cài Node.js (nên dùng phiên bản LTS, ví dụ v18.x hoặc v20.x)
Tải từ: https://nodejs.org/en/download
Kiểm tra phiên bản:
node -v

1.2. Cài pnpm (nếu chưa có)
nKiểm tra:pm install -g pnpm
pnpm -v

ƯỚC 2: CÀI ĐẶT DEPENDENCIES
Trong thư mục gốc dự án (nơi chứa package.json):
pnpm install

BƯỚC 3: CHẠY DỰ ÁN
pnpm dev

Mặc định, ứng dụng Next.js sẽ chạy tại: http://localhost:3000

Back end
