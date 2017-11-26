/**
 * Created by SYLVAIN on 20/11/2017.
 */

'use strict';


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



module.exports = mongoose.model('User', userSchema);
