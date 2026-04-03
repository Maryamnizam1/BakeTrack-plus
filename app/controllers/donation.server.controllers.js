const Donation = require('../models/donation.server.models');

const create = (req, res) => {
    const { product_id, quantity, charity_name, date } = req.body;

    if (!product_id || !quantity || !charity_name || !date) {
        return res.status(400).send({ error_message: "product_id, quantity, charity_name and date are required" });
    }

    Donation.create(product_id, quantity, charity_name, date, (err, id) => {
        if (err) return res.sendStatus(500);
        return res.status(201).send({ donation_id: id });
    });
};

const list = (req, res) => {
    Donation.getAll((err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

const getByCharity = (req, res) => {
    let charity_name = req.params.charity_name;
    Donation.getByCharity(charity_name, (err, rows) => {
        if (err) return res.sendStatus(500);
        return res.status(200).send(rows);
    });
};

module.exports = {
    create: create,
    list: list,
    getByCharity: getByCharity
};