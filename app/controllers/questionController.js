const { request } = require('express');
const Question = require('../models/question');

const questionController = {
    allArticles : async (request, response) => {
        try {
            //on récupère tous les articles en BDD avec "lang" comme paramètre
            //les langues seront choisi automatiquement en fonction de la langue du navigateur
            //ou de la langue choisi sur le site
            const lang = request.params.lang;
            const article = await Question.findAllArticle(lang);
            //on affiche tous les articles de la langue
            response.json(article);
        } catch (error) {
            response.status(404).json(error.message);
            console.log('Erreur dans le controller article : ', error);
        }
    },

};

module.exports = questionController;