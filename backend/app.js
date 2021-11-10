const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const cors = require('cors')
require('dotenv').config()
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize')
var RateLimit = require('express-rate-limit');


mongoose.connect(process.env.DB_LINK, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
});


// Rate limiting //
const limiter = RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: "Trop de requêtes, veuillez réessayer après 15 minutes."
});




app.use(limiter);
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(mongoSanitize())

const sauceRoutes = require('./routes/sauce')

const userRoutes = require('./routes/user');



app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes);


module.exports = app;