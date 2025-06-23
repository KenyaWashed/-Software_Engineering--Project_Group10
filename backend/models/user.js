const { sql, poolPromise } = require('../config/db');


exports.isUserExists = async (user_email) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_email', sql.NVarChar(100), user_email)
            .query('SELECT * FROM users WHERE user_email = @user_email');

        return result.recordset.length > 0;
    } catch (err) {
        console.error('❌ Error checking user existence:', err);
        return false;
    }
}

exports.getUserByEmail = async (user_email) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_email', sql.NVarChar(100), user_email)
            .query('SELECT * FROM users WHERE user_email = @user_email');

        return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
        console.error('❌ Error fetching user by user_email:', err);
        return null;
    }
}

exports.getUserRoleByEmail = async (user_email) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_email', sql.NVarChar(100), user_email)
            .query('SELECT user_role FROM users WHERE user_email = @user_email');

        return result.recordset.length > 0 ? result.recordset[0].user_role : null;
    } catch (err) {
        console.error('❌ Error fetching user role by user_email:', err);
        return null;
    }
}

exports.getUserPasswordByEmail = async (user_email) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_email', sql.NVarChar(100), user_email)
            .query('SELECT user_password FROM users WHERE user_email = @user_email');

        return result.recordset.length > 0 ? result.recordset[0].user_password : null;
    } catch (err) {
        console.error('❌ Error fetching user password by user_email:', err);
        return null;
    }
}

exports.getUserByPhone = async (phone_number) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('phone_number', sql.Char(10), phone_number)
            .query('SELECT * FROM users WHERE phone_number = @phone_number');

        return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
        console.error('❌ Error fetching user by phone number:', err);
        return null;
    }
}

exports.getUserRoleByPhone = async (phone_number) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('phone_number', sql.Char(10), phone_number)
            .query('SELECT user_role FROM users WHERE phone_number = @phone_number');

        return result.recordset.length > 0 ? result.recordset[0].user_role : null;
    } catch (err) {
        console.error('❌ Error fetching user role by phone number:', err);
        return null;
    }
}

exports.getUserPasswordByPhone = async (phone_number) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('phone_number', sql.Char(10), phone_number)
            .query('SELECT user_password FROM users WHERE phone_number = @phone_number');

        return result.recordset.length > 0 ? result.recordset[0].user_password : null;
    } catch (err) {
        console.error('❌ Error fetching user password by phone number:', err);
        return null;
    }
}

exports.roleDecider = (role) => {
    const roles = {
        2: 'guest',
        1: 'receptionist',
        0: 'admin',
    }
    return roles[role];
}

exports.createUser = async (user_name, full_name, user_email, phone_number, user_password, user_role) => {
    try {
        const roleString = this.roleDecider(user_role);
        const pool = await poolPromise;
        await pool.request()
            .input('user_name', sql.NVarChar(50), user_name)
            .input('full_name', sql.NVarChar(50), full_name)
            .input('user_email', sql.NVarChar(100), user_email)
            .input('phone_number', sql.Char(10), phone_number)
            .input('user_password', sql.VarChar(100), user_password)
            .input('user_role', sql.NVarChar(20), roleString)
            .query(`INSERT INTO users (user_name, full_name, user_email, phone_number, user_password, user_role)
                VALUES (@user_name, @full_name, @user_email, @phone_number, @user_password, @user_role)`);
    } catch (err) {
        console.error('❌ Error creating user:', err);
    }
}

// Hàm xác thực đăng nhập
exports.authenticateUserByEmail = async (user_email, user_password) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_email', sql.NVarChar(100), user_email)
            .query('SELECT user_password FROM users WHERE user_email = @user_email');

        if (result.recordset.length === 0) return false;

        return user_password === result.recordset[0].user_password;
    } catch (err) {
        console.error('❌ Error authenticating user:', err);
        return false;
    }
}

exports.writeLogWhenLogin = async (user_id, ip_address) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('ip_address', sql.VarChar(50), ip_address)
            .query(`
                INSERT INTO user_login_history (user_id, ip_address)
                OUTPUT INSERTED.login_id
                VALUES (@user_id, @ip_address)
            `);
        const login_id = result.recordset[0].login_id;
        return login_id;
    } catch (err) {
        console.error('❌ Error writing login log:', err);
        return -1; // Trả về -1 nếu có lỗi
    }
}

exports.getUserLoginHistory = async (user_id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query('SELECT * FROM user_login_history WHERE user_id = @user_id');

        return result.recordset;
    } catch (err) {
        console.error('❌ Error fetching user login history:', err);
        return [];
    }
}

exports.getTop10LoginHistory = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT TOP 10 * FROM user_login_history ORDER BY login_time DESC');

        return result.recordset;
    } catch (err) {
        console.error('❌ Error fetching top 10 login history:', err);
        return [];
    }
}

exports.writeLogWhenLogOut = async (login_id) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('login_id', sql.Int, login_id)
            .query(`UPDATE user_login_history SET logout_time = GETDATE() WHERE login_id = @login_id`);
    } catch (err) {
        console.error('❌ Error writing logout log:', err);
    }
}