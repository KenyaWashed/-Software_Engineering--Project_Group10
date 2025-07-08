const RoomModel = require("../models/policyModel");

const getPolicies = async (req, res) => {
  try {
    const policies = await RoomModel.getPolicies();
    res.json({
      policies,
    });
  } catch (error) {
    console.error("Error in getPolicies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { policy_short_name, policy_value , policy_notes} = req.body;

    if (!policy_short_name || policy_value === undefined) {
      return res.status(400).json({ message: "Thiếu tham số." });
    }

    const rowsAffected = await RoomModel.updatePolicy(policy_short_name, policy_value, policy_notes);

    if (rowsAffected === 0) {
      return res.status(404).json({ message: "Không tìm thấy chính sách." });
    }

    return res.status(200).json({ message: "Cập nhật thành công." });
  } catch (error) {
    console.error("Lỗi khi cập nhật chính sách:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

const addPolicy = async (req, res) => {
  try {
    const { policy_name, policy_short_name, policy_value, policy_notes } = req.body;

    // Kiểm tra dữ liệu đầu vào (có thể dùng express-validator nâng cao hơn)
    if (!policy_name || !policy_short_name || !policy_value) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const result = await RoomModel.insertPolicy({
      policy_name,
      policy_short_name,
      policy_value,
      policy_notes
    });

    res.status(201).json({ message: '✅ Thêm chính sách thành công', result });
  } catch (error) {
    console.error('❌ Lỗi thêm chính sách:', error);
    res.status(500).json({ message: '❌ Lỗi server khi thêm chính sách' });
  }
};

module.exports = {
  getPolicies,
  updatePolicy,
  addPolicy
};