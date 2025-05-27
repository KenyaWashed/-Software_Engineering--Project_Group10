const { sql, poolPromise } = require('../config/db');



exports.isUserExists = async (cmnd) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('cmnd', sql.Char(12), cmnd)
            .query('SELECT * FROM app_user WHERE cmnd = @cmnd');

        return result.recordset.length > 0;
    } catch (err) {
        console.error('❌ Error checking user existence:', err);
        return false;
    }
}

exports.getUserByCMND = async (cmnd) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('cmnd', sql.Char(12), cmnd)
            .query('SELECT * FROM app_user WHERE cmnd = @cmnd');

        return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (err) {
        console.error('❌ Error fetching user by CMND:', err);
        return null;
    }
}

exports.getUserRoleByCMND = async (cmnd) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('cmnd', sql.Char(12), cmnd)
            .query('SELECT user_role FROM app_user WHERE cmnd = @cmnd');

        return result.recordset.length > 0 ? result.recordset[0].user_role : null;
    } catch (err) {
        console.error('❌ Error fetching user role by CMND:', err);
        return null;
    }
}

exports.getUserPasswordByCMND = async (cmnd) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('cmnd', sql.Char(12), cmnd)
            .query('SELECT user_password FROM app_user WHERE cmnd = @cmnd');

        return result.recordset.length > 0 ? result.recordset[0].user_password : null;
    } catch (err) {
        console.error('❌ Error fetching user password by CMND:', err);
        return null;
    }
}

exports.roleDecider = (role) => {
    const roles = {
        0: 'Chủ khách sạn',
        1: 'Lễ tân',
        2: 'Khách nước ngoài',
        3: 'Khác nội địa'
    }
    return roles[role] || 'Khách hàng';
}

exports.updateUser = async (
    cmnd, user_name, user_email, phone_number, user_address, user_password, user_role
) => {
    try {
        const roleString = this.roleDecider(user_role);

        const pool = await poolPromise;
        await pool.request()
            .input('cmnd', sql.Char(12), cmnd)
            .input('user_name', sql.VarChar(100), user_name)
            .input('user_email', sql.VarChar(100), user_email)
            .input('phone_number', sql.VarChar(15), phone_number)
            .input('user_address', sql.VarChar(255), user_address)
            .input('user_password', sql.VarChar(100), user_password)
            .input('user_role', sql.NVarChar(20), roleString)
            .query(`
                UPDATE app_user
                SET user_name = @user_name,
                    user_email = @user_email,
                    phone_number = @phone_number,
                    user_address = @user_address,
                    cmnd = @cmnd,
                    user_password = @user_password,
                    user_role = @user_role
                WHERE cmnd = @cmnd
            `);
    } catch (err) {
        console.error('❌ Error updating user:', err);
    }
};


exports.createUser = async (cmnd, user_name, user_email, phone_number, user_address, user_password, user_role) => {
    try {
        const roleString = this.roleDecider(user_role);

        const pool = await poolPromise;
        await pool.request()
            .input('cmnd', sql.Char(12), cmnd)
            .input('user_name', sql.VarChar(100), user_name)
            .input('user_email', sql.VarChar(100), user_email)
            .input('phone_number', sql.VarChar(15), phone_number)
            .input('user_address', sql.VarChar(255), user_address)
            .input('user_password', sql.VarChar(100), user_password)
            .input('user_role', sql.NVarChar(20), roleString)
            .query(`INSERT INTO app_user (cmnd, user_name, user_email, phone_number, user_address, user_password, user_role)
                VALUES (@cmnd, @user_name, @user_email, @phone_number, @user_address, @user_password, @user_role)`);
    } catch (err) {
        console.error('❌ Error creating user:', err);
    }
}

// Hàm xác thực đăng nhập
exports.authenticateUser = async (cmnd, user_password) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('cmnd', sql.Char(12), cmnd)
            .query('SELECT user_password FROM app_user WHERE cmnd = @cmnd');

        if (result.recordset.length === 0) return false;

        return user_password === result.recordset[0].user_password;
    } catch (err) {
        console.error('❌ Error authenticating user:', err);
        return false;
    }
}