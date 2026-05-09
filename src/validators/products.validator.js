function parsePositiveInteger(value, field) {
    if (value === undefined || value === null || value === '') {
        const err = new Error(`${field} is required`);
        err.status = 400;
        throw err;
    }

    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
        const err = new Error(`${field} must be a positive integer`);
        err.status = 400;
        throw err;
    }

    return n;
}


function validateProductId(value) {
    return parsePositiveInteger(value, 'product_id');
}

function validateCategoryId(value) {
    if (value === undefined) {
        return null;
    }

    return parsePositiveInteger(value, 'category_id');
}

module.exports = {validateProductId, validateCategoryId};