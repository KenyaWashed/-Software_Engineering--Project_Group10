import fakeTransactions from "./fakeTransactions";

export default function RevenueHistory() {
  // Tính tổng doanh thu theo ngày từ fakeTransactions
  const revenueByDate: { [date: string]: number } = {};
  fakeTransactions.forEach((row) => {
    // Lấy số tiền dạng "VND 1,000,000" => 1000000
    const amount = Number((row.amount || "").replace(/[^\d]/g, "")) || 0;
    if (!revenueByDate[row.date]) revenueByDate[row.date] = 0;
    revenueByDate[row.date] += amount;
  });
  const revenueRows = Object.entries(revenueByDate)
    .filter(([_, v]) => v !== 0)
    .sort((a, b) => {
      // dd/mm/yyyy -> yyyy-mm-dd
      const parse = (d: string) => {
        const [day, month, year] = d.split("/");
        return new Date(`${year}-${month}-${day}`).getTime();
      };
      return parse(b[0]) - parse(a[0]);
    });
  const totalRevenue = revenueRows.reduce((sum, [_, v]) => sum + v, 0);

  // Chỉ lấy 10 dòng gần nhất
  const latestRevenueRows = revenueRows.slice(0, 10);

  return (
    <div className="bg-[#202020] rounded-md p-4 text-white">
      <h3 className="text-xl font-semibold font-montserrat mb-6">
        Lịch sử doanh thu
      </h3>
      <div className="space-y-5">
        {latestRevenueRows.map(([date, amount], index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-[#111111] rounded-md p-4"
          >
            <span className="text-base">{date}</span>
            <span className="text-base">VND {amount.toLocaleString()}</span>
          </div>
        ))}
        <div className="flex items-center justify-between bg-[#232323] rounded-md p-4 font-bold text-yellow-400 mt-4">
          <span>Tổng cộng</span>
          <span>VND {totalRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}