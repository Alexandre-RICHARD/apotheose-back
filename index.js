require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 4000;
const apiRouter = require('./app/router');
const cookieParser = require('cookie-parser');
const app = express();
const checkUser = require('./app/middlewares/checkUser');
const authentificationUser = require('./app/middlewares/authentificationUser');
const jwt = require('jsonwebtoken');

app.use(express.json());
// on rajoute la gestion des POST body
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

//CORS
app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
    methods: "GET, PUT, PATCH, POST, DELETE",
    allowedHeaders : ['Content-Type', 'Authorization'],

}));

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "Origin, x-Requested-With, Content-Type, Accept")
    response.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    next();
});

//jwt
app.get('*', checkUser);
app.get('/jwtid', authentificationUser, (request, response) => {
    response.status(200).json({'L\'id de l\'utilisateur est : ': response.locals.user.id,
    'Le prénom de l\'utilisateur est : ': response.locals.user.firstname})
});

app.use(apiRouter);

app.listen(port, () => console.log(`Server listenning on http://localhost:${port}`));