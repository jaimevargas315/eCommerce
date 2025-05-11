import express from 'express';
var addressRouter = express.Router();
import { query } from '../db/index.js'


addressRouter.get('/addresses', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM addresses');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting addresses'.error);
        res.status(500).send('Error getting addresses from database')
    }
});

addressRouter.get('/addresses/:id', async (req, res, next) => {
    const addressId = req.params.id;
    try {
        const result = await query('SELECT * FROM addresses WHERE id = $1', [addressId]);

        if (results.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('address not found')
        }
    } catch (error) {
        console.error('Error getting address:', error);
        res.status(500).send('Error getting address from the database');
    }
});

addressRouter.post('/addresses', async (req, res, next) => {
    const { addressId, customerId, city, state, address1, address2, zip } = req.body;
    if (!addressId || !customerId || !city || !state || !address1 || !address2 || !zip) {
        return res.status(400).send('address id, customer id, city, state, address1, address2, and zip are required');
    }

    try {
        const result = await query(
            'INSERT INTO addresss (addressId, customerId, city, state, address1, address2, zip) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [addressid, customerId, city, state, address1, address2, zip]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding address', error);
        res.status(500).send('Error adding address to the database');
    }
});

addressRouter.put('/address:id', async (req, res, next) => {
    const addressToUpdate = req.params.id;
    const { addressId, customerId, city, state, address1, address2, zip } = req.body;

    if (!addressId && !customerId && !city && !state && !address1 && !address2 && !zip) {
        res.status(400).send('At least one field is required for update');
    }
    try {
        const updates = [];
        const values = [];

        let paramIndex = 1;

        if (addressId !== undefined) {
            updates.push(`addressId = $${paramIndex++}`);
            values.push(addressId);
        }
        if (customerId !== undefined) {
            updates.push(`customerId = $${paramIndex++}`);
            values.push(customerId);
        }
        if (city !== undefined) {
            updates.push(`city = $${paramIndex++}`);
            values.push(city);
        }
        if (state !== undefined) {
            updates.push(`state = $${paramIndex++}`);
            values.push(state);
        }
        if (address1 !== undefined) {
            updates.push(`address1 = $${paramIndex++}`);
            values.push(address1);
        }
        if (address2 !== undefined) {
            updates.push(`address2 = $${paramIndex++}`);
            values.push(address2);
        }
        if (zip !== undefined) {
            updates.push(`zip = $${paramIndex++}`);
            values.push(zip);
        }
        if (updates.length === 0) {
            return res.status(200).send('No fields to update');
        }
        const updateQuery = `
            UPDATE addresses
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;
        values.push(addressToUpdate);

        const result = await query(updateQuery, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send(`Address with ID ${addressToUpdate} not found`);
        }
    } catch (error) {
        console.error('Error updating address: ', error);
        res.status(500).send('Error updating address in database');
    }
});


export default addressRouter;
