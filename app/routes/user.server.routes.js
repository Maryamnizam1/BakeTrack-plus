const users = require('../controllers/user.server.controllers');
const auth = require('../lib/authentication');

module.exports = function(app) {
    app.post('/api/register', users.register);
    app.post('/api/login', users.login);
    app.post('/api/logout', users.logout);
};