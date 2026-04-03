const Sales = require('../models/sales.server.models');

const create = (req, res) => {
    const { product_id, quantity_sold, date } = req.body;

    if (!product_id || !quantity_sold || !date) {
        return res.status(400).send({ error_message: "product_id, quantity_sold and date are required" });
    }

    Sales.create(product_id, quantity_sold, date, (err, id) => {
        if (err) return res.sendStatus(500);
        return res.status(201).send({ sale_id: id });
    });
};

const list = (req, res) => {
    Sales.getAll((err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

const getByProduct = (req, res) => {
    let product_id = parseInt(req.params.product_id);
    Sales.getByProduct(product_id, (err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

module.exports = {
    create: create,
    list: list,
    getByProduct: getByProduct
};