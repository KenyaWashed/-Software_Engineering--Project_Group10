const express = require("express");
const router = express.Router();

const signup = require("../controllers/signup");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const session = require('../controllers/session');

router.post('/api/login-user', login.userLoginValidator, login.login);
router.post('/api/register-user', signup.userSignupValidator, signup.signup);
router.get('/api/logout', logout.logout);
// Route: kiểm tra session hiện tại
router.get('/api/check-session', session.checkSession);

// Lấy thông tin user
router.get('/api/me', session.getCurrentUser);

module.exports = router;