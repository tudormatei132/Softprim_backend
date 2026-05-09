const EMAIL_REGEX_FORMAT = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MAX_EMAIL_LENGTH = 150;


function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function throwIfNotPositiveInteger(value, fieldName) {
    if (!Number.isInteger(value) || value <= 0) {
        throw badRequest(`${fieldName} must be a positive integer`);
    }
}

function throwIfInvalidEmail(email) {
    if (typeof email !== 'string' || email.length === 0) {
        throw badRequest('Email is required');
    }

    if (email.length > MAX_EMAIL_LENGTH) {
        throw badRequest(`Email must not exceed ${MAX_EMAIL_LENGTH} characters`);
    }

    if (!EMAIL_REGEX_FORMAT.test(email)) {
        throw badRequest('Invalid email format');
    }
}

function validateOrderInput(body) {
    if (!body || typeof body !== 'object') {
        throw badRequest('Request body must be a JSON object');
    }

    const {product_id, quantity, customer_email} = body;
    throwIfNotPositiveInteger(product_id, 'product_id');
    throwIfNotPositiveInteger(quantity, 'quantity');
    throwIfInvalidEmail(customer_email);

    return {product_id, quantity, customer_email};
}

module.exports = {validateOrderInput};