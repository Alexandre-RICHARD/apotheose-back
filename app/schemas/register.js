const Joi = require('joi');

//on regarde ce qu'il y a dans request.body et on le valide par rapport au validator Joi
//tous les éléments sont "required", ils sont obligatoire pour s'inscrire
//on vérifie que l'email soit bien une "string" avec une contrainte "regex" pour ne pas écrire n'importe quoi comme email
//on vérifie que le firstname et lastname soit bien des "string"
//on vérifie que le password contient au minimum 8 caractères et maximum 60 caractères, au moins une lettre majuscule, une lettre minuscule et un chiffre grâce au "regex"
const registerSchema = Joi.object().keys({
    email: Joi.string().regex(/^[a-zA-Z0-9!#$%&'*+\/=?^_{|}~-][a-zA-Z0-9!#$%&'*+\/=?^_{|}~.-]+[a-zA-Z0-9!#$%&'*+\/=?^_{|}~-]@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/).required().error(new Error('emailFormatError')),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,60}$/).min(8).max(60).required().error(new Error('newPasswordError'))

});

module.exports = registerSchema;