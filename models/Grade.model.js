/**
 * Created by SYLVAIN on 20/11/2017.
 */

'use strict';


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


module.exports = mongoose.model('Grade', gradeSchema);
