const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

// Server port
const HTTP_PORT = 3000;

// Start server
app.listen(HTTP_PORT, () => {
    console.log('Server running on port: ' + HTTP_PORT);
});

// Logging
app.use(morgan('tiny'));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
require('./database');

// Root endpoint
app.get('/', (req, res, next) => {
    res.json({ status: 'Alive' });
});

// API Routes
require('./app/routes/product.server.routes')(app);
require('./app/routes/sales.server.routes')(app);
require('./app/routes/waste.server.routes')(app);
require('./app/routes/donation.server.routes')(app);
require('./app/routes/forecast.server.routes')(app);

// Default response for any other request
app.use((req, res) => {
    res.sendStatus(404);
});