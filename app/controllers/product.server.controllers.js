//const Product = require('../models/product.server.models');
//
//exports.create = (req, res) => {
//    const { name, category } = req.body;
//
//    if (!name || !category) {
//        return res.status(400).json({ error: "Name and category are required" });
//    }
//
//    Product.create(name, category, (err, id) => {
//        if (err) return res.status(500).json({ error: err.message });
//        res.json({ message: "Product added", id });
//    });
//};
//
//exports.list = (req, res) => {
//    Product.getAll((err, rows) => {
//        if (err) return res.status(500).json({ error: err.message });
//        res.json(rows);
//    });
//};

const Product = require('../models/product.server.models');

exports.create = (req, res) => {
    const { name, category } = req.body;

    // validation
    if (!name || !category) {
        return res.status(400).json({ error: "Name and category are required" });
    }

    Product.create(name, category, (err, id) => {
        if (err) return res.status(500).json({ error: err.message });

        // ✅ You MUST send a response
        res.json({ message: "Product added", id });
    });
};
exports.list = (req, res) => {
    Product.getAll((err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};