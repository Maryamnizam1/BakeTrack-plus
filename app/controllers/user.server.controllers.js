const User = require('../models/user.server.models');

const register = (req, res) => {
    const { bakery_name, email, password } = req.body;

    if (!bakery_name || !email || !password) {
        return res.status(400).send({ error_message: 'Bakery name, email and password are required' });
    }

    User.register(bakery_name, email, password, (err, id) => {
        if (err === 400) {
            return res.status(400).send({ error_message: 'Email already exists' });
        }
        if (err) return res.sendStatus(500);
        return res.status(201).send({ user_id: id });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ error_message: 'Email and password are required' });
    }

    User.login(email, password, (err, user_id) => {
        if (err === 400) {
            return res.status(400).send({ error_message: 'Invalid email or password' });
        }
        if (err) return res.sendStatus(500);

        User.getToken(user_id, (err, token) => {
            if (err) return res.sendStatus(500);
            if (token) {
                return res.status(200).send({ user_id, session_token: token });
            } else {
                User.setToken(user_id, (err, token) => {
                    if (err) return res.sendStatus(500);
                    return res.status(200).send({ user_id, session_token: token });
                });
            }
        });
    });
};

const logout = (req, res) => {
    const token = req.get('X-Authorization');
    User.removeToken(token, (err) => {
        if (err) return res.sendStatus(401);
        return res.sendStatus(200);
    });
};

module.exports = {
    register: register,
    login: login,
    logout: logout
};