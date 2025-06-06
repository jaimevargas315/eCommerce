import express, { json } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { query } from '../db/index.js';
const loginRouter = express.Router();

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    console.log('--- Passport LocalStrategy Verify Start ---');
    console.log('Attempting login for username:', username);
    console.log('Password received (DO NOT LOG IN PRODUCTION!):', password); // Temporary for debug, REMOVE LATER!

    try {
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            console.log('User not found in DB:', username);
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        console.log('User found:', user.username);
        console.log('Stored hashed_password (from DB):', user.hashed_password);
        console.log('Stored salt (from DB):', user.salt);

        // Convert the stored hashed_password (hex string) back to a Buffer
        const storedHashedPasswordBuffer = Buffer.from(user.hashed_password, 'hex');
        console.log('Stored hashed_password (as Buffer):', storedHashedPasswordBuffer.toString('hex')); // Confirm it converts back correctly

        // Ensure user.salt is also a Buffer if it's not already
        const saltBuffer = Buffer.from(user.salt, 'hex'); // Convert salt to Buffer if it's a hex string
        console.log('Salt used for hashing (as Buffer):', saltBuffer.toString('hex'));

        crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', function (err, hashedPasswordBuffer) {
            // hashedPasswordBuffer (the one generated now) is already a Buffer.

            if (err) {
                console.error('Error during PBKDF2 hashing in login:', err);
                return cb(err);
            }

            console.log('Newly generated hashed_password (as Buffer):', hashedPasswordBuffer.toString('hex'));

            // Compare the newly generated hashedPasswordBuffer with the stored one
            // Ensure both are Buffers of the same length
            if (storedHashedPasswordBuffer.length !== hashedPasswordBuffer.length) {
                console.log('HASH LENGTH MISMATCH!');
                console.log('Stored hash length:', storedHashedPasswordBuffer.length);
                console.log('Generated hash length:', hashedPasswordBuffer.length);
                return cb(null, false, { message: 'Incorrect username or password.' });
            }

            if (!crypto.timingSafeEqual(storedHashedPasswordBuffer, hashedPasswordBuffer)) {
                console.log('Passwords DO NOT match after timingSafeEqual comparison.');
                return cb(null, false, { message: 'Incorrect username or password.' });
            }

            console.log('Passwords MATCH! User authenticated.');
            console.log('--- Passport LocalStrategy Verify End (Success) ---');
            return cb(null, user);
        });
    } catch (error) {
        console.error('Error during Passport LocalStrategy verify (outer catch):', error);
        return cb(error);
    };
}));
loginRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Passport auth error:', err);
            return next(err); // Pass server errors to global handler
        }
        if (!user) {
            // Authentication failed
            return res.status(401).json({ message: info.message || 'Incorrect username or password.' });
        }
        // Authentication successful - manually log in the user
        req.logIn(user, (err) => {
            if (err) {
                console.error('req.logIn error:', err);
                return next(err);
            }
            // Send success JSON response
            res.status(200).json({
                message: 'Login successful!',
                user: {
                    user_id: user.userId,
                    username: user.username,
                    email: user.email
                }
            });
        });
    })(req, res, next);
});

loginRouter.post('/register', async function (req, res, next) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Check if the username already exists
        const existingUserResult = await query('SELECT username FROM users WHERE username = $1', [username]);
        if (existingUserResult.rows.length > 0) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        const existingEmailResult = await query('SELECT email FROM users WHERE email = $1', [email]);
        if (existingEmailResult.rows.length > 0) {
            return res.status(409).json({ error: 'Email already in use.' });
        }
        // Generate a unique salt
        crypto.randomBytes(16, async (err, saltBuffer) => {
            if (err) { return next(err); }
            const salt = saltBuffer.toString('hex');

            // Hash the password using the generated salt
            crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', async (err, hashedPasswordBuffer) => {
                if (err) { return next(err); }
                const hashedPassword = hashedPasswordBuffer.toString('hex');

                // Store the new user in the database
                try {
                    const result = await query(
                        'INSERT INTO users (username, email, hashed_password, salt) VALUES ($1, $2, $3, $4) RETURNING username',
                        [username, email, hashedPassword, salt]
                    );
                    const newUser = result.rows[0];
                    res.status(201).json({
                        message: 'User created successfully.',
                        user: {
                            user_id: newUser.userId,
                            username: newUser.username,
                            email: newUser.email
                        }
                    });
                } catch (dbError) {
                    console.error('Error creating user:', dbError);
                    return res.status(400).json({ error: 'Error creating user in the database.' });
                }
            });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(400).json({ error: 'An unexpected error occurred during registration.' });
    }
});


export default loginRouter;
