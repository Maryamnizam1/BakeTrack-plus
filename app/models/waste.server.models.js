const db = require('../../database');

const create = (product_id, quantity_wasted, date, reason, done) => {
    const sql = 'INSERT INTO waste (product_id, quantity_wasted, date, reason) VALUES (?, ?, ?, ?)';
    db.run(sql, [product_id, quantity_wasted, date, reason], function(err) {
        if (err) return done(err);
        return done(null, this.lastID);
    });
};

const getAll = (done) => {
    const sql = `
        SELECT waste.*, products.name AS product_name
        FROM waste
        JOIN products ON waste.product_id = products.id
        ORDER BY waste.date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

const getByProduct = (product_id, done) => {
    const sql = `
        SELECT waste.*, products.name AS product_name
        FROM waste
        JOIN products ON waste.product_id = products.id
        WHERE waste.product_id = ?
        ORDER BY waste.date DESC
    `;
    db.all(sql, [product_id], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

const getSummaryByProduct = (done) => {
    const sql = `
        SELECT 
            products.id AS product_id,
            products.name AS product_name,
            SUM(waste.quantity_wasted) AS total_wasted,
            AVG(waste.quantity_wasted) AS avg_wasted,
            COUNT(waste.id) AS num_records
        FROM waste
        JOIN products ON waste.product_id = products.id
        GROUP BY products.id
        ORDER BY total_wasted DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

module.exports = {
    create: create,
    getAll: getAll,
    getByProduct: getByProduct,
    getSummaryByProduct: getSummaryByProduct
};