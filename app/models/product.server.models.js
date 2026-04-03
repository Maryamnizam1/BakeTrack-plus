const db = require('../../database');

const create = (name, category, batch_size, done) => {
    const sql = 'INSERT INTO products (name, category, batch_size) VALUES (?, ?, ?)';
    db.run(sql, [name, category, batch_size], function(err) {
        if (err) return done(err);
        return done(null, this.lastID);
    });
};

const getAll = (done) => {
    const sql = 'SELECT * FROM products ORDER BY name';
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

const getById = (product_id, done) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    db.get(sql, [product_id], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404);
        return done(null, row);
    });
};

const remove = (product_id, done) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, [product_id], (err) => {
        if (err) return done(err);
        return done(null);
    });
};

module.exports = {
    create: create,
    getAll: getAll,
    getById: getById,
    remove: remove
};