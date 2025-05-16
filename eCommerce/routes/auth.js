import express from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import * as passport from 'passport';
import { query } from '../db/index.js';
const loginRouter = express.Router();

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }        
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, user);
        });
    } catch (error) {
        return cb(error);
    };
}));

loginRouter.get('/login', function (req, res, next) {
   // res.render('login');
});

loginRouter.post('/login/password',
    passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        res.redirect('/~' + req.user.username);
    });

loginRouter.get('/register', function (req, res, next) {
   // res.render('register');
});

loginRouter.post('/register', async function (req, res, next) {
    const { username, password } = req.body;

    // Basic input validation (you should add more robust validation)
    if (!username || !password) {
        return res.render('register', { error: 'Username and password are required.' });
    }

    try {
        // Check if the username already exists
        const existingUserResult = await query('SELECT username FROM users WHERE username = $1', [username]);
        if (existingUserResult.rows.length > 0) {
            return res.render('register', { error: 'Username already exists.' });
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
                        'INSERT INTO users (username, hashed_password, salt) VALUES ($1, $2, $3) RETURNING user_id, username',
                        [username, hashedPassword, salt]
                    );
                    const newUser = result.rows[0];
                    // Redirect the new user or log them in automatically
                    res.redirect('/auth/login'); // Or perhaps log them in: req.login(newUser, (err) => { ... });
                } catch (dbError) {
                    console.error('Error creating user:', dbError);
                    return res.render('register', { error: 'Error creating user in the database.' });
                }
            });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.render('register', { error: 'An unexpected error occurred during registration.' });
    }
});


export default loginRouter;
