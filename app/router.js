const { Router } = require('express');
const router = Router();

//on importe nos controllers
const quizController = require('./controllers/quizController');
const questionController = require('./controllers/questionController');
const userController = require('./controllers/userController');
const userMadeQuizController = require('./controllers/userMadeQuizController');

//on importe les validateurs 'Joi'
const { validateBody } = require('./services/validator');
const registerSchema = require ('./schemas/register');
const modifyDataSchema = require ('./schemas/modifyData');
const modifyEmailSchema = require ('./schemas/modifyEmail');

const authentificationUser = require('./middlewares/authentificationUser');

// Page d'accueil
router.get('/', (req, res) => {
    res.send('Hello and Welcome! This is a blockchain API!');
  });

// Routes quiz
router.get('/:lang/quizzes', quizController.allQuiz);
router.get('/:lang/quiz/:id', quizController.quizById);

// Routes Article
router.get('/:lang/articles', questionController.allArticles);

// Routes Login, Register
router.post('/login', authentificationUser, userController.login);
router.patch('/settings/user/:id', validateBody(modifyDataSchema), userController.modifyUserData);
router.patch('/settings/email/:id', validateBody(modifyEmailSchema), userController.modifyUserEmail);
router.delete('/settings/delete/:id', userController.deleteUser);
router.post('/register', validateBody(registerSchema), userController.signupForm);
router.put('/score', userMadeQuizController.createOrModifyUserScoreQuiz);
router.get('/score/:id', userMadeQuizController.userScoreById);
router.post('/logout', userController.logoutUser);


module.exports = router;