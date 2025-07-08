"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function PoliciesContent() {
  const [policies, setPolicies] = useState([
    {
      title: "Check-in & Check-out",
      content: [
        "Check-in: từ 14:00",
        "Check-out: trước 12:00 trưa ngày rời đi",
        "Nhận phòng sớm hoặc trả phòng muộn có thể tính thêm phí (tùy tình trạng phòng trống)",
      ],
    },
    {
      title: "Đồ đạc cá nhân",
      content: [
        "Khách hàng tự bảo quản tài sản cá nhân",
        "Khách sạn không chịu trách nhiệm với tài sản thất lạc nếu không gửi tại quầy lễ tân",
      ],
    },
    {
      title: "Thanh toán",
      content: [
        "Chấp nhận tiền mặt, thẻ tín dụng, ví điện tử",
        "Thanh toán đầy đủ khi nhận phòng, hoặc đặt cọc tùy theo loại phòng",
      ],
    },
    {
      title: "Chính sách phụ thu",
      // Luôn để content rỗng, chỉ cập nhật từ API
      content: [],
      surchargeVars: {
        thirdGuest: null,
        foreignGuest: null,
      },
    },
  ]);

  const formatPolicyContent = (content: string) => {
    // Highlight percentages in bold
    return content.replace(
      /(\d+%)/g,
      '<span style="font-weight: 900;">$1</span>',
    );
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState<string[]>([]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditTitle(policies[index].title);
    setEditContent([...policies[index].content]);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditTitle("");
    setEditContent([]);
  };

  const handleSave = async (index: number) => {
    // Nếu là chính sách phụ thu thì gọi API cập nhật
    if (policies[index].title === "Chính sách phụ thu") {
      // Lấy giá trị mới từ editContent
      const thirdMatch = editContent[0]?.match(/(\d+)%/);
      const foreignMatch = editContent[2]?.match(/(\d+)%/);
      const thirdValue = thirdMatch ? parseFloat(thirdMatch[1]) / 100 : null;
      const foreignValue = foreignMatch ? parseFloat(foreignMatch[1]) / 100 : null;
      // Gọi API cập nhật cho từng loại phụ thu nếu có thay đổi
      try {
        if (thirdValue !== null) {
          await fetch('http://localhost:4000/policy/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              policy_short_name: 'KH3',
              policy_value: thirdValue,
              policy_notes: 'Cập nhật từ dashboard',
            })
          });
        }
        if (foreignValue !== null) {
          await fetch('http://localhost:4000/policy/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              policy_short_name: 'KNN',
              policy_value: foreignValue,
              policy_notes: 'Cập nhật từ dashboard',
            })
          });
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật chính sách phụ thu:', error);
      }
    }
    // Update policies state so UI re-renders
    setPolicies(prev => {
      const updated = [...prev];
      updated[index] = { title: editTitle, content: [...editContent] };
      return updated;
    });
    setEditingIndex(null);
  };

  // Surcharge variables for dynamic content
  const [surchargeThirdGuest, setSurchargeThirdGuest] = useState<number | null>(null);
  const [surchargeForeignGuest, setSurchargeForeignGuest] = useState<number | null>(null);

  // Fetch phụ thu policy from API
  useEffect(() => {
    fetch('http://localhost:4000/policy/get', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.policies)) {
          let third = null, foreign = null;
          data.policies.forEach((item) => {
            if (item.policy_short_name === 'KH3') third = item.policy_value;
            if (item.policy_short_name === 'KNN') foreign = item.policy_value;
          });
          setSurchargeThirdGuest(third);
          setSurchargeForeignGuest(foreign);
          setPolicies(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(p => p.title === "Chính sách phụ thu");
            if (idx !== -1) {
              // Tạo đúng 4 dòng, loại bỏ trùng lặp bằng Set
              const surchargeLines = [
                third !== null ? `Phụ thu ${(third * 100).toFixed(0)}% đối với khách ở thêm người so với số lượng quy định của phòng` : "",
                "Phụ thu dịp Lễ/Tết: 20%",
                foreign !== null ? `Khách nước ngoài: áp dụng phụ thu ${(foreign * 100).toFixed(0)}% trên tổng giá trị đơn đặt phòng để hỗ trợ chi phí quản lý, phiên dịch, và các thủ tục liên quan` : "",
                "Mọi mức phụ thu được thông báo rõ ràng tại thời điểm đặt phòng và khi nhận phòng"
              ].filter(Boolean);
              // Loại bỏ dòng trùng lặp
              const uniqueContent = Array.from(new Set(surchargeLines));
              updated[idx] = {
                ...updated[idx],
                content: uniqueContent,
                surchargeVars: {
                  thirdGuest: third,
                  foreignGuest: foreign,
                }
              };
            }
            return updated;
          });
        }
      });
  }, []);

  // Lưu policies vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('hotel_policies', JSON.stringify(policies));
  }, [policies]);

  // Khi load trang, lấy policies từ localStorage nếu có
  useEffect(() => {
    const saved = localStorage.getItem('hotel_policies');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPolicies(parsed);
        }
      } catch {}
    }
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicyTitle, setNewPolicyTitle] = useState("");
  const [newPolicyContent, setNewPolicyContent] = useState<string[]>([""]);

  const handleAddPolicy = () => {
    if (!newPolicyTitle.trim() || newPolicyContent.every(line => !line.trim()))
      return;
    const newPolicy = { title: newPolicyTitle, content: newPolicyContent.filter(line => line.trim()) };
    setPolicies(prev => [
      ...prev,
      newPolicy
    ]);
    setShowAddModal(false);
    setNewPolicyTitle("");
    setNewPolicyContent([""]);
  };

  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="p-6 font-montserrat">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-bold text-black">
              Chính sách khách sạn
            </h1>
            <button
              type="button"
              className="bg-[#00868D] text-white px-12 py-4 rounded-md font-medium text-base mt-2"
              onClick={() => setShowAddModal(true)}
            >
              +Thêm chính sách
            </button>
          </div>

          {/* Policy Sections */}
          <div className="space-y-7">
            {policies.map((policy, index) => (
              <div key={index} className="bg-[#202020] rounded-md p-5">
                <div className="flex justify-between items-start gap-20">
                  <div className="flex-1">
                    <div className="flex gap-25">
                      {editingIndex === index ? (
                        <input
                          className="text-black font-bold text-base min-w-[200px] shrink-0 rounded px-2 py-1 mb-2"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                        />
                      ) : (
                        <h3 className="text-white font-bold text-base min-w-[200px] shrink-0">
                          {policy.title}
                        </h3>
                      )}
                      <div className="flex-1">
                        {editingIndex === index ? (
                          <div className="space-y-2">
                            {editContent.map((line, lineIdx) => (
                              <div key={lineIdx} className="flex gap-2 items-center">
                                <textarea
                                  className="w-full rounded px-2 py-1 text-black"
                                  value={line}
                                  onChange={e => {
                                    const newContent = [...editContent];
                                    newContent[lineIdx] = e.target.value;
                                    setEditContent(newContent);
                                  }}
                                />
                                <button
                                  className="text-red-500 font-bold px-2"
                                  type="button"
                                  onClick={() => {
                                    setEditContent(editContent.filter((_, i) => i !== lineIdx));
                                  }}
                                >
                                  Xóa
                                </button>
                              </div>
                            ))}
                            <button
                              className="bg-teal-600 text-white px-3 py-1 rounded mt-2"
                              type="button"
                              onClick={() => setEditContent([...editContent, ""])}
                            >
                              + Thêm dòng
                            </button>
                          </div>
                        ) : (
                          policy.content.map((line, lineIndex) => (
                            <div
                              key={lineIndex}
                              className="text-white font-normal text-base mb-1"
                            >
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: formatPolicyContent(line),
                                }}
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8 gap-2">
                  {editingIndex === index ? (
                    <>
                      <button
                        className="bg-teal-600 text-white rounded-[10px] px-8 py-2 font-normal text-base"
                        type="button"
                        onClick={() => handleSave(index)}
                      >
                        Lưu
                      </button>
                      <button
                        className="bg-gray-400 text-white rounded-[10px] px-8 py-2 font-normal text-base"
                        type="button"
                        onClick={handleCancel}
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-[#111111] border border-[#FF1010] rounded-[10px] px-16 py-2 text-[#FF1010] font-normal text-base"
                      type="button"
                      onClick={() => handleEdit(index)}
                    >
                      Sửa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-8 min-w-[350px] w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              onClick={() => setShowAddModal(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-center">Thêm chính sách mới</h2>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-semibold">Tên chính sách</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={newPolicyTitle}
                onChange={e => setNewPolicyTitle(e.target.value)}
                placeholder="Nhập tên chính sách..."
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700 font-semibold">Nội dung chính sách</label>
              {newPolicyContent.map((line, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    value={line}
                    onChange={e => {
                      const updated = [...newPolicyContent];
                      updated[idx] = e.target.value;
                      setNewPolicyContent(updated);
                    }}
                    rows={2}
                    placeholder={`Nội dung dòng ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="text-red-500 font-bold px-2"
                    onClick={() => setNewPolicyContent(newPolicyContent.filter((_, i) => i !== idx))}
                    disabled={newPolicyContent.length === 1}
                  >
                    Xóa
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bg-teal-600 text-white px-3 py-1 rounded mt-2"
                onClick={() => setNewPolicyContent([...newPolicyContent, ""])}
              >
                + Thêm dòng
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowAddModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700"
                onClick={handleAddPolicy}
                disabled={!newPolicyTitle.trim() || newPolicyContent.every(line => !line.trim())}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}