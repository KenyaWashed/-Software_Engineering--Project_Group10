const express = require("express");
const router = express.Router();

const signup = require("../controllers/signup");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const sessionController = require('../controllers/session');

router.post('/api/login-user', login.userLoginValidator, login.login);
router.post("/api/register-user", signup.userSignupValidator, signup.signup);
router.get("/api/logout", logout.logout);
// Route: kiểm tra session hiện tại
router.get('/api/check-session', sessionController.checkSession);

// Route cần quyền Chủ khách sạn
router.get('/api/admin-only', sessionController.checkHotelOwner, (req, res) => {
  res.status(200).send('✅ Chào mừng Chủ khách sạn!');
});

// Route cần quyền Lễ tân
router.get('/api/receptionist-only', sessionController.checkReceptionist, (req, res) => {
  res.status(200).send('✅ Chào mừng Lễ tân!');
});

module.exports = router;