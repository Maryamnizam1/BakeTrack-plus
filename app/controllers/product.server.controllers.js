const Product = require('../models/product.server.models');

const create = (req, res) => {
    const { name, category, batch_size } = req.body;

    if (!name || !category) {
        return res.status(400).json({ error_message: "Name and category are required" });
    }

    Product.create(name, category, batch_size || 1, (err, id) => {
        if (err) return res.sendStatus(500);
        return res.status(201).send({ product_id: id });
    });
};

const list = (req, res) => {
    Product.getAll((err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

const getOne = (req, res) => {
    let product_id = parseInt(req.params.product_id);
    Product.getById(product_id, (err, product) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
        return res.status(200).send(product);
    });
};

const remove = (req, res) => {
    let product_id = parseInt(req.params.product_id);
    Product.getById(product_id, (err) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
        Product.remove(product_id, (err) => {
            if (err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    });
};

module.exports = {
    create: create,
    list: list,
    getOne: getOne,
    remove: remove
};