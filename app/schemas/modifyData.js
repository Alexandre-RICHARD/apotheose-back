const Joi = require('joi');

//on regarde ce qu'il y a dans request.body et on le valide par rapport au validator Joi
//on vérifie que le firstname et lastname soit bien des "string"
//on vérifie que le password contient au minimum 8 caractères et maximum 20 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre grâce au "regex"
//on vérifie que le nouveau password contient au minimum 8 caractères et maximum 20 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre grâce au "regex"
const modifyDataSchema = Joi.object().keys({
    firstname: Joi.string(),
    lastname: Joi.string(),
    password: Joi.string().required().error(new Error('incorrectPasswordError')),
    newPassword: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,60}$/).min(8).max(60).required().error(new Error('newPasswordError'))
    
});

module.exports = modifyDataSchema;