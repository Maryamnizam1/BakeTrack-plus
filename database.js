const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database.'))
    .catch(err => console.error('Database connection error:', err.message));

const createTables = async () => {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            bakery_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            salt TEXT NOT NULL,
            session_token TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )`);
        console.log('Users table ready');

        await pool.query(`CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            batch_size INTEGER DEFAULT 1
        )`);
        console.log('Products table ready');

        await pool.query(`CREATE TABLE IF NOT EXISTS sales (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES products(id),
            quantity_sold INTEGER NOT NULL,
            date TEXT NOT NULL,
            day_of_week TEXT
        )`);
        console.log('Sales table ready');

        await pool.query(`CREATE TABLE IF NOT EXISTS waste (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES products(id),
            quantity_wasted INTEGER NOT NULL,
            date TEXT NOT NULL,
            reason TEXT
        )`);
        console.log('Waste table ready');

        await pool.query(`CREATE TABLE IF NOT EXISTS donations (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES products(id),
            quantity INTEGER NOT NULL,
            charity_name TEXT NOT NULL,
            date TEXT NOT NULL
        )`);
        console.log('Donations table ready');

        await pool.query(`CREATE TABLE IF NOT EXISTS forecasts (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL REFERENCES products(id),
            recommended_quantity INTEGER NOT NULL,
            forecast_date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )`);
        console.log('Forecasts table ready');

    } catch (err) {
        console.error('Error creating tables:', err.message);
    }
};

createTables();

module.exports = pool;
