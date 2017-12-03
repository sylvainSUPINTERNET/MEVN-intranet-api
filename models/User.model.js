/**
 * Created by SYLVAIN on 20/11/2017.
 */

'use strict';

const Mater = require('./Mater.model');
const Grade = require('./Grade.model');


// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ObjectId  = mongoose.Schema.Types.ObjectId; //permet de creer un champ qui sera un d'objectId de custommer par exemple

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    salt: String,
    email: String,
    date_registration: Date,
    maters: [
        {
            type: ObjectId,
            ref: 'Mater'
        }
    ],
    grades: [
        {
            type: ObjectId,
            ref: 'Grade'
        }
    ],
    role: String,
});


userSchema.pre('remove',function(next){
    //this correspond schem user we try to delete
    var self = this;
    Grade.remove({user: this._id}).exec(); //supprime sa note forecement
    //user position in mater is auto deleted

    Mater.find({users: this._id}).then(function(maters){
        console.log(maters.length);
        for(let x = 0; x < maters.length; x++){
            Mater.find({name: maters[x].name}).then(function(materToUpdate){
                //todo : DELETE CE PUTIN DUSER DE MATERS +
                console.log(materToUpdate[0].name, materToUpdate[0].users);
                materToUpdate.update(
                    { },
                    { "$pull": { "users": self._id } },
                    { "multi": true },
                )

            });
        }
    });

    next();
});


module.exports = mongoose.model('User', userSchema);
