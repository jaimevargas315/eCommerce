import express from 'express';
var itemRouter = express.Router();
import { query } from '../db/index.js'


itemRouter.get('/items', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM items');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting items'.error);
        res.status(500).send('Error getting items from database')
    }
});

itemRouter.get('/items/:id', async (req, res, next) => {
    const itemId = req.params.id;
    try {
        const result = await query('SELECT * FROM items WHERE itemId = $1', [itemId]);

        if (results.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('item not found')
        }
    } catch (error) {
        console.error('Error getting item:', error);
        res.status(500).send('Error getting item from the database');
    }
});

itemRouter.post('/items', async (req, res, next) => {
    const { itemId, name, description, inStock } = req.body;
    if (!itemId || !name || !description || !inStock) {
        return res.status(400).send('item id, name, description, and in-stock amount are required');
    }
    try {
        const result = await query(
            'INSERT INTO items (itemId, name, description, inStock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [itemid, name, description, inStock]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding item', error);
        res.status(500).send('Error adding item to the database');
    }
});

itemRouter.put('/items:id', async (req, res, next) => {
    const itemToUpdate = req.params.id;
    const { itemId, name, description, inStock } = req.body;

    if (!itemId && !name && !description && !inStock) {
        res.status(400).send('At least one field is required for update');
    }
    try {
        const updates = [];
        const values = [];

        let paramIndex = 1;

        if (itemId !== undefined) {
            updates.push(`itemId = $${paramIndex++}`);
            values.push(itemId);
        }
        if (name !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(name);
        }
        if (description !== undefined) {
            updates.push(`description = $${paramIndex++}`);
            values.push(description);
        }
        if (inStock !== undefined) {
            updates.push(`inStock = $${paramIndex++}`);
            values.push(inStock);
        }
        if (updates.length === 0) {
            return res.status(200).send('No fields to update');
        }
        const updateQuery = `
            UPDATE items
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;
        values.push(itemToUpdate);

        const result = await query(updateQuery, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send(`item with ID ${itemToUpdate} not found`);
        }
    } catch (error) {
        console.error('Error updating item: ', error);
        res.status(500).send('Error updating item in database');
    }
});


export default itemRouter;
