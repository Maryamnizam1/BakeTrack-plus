const pool = require('../../database');
const crypto = require('crypto');
 
const getHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
};
 
const register = (bakery_name, email, password, done) => {
    const checkSql = 'SELECT COUNT(*) AS count FROM users WHERE email = $1';
    pool.query(checkSql, [email])
        .then(result => {
            if (parseInt(result.rows[0].count) > 0) return done(400);
 
            const salt = crypto.randomBytes(64);
            const hash = getHash(password, salt);
 
            const sql = 'INSERT INTO users (bakery_name, email, password, salt) VALUES ($1, $2, $3, $4) RETURNING user_id';
            return pool.query(sql, [bakery_name, email, hash, salt.toString('hex')]);
        })
        .then(result => {
            if (result) done(null, result.rows[0].user_id);
        })
        .catch(err => done(err));
};
 
const login = (email, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE email = $1';
    pool.query(sql, [email])
        .then(result => {
            if (result.rows.length === 0) return done(400);
 
            const row = result.rows[0];
            const salt = Buffer.from(row.salt, 'hex');
            if (row.password === getHash(password, salt)) {
                return done(null, row.user_id);
            } else {
                return done(400);
            }
        })
        .catch(err => done(err));
};
 
const setToken = (user_id, done) => {
    const token = crypto.randomBytes(16).toString('hex');
    const sql = 'UPDATE users SET session_token = $1 WHERE user_id = $2';
    pool.query(sql, [token, user_id])
        .then(() => done(null, token))
        .catch(err => done(err));
};
 
const getToken = (user_id, done) => {
    pool.query('SELECT session_token FROM users WHERE user_id = $1', [user_id])
        .then(result => {
            if (result.rows.length > 0 && result.rows[0].session_token) {
                return done(null, result.rows[0].session_token);
            } else {
                return done(null, null);
            }
        })
        .catch(err => done(err));
};
 
const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token = null WHERE session_token = $1';
    pool.query(sql, [token])
        .then(() => done(null))
        .catch(err => done(err));
};
 
const getIdFromToken = (token, done) => {
    if (!token) return done(true, null);
    pool.query('SELECT user_id FROM users WHERE session_token = $1', [token])
        .then(result => {
            if (result.rows.length > 0) return done(null, result.rows[0].user_id);
            return done(true, null);
        })
        .catch(err => done(err, null));
};
 
const getBakeryName = (user_id, done) => {
    pool.query('SELECT bakery_name FROM users WHERE user_id = $1', [user_id])
        .then(result => {
            return done(null, result.rows.length > 0 ? result.rows[0].bakery_name : '');
        })
        .catch(err => done(err));
};
 
module.exports = {
    register: register,
    login: login,
    setToken: setToken,
    getToken: getToken,
    removeToken: removeToken,
    getIdFromToken: getIdFromToken,
    getBakeryName: getBakeryName
};