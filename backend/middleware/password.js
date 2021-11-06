const password = require('../models/password')


module.exports = (req, res, next) => {
    if (!password.validate(req.body.password)) {
        return res.status(400).json('mot de passe trop faible')
    } else
        next()





}