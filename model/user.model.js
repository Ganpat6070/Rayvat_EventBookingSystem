const db = require('../config/db');
const bcrypt = require('bcrypt');
const moment = require('moment');
const { generateToken } = require('../utils/jwt.utils');

module.exports = {
    register: async (data) => {
        // Check if email already exists (case-insensitive)
        const existingUsers = await db.getResults(
            'SELECT userid FROM usermaster WHERE LOWER(email) = LOWER(?) AND isdeleted = 0',
            [data.email]
        );
        if (existingUsers.length) return { success: 0, status: 409, msg: 'Email already registered' };

        const hashedPassword = await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS));
        const userObj = {
            name: data.name,
            email: data.email.toLowerCase(),
            password: hashedPassword,
            role: 2, // Default role: User (1=Admin, 2=User)
            createddate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };

        const result = await db.insert('usermaster', userObj);
        if (!result.insertId) return { success: 0, status: 500, msg: 'Failed to register user' };
        return { success: 1, status: 201, msg: 'User registered successfully' };
    },

    login: async (data) => {
        const users = await db.getResults(
            'SELECT userid, name, email, password, role FROM usermaster WHERE LOWER(email) = LOWER(?) AND isdeleted = 0 LIMIT 1',
            [data.email]
        );
        // Generic message to prevent email enumeration
        if (!users.length) return { success: 0, status: 401, msg: 'Invalid email or password' };
        const user = users[0];

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) return { success: 0, status: 401, msg: 'Invalid email or password' };

        // Exclude password from token payload
        const { password, ...safeUser } = user;
        const token = generateToken(safeUser);
        return { success: 1, status: 200, msg: 'Login successful', token, data: safeUser };
    },
};
