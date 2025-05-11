import express from 'express';
var customerRouter = express.Router();
import { query } from '../db/index.js'


customerRouter.get('/customers', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting customers'.error);
        res.status(500).send('Error getting customers from database')
    }
});

customerRouter.get('/customers/:id', async (req, res, next) => {
    const customerId = req.params.id;
    try {
        const result = await query('SELECT * FROM customers WHERE id = $1', [customerId]);

        if (results.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Customer not found')
        }
    } catch (error) {
        console.error('Error getting customer:', error);
        res.status(500).send('Error getting customer from the database');
    }
});

customerRouter.post('/customers', async (req, res, next) => {
    const { customerId, name, orderId } = req.body;
    if (!customerId || !name || !orderId) {
        return res.status(400).send('customer id, name, and order id are required');
    }

    try {
        const result = await query(
            'INSERT INTO customers (customerid, name, orderid) VALUES ($1, $2, $3) RETURNING *',
            [customerid, name, orderid]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding customer', error);
        res.status(500).send('Error adding customer to the database');
    }
});

customerRouter.put('/customers:id', async (req, res, next) => {
    const customerToUpdate = req.params.id;
    const { customerId, name, orderId } = req.body;

    if ( !customerId && !name && !orderId) {
        res.status(400).send('At least one field is required for update');
    }
    try {
        const updates = [];
        const values = [];

        let paramIndex = 1;

        if (customerId !== undefined) {
            updates.push(`customerId = $${paramIndex++}`);
            values.push(customerId);
        }
        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
        }
        if (orderId !== undefined) {
            updates.push(`orderId = $${paramIndex++}`);
            values.push(orderId);
        }
        
        if (updates.length === 0) {
            return res.status(200).send('No fields to update');
        }
        const updateQuery = `
            UPDATE customers
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;
        values.push(customerToUpdate);

        const result = await query(updateQuery, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send(`customer with ID ${customerToUpdate} not found`);
        }
    } catch (error) {
        console.error('Error updating customer: ', error);
        res.status(500).send('Error updating customer in database');
    }
});


export default customerRouter;
