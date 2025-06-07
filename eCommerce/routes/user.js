import express from 'express';
var userRouter = express.Router();
import { query } from '../db/index.js'


userRouter.get('/users', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting users'.error);
        res.status(500).send('Error getting users from database')
    }
});

userRouter.get('/users/:id', async (req, res, next) => {
    const userId = req.params.id;
    try {
        const result = await query('SELECT * FROM users WHERE "userId" = $1', [userId]);

        if (results.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('user not found')
        }
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Error getting user from the database');
    }
});

userRouter.post('/users', async (req, res, next) => {
    const { userId, userName, orderId, hashedPassword, salt, type } = req.body;
    if (!userId || !userName || !orderId || !hashedPassword || !salt ||!type) {
        return res.status(400).send('user id, name,order id, hashed password, salt, and type are required');
    }

    try {
        const result = await query(
            'INSERT INTO users ("userId", name, orderid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userid, userName, orderid, hashedPassword, salt, type]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding user', error);
        res.status(500).send('Error adding user to the database');
    }
});

userRouter.put('/users:id', async (req, res, next) => {
    const userToUpdate = req.params.id;
    const { userId, userName, orderId, hashedPassword, salt, type } = req.body;

    if ( !userId && !userName && !orderId && hashedPassword && salt && type) {
        res.status(400).send('At least one field is required for update');
    }
    try {
        const updates = [];
        const values = [];

        let paramIndex = 1;

        if (userId !== undefined) {
            updates.push(`userId = $${paramIndex++}`);
            values.push(userId);
        }
        if (userName !== undefined) {
            updates.push(`name = $${paramIndex++}`);
            values.push(userName);
        }
        if (orderId !== undefined) {
            updates.push(`orderId = $${paramIndex++}`);
            values.push(orderId);
        }
        if (hashedPassword !== undefined) {
            updates.push(`hashedPassword = $${paramIndex++}`);
            values.push(hashedPassword);
        }
        if (salt !== undefined) {
            updates.push(`salt = $${paramIndex++}`);
            values.push(salt);
        }
        if (typw !== undefined) {
            updates.push(`type = $${paramIndex++}`);
            values.push(type);
        }
        
        if (updates.length === 0) {
            return res.status(200).send('No fields to update');
        }
        const updateQuery = `
            UPDATE users
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;
        values.push(userToUpdate);

        const result = await query(updateQuery, values);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send(`user with ID ${userToUpdate} not found`);
        }
    } catch (error) {
        console.error('Error updating user: ', error);
        res.status(500).send('Error updating user in database');
    }
});


export default userRouter;
