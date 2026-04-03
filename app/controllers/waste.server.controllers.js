const Waste = require('../models/waste.server.models');

const create = (req, res) => {
    const { product_id, quantity_wasted, date, reason } = req.body;

    if (!product_id || !quantity_wasted || !date) {
        return res.status(400).send({ error_message: "product_id, quantity_wasted and date are required" });
    }

    Waste.create(product_id, quantity_wasted, date, reason || 'Not specified', (err, id) => {
        if (err) return res.sendStatus(500);
        return res.status(201).send({ waste_id: id });
    });
};

const list = (req, res) => {
    Waste.getAll((err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

const getByProduct = (req, res) => {
    let product_id = parseInt(req.params.product_id);
    Waste.getByProduct(product_id, (err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

module.exports = {
    create: create,
    list: list,
    getByProduct: getByProduct
};