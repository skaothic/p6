const jwt = require('jsonwebtoken');
require('dotenv').config()


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.tokenChain);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(403).json({
            error: new Error('Invalid request!')
        });
    }
};



//integrer err 403 pour mauvais Id