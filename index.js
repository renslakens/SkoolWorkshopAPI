const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const fileUpload = require('express-fileupload');
const logger = require('./src/config/config').logger;
require('dotenv').config();

const port = process.env.PORT;

const dbconnection = require('./dbconnection');
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes');

app.use(bodyParser.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

//Templating engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.all('*', (req, res, next) => {
    const method = req.method;

    logger.debug(`Method ${method} is aangeroepen`);
    next();
});

//Default route
app.get('/', (req, res) => {
    logger.debug('User is on default endpoint');
    res.status(200).json({
        status: 200,
        result: 'Skool Workshop API',
    });
});

//User route
app.use('/api/user', userRoutes);

//Authentication route
app.use('/api/auth/login', authRoutes);

app.all('*', (req, res) => {
    res.status(401).json({
        status: 401,
        result: 'End-point not found',
    });
});

//Error handler
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status).json(err);
});

//Welcome message
app.listen(port, () => {
    logger.debug(`API listening on port ${port}`);
});

process.on('SIGINT', () => {
    logger.debug('SIGINT signal received: closing HTTP server');
    dbconnection.end((err) => {
        logger.debug('Database connection closed');
    });
    app.close(() => {
        logger.debug('HTTP server closed');
    });
});

module.exports = app;