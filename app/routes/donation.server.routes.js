const donations = require('../controllers/donation.server.controllers');

module.exports = function(app) {
    app.route('/api/donations')
        .get(donations.list)
        .post(donations.create);

    app.route('/api/donations/charity/:charity_name')
        .get(donations.getByCharity);
};