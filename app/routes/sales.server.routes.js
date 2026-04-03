const sales = require('../controllers/sales.server.controllers');

module.exports = function(app) {
    app.route('/api/sales')
        .get(sales.list)
        .post(sales.create);

    app.route('/api/sales/product/:product_id')
        .get(sales.getByProduct);
};