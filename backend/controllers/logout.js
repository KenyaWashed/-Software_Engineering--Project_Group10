const express = require('express');
const userModels = require('../models/user');
const session = require('express-session');

exports.logout = async (req, res) => {
    try {
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

        // Ghi log khi người dùng đăng xuất
        if (req.session.user?.login_id) {
            await userModels.writeLogWhenLogOut(req.session.user.login_id);
        }
    } catch (error) {
        console.error('❌ Error during logout:', error);
        return res.status(500).json({ error: 'An error occurred during logout' });
    }
}