const pool = require('../../database');
 
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
    1:  { default: 0.8,  bread: 0.9  },
    2:  { default: 0.85, bread: 0.9  },
    3:  { default: 1.0,  bread: 1.0  },
    4:  { default: 1.2,  hotcross: 2.0, bread: 1.1 },
    5:  { default: 1.0,  bread: 1.0  },
    6:  { default: 1.0,  bread: 1.0  },
    7:  { default: 1.1,  bread: 1.0  },
    8:  { default: 1.1,  bread: 1.0  },
    9:  { default: 0.95, bread: 1.0  },
    10: { default: 1.0,  bread: 1.0  },
    11: { default: 1.1,  cake: 1.3   },
    12: { default: 1.4,  cake: 1.8, bread: 1.2 }
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
    const productSql = 'SELECT * FROM products WHERE id = $1';
    pool.query(productSql, [product_id])
        .then(productResult => {
            if (productResult.rows.length === 0) return done(404);
            const product = productResult.rows[0];
 
            const salesSql = `
                SELECT 
                    AVG(quantity_sold) AS avg_sales,
                    COUNT(id) AS num_records
                FROM sales
                WHERE product_id = $1
            `;
            return pool.query(salesSql, [product_id]).then(salesResult => {
                const wasteSql = `
                    SELECT AVG(quantity_wasted) AS avg_waste
                    FROM waste
                    WHERE product_id = $1
                `;
                return pool.query(wasteSql, [product_id]).then(wasteResult => {
                    const avgSales = parseFloat(salesResult.rows[0].avg_sales) || 0;
                    const avgWaste = parseFloat(wasteResult.rows[0].avg_waste) || 0;
                    const numRecords = parseInt(salesResult.rows[0].num_records) || 0;
 
                    const date = new Date(forecast_date);
                    const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
                    const month = date.getMonth() + 1;
 
                    const dayMultiplier = getDayMultiplier(dayName);
                    const seasonMultiplier = getSeasonalityMultiplier(product.category, month);
 
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
        })
        .catch(err => done(err));
};
 
const getForecastAllProducts = (forecast_date, done) => {
    const sql = 'SELECT * FROM products ORDER BY name';
    pool.query(sql)
        .then(result => {
            if (result.rows.length === 0) return done(null, []);
 
            const products = result.rows;
            const forecasts = [];
            let counter = 0;
 
            products.forEach((product) => {
                getForecastForProduct(product.id, forecast_date, (err, forecast) => {
                    if (!err) {
                        forecasts.push(forecast);
                    }
                    counter++;
                    if (counter === products.length) {
                        return done(null, forecasts);
                    }
                });
            });
        })
        .catch(err => done(err));
};
 
const saveForecast = (product_id, recommended_quantity, forecast_date, done) => {
    const sql = `
        INSERT INTO forecasts (product_id, recommended_quantity, forecast_date)
        VALUES ($1, $2, $3) RETURNING id
    `;
    pool.query(sql, [product_id, recommended_quantity, forecast_date])
        .then(result => done(null, result.rows[0].id))
        .catch(err => done(err));
};
 
const getForecastHistory = (done) => {
    const sql = `
        SELECT forecasts.*, products.name AS product_name
        FROM forecasts
        JOIN products ON forecasts.product_id = products.id
        ORDER BY forecasts.forecast_date DESC
    `;
    pool.query(sql)
        .then(result => done(null, result.rows))
        .catch(err => done(err));
};
 
module.exports = {
    getForecastForProduct: getForecastForProduct,
    getForecastAllProducts: getForecastAllProducts,
    saveForecast: saveForecast,
    getForecastHistory: getForecastHistory
};