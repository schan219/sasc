const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const users = require('./components/users/userAPI');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(limiter);
app.use(logger('dev'));
app.use(bodyParser.json({limit: '8kb'}));
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({error: err});
});

module.exports = app;
