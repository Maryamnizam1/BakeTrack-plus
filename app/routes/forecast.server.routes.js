const forecast = require('../controllers/forecast.server.controllers');

module.exports = function(app) {
    // Get forecast for all products for a given date
    app.route('/api/forecast')
        .get(forecast.getForecastAllProducts)
        .post(forecast.saveForecast);

    // Get forecast for a specific product
    app.route('/api/forecast/:product_id')
        .get(forecast.getForecastForProduct);

    // Get saved forecast history
    app.route('/api/forecast/history')
        .get(forecast.getForecastHistory);
};