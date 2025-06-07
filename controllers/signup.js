// Quy trình đăng ký người dùng mới:
// 1. Nhận các thông tin đăng ký từ người dùng: họ tên, email, sdt, mật khẩu, xác nhận mật khẩu.
// 2. Kiểm tra tính hợp lệ của các trường.
// 3. Kiểm tra có tồn tại người dùng có email và sdt này chưa, chưa thì thôi
// 6. Nếu đã có, thông báo người dùng về việc đã có tài khoản với email/sdt này, và chọn email/sdt khác.
// 7. Kiểm tra sự khớp giữa mật khẩu và xác nhận mật khẩu.
// 8. Nếu không có lỗi, tạo người dùng mới và lưu vào cơ sở dữ liệu, sau đó cho người dùng vào trang chính ngay (không cần đăng nhập nữa)

const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');
const e = require('express');
const { check, validationResult } = require('express-validator');

exports.userSignupValidator = [
    check('user_name', 'Name is required').notEmpty(),
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
    check('phone_number', 'Phone number is required').notEmpty(),
    check('phone_number')
        .matches(/^\d+$/)
        .withMessage('Phone number must contain only numbers')
        .isLength(10)
        .withMessage('Phone number must be exactly 10 digits long'),
    check('user_password', 'Password is required').notEmpty(),
    check('user_password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number'),
    ];

exports.signup = async (req, res) => {
    // 1. Kiểm tra tính hợp lệ của các trường
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    const { user_name, user_email, phone_number, user_password, user_repassword } = req.body;

    // 3. Kiểm tra có tồn tại người dùng có email này chưa, chưa thì thôi
    const existingUser = await userModels.getUserByEmail(user_email);
    if (existingUser) {
        return res.status(400).json({ error: 'Người dùng đã có tài khoản với email này, vui lòng chọn email khác hoặc đăng nhập.' });
    }

    // 4. Kiểm tra có tồn tại người dùng có sdt này chưa, chưa thì thôi
    const existingPhoneUser = await userModels.getUserByPhone(phone_number);
    if (existingPhoneUser) {
        return res.status(400).json({ error: 'Người dùng đã có tài khoản với số điện thoại này, vui lòng chọn số khác hoặc đăng nhập.' });
    }

    if (user_password !== user_repassword) {
        return res.status(400).json({ error: 'Mật khẩu và xác nhận mật khẩu không khớp.' });
    }

    const result = await userModels.createUser(user_email, user_name, phone_number, user_password, 2); // 2 là guest
    if (result instanceof Error) {
        console.error('❌ Lỗi tạo user:', result);
        return res.status(500).json({ error: 'Tạo người dùng thất bại' });
    }
    console.log('✅ Tạo người dùng mới thành công');
    req.session.user = {
        user_email: user_email,
        phone_number: phone_number,
        user_role: 2, // 2 là guest
    };
    console.log('✅ Đăng ký thành công và đã tạo phiên cho người dùng mới');
    return res.status(200).json({ message: 'Đăng ký thành công', user: req.session.user });
};
