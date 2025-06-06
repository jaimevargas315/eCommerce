import express from 'express';
var orderItemRouter = express.Router();
import { query } from '../db/index.js'


orderItemRouter.get('/orderItems', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM orderItems');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting orderItems'.error);
        res.status(500).send('Error getting orderItems from database')
    }
});

orderItemRouter.get('/orderItems/:id', async (req, res, next) => {
    const orderItemId = req.params.id;
    try {
        const result = await query('SELECT * FROM orderItems WHERE orderItemId = $1', [orderItemId]);

        if (results.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('orderItem not found')
        }
    } catch (error) {
        console.error('Error getting orderItem:', error);
        res.status(500).send('Error getting orderItem from the database');
    }
});

orderItemRouter.post('/orderItems', async (req, res, next) => {
    const { orderItemId, orderId, quantity  } = req.body;
    if (!itemId || !orderId || !quantity) {
        return res.status(400).send('item id, order id, and quantity are required');
    }
    try {
        const result = await query(
            'INSERT INTO orderItems (orderItemId, orderId, quantity) VALUES ($1, $2, $3) RETURNING *',
            [orderItemid, orderId, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding orderItem', error);
        res.status(500).send('Error adding orderItem to the database');
    }
});

orderItemRouter.put('/orderItems:id', async (req, res, next) => {
    const orderItemToUpdate = req.params.id;
    const { orderItemId, orderId, quantity } = req.body;

    if (!orderItemId && !orderId && !quantity) {
        res.status(400).send('At least one field is required for update');
    }
    try {
        const updates = [];
        const values = [];

        let paramIndex = 1;

        if (orderItemId !== undefined) {
            updates.push(`orderItemId = $${paramIndex++}`);
            values.push(orderItemId);
        }
        if (orderId !== undefined) {
            updates.push(`orderId = $${paramIndex++}`);
            values.push(orderId);
        }
        if (quantity !== undefined) {
            updates.push(`quantity = $${paramIndex++}`);
            values.push(quantity);
        }
        if (updates.length === 0) {
            return res.status(200).send('No fields to update');
        }
        const updateQuery = `
            UPDATE orderItems
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;
        values.push(orderItemToUpdate);

        const result = await query(updateQuery, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send(`orderItem with ID ${orderItemToUpdate} not found`);
        }
    } catch (error) {
        console.error('Error updating orderItem: ', error);
        res.status(500).send('Error updating orderItem in database');
    }
});


export default orderItemRouter;
