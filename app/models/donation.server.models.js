const db = require('../../database');

const create = (product_id, quantity, charity_name, date, done) => {
    const sql = 'INSERT INTO donations (product_id, quantity, charity_name, date) VALUES (?, ?, ?, ?)';
    db.run(sql, [product_id, quantity, charity_name, date], function(err) {
        if (err) return done(err);
        return done(null, this.lastID);
    });
};

const getAll = (done) => {
    const sql = `
        SELECT donations.*, products.name AS product_name
        FROM donations
        JOIN products ON donations.product_id = products.id
        ORDER BY donations.date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

const getByCharity = (charity_name, done) => {
    const sql = `
        SELECT donations.*, products.name AS product_name
        FROM donations
        JOIN products ON donations.product_id = products.id
        WHERE donations.charity_name = ?
        ORDER BY donations.date DESC
    `;
    db.all(sql, [charity_name], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
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
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

module.exports = {
    create: create,
    getAll: getAll,
    getByCharity: getByCharity,
    getSummaryByCharity: getSummaryByCharity
};