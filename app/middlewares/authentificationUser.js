const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authentificationUser = (request, response, next) => {
        const token = request.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) => {
                if(error) {
                    console.log(error);
                } else {
                    console.log('L\'id de l\'utilisateur est :',decodedToken.id);
                    console.log('Le token de l\'utilisateur est :',request.cookies.jwt);
                    next();
                }
            })
        } else {
            console.log('No Token');
            next();
        }
};


module.exports = authentificationUser;