const db = require('../../database');

// Day of week multipliers based on typical bakery patterns
const DAY_MULTIPLIERS = {
    'Monday':    0.8,
    'Tuesday':   0.8,
    'Wednesday': 0.9,
    'Thursday':  0.9,
    'Friday':    1.3,
    'Saturday':  1.5,
    'Sunday':    1.2
};

// Seasonality multipliers based on month and product category
const SEASONALITY_MULTIPLIERS = {
    1:  { default: 0.8,  bread: 0.9  },   // January - quiet
    2:  { default: 0.85, bread: 0.9  },   // February
    3:  { default: 1.0,  bread: 1.0  },   // March
    4:  { default: 1.2,  hotcross: 2.0, bread: 1.1 }, // April - Easter
    5:  { default: 1.0,  bread: 1.0  },   // May
    6:  { default: 1.0,  bread: 1.0  },   // June
    7:  { default: 1.1,  bread: 1.0  },   // July - summer
    8:  { default: 1.1,  bread: 1.0  },   // August - summer
    9:  { default: 0.95, bread: 1.0  },   // September
    10: { default: 1.0,  bread: 1.0  },   // October
    11: { default: 1.1,  cake: 1.3   },   // November
    12: { default: 1.4,  cake: 1.8, bread: 1.2 } // December - Christmas
};

const getSeasonalityMultiplier = (category, month) => {
    const monthData = SEASONALITY_MULTIPLIERS[month];
    if (!monthData) return 1.0;
    const cat = category ? category.toLowerCase() : 'default';
    return monthData[cat] || monthData['default'] || 1.0;
};

const getDayMultiplier = (dayName) => {
    return DAY_MULTIPLIERS[dayName] || 1.0;
};

const getForecastForProduct = (product_id, forecast_date, done) => {
    // Get product details
    const productSql = 'SELECT * FROM products WHERE id = ?';
    db.get(productSql, [product_id], (err, product) => {
        if (err) return done(err);
        if (!product) return done(404);

        // Get average daily sales for this product
        const salesSql = `
            SELECT 
                AVG(quantity_sold) AS avg_sales,
                COUNT(id) AS num_records
            FROM sales
            WHERE product_id = ?
        `;
        db.get(salesSql, [product_id], (err, salesData) => {
            if (err) return done(err);

            // Get average daily waste for this product
            const wasteSql = `
                SELECT AVG(quantity_wasted) AS avg_waste
                FROM waste
                WHERE product_id = ?
            `;
            db.get(wasteSql, [product_id], (err, wasteData) => {
                if (err) return done(err);

                const avgSales = salesData.avg_sales || 0;
                const avgWaste = wasteData.avg_waste || 0;
                const numRecords = salesData.num_records || 0;

                // Get day of week and month from forecast date
                const date = new Date(forecast_date);
                const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
                const month = date.getMonth() + 1;

                // Apply multipliers
                const dayMultiplier = getDayMultiplier(dayName);
                const seasonMultiplier = getSeasonalityMultiplier(product.category, month);

                // Core formula: (avg sales - avg waste) × day multiplier × seasonality
                const baseQuantity = Math.max(avgSales - (avgWaste * 0.5), avgSales * 0.5);
                const recommended = Math.ceil(baseQuantity * dayMultiplier * seasonMultiplier);

                return done(null, {
                    product_id: product.id,
                    product_name: product.name,
                    category: product.category,
                    forecast_date: forecast_date,
                    day_of_week: dayName,
                    recommended_quantity: recommended,
                    avg_daily_sales: Math.round(avgSales * 10) / 10,
                    avg_daily_waste: Math.round(avgWaste * 10) / 10,
                    day_multiplier: dayMultiplier,
                    seasonality_multiplier: seasonMultiplier,
                    data_points_used: numRecords
                });
            });
        });
    });
};

const getForecastAllProducts = (forecast_date, done) => {
    const sql = 'SELECT * FROM products ORDER BY name';
    db.all(sql, [], (err, products) => {
        if (err) return done(err);
        if (products.length === 0) return done(null, []);

        const forecasts = [];
        let counter = 0;

        products.forEach((product) => {
            getForecastForProduct(product.id, forecast_date, (err, forecast) => {
                if (err) {
                    counter++;
                } else {
                    forecasts.push(forecast);
                    counter++;
                }
                if (counter === products.length) {
                    return done(null, forecasts);
                }
            });
        });
    });
};

const saveForecast = (product_id, recommended_quantity, forecast_date, done) => {
    const sql = `
        INSERT INTO forecasts (product_id, recommended_quantity, forecast_date)
        VALUES (?, ?, ?)
    `;
    db.run(sql, [product_id, recommended_quantity, forecast_date], function(err) {
        if (err) return done(err);
        return done(null, this.lastID);
    });
};

const getForecastHistory = (done) => {
    const sql = `
        SELECT forecasts.*, products.name AS product_name
        FROM forecasts
        JOIN products ON forecasts.product_id = products.id
        ORDER BY forecasts.forecast_date DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return done(err);
        return done(null, rows);
    });
};

module.exports = {
    getForecastForProduct: getForecastForProduct,
    getForecastAllProducts: getForecastAllProducts,
    saveForecast: saveForecast,
    getForecastHistory: getForecastHistory
};