const db = require('../../database');

const create = (product_id, quantity_sold, date, done) => {
    const day_of_week = new Date(date).toLocaleDateString('en-GB', { weekday: 'long' });
    const sql = 'INSERT INTO sales (product_id, quantity_sold, date, day_of_week) VALUES (?, ?, ?, ?)';
    db.run(sql, [product_id, quantity_sold, date, day_of_week], function(err) {
        if (err) return done(err);
        return done(null, this.lastID);
    });
};

const getAll = (done) => {
    const sql = `
        SELECT sales.*, products.name AS product_name
        FROM sales
        JOIN products ON sales.product_id = products.id
        ORDER BY sales.date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

const getByProduct = (product_id, done) => {
    const sql = `
        SELECT sales.*, products.name AS product_name
        FROM sales
        JOIN products ON sales.product_id = products.id
        WHERE sales.product_id = ?
        ORDER BY sales.date DESC
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
            SUM(sales.quantity_sold) AS total_sold,
            AVG(sales.quantity_sold) AS avg_sold,
            COUNT(sales.id) AS num_records
        FROM sales
        JOIN products ON sales.product_id = products.id
        GROUP BY products.id
        ORDER BY total_sold DESC
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