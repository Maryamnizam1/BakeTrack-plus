const pool = require('../../database');
 
const create = (product_id, quantity_wasted, date, reason, done) => {
    const sql = 'INSERT INTO waste (product_id, quantity_wasted, date, reason) VALUES ($1, $2, $3, $4) RETURNING id';
    pool.query(sql, [product_id, quantity_wasted, date, reason])
        .then(result => done(null, result.rows[0].id))
        .catch(err => done(err));
};
 
const getAll = (done) => {
    const sql = `
        SELECT waste.*, products.name AS product_name
        FROM waste
        JOIN products ON waste.product_id = products.id
        ORDER BY waste.date DESC
    `;
    pool.query(sql)
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
const getByProduct = (product_id, done) => {
    const sql = `
        SELECT waste.*, products.name AS product_name
        FROM waste
        JOIN products ON waste.product_id = products.id
        WHERE waste.product_id = $1
        ORDER BY waste.date DESC
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
            SUM(waste.quantity_wasted) AS total_wasted,
            AVG(waste.quantity_wasted) AS avg_wasted,
            COUNT(waste.id) AS num_records
        FROM waste
        JOIN products ON waste.product_id = products.id
        GROUP BY products.id, products.name
        ORDER BY total_wasted DESC
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