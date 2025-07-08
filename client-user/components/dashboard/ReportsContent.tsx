"use client";
import Sidebar from "./Sidebar";
import fakeTransactions from "./fakeTransactions";
import React, { use, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Sắp xếp ngày mới nhất về trước và loại bỏ phòng unknown
const sortedTransactions = fakeTransactions
  .filter(row => {
    // Tách số phòng từ row.room
    const match = row.room.match(/(Phòng [^ ]+) (\d+)/);
    return match && match[2] !== 'unknown';
  })
  .sort((a, b) => {
    // Chuyển ngày dd/mm/yyyy thành yyyy-mm-dd để so sánh
    const parse = (d: string) => {
      const [day, month, year] = d.split('/');
      return new Date(`${year}-${month}-${day}`).getTime();
    };
    return parse(b.date) - parse(a.date);
  });

// Tính tổng doanh thu theo ngày
const revenueByDate: { [date: string]: number } = {};
sortedTransactions.forEach(row => {
  const date = row.date;
  const amount = Number(row.amount) || 0;
  if (!revenueByDate[date]) revenueByDate[date] = 0;
  revenueByDate[date] += amount;
});
const revenueRows = Object.entries(revenueByDate)
  .sort((a, b) => {
    // dd/mm/yyyy -> yyyy-mm-dd
    const parse = (d: string) => {
      const [day, month, year] = d.split('/');
      return new Date(`${year}-${month}-${day}`).getTime();
    };
    return parse(b[0]) - parse(a[0]);
  });
const totalRevenue = revenueRows.reduce((sum, [_, v]) => sum + v, 0);

export default function ReportsContent() {
  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const totalPages = Math.ceil(sortedTransactions.length / pageSize);
  const pagedData = sortedTransactions.slice((page - 1) * pageSize, page * pageSize);

  // Hàm xuất dữ liệu ra Excel
  const exportToExcel = () => {
    // Chuyển đổi dữ liệu thành mảng các object đơn giản
    const data = sortedTransactions.map(row => {
      let soPhong = 'unknown';
      let goiPhong = 'unknown';
      const match = row.room.match(/(Phòng [^ ]+) (\d+)/);
      if (match) {
        goiPhong = match[1];
        soPhong = match[2];
      }
      // Sửa dữ liệu gói phòng thành 'Gói phòng 1' đến 'Gói phòng 4' (random)
      const goiPhongNumber = 1 + (parseInt(soPhong) % 4 || Math.floor(Math.random() * 4));
      goiPhong = `Gói phòng ${goiPhongNumber}`;
      return {
        "Tên": row.name,
        "Số tiền": row.amount,
        "Ngày": row.date,
        "Số phòng": soPhong,
        "Gói phòng": goiPhong,
        "Tỉ lệ phụ thu": row.surcharge,
        "Số điện thoại": row.phone
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LichSuGiaoDich");
    XLSX.writeFile(wb, `lich_su_giao_dich_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Hàm xuất dữ liệu ra PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Lịch sử giao dịch", 14, 16);
    const data = sortedTransactions.map(row => {
      let soPhong = 'unknown';
      let goiPhong = 'unknown';
      const match = row.room.match(/(Phòng [^ ]+) (\d+)/);
      if (match) {
        goiPhong = match[1];
        soPhong = match[2];
      }
      // Sửa dữ liệu gói phòng thành 'Gói phòng 1' đến 'Gói phòng 4' (random)
      const goiPhongNumber = 1 + (parseInt(soPhong) % 4 || Math.floor(Math.random() * 4));
      goiPhong = `Gói phòng ${goiPhongNumber}`;
      return [
        row.name,
        row.amount,
        row.date,
        soPhong,
        goiPhong,
        row.surcharge,
        row.phone
      ];
    });
    autoTable(doc, {
      head: [["Tên", "Số tiền", "Ngày", "Số phòng", "Gói phòng", "Tỉ lệ phụ thu", "Số điện thoại"]],
      body: data,
      startY: 22,
    });
    doc.save(`lich_su_giao_dich_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <div className="flex min-h-[calc(100vh-32px)] bg-dashboard-bg font-montserrat">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="bg-[#202020] rounded-md m-4 p-5 text-white min-h-[80vh] flex flex-col">
          <div className="px-3 flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-7 gap-4">
              <h1 className="text-xl font-semibold font-montserrat text-white">
                Lịch sử giao dịch
              </h1>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-montserrat"
                onClick={exportToExcel}
              >
                Xuất Excel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-montserrat"
                onClick={exportToPDF}
              >
                Xuất PDF
              </button>
            </div>
            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="min-w-full divide-y divide-gray-700 font-montserrat">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Tên</th>
                    <th className="px-4 py-2 text-left">Số tiền</th>
                    <th className="px-4 py-2 text-left">Ngày</th>
                    <th className="px-4 py-2 text-left">Số phòng</th>
                    <th className="px-4 py-2 text-left">Gói phòng</th>
                    <th className="px-4 py-2 text-left">Tỉ lệ phụ thu</th>
                    <th className="px-4 py-2 text-left">Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((row, idx) => {
                    // Tách số phòng và gói phòng từ row.room
                    let soPhong = 'unknown';
                    let goiPhong = 'unknown';
                    const match = row.room.match(/(Phòng [^ ]+) (\d+)/);
                    if (match) {
                      goiPhong = match[1];
                      soPhong = match[2];
                    }
                    // Sửa dữ liệu gói phòng thành 'Gói phòng 1' đến 'Gói phòng 4' (random hoặc theo số phòng)
                    const goiPhongNumber = 1 + (parseInt(soPhong) % 4 || Math.floor(Math.random() * 4));
                    goiPhong = `Gói phòng ${goiPhongNumber}`;
                    return (
                      <tr key={idx} className="border-b border-gray-800 hover:bg-gray-900 font-montserrat">
                        <td className="px-4 py-2">{row.name}</td>
                        <td className="px-4 py-2">{row.amount}</td>
                        <td className="px-4 py-2">{row.date}</td>
                        <td className="px-4 py-2">{soPhong}</td>
                        <td className="px-4 py-2">{goiPhong}</td>
                        <td className="px-4 py-2">{row.surcharge}</td>
                        <td className="px-4 py-2">{row.phone}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 font-montserrat"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Trước
              </button>
              <span className="font-montserrat">
                Trang {page} / {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-700 text-white disabled:opacity-50 font-montserrat"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}