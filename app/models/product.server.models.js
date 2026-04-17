const pool = require('../../database');
 
const create = (name, category, batch_size, done) => {
    const sql = 'INSERT INTO products (name, category, batch_size) VALUES ($1, $2, $3) RETURNING id';
    pool.query(sql, [name, category, batch_size])
        .then(result => done(null, result.rows[0].id))
        .catch(err => done(err));
};
 
const getAll = (done) => {
    const sql = 'SELECT * FROM products ORDER BY name';
    pool.query(sql)
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
const getById = (product_id, done) => {
    const sql = 'SELECT * FROM products WHERE id = $1';
    pool.query(sql, [product_id])
        .then(result => {
            if (result.rows.length === 0) return done(404);
            return done(null, result.rows[0]);
        })
        .catch(err => done(err));
};
 
const remove = (product_id, done) => {
    const sql = 'DELETE FROM products WHERE id = $1';
    pool.query(sql, [product_id])
        .then(() => done(null))
        .catch(err => done(err));
};
 
module.exports = {
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove
};