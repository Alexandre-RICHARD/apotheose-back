const { request } = require('express');
const Quiz = require('../models/quiz');

const quizController = {
    allQuiz : async (request, response) => {
        try {
            //on récupère tous les quiz en BDD avec "lang" comme paramètre
            //les langues seront choisi automatiquement en fonction de la langue du navigateur
            //ou de la langue choisi sur le site
            const lang = request.params.lang;
            const quiz = await Quiz.findAllQuiz(lang);

            console.log(quiz);
            response.json(quiz);
        } catch (error) {
            //si la page n'existe pas
            response.status(404).json(error.message);
            console.log("Erreur dans le quiz controller : ", error);
        }
    },

    quizById : async (request, response) => {
        try {
        //on récupère un quiz en fonction de son ID en BDD avec "lang" comme paramètre
        const lang = request.params.lang;
        const id = parseInt(request.params.id, 10);
        const theQuiz = await Quiz.findOneQuiz(id, lang);
        
        console.log(theQuiz);
        response.json(theQuiz);
        } catch (error) {
        // si le quiz n'existe pas
        response.status(404).json(error.message);
        console.log("Erreur dans l'id demandé : ", error);
        }
    },

};

module.exports = quizController;