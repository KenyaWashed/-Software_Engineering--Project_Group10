const express = require("express");
const router = express.Router();

const signup = require("../controllers/signup");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const sessionController = require('../controllers/session');

router.post('/login', login.userLoginValidator, login.login);
router.post("/signup", signup.userSignupValidator, signup.signup);
router.get("/logout", logout.logout);
// Route: kiểm tra session hiện tại
router.get('/check-session', sessionController.checkSession);

// Route cần quyền Chủ khách sạn
router.get('/admin-only', sessionController.checkHotelOwner, (req, res) => {
  res.status(200).send('✅ Chào mừng Chủ khách sạn!');
});

// Route cần quyền Lễ tân
router.get('/receptionist-only', sessionController.checkReceptionist, (req, res) => {
  res.status(200).send('✅ Chào mừng Lễ tân!');
});

module.exports = router;