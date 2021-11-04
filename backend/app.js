const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors')
require('dotenv').config()
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize')
var RateLimit = require('express-rate-limit');
var MongoStore = require('rate-limit-mongo');


mongoose.connect(process.env.DB_LINK, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));




const limiter = new RateLimit({
    store: new MongoStore({
        uri: process.env.DB_LINK,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        // should match windowMs
        expireTimeMs: 15 * 60 * 1000,
        errorHandler: console.error.bind(null, 'rate-limit-mongo')
            // see Configuration section for more options and details
    }),
    max: 100,
    // should match expireTimeMs
    windowMs: 15 * 60 * 1000
});


app.use(limiter);
app.use(express.json())
app.use(helmet());
app.use(cors())
app.use(mongoSanitize())

const sauceRoutes = require('./routes/sauce')

const userRoutes = require('./routes/user');



app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes);


module.exports = app;