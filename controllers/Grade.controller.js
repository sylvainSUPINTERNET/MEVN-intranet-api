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
const Grade = require('../models/Grade.model');

/* UTILS */
const random = require('../utils/random');
const checkToken = require('../utils/checkToken');



module.exports = {
    addGrade: function (req, res) {
                let dataPostedByApp = req.body.body; //json received from API call app post
                let grade_total = dataPostedByApp.grade_total; //numeric
                let grade_value = dataPostedByApp.grade_value; //numeric
                let grade_user = dataPostedByApp.grade_user;  //name
                let grade_mater = dataPostedByApp.grade_mater; //name



                if(grade_value && grade_total && grade_user!== "") {
                    User
                        .findOne({name: grade_user})
                        .then(function (user) {
                            if (user) {
                                Mater
                                    .findOne({name: grade_mater})
                                    .then(function (mater) {
                                        console.log("MATER TO CHECK IF USER IS INSIDE", mater);
                                        console.log(mater.users.indexOf(user._id))
                                        if (mater.users.length !== 0) {
                                                console.log(mater.users.indexOf(user._id));
                                                if(mater.users.indexOf(String(user._id)) > -1){
                                                    let grade = new Grade({
                                                        value: grade_value,
                                                        total: grade_total,
                                                        mater: mater._id,
                                                        user: user._id,
                                                    });

                                                    grade.save().catch(err => console.log(err))

                                                    mater.grades.push(grade);
                                                    user.grades.push(grade);
                                                    mater.save().catch(err => console.log(err))
                                                    user.save().catch(err => console.log(err))
                                                }else{
                                                    res.json({error:true, message: "user not found in this matter, cant add grade"})
                                                }

                                        } else {
                                            res.json({error:true, message: "Error, user is not register for this mater"})
                                        }
                                    }).catch(err => console.log(err))
                            }
                        }).catch(err => console.log(err))
                }


                                        /*
                                        if(mater){
                                            console.log("USER", user);
                                            console.log("MATER", mater);

                                            let grade = new Grade({
                                                value: grade_value,
                                                total: grade_total,
                                                mater: mater._id,
                                                user: user._id,
                                            });
                                            console.log("NOTE", grade);
                                            grade.save().catch(err => console.log(err))

                                            // Update mater / user with new grade
                                            mater.grades.push(grade);
                                            user.grades.push(grade);
                                            mater.save().catch(err => console.log(err))
                                            user.save().catch(err => console.log(err))

                                        }else{
                                            res.json({error:true, message:"Not mater found for this name"})
                                        } */

    },

    listGrade: function(req,res){
        Grade.find().populate('user mater').then(function(grades){
            if(grades){
                res.json({error:false, message:grades})
            }else{
                res.json({error: true, message:"NO GRADES FOUND !"})
            }
        }).catch(err => console.log(err))
    },

    deleteGrade: function(req,res){
        let dataPostedByApp = req.body; //json received from API call app post
        console.log(dataPostedByApp);
        let grade_id = dataPostedByApp.grade_id;
        console.log(grade_id);
        if(grade_id){
            Grade.findOne({_id: grade_id}).then(function(grade){
                console.log("GRADE TO DELETE", grade)
                grade.remove().catch(err => console.log(err));
            })
        }else{
            res.json({error:true, message: "No grade to delete"})
        }


    },

};
