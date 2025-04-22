const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { signup, signin, signout, requireSignin } = require('../controllers/auth');

// Đăng ký người dùng mới
router.post(
  '/signup',
  [
    check('name', 'Tên là bắt buộc').notEmpty(),
    check('email', 'Email phải hợp lệ').isEmail(),
    check('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({ min: 6 })
  ],
  signup
);

// Đăng nhập
router.post(
  '/signin',
  [
    check('email', 'Email phải hợp lệ').isEmail(),
    check('password', 'Mật khẩu là bắt buộc').notEmpty()
  ],
  signin
);

// Đăng xuất
router.get('/signout', signout);

// Route test yêu cầu đăng nhập (middleware requireSignin)
router.get('/secret', requireSignin, (req, res) => {
  res.json({ message: 'Đã đăng nhập, truy cập được nội dung bảo mật' });
});

module.exports = router;
