const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkUser = (request, response, next) => {
        const token = request.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (error, decodedToken) => {
                if(error) {
                    response.locals.user = null;
                    response.cookie('jwt', '', {maxAge: 1});
                    next();
                } else {
                    let user = await User.findOneById(decodedToken.id);
                    response.locals.user = user;
                    console.log(response.locals.user);
                    next();
                }
            })
        } else {
            response.locals.user = null;
            next();
        }
};

module.exports = checkUser;