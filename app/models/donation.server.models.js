const pool = require('../../database');
 
const create = (product_id, quantity, charity_name, date, done) => {
    const sql = 'INSERT INTO donations (product_id, quantity, charity_name, date) VALUES ($1, $2, $3, $4) RETURNING id';
    pool.query(sql, [product_id, quantity, charity_name, date])
        .then(result => done(null, result.rows[0].id))
        .catch(err => done(err));
};
 
const getAll = (done) => {
    const sql = `
        SELECT donations.*, products.name AS product_name
        FROM donations
        JOIN products ON donations.product_id = products.id
        ORDER BY donations.date DESC
    `;
    pool.query(sql)
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
const getByCharity = (charity_name, done) => {
    const sql = `
        SELECT donations.*, products.name AS product_name
        FROM donations
        JOIN products ON donations.product_id = products.id
        WHERE donations.charity_name = $1
        ORDER BY donations.date DESC
    `;
    pool.query(sql, [charity_name])
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
const getSummaryByCharity = (done) => {
    const sql = `
        SELECT 
            charity_name,
            COUNT(donations.id) AS num_donations,
            SUM(donations.quantity) AS total_donated
        FROM donations
        GROUP BY charity_name
        ORDER BY total_donated DESC
    `;
    pool.query(sql)
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
module.exports = {
    create: create,
    getAll: getAll,
    getByCharity: getByCharity,
    getSummaryByCharity: getSummaryByCharity
};
 