const waste = require('../controllers/waste.server.controllers');

module.exports = function(app) {
    app.route('/api/waste')
        .get(waste.list)
        .post(waste.create);

    app.route('/api/waste/product/:product_id')
        .get(waste.getByProduct);
};