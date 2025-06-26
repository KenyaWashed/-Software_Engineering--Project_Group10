// Quy trình đăng nhập:
// 1. Nhận thông tin đăng nhập từ client (email, mật khẩu)
// 2. Kiểm tra tính hợp lệ của email hoặc sdt (email phải có định dạng hợp lệ, sdt phải là số và dài 10 ký tự).
// 3. Kiểm tra sự khớp của email và mật khẩu: Kiểm tra tồn tại và kiểm tra đúng mật khẩu.
// 4. Nếu đăng nhập thành công, ghi lại lịch sử đăng nhập và lưu thông tin người dùng vào session
// 5. Chọn hướng chuyển trang dựa trên vai trò của người dùng (admin, receptionist, khách hàng)
// 6. Trả về phản hồi cho client (thông báo thành công, thông tin người dùng, hướng chuyển trang)

const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');
const { check, validationResult } = require('express-validator');

exports.userLoginValidator = [ 
    check('email').isEmail().withMessage('Email không hợp lệ.'),
    check('password', 'Password is required').notEmpty(),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
];

exports.getUserIPAddress = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    let user_email = email.toLowerCase();
    let user_password = password;

    // 1. Kiểm tra tính hợp lệ của email và mật khẩu
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // 3. Kiểm tra mật khẩu
    const isAuthenticated = await userModels.authenticateUserByEmail(user_email, user_password);
    if (isAuthenticated === false) {
        return res.status(401).json({ error: '❌ Mật khẩu hoặc email không đúng' });
    }

    // 4. Lưu thông tin đăng nhập vào lịch sử
    const user = await userModels.getUserByEmail(user_email);
    if (!user) {
        return res.status(404).json({ error: '❌ Người dùng không tồn tại' });
    }
    const login_id = await userModels.writeLogWhenLogin(user.user_id, this.getUserIPAddress(req));

    // 4. Lưu thông tin người dùng vào session
    req.session.user = {
        email: user_email,
        role: await userModels.getUserRoleByEmail(user_email),
        login_id: login_id,
    };

    if (rememberMe) {
        req.session.cookie.maxAge = 3 * 24 * 60 * 60 * 1000; // 3 ngày
    } else {
        req.session.cookie.expires = false; // session sẽ hết khi đóng trình duyệt
    }

    // Xử lý chọn hướng chuyển trang
    let redirectTo = '/home'; // mặc định cho khách hàng
    if (req.session.user.role === 'admin' || req.session.user.role === 'receptionist') {
        redirectTo = '/dashboard';
    }

    return res.status(200).json({ message: '✅ Đăng nhập thành công', user: req.session.user, redirectTo });
};

exports.getTop10LoginHistory = async (req, res) => {
    try {
        const userId = req.session.user?.login_id;
        if (!userId) {
            return res.status(401).json({ error: 'Bạn chưa đăng nhập' });
        }

        const loginHistory = await userModels.getTop10LoginHistory();
        return res.status(200).json({ loginHistory });
    } catch (error) {
        console.error('❌ Lỗi khi lấy lịch sử đăng nhập:', error);
        return res.status(500).json({ error: 'Lỗi khi lấy lịch sử đăng nhập' });
    }
}