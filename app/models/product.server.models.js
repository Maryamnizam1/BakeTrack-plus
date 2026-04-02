//const db = require('../../database');
//
//exports.create = (name, category, callback) => {
//    const query = `INSERT INTO products (name, category) VALUES (?, ?)`;
//    db.run(query, [name, category], function(err) {
//        callback(err, this.lastID);
//    });
//};
//
//exports.getAll = (callback) => {
//    const query = `SELECT * FROM products`;
//    db.all(query, [], callback);
//};

const db = require('../../database');

exports.create = (name, category, callback) => {
    const query = `INSERT INTO products (name, category) VALUES (?, ?)`;
    db.run(query, [name, category], function(err) {
        // ✅ MUST call callback
        callback(err, this.lastID);
    });
};
exports.getAll = (callback) => {
    db.all('SELECT * FROM products', [], callback);
};