const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = {
    getResults: async (sql, params = []) => {
        const [rows] = await pool.query(sql, params);
        return rows;
    },

    insert: async (table, data) => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.map(k => `\`${k}\``).join(', ');
        const sql = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
        const [result] = await pool.query(sql, values);
        return result;
    },

    update: async (table, data, condition = {}) => {
        const setKeys = Object.keys(data);
        const setClause = setKeys.map(k => `\`${k}\` = ?`).join(', ');
        const setValues = Object.values(data);

        const whereKeys = Object.keys(condition);
        const whereClause = whereKeys.map(k => `\`${k}\` = ?`).join(' AND ');
        const whereValues = Object.values(condition);

        const sql = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`;
        const [result] = await pool.query(sql, [...setValues, ...whereValues]);
        return result;
    },

    pool
};
