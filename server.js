//const express = require('express');
//const cors = require('cors');

//const app = express();
//const PORT = 3000;

//app.use(cors());
//app.use(express.json());

// database
//require('./database');

// routes
//app.use('/api/products', require('./app/routes/product.server.routes'));
//app.use('/api/sales', require('./app/routes/sales.server.routes'));
//app.use('/api/waste', require('./app/routes/waste.server.routes'));
//app.use('/api/donations', require('./app/routes/donation.server.routes'));

//app.listen(PORT, () => {
 //   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ parse JSON

// 🔹 Add debug logging here — BEFORE your routes
app.use((req, res, next) => {
    console.log(req.method, req.url, req.body); // log method, URL, and body
    next();
});

// Routes
app.use('/api/products', require('./app/routes/product.server.routes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});