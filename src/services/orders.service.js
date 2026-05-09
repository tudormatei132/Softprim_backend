const pool = require('../db');

async function createOrder({product_id, quantity, customer_email}) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [rows] = await conn.query('SELECT id, price, stock FROM products WHERE id = ? FOR UPDATE', [product_id]);

        if (rows.length === 0) {
            const err = new Error('Product not found');
            err.status = 404;
            throw err;
        }

        const product = rows[0];

        if (quantity > product.stock) {
            const err = new Error('Insufficient stock');
            err.status = 400;
            throw err;
        }

        const total = product.price * quantity;

        const [res] = await conn.query('INSERT INTO orders (product_id, quantity, total, customer_email) VALUES (?, ?, ?, ?)',
            [product_id, quantity, total, customer_email]);
        
        await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);
        
        const [orderRows] = await conn.query('SELECT total, created_at FROM orders WHERE id = ?', [res.insertId]);

        await conn.commit();

        return {
            order_id: res.insertId,
            product_id: product_id,
            quantity,
            total: orderRows[0].total,
            created_at: orderRows[0].created_at
        };
    } catch (err) {
        await conn.rollback().catch(() => {});
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = {createOrder};