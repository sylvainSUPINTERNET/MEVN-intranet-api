/**
 * Created by SYLVAIN on 20/11/2017.
 */

'use strict';

/* MODELS for cascade remove*/

const Mater = require('./Mater.model');
const Grade = require('./Grade.model');
const User = require('./User.model');

// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');

const ObjectId  = mongoose.Schema.Types.ObjectId; //permet de creer un champ qui sera un d'objectId de custommer par exemple



mongoose.Promise = global.Promise;


const gradeSchema = new mongoose.Schema({
    value: Number,
    total: Number,
    mater:
        {
            type: ObjectId,
            ref: 'Mater'
        },
    user: {
        type: ObjectId,
        ref: 'User'
    }

});

//todo: when grade is added, check before if user is in matter

/*
gradeSchema.pre('remove',function(next){
    //Mater.remove({grades: this._id}).exec();
    //this correspond schem grade we try to delete
    var self = this;
    Mater.findOne({grades: this._id}).then(function(mater){
        //remove grade at index
        //console.log(mater);
        let positionGrade_ref_into_mater = mater.grades.indexOf(self._id)
        mater.grades.splice(positionGrade_ref_into_mater,1);
        mater.save();
    });

    User.findOne({grades: this._id}).then(function(user){
        let positionGrade_ref_into_user = user.grades.indexOf(self._id)
        user.grades.splice(positionGrade_ref_into_user,1);
        user.save();
    });
    next();
});
*/

module.exports = mongoose.model('Grade', gradeSchema);
