/**
 * Created by SYLVAIN on 20/11/2017.
 */

'use strict';

const User = require('./User.model');
const Grade = require('./Grade.model');

// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');

const ObjectId  = mongoose.Schema.Types.ObjectId; //permet de creer un champ qui sera un d'objectId de custommer par exemple



mongoose.Promise = global.Promise;


const materSchema = new mongoose.Schema({
    name: String,
    users: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    grades: [
        {
            type: ObjectId,
            ref: 'Grade'
        }
    ]

});
// todo: when user is added to mater, before check if user already in mater

/*
materSchema.pre('remove',function(next){
    //delete all reference in each grades
    Grade.find({mater:this._id}).then(function(grades){
        console.log("GRADES FROM THIS MATER TO DELETE", grades);
        //mater delete, but grades dont

    });
    //delete all reference in each users
    next();
});
*/


module.exports = mongoose.model('Mater', materSchema);
