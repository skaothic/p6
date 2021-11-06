const passwordValidator = require('password-validator');

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(6) // Minimum length 6
    .is().max(20) // Maximum length 20
    .has().digits() // Must have at  digits
    .has().not().spaces() // Should not have spaces


module.exports = schema