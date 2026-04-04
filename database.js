const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = 'db.sqlite';

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            bakery_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            salt TEXT NOT NULL,
            session_token TEXT,
            created_at TEXT DEFAULT (datetime('now'))
        )`, (err) => {
            if (err) console.log('Users table already created');
            else console.log('Users table created');
        });

        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            batch_size INTEGER DEFAULT 1
        )`, (err) => {
            if (err) console.log('Products table already created');
            else console.log('Products table created');
        });

        db.run(`CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity_sold INTEGER NOT NULL,
            date TEXT NOT NULL,
            day_of_week TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`, (err) => {
            if (err) console.log('Sales table already created');
            else console.log('Sales table created');
        });

        db.run(`CREATE TABLE IF NOT EXISTS waste (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity_wasted INTEGER NOT NULL,
            date TEXT NOT NULL,
            reason TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`, (err) => {
            if (err) console.log('Waste table already created');
            else console.log('Waste table created');
        });

        db.run(`CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            charity_name TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`, (err) => {
            if (err) console.log('Donations table already created');
            else console.log('Donations table created');
        });

        db.run(`CREATE TABLE IF NOT EXISTS forecasts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            recommended_quantity INTEGER NOT NULL,
            forecast_date TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )`, (err) => {
            if (err) console.log('Forecasts table already created');
            else console.log('Forecasts table created');
        });
    }
});

module.exports = db;