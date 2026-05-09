const pool = require('../db');

const SELECT_COMMON = `SELECT p.id, p.name, p.price, p.stock, p.category_id, c.name AS category_name`;

const JOIN_COMMON = `FROM products p JOIN categories c ON p.category_id = c.id`;


async function listProducts(categoryId) {

    if (categoryId !== null && categoryId !== undefined) {
        const [rows] = await pool.query(`${SELECT_COMMON} ${JOIN_COMMON} WHERE p.category_id = ? ORDER BY p.id`, [categoryId]);
        return rows;
    }
    const [rows] = await pool.query(`${SELECT_COMMON} ${JOIN_COMMON} ORDER BY p.id`);
    return rows;
}

async function getProductById(id) {
    const [rows] = await pool.query(`${SELECT_COMMON}, p.created_at ${JOIN_COMMON} WHERE p.id = ?`, [id]);
    return rows[0] || null;
}

module.exports = {listProducts, getProductById};