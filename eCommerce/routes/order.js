import express from 'express';
var orderRouter = express.Router();
import { query } from '../db/index.js'


orderRouter.get('/orders', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting orders'.error);
        res.status(500).send('Error getting orders from database')
    }
});

orderRouter.get('/orders/:id', async (req, res, next) => {
    const orderId = req.params.id;
    try {
        const result = await query('SELECT * FROM orders WHERE orderId = $1', [orderId]);

        if (results.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('order not found')
        }
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).send('Error getting order from the database');
    }
});

orderRouter.post('/orders', async (req, res, next) => {
    const { orderId, status, createdDate } = req.body;
    if (!orderId || !status || !createdDate) {
        return res.status(400).send('order id, status, and created date are required');
    }

    try {
        const result = await query(
            'INSERT INTO orders (orderid, status, createdDate) VALUES ($1, $2, $3) RETURNING *',
            [orderid, status, createdDate]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding order', error);
        res.status(500).send('Error adding order to the database');
    }
});

customerRouter.put('/orders:id', async (req, res, next) => {
    const orderToUpdate = req.params.id;
    const { orderId, status, createdDate } = req.body;

    if (!orderId && !status && !createdDate) {
        res.status(400).send('At least one field is required for update');
    }
    try {
        const updates = [];
        const values = [];

        let paramIndex = 1;

        if (orderId !== undefined) {
            updates.push(`orderId = $${paramIndex++}`);
            values.push(orderId);
        }
        if (status !== undefined) {
            updates.push(`status = $${paramIndex++}`);
            values.push(status);
        }
        if (createdDate !== undefined) {
            updates.push(`createdDate = $${paramIndex++}`);
            values.push(createdDate);
        }

        if (updates.length === 0) {
            return res.status(200).send('No fields to update');
        }
        const updateQuery = `
            UPDATE orders
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;
        values.push(orderToUpdate);

        const result = await query(updateQuery, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send(`Order with ID ${orderToUpdate} not found`);
        }
    } catch (error) {
        console.error('Error updating order: ', error);
        res.status(500).send('Error updating order in database');
    }
});


export default orderRouter;
