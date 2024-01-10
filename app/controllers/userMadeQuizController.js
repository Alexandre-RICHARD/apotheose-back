const { request } = require('express');
const UserMadeQuiz = require('../models/userMadeQuiz');

const userMadeQuizController = {
    userMadeQuizById : async (request, response) => {
    try {
        //on récupère un utilisateur en fonction de son ID en BDD
        const id = parseInt(request.params.id, 10);
        const theUserMadeQuiz = await UserMadeQuiz.findOneById(id);

        console.log(theUserMadeQuiz);
        response.json(theUserMadeQuiz);
    } catch (error) {
        // si le user n'existe pas
        response.status(404).json(error.message);
        console.log("Erreur dans l'id demandé : ", error);
    }
    },

    userScoreById : async (request, response) => {
    try {
        //on récupère un utilisateur en fonction de son ID en BDD
        const id = parseInt(request.params.id, 10);
        const theUserScoreQuiz = await UserMadeQuiz.findScoreUserById(id);

        console.log(theUserScoreQuiz);
        response.json(theUserScoreQuiz);
    } catch (error) {
        // si le user n'existe pas
        response.status(404).json(error.message);
        console.log("Erreur dans l'id demandé : ", error);
    }
    },

    createOrModifyUserScoreQuiz: async (request, response) => {
    try {
        //les infos de l'utilisateur à ajouter
        const { scoreQuiz, userId, quizId } = request.body;
        console.log(request.body);
        //on checke si un utilisateur existe déjà avec cet id
        const theUserDoesExist = await UserMadeQuiz.findOneById(userId, quizId);

        //si l'id existe déjà, alors on modifie les scores
        if (theUserDoesExist.id) {
        theUserDoesExist.scoreQuiz = scoreQuiz;

        console.log("Debut de la modification");
        await theUserDoesExist.modifyScoreQuiz();
        response.json(theUserDoesExist);

        console.log(theUserDoesExist);
        console.log("Les scores ont bien été modifié");

        //si l'id n'existe pas, alors on inscrit le score de l'utilisateur en BDD
        } else {
        console.log("Debut de la création");
        const newUserScore = new UserMadeQuiz(request.body);
        await newUserScore.createScoreQuiz();

        response.json(newUserScore);
        console.log(newUserScore);
        console.log("Les scores ont bien été rajouté");
        }
    } catch(error) {
        console.log(error);
    }
},


};

module.exports = userMadeQuizController;