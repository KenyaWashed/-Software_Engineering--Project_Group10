const { poolPromise } = require('../config/db');
const sql = require('mssql');

const getPolicies = async () => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request.query(`
      select policy_short_name, policy_name, policy_value from policy
    `);

    return result.recordset;
  } catch (error) {
    console.error('DB Error:', error);
    throw error;
  }
}

const updatePolicy = async (policy_short_name, policy_value, policy_notes) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input('policy_short_name', sql.Char(3), policy_short_name);
    request.input('policy_value', sql.Decimal(18, 2), policy_value);
    request.input('policy_notes', sql.NVarChar(sql.MAX), policy_notes || null); // nếu cần update notes

    const result = await request.query(`
      UPDATE policy
      SET policy_value = @policy_value,
          policy_notes = @policy_notes
      WHERE policy_short_name = @policy_short_name
    `);

    return result.rowsAffected[0];
  } catch (error) {
    console.error('DB Update Error:', error);
    throw error;
  }
};

const insertPolicy = async ({ policy_name, policy_short_name, policy_value, policy_notes }) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    request.input('policy_name', sql.NVarChar(100), policy_name);
    request.input('policy_short_name', sql.Char(3), policy_short_name);
    request.input('policy_value', sql.Decimal(18, 2), policy_value);
    request.input('policy_notes', sql.NVarChar(sql.MAX), policy_notes || null);

    const result = await request.query(`
      INSERT INTO Policy (policy_name, policy_short_name, policy_value, policy_notes)
      VALUES (@policy_name, @policy_short_name, @policy_value, @policy_notes)
    `);

    return result;
  } catch (error) {
    console.error('DB Insert Error:', error);
    throw error;
  }
};

module.exports = {
  getPolicies,
  updatePolicy,
  insertPolicy
};