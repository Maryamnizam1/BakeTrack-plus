const db = require('../../database');
const crypto = require('crypto');

const getHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};

const register = (bakery_name, email, password, done) => {
    const checkSql = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    db.get(checkSql, [email], (err, row) => {
        if (err) return done(err);
        if (row.count > 0) return done(400);

        const salt = crypto.randomBytes(64);
        const hash = getHash(password, salt);

        const sql = 'INSERT INTO users (bakery_name, email, password, salt) VALUES (?, ?, ?, ?)';
        db.run(sql, [bakery_name, email, hash, salt.toString('hex')], function(err) {
            if (err) return done(err);
            return done(null, this.lastID);
        });
    });
};

const login = (email, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) return done(err);
        if (!row) return done(400);

        const salt = Buffer.from(row.salt, 'hex');
        if (row.password === getHash(password, salt)) {
            return done(null, row.user_id);
        } else {
            return done(400);
        }
    });
};

const setToken = (user_id, done) => {
    const token = crypto.randomBytes(16).toString('hex');
    const sql = 'UPDATE users SET session_token = ? WHERE user_id = ?';
    db.run(sql, [token, user_id], (err) => {
        return done(err, token);
    });
};

const getToken = (user_id, done) => {
    db.get('SELECT session_token FROM users WHERE user_id = ?', [user_id], (err, row) => {
        if (row && row.session_token) {
            return done(null, row.session_token);
        } else {
            return done(null, null);
        }
    });
};

const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token = null WHERE session_token = ?';
    db.run(sql, [token], (err) => {
        return done(err);
    });
};

const getIdFromToken = (token, done) => {
    if (!token) return done(true, null);
    db.get('SELECT user_id FROM users WHERE session_token = ?', [token], (err, row) => {
        if (err) return done(err, null);
        if (row) return done(null, row.user_id);
        return done(true, null);
    });
};

module.exports = {
    register: register,
    login: login,
    setToken: setToken,
    getToken: getToken,
    removeToken: removeToken,
    getIdFromToken: getIdFromToken
};