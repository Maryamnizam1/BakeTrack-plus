//const express = require('express');
//const router = express.Router();
//const controller = require('../controllers/product.server.controllers');
//
//router.post('/', controller.create);
//router.get('/', controller.list);
//
//module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.server.controllers');

router.post('/', controller.create);
router.get('/', controller.list);

module.exports = router;