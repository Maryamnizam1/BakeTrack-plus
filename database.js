//const sqlite3 = require('sqlite3').verbose();
//
//const db = new sqlite3.Database('./db.sqlite', (err) => {
//    if (err) console.error(err.message);
//    else console.log("Connected to SQLite database");
//});
//
//// Create products table if it doesn’t exist
//db.serialize(() => {
//    db.run(`
//        CREATE TABLE IF NOT EXISTS products (
//            id INTEGER PRIMARY KEY AUTOINCREMENT,
//            name TEXT NOT NULL,
//            category TEXT NOT NULL
//        )
//    `);
//});
//
//module.exports = db;
//    db.run(`
//        CREATE TABLE IF NOT EXISTS waste (
//            id INTEGER PRIMARY KEY AUTOINCREMENT,
//            product_id INTEGER,
//            quantity INTEGER,
//            date TEXT
//        )
//    `);
//
//    db.run(`
//        CREATE TABLE IF NOT EXISTS donations (
//            id INTEGER PRIMARY KEY AUTOINCREMENT,
//            product_id INTEGER,
//            quantity INTEGER,
//            charity TEXT,
//            date TEXT
//        )
//    `);
//});
//
//module.exports = db;


const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database");
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL
        )
    `);
});

module.exports = db;