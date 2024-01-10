const { request } = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    login : async (request, response) => {
        try {
            const user = {
                email: request.body.email,
                password: request.body.password
            };
            console.log('user InDb => ', user);

            //on cherche à identifier le user à partir de son email
            const theUser = await User.findOneUserByEmail(user.email);

            //si aucun user trouvé avec ce mail => message d'erreur
            if (!theUser.id) {
                return response.status(400).json('loginError');
            }

            //le user avec ce mail existe, on vérifie son mot de passe en comparant :
            //- la version en clair saisie dans le formulaire
            //- la version hachée stockée en BDD
            //bcrypt est capable de déterminer si les 2 version du mot de passe correcpondent
            const validPassword = await bcrypt.compare(user.password, theUser.password);

            console.log(validPassword);

            //la vérification a échoué, on envoie un message d'erreur
            if (!validPassword) {
                return response.status(400).json('loginError');
            }

            const maxAge = 3 * 24 * 60 * 60 * 1000; // soit une durée d'une journée

            const createToken = (id) => {
                return jwt.sign({id}, process.env.TOKEN_SECRET,{expiresIn: maxAge})
            };

            const token = createToken(theUser.id);

            response.cookie('jwt', token, {httpOnly: true, maxAge: maxAge});

            console.log(request.cookies);
            console.log('Le token de l\'utilisateur est :', token);

            response.status(200).json(theUser);
            console.log("Connexion réussi pour : ", theUser);

        } catch (error) {
            response.status(404).json(error.message);
            console.log("Erreur dans la connexion d'un user : ", error);
        }
    },

    signupForm: async (request, response) => {
        try {
            //bcrypt va hashé le mot de passe
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(request.body.password, salt);

            //les infos de l'utilisateur à ajouter
            const userData = {
                email: request.body.email,
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                password: hash};

            //on checke si un utilisateur existe déjà avec cet email
            const doesExist = await User.findOneUserByEmail(userData.email);

            //si l'email existe déjà, alors on envoie un message d'erreur
            if (doesExist.id) {
                return response.status(400).json('emailError');
            }

            //si l'email n'existe pas, alors on inscrit le nouveau user en BDD
            const user = new User(userData);

            await user.createAuser(userData);
            console.log(hash);
            console.log(user);

            response.json(user);
            console.log("Le nouvel utilisateur a bien été rajouté");


        } catch(error) {
            console.log(error);
        }

},


    modifyUserData: async (request, response) => {
        try {
            //on vérifie si le user existe en BDD grâce à son ID
            const id = parseInt(request.params.id, 10);
            const theUser = await User.findOneById(id);
            console.log(id);

            const { firstname, lastname, password, newPassword } = request.body;
            console.log(request.body);
            //la vérification a échoué, on envoie un message d'erreur
            if (!theUser) {
                response.status(400).json("Nous n'avons pas trouvé l'id : " + id)
            } else {
            // on ne change que les paramètres envoyés
            if (firstname) {
                theUser.firstname = firstname;
            }
            if (lastname) {
                theUser.lastname = lastname;
            }

            if (password) {
            //on vérifie son mot de passe en comparant :
            //- la version en clair saisie dans le formulaire
            //- la version hachée stockée en BDD
            //bcrypt est capable de déterminer si les 2 version du mot de passe correcpondent
            const validPassword = await bcrypt.compare(password, theUser.password);
            console.log(password);
            console.log(validPassword);
            console.log("Confirmation du mot de passe actuel");

            //la vérification a échoué, on envoie un message d'erreur
            if (!validPassword) {
                return response.status(400).json('incorrectPasswordError');
            }
            //la vérification a réussi, l'utilisateur peut modifier son mot de passe
            if (validPassword) {
            console.log("Debut du processus de changement de mot de passe");

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);

            console.log("Fin du processus de changement de mot de passe");

            theUser.password = hash;

            console.log("Mot de passe crypté: ", theUser.password);
            console.log("Mot de passe mis à jour : ", newPassword);

            }
            }
            //on envoie les modifications en BDD
            await theUser.modifyUserData();
            console.log(theUser);
            response.json("L'utilisateur avec l'id : " + id + ", a bien été modifié");

            }
        } catch (error) {
            response.status(403).json(error.message);
            console.log("Erreur dans la modification d'un utilisateur : ", error);
        }
    },

    modifyUserEmail: async (request, response) => {
        try {
            //on vérifie si le user existe en BDD grâce à son ID
            const id = parseInt(request.params.id, 10);
            const theUser = await User.findOneById(id);
            //const data = request.body;
            const { email, password } = request.body;

            //la vérification a échoué, on envoie un message d'erreur
            if (!theUser) {
                response.status(400).json("Nous n'avons pas trouvé l'id : " + id)
            } else {
            //on vérifie son mot de passe en comparant :
            //- la version en clair saisie dans le formulaire
            //- la version hachée stockée en BDD
            //bcrypt est capable de déterminer si les 2 version du mot de passe correcpondent
            const validPassword = await bcrypt.compare(password, theUser.password);
            console.log(password);
            console.log(validPassword);

            //la vérification a échoué, on envoie un message d'erreur
            if (!validPassword) {
                return response.status(400).json('incorrectPasswordError');
            }

            //la vérification a réussi, l'utilisateur peut changer son mail
            if (validPassword) {
            //on checke si un autre utilisateur existe déjà avec cet email
            const doesExist = await User.findOneUserByEmail(email);

            //si l'email existe déjà, alors on envoie un message d'erreur
            if (doesExist.email) {
            return response.status(400).json('emailError');
            }

            //si l'email n'existe pas, alors on l'envoie en BDD
            theUser.email = email;
            }

            await theUser.modifyUserEmail();

            console.log(theUser);
            response.json("Le mail de l'utilisateur avec l'id : " + id + ", a bien été modifié");

            }
        } catch (error) {
            response.status(400).json(error.message);
            console.log("Erreur dans la modification d'un utilisateur : ", error);
        }
    },

    deleteUser : async (request, response) => {
        try {
            const id = parseInt(request.params.id, 10);
            const theUser = await User.findOneById(id);
            const { password } = request.body;

            if (!theUser) {
                response.status(400).json("Nous n'avons pas trouvé l'id : " + id)
            } else {
            //on vérifie son mot de passe en comparant :
            //- la version en clair saisie dans le formulaire
            //- la version hachée stockée en BDD
            //bcrypt est capable de déterminer si les 2 version du mot de passe correcpondent
            const validPassword = await bcrypt.compare(password, theUser.password);

            console.log(validPassword);

            //la vérification a échoué, on envoie un message d'erreur
            if (!validPassword) {
                return response.status(400).json('incorrectPasswordError');
            }

            if (validPassword) {
              //la vérification a réussi, l'utilisateur peut supprimer son compte
              await theUser.deleteUser();
              response.json("L'utilisateur' avec l'id : " + id + ", a bien été supprimé");
            }
            }
        } catch (error) {
            //si l'utilisateur n'existe pas
            response.status(403).json(error.message);
            console.log("Erreur dans la suppression d'un utilisateur : ", error);
        }
    },

    logoutUser : async (request, response) => {
            response.cookie('jwt', '', {maxAge: 1});
            //on redirige sur la page d'accueil
            response.redirect('/');
            console.log("L'utilisateur a bien été déconnecté");

    },




};

module.exports = userController;