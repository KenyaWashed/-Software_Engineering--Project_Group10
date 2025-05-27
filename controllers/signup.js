// Quy trình đăng ký người dùng mới:
// 1. Nhận CCMND từ người dùng
// 2. Kiểm tra tính hợp lệ của CMND
// 3. Kiểm tra có tồn tại người dùng có CMND này chưa => Nhắc frontend xử lý sự kiện đã nhập xong trường CMND
// 4. Nếu chưa, cho người dùng tự nhập các trường còn lại
// 5. Nếu đã tồn tại, kiểm tra mật khẩu của người dùng này
// 6. Nếu mật khẩu rỗng (chưa có gì hết), hiển thị gợi ý người dùng về các thông tin đã tồn tại trong CSDL (và tự động điền nếu frontend làm được),
// sau đó cho người dùng nhập mật khẩu mới và cập nhật mật khẩu.
// 7. Nếu đã có, thông báo người dùng về việc đã có tài khoản với CMND này, và chọn CMND khác.
// 8. Khi nhập mật khẩu và các trường xong, kiểm tra tính hợp lệ của các trường trước khi duyệt. Nếu có lỗi phải thông báo cụ thể tại nơi bị lỗi.
// 9: Nếu không có lỗi, tạo người dùng mới và lưu vào cơ sở dữ liệu, sau đó cho người dùng vào trang chính ngay (không cần đăng nhập nữa)

const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');
const e = require('express');
const { check, validationResult } = require('express-validator');

exports.userCMNDValidator = [
    check('cmnd')
        .matches(/^\d+$/)
        .withMessage('cmnd must contain only numbers')
        .isLength(12)
        .withMessage('cmnd must be exactly 12 digits long')
];

exports.userSignupValidator = [
    check('user_name', 'Name is required').notEmpty(),
    check('user_email', 'Email must be between 3 to 32 characters')
        .matches(/.+@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
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

exports.checkCMNDOnly = async (req, res, next) => {
    const { cmnd } = req.body;

    // 1. Kiểm tra tính hợp lệ CMND
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // 2. Kiểm tra người dùng đã tồn tại chưa
    const isUserExists = await userModels.isUserExists(cmnd);
    
    if (isUserExists) {
        const existingUser = await userModels.getUserByCMND(cmnd);
        // Kiểm tra nếu đã tồn tại thì đã có mật khẩu hay chưa
        if (existingUser?.user_password) {
            return res.status(400).json({ error: 'Người dùng đã có tài khoản với CMND này, vui lòng chọn CMND khác hoặc đăng nhập.' });
        } else {
            // Cho frontend biết là user này đã có dữ liệu, chỉ cần nhập mật khẩu để hoàn tất
            return res.status(200).json({ 
                message: 'Người dùng tồn tại nhưng chưa hoàn tất đăng ký. Vui lòng nhập mật khẩu để hoàn tất.',
                suggest: {
                    cmnd,
                    user_name: existingUser.user_name || user_name,
                    user_email: existingUser.user_email || user_email,
                    user_address: existingUser.user_address || user_address,
                    phone_number: existingUser.phone_number || phone_number,
                    user_role: existingUser.user_role || user_role
                }
            });
        }
    }

    return res.status(204).send();
}

exports.signup = async (req, res, next) => {
    // 1. Kiểm tra tính hợp lệ của các trường
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

    const { cmnd, user_name, user_email, phone_number, user_address, user_password, user_role } = req.body;

    // 4. Tạo người dùng
    const result = await userModels.createUser(cmnd, user_name, user_email, phone_number, user_address, user_password, user_role);

    if (result instanceof Error) {
        console.error('❌ Lỗi tạo user:', result);
        return res.status(500).json({ error: 'Tạo user thất bại' });
    }

    // 5. Tạo session ngay sau khi đăng ký thành công
    req.session.user = {
        cmnd,
        user_role
    };

    console.log('✅ Đăng ký thành công và đã tạo phiên');
    res.status(201).json({ message: 'Đăng ký thành công', user: req.session.user });
};
