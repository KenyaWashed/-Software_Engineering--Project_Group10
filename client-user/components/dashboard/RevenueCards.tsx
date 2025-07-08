import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import fakeTransactions from "./fakeTransactions";

interface RevenueCardProps {
  title: string;
  amount: string;
  className?: string;
}

function RevenueCard({ title, amount, className, onMenuClick }: RevenueCardProps & { onMenuClick?: () => void }) {
  return (
    <div
      className={cn(
        "w-64 h-20 bg-white rounded-2xl p-3 px-5 box-border relative",
        className,
      )}
    >
      <div className="flex justify-between items-center">
        <div className="text-black font-montserrat text-sm font-normal leading-normal mb-2">
          {title}
        </div>
        {onMenuClick && (
          <button
            className="text-xl text-gray-400 hover:text-black focus:outline-none"
            onClick={onMenuClick}
            title="Chi tiết doanh thu"
          >
            &#8942;
          </button>
        )}
      </div>
      <div className="text-black font-montserrat text-xl font-normal leading-normal">
        {amount}
      </div>
    </div>
  );
}

interface RevenueCardsProps {
  className?: string;
}

export default function RevenueCards({ className }: RevenueCardsProps) {
  // Tính tổng doanh thu theo ngày từ fakeTransactions
  const revenueByDate: { [date: string]: number } = {};
  fakeTransactions.forEach(row => {
    const date = row.date;
    const amount = Number(row.amount) || 0;
    if (!revenueByDate[date]) revenueByDate[date] = 0;
    revenueByDate[date] += amount;
  });
  const revenueRows = Object.entries(revenueByDate)
    .filter(([_, v]) => v !== 0)
    .sort((a, b) => {
      // dd/mm/yyyy -> yyyy-mm-dd
      const parse = (d: string) => {
        const [day, month, year] = d.split('/');
        return new Date(`${year}-${month}-${day}`).getTime();
      };
      return parse(b[0]) - parse(a[0]);
    });
  const totalRevenue = revenueRows.reduce((sum, [_, v]) => sum + v, 0);

  const [detailDate, setDetailDate] = useState<string | null>(null);

  return (
    <div className={cn("", className)}>
      <h2 className="text-black font-montserrat font-semibold text-xl leading-normal mb-6">
        DOANH THU
      </h2>
      <div className="flex gap-14 mb-8">
        <RevenueCard
          title="Đã thu hôm nay"
          amount={revenueRows.length && revenueRows[0][0] === new Date().toLocaleDateString('vi-VN') ? `VND ${revenueRows[0][1].toLocaleString()}` : "0"}
          onMenuClick={() => setDetailDate(revenueRows.length ? revenueRows[0][0] : null)}
        />
      </div>
      {/* Modal chi tiết doanh thu theo ngày */}
      {detailDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[350px] w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setDetailDate(null)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4">Chi tiết doanh thu ngày {detailDate}</h3>
            <table className="min-w-full divide-y divide-gray-300 font-montserrat mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Tên</th>
                  <th className="px-4 py-2 text-left">Số tiền</th>
                  <th className="px-4 py-2 text-left">Gói phòng</th>
                </tr>
              </thead>
              <tbody>
                {fakeTransactions.filter(row => row.date === detailDate).map((row, idx) => {
                  let soPhong = 'unknown';
                  let goiPhong = 'unknown';
                  const match = row.room.match(/(Phòng [^ ]+) (\d+)/);
                  if (match) {
                    goiPhong = match[1];
                    soPhong = match[2];
                  }
                  const goiPhongNumber = 1 + (parseInt(soPhong) % 4 || Math.floor(Math.random() * 4));
                  goiPhong = `Gói phòng ${goiPhongNumber}`;
                  return (
                    <tr key={idx} className="border-b border-gray-200 font-montserrat">
                      <td className="px-4 py-2">{row.name}</td>
                      <td className="px-4 py-2">{Number(row.amount).toLocaleString()}</td>
                      <td className="px-4 py-2">{goiPhong}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="text-right font-bold">
              Tổng: VND {fakeTransactions.filter(row => row.date === detailDate).reduce((sum, row) => sum + (Number(row.amount) || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}
      {/* Bảng lịch sử doanh thu */}
      <div className="bg-[#f5f5f5] rounded-md p-5">
        <h3 className="text-lg font-bold mb-4">Lịch sử doanh thu</h3>
        <table className="min-w-full divide-y divide-gray-300 font-montserrat">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Ngày</th>
              <th className="px-4 py-2 text-left">Tổng doanh thu</th>
              <th className="px-4 py-2 text-left">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {revenueRows.map(([date, amount]) => amount !== 0 && (
              <tr key={date} className="border-b border-gray-200 font-montserrat">
                <td className="px-4 py-2">{date}</td>
                <td className="px-4 py-2">{amount.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-xl text-gray-400 hover:text-black focus:outline-none"
                    onClick={() => setDetailDate(date)}
                    title="Chi tiết doanh thu"
                  >
                    &#8942;
                  </button>
                </td>
              </tr>
            ))}
            <tr className="font-bold text-blue-700">
              <td className="px-4 py-2">Tổng cộng</td>
              <td className="px-4 py-2">{totalRevenue.toLocaleString()}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}