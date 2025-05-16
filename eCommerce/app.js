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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const app = express();
const port = 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
