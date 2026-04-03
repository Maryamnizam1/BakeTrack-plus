const Forecast = require('../models/forecast.server.models');

const getForecastForProduct = (req, res) => {
    let product_id = parseInt(req.params.product_id);
    let forecast_date = req.query.date || new Date().toISOString().split('T')[0];

    Forecast.getForecastForProduct(product_id, forecast_date, (err, forecast) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
        return res.status(200).send(forecast);
    });
};

const getForecastAllProducts = (req, res) => {
    let forecast_date = req.query.date || new Date().toISOString().split('T')[0];

    Forecast.getForecastAllProducts(forecast_date, (err, forecasts) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(forecasts);
    });
};

const saveForecast = (req, res) => {
    const { product_id, recommended_quantity, forecast_date } = req.body;

    if (!product_id || !recommended_quantity || !forecast_date) {
        return res.status(400).send({ error_message: "product_id, recommended_quantity and forecast_date are required" });
    }

    Forecast.saveForecast(product_id, recommended_quantity, forecast_date, (err, id) => {
        if (err) return res.sendStatus(500);
        return res.status(201).send({ forecast_id: id });
    });
};

const getForecastHistory = (req, res) => {
    Forecast.getForecastHistory((err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

module.exports = {
    getForecastForProduct: getForecastForProduct,
    getForecastAllProducts: getForecastAllProducts,
    saveForecast: saveForecast,
    getForecastHistory: getForecastHistory
};