/**
 * Created by SYLVAIN on 20/11/2017.
 */


'use strict';

/* Dependencies */
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
const config = require('../config/config');



/* MODELS */
const User = require('../models/User.model');


/* UTILS */
const random = require('../utils/random');
const checkToken = require('../utils/checkToken');


//TODO:: // si il y a des undefined sur req.body c'est parce que aximo ajoute un body donc req.body.body.propl
module.exports = {
    decodeMyToken: function(req,res){
        let dataPostedByApp = req.body.token;
        if(dataPostedByApp){
            checkToken(req, function(decoded){
                console.log(decoded);
                res.json(decoded);
            });
        }
    },
    addUser: function (req, res) {

        let dataPostedByApp = req.body.body; //json received from API call app post

        let errors = {
            name: "",
            password: "",
            passwordConfirmed: "",
            email: "",
            error: true
        };

        let name = String(dataPostedByApp.name);
        let password = String(dataPostedByApp.password);
        let passwordConfirmed = String(dataPostedByApp.passwordConfirmed);
        let email = String(dataPostedByApp.email);


        if (name.length <= 3 || typeof name !== 'string') {
            errors.name += "Votre nom doit faire minimum 3 caractères !";
        }
        if (password.length <= 3 || typeof password !== 'string') {
            errors.password += "Votre nom doit faire minimum 3 caractères !";
        }

        if (passwordConfirmed.length <= 3 || typeof passwordConfirmed !== 'string' || passwordConfirmed !== password) {
            errors.passwordConfirmed += "Vos mots de passe doivent correspondre !";
        }
        if (!email || typeof email !== 'string') {
            errors.email += "Votre email n'est pas valide!";
        }

        if (errors.name === "" && errors.password === "" && errors.passwordConfirmed === "") {
            //IF SUCCESS ON INSERT
            let salt = random(10);
            let hashPassword = sha256(password + salt);

            User.findOne({email: email}, function (err, user) {
                // doc is a Document
                if (user) {
                    console.log("Email already used !")
                    errors.email = " Email already used !";
                    res.json(errors);
                } else {
                    User.findOne({name: name}, function (err, user) {
                        if (user) {
                            console.log("Name already used !");
                            errors.name = "Name already used !";
                            res.json(errors);
                        } else {

                            let userToCreate = new User({
                                name: name,
                                password: hashPassword,
                                salt: salt,
                                email: email,
                                date_registration: new Date(),
                                role: "ROLE_ETUDIANT" //ROLE_TEACHER
                            });


                            userToCreate.save(function (err) {
                                if (err)
                                    throw err;

                                // create a token
                                let token = jwt.sign({
                                    "name": userToCreate.name,
                                    "password": userToCreate.password,
                                    "role": userToCreate.role,
                                    "email": userToCreate.email
                                }, config.secret, {
                                    expiresIn: "1d" // d h etc
                                });
                                res.json({
                                    error: false,
                                    message: "user inserted with success",
                                    user: userToCreate,
                                    token: token,
                                    code_http: 200
                                })
                            });

                        }
                    });
                }
            });
        } else {
            //MINIMUM une erreur / 3
            res.json(errors);
        }
    },

    logoutUser: function (req, res) {
        res.clearCookie("token"); //delete token => deconnexion
        let path_name = '/login'; //redirect
        res.json({message: "you get disconnected !", error: false, path_name_redirect: path_name})
    },

    loginUser: function (req, res) {

        let dataPostedByApp = req.body.body; //json received from API call app post

        let email = String(dataPostedByApp.email)
        let password = String(dataPostedByApp.password);

        // find the user
        User.findOne({
            email: email
        }, function (err, user) {

            if (err) throw err;
            if (!user) {
                res.json({error: true, message: 'Login failed. User not found.'});
                //console.log(user);
                //redirect to inscription page
            } else if (user) {
                // check if password matches
                if (user.password !== sha256(password + user.salt)) {
                    res.json({error: true, message: 'Login failed. Wrong password.'});
                } else {

                    // if user is found and password is right
                    // create a token
                    // ON PEUT AJOUTER DES CHAMPS ICI qui seront accessible ensuite dans le verify via decode()(format json)
                    let token = jwt.sign({
                        "name": user.name,
                        "password": user.password,
                        "role": user.role,
                        "email": user.email
                    }, config.secret, {
                        expiresIn: "1d" // d h etc
                    });

                    res.json({
                        message: 'Connected with succes !',
                        error: false,
                        token: token
                    });
                }

            }

        });
    },
    listUser: function (req, res) {
        //TODO .populate avec un objet mater / grade etc par la suite
                //call mongoose
                User.find().then(function (users) {
                        res.json({error:false, message: users});
                    })
                    //erreur mongoose
                    .catch(function (err) {
                        res.json({error: true, message: err})
                    });
    },

    promoteUser: function(req,res){
        let dataPosted = req.body.body
        let user_role = dataPosted.user_role;
        let user_id = dataPosted.user_id;

        const ROLE_ETUDIANT = "ROLE_ETUDIANT";
        const ROLE_PROFESSEUR = "ROLE_PROFESSEUR";

        if(user_id && user_role){
            User
                .findOne({_id: user_id})
                .then(function(user){
                    if(user){
                        if(user_role === ROLE_ETUDIANT){
                            //devient professeur
                            user.role = ROLE_PROFESSEUR
                            user.save().catch(err => console.log(err))
                        }else{
                            //devient etudiant
                            user.role = ROLE_ETUDIANT
                            user.save().catch(err => console.log(err))
                        }
                    }else{
                        res.json({error:true, message:"Cant change the role of this User, user not found !"})
                    }
                 })
                .catch(err => console.log(err))
        }

    },

    //TODO: // suite route API
};
