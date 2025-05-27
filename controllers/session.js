const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');


exports.checkSession = (req, res, next) => {
    if (req.session?.user) {
        res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(401).json({ loggedIn: false, error: 'Bạn chưa đăng nhập' });
    }
};

// Middleware kiểm tra quyền (dùng cho chủ khách sạn)
exports.checkHotelOwner = (req, res, next) => {
  if (req.session && req.session.user?.user_role !== 'Chủ khách sạn') {
    return res.status(403).send('Bạn không có quyền truy cập!');
  }
  next();
};

// Middleware kiểm tra quyền (dùng cho lễ tân)
exports.checkReceptionist = (req, res, next) => {
  if (req.session && req.session.user?.user_role !== 'Lễ tân') {
    return res.status(403).send('Bạn không có quyền truy cập!');
  }
  next();
};
