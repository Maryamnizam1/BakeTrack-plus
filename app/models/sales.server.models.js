const pool = require('../../database');
 
const create = (product_id, quantity_sold, date, done) => {
    const day_of_week = new Date(date).toLocaleDateString('en-GB', { weekday: 'long' });
    const sql = 'INSERT INTO sales (product_id, quantity_sold, date, day_of_week) VALUES ($1, $2, $3, $4) RETURNING id';
    pool.query(sql, [product_id, quantity_sold, date, day_of_week])
        .then(result => done(null, result.rows[0].id))
        .catch(err => done(err));
};
 
const getAll = (done) => {
    const sql = `
        SELECT sales.*, products.name AS product_name
        FROM sales
        JOIN products ON sales.product_id = products.id
        ORDER BY sales.date DESC
    `;
    pool.query(sql)
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
const getByProduct = (product_id, done) => {
    const sql = `
        SELECT sales.*, products.name AS product_name
        FROM sales
        JOIN products ON sales.product_id = products.id
        WHERE sales.product_id = $1
        ORDER BY sales.date DESC
    `;
    pool.query(sql, [product_id])
        .then(result => done(null, result.rows))
        .catch(err => done(err));
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
        GROUP BY products.id, products.name
        ORDER BY total_sold DESC
    `;
    pool.query(sql)
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
module.exports = {
    create: create,
    getAll: getAll,
    getByProduct: getByProduct,
    getSummaryByProduct: getSummaryByProduct
};