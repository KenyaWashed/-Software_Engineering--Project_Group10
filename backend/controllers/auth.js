// controllers/auth.js

exports.signup = (req, res) => {
    res.json({ message: "Đăng ký thành công" });
  };
  
  exports.signin = (req, res) => {
    res.json({ message: "Đăng nhập thành công" });
  };
  
  exports.signout = (req, res) => {
    res.json({ message: "Đã đăng xuất" });
  };
  
  exports.requireSignin = (req, res, next) => {
    // Đơn giản: giả sử ai cũng được phép
    next();
  };
  