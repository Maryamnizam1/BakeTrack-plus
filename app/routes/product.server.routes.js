const products = require('../controllers/product.server.controllers');

module.exports = function(app) {
    app.route('/api/products')
        .get(products.list)
        .post(products.create);

    app.route('/api/products/:product_id')
        .get(products.getOne)
        .delete(products.remove);
};