/**
 * Created by SYLVAIN on 20/11/2017.
 */

//TODO: REMOVE sur deleteUserForMater !!!!!!!!!!!!!!!!!!!! (voir la doc et utiliser method du model pour ca

'use strict';

/* Dependencies */
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
const config = require('../config/config');



/* MODELS */
const Mater = require('../models/Mater.model');
const User = require('../models/User.model');


/* UTILS */
const random = require('../utils/random');
const checkToken = require('../utils/checkToken');



module.exports = {
    addMater: function (req, res) {
                let dataPostedByApp = req.body.body; //json received from API call app post
                let materName = dataPostedByApp.mater_name
                if(materName !== ""){
                    let mater = new Mater({
                        name: materName,
                    });
                    mater.save(function(err){
                        if(err)
                            console.log("error while insert new mater", err)
                        else
                            res.json({error: false, message:"Your mater inserted with success !"})

                    }).catch(err => console.log(err))
                }else{
                    res.json({error: true, message: "Your mater name is null ! "});
                }

    },
    addUserForMater: function(req,res){
                let dataPostedByApp = req.body.body; //json received from API call app post
                let userName = dataPostedByApp.user_name;
                let materName = dataPostedByApp.mater_name;

                if(userName !== "" && materName !== ""){
                    User.find({name: userName}).then(function(userFound){
                            Mater.find({name: materName}).then(function(materFound){
                                //list array => populate to display user per mater
                                console.log("MY USER" , userFound);
                                console.log("MY MATER", materFound);

                                userFound[0].maters.push(materFound[0]._id);
                                materFound[0].users.push(userFound[0]._id);
                                console.log("ok")
                                console.log("user update ", userFound);
                                console.log("mater update ", materFound);
                                userFound[0].save().catch(err => console.log(err));
                                materFound[0].save().catch(err => console.log(err));
                                res.json({error: false, message:"Matter / user updated with success "})

                                //TODO: checker if user already in matter => dont add
                                /*
                                if(materFound[0].users.indexOf(userFound[0]._id) !== -1){
                                    console.log("wtf");
                                    res.json({error: true, message:"User already in this matter !"})
                                }
                                */
                                /*
                                Mater.find( { users: { $exists: true, $eq: userFound[0]._id } } ).then(function(data){
                                    if(data.length !== 0){
                                        console.log(data);
                                        res.json({error:true, message:"This user is still in this mater !"})
                                    }else{

                                    }
                                });
                                */
                            }).catch(err => console.log(err))
                    }).catch(err => console.log(err))
                }else{
                    res.json({error: true, message: "Please fill correclty the fields ! "});
                }
    },
    deleteUserForMater: function(req,res){
        let dataPostedByApp = req.body.body; //json received from API call app post
        let userName = dataPostedByApp.user_name;
        let materName = dataPostedByApp.mater_name;

        if(userName !== "" && materName !== ""){
            User.find({name: userName}).then(function(userFound){
                Mater.find({name: materName}).then(function(materFound){
                    //list array => populate to display user per mater
                    console.log("MY USER" , userFound);
                    console.log("MY MATER", materFound);

                    //delete _id reference in both
                    materFound[0].users.splice(materFound[0].users.indexOf(userFound[0]._id), 1);
                    userFound[0].maters.splice(userFound[0].maters.indexOf(materFound[0]._id), 1);


                    console.log("user update ", userFound);
                    console.log("mater update ", materFound);
                    userFound[0].save().catch(err => console.log(err));
                    materFound[0].save().catch(err => console.log(err));
                    res.json({error: false, message:"Matter / user updated with success "})

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }else{
            res.json({error: true, message: "Please fill correclty the fields ! "});
        }
    },
    listMater: function(req,res){
        Mater.find().populate('users grades').then(function(maters){
            if(maters)
                res.json({error:false, message:maters})
        }).catch(err => console.log(err))
    },
    deleteMater: function(req,res){
        let dataPostedByApp = req.body.body; //json received from API call app post

        let materName = dataPostedByApp.mater_name;
        if(materName !== ""){
            Mater.findOne({name: materName})
                .then(function(mater){
                    if(mater){
                        //todo add CASCADE (if matter is deleted, remove the reference into each users)
                        mater.remove().catch(err => console.log(err));
                        res.json({error:false, message:"mater deleted with success !"})
                    }else{
                        res.json({error:true, message:"Mater not found !"})
                    }
                })
                .catch(err => res.json({error:true, message:err}))

        }else{
            res.json({error: true, message: "Please fill correclty the fields ! "});
        }
    }

    ,

};
