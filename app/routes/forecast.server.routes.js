// const forecast = require('../controllers/forecast.server.controllers');

// module.exports = function(app) {

//  app.get('/api/forecast/history/test', (req, res) => {
//         return res.status(200).send({ message: "history route found" });
//     });

//     // Get saved forecast history
//     app.routes('/api/forecast/history')
//         .get(forecast.getForecastHistory);

//     // Get forecast for all products for a given date
//     app.routes('/api/forecast')
//         .get(forecast.getForecastAllProducts)
//         .post(forecast.saveForecast);

//     // Get forecast for a specific product
//     app.routes('/api/forecast/:product_id')
//         .get(forecast.getForecastForProduct);
    
// };

const forecast = require('../controllers/forecast.server.controllers');

module.exports = function(app) {

    app.get('/api/forecast/history', forecast.getForecastHistory);

    app.get('/api/forecast', forecast.getForecastAllProducts);
    app.post('/api/forecast', forecast.saveForecast);

    app.get('/api/forecast/:product_id', forecast.getForecastForProduct);

};