import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import './db/index.js';
import addressRouter from './routes/address.js';
import userRouter from './routes/user.js';
import indexRouter from './routes/index.js';
import itemRouter from './routes/item.js';
import orderItemRouter from './routes/orderItem.js';
import orderRouter from './routes/order.js';
import loginRouter from './routes/auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const app = express();
const port = 3001;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'a_very_secret_key_that_you_should_change_to_env_var_in_production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true if HTTPS, false for http://localhost
        maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds for session expiry
    }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    // What to store in the session (e.g., just the user's ID)
    // The user object comes from your LocalStrategy's success callback (the 'user' argument)
    cb(null, user.userId);
});

passport.deserializeUser(async function (id, cb) {
    // How to retrieve the full user object from the database based on the ID stored in the session
    try {
        const result = await query('SELECT userId, username, email FROM users WHERE userId = $1', [id]);
        const user = result.rows[0];

        if (!user) {
            return cb(null, false); // User not found, session invalid
        }
        cb(null, user); // User found, attach to req.user
    } catch (err) {
        console.error('Error deserializing user:', err);
        cb(err);
    }
});

app.use('/address', addressRouter);
app.use('/users', userRouter);
app.use('/items', itemRouter);
app.use('/orderItems', orderItemRouter);
app.use('/orders', orderRouter);
app.use('/', indexRouter);
app.use('/auth', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
    console.log(`Listening on port express ${port}`)
})

export default app;
