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



module.exports = {
  getPolicies
};
