const orderService = require('../services/orders.service');
const {validateOrderInput} = require('../validators/orders.validator');

async function createOrder(req, res, next) {
    try {
        const input = validateOrderInput(req.body);
        const order = await orderService.createOrder(input);
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
}

module.exports = {createOrder};
