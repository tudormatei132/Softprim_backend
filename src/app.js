const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/products', require('./routes/products.routes'));
app.use('/api/orders', require('./routes/orders.routes'));

app.use(require('./middleware/notFound'));
app.use(require('./middleware/errorHandler'));

module.exports = app;