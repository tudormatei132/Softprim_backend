const productsService = require('../services/products.service');
const {validateProductId, validateCategoryId} = require('../validators/products.validator');


async function listProducts(req, res, next) {
    try {
        const categoryId = validateCategoryId(req.query.category_id);
        const products = await productsService.listProducts(categoryId);
        res.json(products);
    } catch (err) {
        next(err);
    }
}

async function getProductById(req, res, next) {
    try {
        const id = validateProductId(req.params.id);
        const product = await productsService.getProductById(id);
        if (!product) {
            const err = new Error('Product not found');
            err.status = 404;
            throw err;
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
}

module.exports = {listProducts, getProductById};