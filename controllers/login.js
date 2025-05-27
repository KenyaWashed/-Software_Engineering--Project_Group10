// Quy trình đăng nhập:
// 1. Nhận thông tin đăng nhập từ client (cmnd, mật khẩu)
// 2. Kiểm tra tính hợp lệ của thông tin (cmnd phải là số, mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất một số).
// 3. Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
// 4. Nếu chưa tồn tại, gợi ý người dùng chuyển hướng sang chức năng đăng ký.
// 5. Nếu đã tồn tại, kiểm tra sự khớp của cmnd và mật khẩu.


const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');
const { check, validationResult } = require('express-validator');

exports.userLoginValidator = [ 
    check('cmnd')
        .matches(/^\d+$/)
        .withMessage('cmnd must contain only numbers')
        .isLength(12)
        .withMessage('cmnd must be exactly 12 digits long'),
    check('user_password', 'Password is required').notEmpty(),
    check('user_password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
];

exports.login = async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        
    const { cmnd, user_password } = req.body;

    try {
        const isUserExists = await userModels.isUserExists(cmnd);
        if (!isUserExists) {
            return res.status(404).json({
                error: 'Người dùng không tồn tại',
                shouldRedirect: true,
                redirectTo: '/signup' 
            });
        }

        const isAuthenticated = await userModels.authenticateUser(cmnd, user_password);
        if (!isAuthenticated) {
            return res.status(401).json({ error: '❌ Mật khẩu không đúng' });
        }

        // ✅ Lưu thông tin người dùng vào session
        req.session.user = {
            cmnd: cmnd,
            user_role: await userModels.getUserRoleByCMND(cmnd), // Lấy role từ cơ sở dữ liệu
        };

        return res.status(200).json({ message: '✅ Đăng nhập thành công', redirectTo: '/home' });

    } catch (err) {
        console.error('❌ Lỗi đăng nhập:', err);
        return res.status(500).json({ error: '❌ Lỗi máy chủ. Vui lòng thử lại sau.' });
    }
};