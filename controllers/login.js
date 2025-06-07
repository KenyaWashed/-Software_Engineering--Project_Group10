// Quy trình đăng nhập:
// 1. Nhận thông tin đăng nhập từ client (email, mật khẩu)
// 2. Kiểm tra tính hợp lệ của email hoặc sdt (email phải có định dạng hợp lệ, sdt phải là số và dài 10 ký tự).
// 3. Kiểm tra sự khớp của email và mật khẩu: Kiểm tra tồn tại và kiểm tra đúng mật khẩu.
// 4. Nếu đăng nhập thành công, lưu thông tin người dùng vào session và chuyển sang trang chính.

const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');
const { check, validationResult } = require('express-validator');

exports.userLoginValidator = [ 
    check('user_email')
        .isLength({ min: 4, max: 32 })
        .withMessage('Email must be between 4 to 32 characters')
        .matches(/.+@.+\..+/)
        .withMessage('Email must contain @ and a valid domain')
        .custom((value) => {
            const atCount = (value.match(/@/g) || []).length;
            if (atCount > 1) {
                throw new Error('Email must not contain more than one @ symbol');
            }
            return true;
        }),
    check('user_password', 'Password is required').notEmpty(),
    check('user_password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
];

exports.login = async (req, res) => {
    const { user_email, user_password, remember } = req.body;

    // 1. Kiểm tra tính hợp lệ của email và mật khẩu
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // 3. Kiểm tra mật khẩu
    const isAuthenticated = await userModels.authenticateUserByEmail(user_email, user_password);
    if (!isAuthenticated) {
        return res.status(401).json({ error: '❌ Mật khẩu không đúng' });
    }

    // 4. Lưu thông tin người dùng vào session
    req.session.user = {
        email: user_email,
        role: await userModels.getUserRoleByEmail(user_email),
    };

    if (remember) {
        req.session.cookie.maxAge = 3 * 24 * 60 * 60 * 1000; // 3 ngày
    } else {
        req.session.cookie.expires = false; // session sẽ hết khi đóng trình duyệt
    }

    return res.status(200).json({ message: '✅ Đăng nhập thành công', redirectTo: '/home' });
};