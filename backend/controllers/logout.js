const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');

exports.logout = async (req, res) => {
    try {
        // Lưu lại login_id trước khi destroy session
        const login_id = req.session.user?.login_id;

        // Ghi log khi người dùng đăng xuất
        if (login_id) {
            await userModels.writeLogWhenLogOut(login_id);
        }

        // Xóa thông tin người dùng khỏi session
        req.session.destroy((err) => {
            if (err) {
                console.error('❌ Error destroying session:', err);
                return res.status(500).json({ error: 'Failed to log out' });
            }
            res.clearCookie('connect.sid');
            console.log('✅ User logged out successfully');
            return res.status(200).json({ message: 'Logged out successfully' });
        });

    } catch (error) {
        console.error('❌ Error during logout:', error);
        return res.status(500).json({ error: 'An error occurred during logout' });
    }
}